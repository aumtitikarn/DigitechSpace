// pages/api/search/save.js
import { connectMongoDB } from '../../../../lib/mongodb';
import SearchTerm from '../../../../models/SearchTerm';

export async function POST(request) {
    try {
      await connectMongoDB();
  
      const { searchTerm } = await request.json();
      
      if (!searchTerm) {
        return NextResponse.json({ message: 'Search term is required' }, { status: 400 });
      }
  
      // บันทึกหรืออัปเดตคำค้นหา
      await SearchTerm.findOneAndUpdate(
        { term: searchTerm },
        { $inc: { count: 1 }, $set: { lastSearched: new Date() } },
        { upsert: true, new: true }
      );
  
      // ทำความสะอาดข้อมูลเก่า
      await cleanupOldSearchTerms();
  
      return NextResponse.json({ message: 'Search term saved successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error saving search term:', error);
      return NextResponse.json({ message: 'Error saving search term' }, { status: 500 });
    }
  }

  async function cleanupOldSearchTerms() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
    // ดึง 10 อันดับแรกที่มีการค้นหามากที่สุด
    const topSearches = await SearchTerm.find()
      .sort({ count: -1 })
      .limit(10)
      .select('_id');
  
    const topSearchIds = topSearches.map(search => search._id);
  
    // ลบข้อมูลที่เก่ากว่า 6 เดือนและไม่อยู่ใน 10 อันดับแรก
    const result = await SearchTerm.deleteMany({
      _id: { $nin: topSearchIds },
      lastSearched: { $lt: sixMonthsAgo }
    });
  
    console.log(`Deleted ${result.deletedCount} old search terms`);
  }