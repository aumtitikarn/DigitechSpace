import { connectMongoDB } from '../../../../../lib/mongodb';
import SearchTerm from '../../../../../models/SearchTerm';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(request) {
    try {
      await connectMongoDB();
  
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');
  
      const popularSearches = await SearchTerm.find()
        .sort({ count: -1 })
        .limit(limit)
        .select('term count -_id')
        .lean();
  
      return NextResponse.json(popularSearches, { status: 200 });
    } catch (error) {
      console.error('Error fetching popular searches:', error);
      return NextResponse.json({ message: 'Error fetching popular searches' }, { status: 500 });
    }
  }