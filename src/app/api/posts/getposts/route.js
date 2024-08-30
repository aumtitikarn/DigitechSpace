// import { connectMongoDB } from '../../../../../lib/mongodb';
// import Post from "../../../../../models/post";

// export async function GET(req) {
//   try {
//     await connectMongoDB();
//     const ports = await Post.find({}).sort({ createdAt: -1 });
//     return new Response(JSON.stringify(ports), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ success: false }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
