import { connectMongoDB } from '../../../../lib/mongodb'; 
import Policy from '../../../../models/policy'
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      await connectMongoDB();
      
      const policies = await Policy.find({
        type: { $in: ['privacy-policy-thai', 'privacy-policy-english'] }
      });
  
      return NextResponse.json(policies);
    } catch (error) {
      console.error('Failed to fetch policies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch policies' },
        { status: 500 }
      );
    }
  }