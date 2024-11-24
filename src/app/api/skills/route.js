import { connectMongoDB } from "../../../../lib/mongodb";
import StudentUser from "../../../../models/StudentUser";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const skillsParam = searchParams.get('skills');
    const name = searchParams.get('name');

    if (mode === 'skills') {
      // Return all unique skills
      const allUsers = await StudentUser.find({});
      const allSkills = [...new Set(allUsers.flatMap(user => user.skills || []))];
      return NextResponse.json({
        success: true,
        skills: allSkills
      });
    }

    if (mode === 'users') {
      let query = {};
      
      // Name search condition
      if (name) {
        // Create an OR condition for name and skills
        query.$or = [
          { name: { $regex: name, $options: 'i' } },
          { skills: { $regex: name, $options: 'i' } }
        ];

        // Special handling for "React" variations
        if (name.toLowerCase().includes('react')) {
          query.$or.push(
            { skills: { $regex: 'ReactJS', $options: 'i' } },
            { skills: { $regex: 'React.js', $options: 'i' } },
            { skills: { $regex: 'React Native', $options: 'i' } }
          );
        }
      }

      // Skills search condition
      if (skillsParam) {
        const searchSkills = skillsParam.split(',');
        const skillQueries = searchSkills.map(skill => {
          const skillRegex = new RegExp(skill, 'i');
          if (skill.toLowerCase().includes('react')) {
            return {
              $or: [
                { skills: skillRegex },
                { skills: /ReactJS/i },
                { skills: /React\.js/i },
                { skills: /React Native/i }
              ]
            };
          }
          return { skills: skillRegex };
        });

        if (query.$or) {
          // Combine with existing name search
          query = {
            $and: [
              { $or: query.$or },
              { $or: skillQueries }
            ]
          };
        } else {
          query.$or = skillQueries;
        }
      }

      // Fetch users based on the query
      const users = await StudentUser.find(query);

      // Calculate match percentage and format response
      const processedUsers = users.map(user => {
        const userSkills = user.skills || [];
        let matchedSkills = [];
        let matchPercentage = 100;

        if (skillsParam) {
          const searchSkills = skillsParam.split(',');
          const searchSkillsLower = searchSkills.map(s => s.toLowerCase());

          // Find matching skills including React variations
          matchedSkills = userSkills.filter(skill => {
            const skillLower = skill.toLowerCase();
            return searchSkillsLower.some(searchSkill => {
              if (searchSkill.toLowerCase().includes('react')) {
                return skillLower.includes('react') || 
                       skillLower.includes('reactjs') || 
                       skillLower.includes('react.js') || 
                       skillLower.includes('react native');
              }
              return skillLower.includes(searchSkill.toLowerCase());
            });
          });

          matchPercentage = searchSkills.length > 0
            ? Math.round((matchedSkills.length / searchSkills.length) * 100)
            : 100;
        }

        return {
          _id: user._id,
          name: user.name,
          imageUrl: user.imageUrl,
          skills: userSkills,
          matchedSkills: matchedSkills,
          matchPercentage: matchPercentage
        };
      });

      // Sort by match percentage and filter out 0% matches
      const filteredAndSorted = processedUsers
        .filter(user => user.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

      return NextResponse.json({
        success: true,
        users: filteredAndSorted
      });
    }

    return NextResponse.json({
      success: false,
      error: "Invalid mode specified"
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}