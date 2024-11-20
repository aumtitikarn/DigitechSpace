import { connectMongoDB } from "../../../../lib/mongodb";
import StudentUser from "../../../../models/StudentUser";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'skills';
    const query = searchParams.get('query') || '';
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];

    await connectMongoDB();

    if (mode === 'skills') {
      // Existing skills aggregation code...
      const skillsData = await StudentUser.aggregate([
        { $unwind: "$skills" },
        {
          $group: {
            _id: {
              original: "$skills",
              lower: { $toLower: "$skills" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: "$_id.original",
            count: 1
          }
        }
      ]);

      return NextResponse.json({ 
        success: true,
        skills: skillsData.map(item => item._id)
      });

    } else {
      // Case-insensitive search for users with any of the searched skills
      const skillRegexes = skills.length > 0 
        ? skills.map(skill => new RegExp(skill, 'i'))
        : [new RegExp(query, 'i')];

      const users = await StudentUser.find({
        skills: { $in: skillRegexes }  // Changed from $all to $in to find users with any matching skill
      }).select('name profileImage skills _id');

      // Calculate match percentage for each user
      const usersWithMatchPercentage = users.map(user => {
        const userSkillsLower = user.skills.map(s => s.toLowerCase());
        const searchSkillsLower = skills.map(s => s.toLowerCase());
        
        // Find matching skills (maintaining original case)
        const matchedSkills = user.skills.filter(userSkill => 
          skillRegexes.some(regex => regex.test(userSkill))
        );

        // Calculate percentage
        const matchPercentage = (matchedSkills.length / searchSkillsLower.length) * 100;

        return {
          ...user.toObject(),
          matchedSkills,
          matchPercentage: Math.round(matchPercentage) // Round to nearest integer
        };
      });

      // Sort by match percentage (highest first)
      const sortedUsers = usersWithMatchPercentage.sort((a, b) => 
        b.matchPercentage - a.matchPercentage
      );

      return NextResponse.json({ 
        success: true,
        users: sortedUsers
      });
    }
  } catch (error) {
    console.error("Error in GET /api/skills:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch data",
        details: error.message
      },
      { status: 500 }
    );
  }
}