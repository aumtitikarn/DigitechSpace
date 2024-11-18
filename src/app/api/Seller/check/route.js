// import { getServerSession } from 'next-auth/next';
// import { connectMongoDB } from '../../../../../lib/mongodb';
// import StudentUser from '../../../../../models/StudentUser';
// import { authOptions } from "../../../api/auth/auth.config";

// export async function GET(req, res) {
//   try {
//     const session = await getServerSession({ req, ...authOptions });
    
//     if (!session || !session.user || !session.user.email) {
//       return new Response('Unauthorized', { status: 401 });
//     }
    
//     await connectMongoDB();
    
//     const user = await StudentUser.findOne({ email: session.user.email });
    
//     if (user) {
//       // Check if SellInfo exists and is an object
//       if (user.SellInfo && typeof user.SellInfo === 'object') {
//         // Check if any fields in SellInfo are not empty
//         const hasSellInfo = Object.values(user.SellInfo).some(value => value !== undefined && value !== null && value !== '');
        
//         if (hasSellInfo) {
//           return new Response(JSON.stringify({ hasSellInfo: true }), { status: 200 });
//         } else {
//           return new Response(JSON.stringify({ hasSellInfo: false }), { status: 200 });
//         }
//       } else {
//         return new Response(JSON.stringify({ hasSellInfo: false }), { status: 200 });
//       }
//     } else {
//       return new Response('User not found', { status: 404 });
//     }
//   } catch (error) {
//     console.error('Error fetching SellInfo:', error);
//     return new Response('Internal Server Error', { status: 500 });
//   }
// }
// app/api/Seller/check/route.js
import { getServerSession } from 'next-auth';
import { connectMongoDB } from '../../../../../lib/mongodb';
import StudentUser from '../../../../../models/StudentUser';
import { authOptions } from "../../../api/auth/auth.config";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
 try {
   const session = await getServerSession(authOptions);
   
   if (!session?.user?.email) {
     return NextResponse.json(
       { error: 'Unauthorized' },
       { status: 401 }
     );
   }
   
   await connectMongoDB();
   
   const user = await StudentUser.findOne({ email: session.user.email });
   
   if (!user) {
     return NextResponse.json(
       { error: 'User not found' },
       { status: 404 }
     );
   }

   // ตรวจสอบ SellInfo
   const hasSellInfo = user.SellInfo && 
                      typeof user.SellInfo === 'object' && 
                      Object.values(user.SellInfo).some(value => 
                        value !== undefined && 
                        value !== null && 
                        value !== ''
                      );

   return NextResponse.json({ hasSellInfo });

 } catch (error) {
   console.error('Error fetching SellInfo:', error);
   return NextResponse.json(
     { error: 'Internal Server Error' },
     { status: 500 }
   );
 }
}

// สำหรับ CORS
export async function OPTIONS() {
 return new NextResponse(null, {
   status: 204,
   headers: {
     'Access-Control-Allow-Origin': '*',
     'Access-Control-Allow-Methods': 'GET, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
   },
 });
}