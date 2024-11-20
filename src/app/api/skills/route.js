import { connectMongoDB } from "../../../../lib/mongodb";
import StudentUser from "../../../../models/StudentUser";
import { NextResponse } from "next/server";

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
      
      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }

      // Fetch users
      const users = await StudentUser.find(query);

      if (!skillsParam) {
        // If no skills specified, return all users
        return NextResponse.json({ 
          success: true,
          users: users.map(user => ({
            _id: user._id,
            name: user.name,
            imageUrl: user.imageUrl,
            skills: user.skills,
            matchPercentage: 100,
            matchedSkills: user.skills
          }))
        });
      }

      const searchSkills = skillsParam.split(',');
      const searchSkillsLower = searchSkills.map(s => s.toLowerCase());

      // Calculate match percentage for each user
      const usersWithMatch = users.map(user => {
        const userSkills = user.skills || [];
        const userSkillsLower = userSkills.map(s => s.toLowerCase());
        
        // Find matching skills
        const matchedSkills = userSkills.filter(skill => 
          searchSkillsLower.includes(skill.toLowerCase())
        );

        // Calculate percentage
        const matchPercentage = searchSkills.length > 0
          ? (matchedSkills.length / searchSkills.length) * 100
          : 0;

        return {
          _id: user._id,
          name: user.name,
          imageUrl: user.imageUrl,
          skills: user.skills,
          matchedSkills: matchedSkills,
          matchPercentage: Math.round(matchPercentage)
        };
      });

      // Filter users with match percentage > 0 and sort by percentage
      const filteredAndSorted = usersWithMatch
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