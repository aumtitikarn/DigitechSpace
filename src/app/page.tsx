'use client';

import React from "react";
import { useRouter } from 'next/navigation'; // Import the redirect function from next/navigation
import Link from "next/link";
import { useSession } from "next-auth/react";
import Home from "./Home/page";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter(); // Use the useRouter hook to get the router instance

  if (status === "loading") {
    return <p>Loading...</p>;
  }


  return (
    <div>
     <Home/>
    </div>
  );
}

// export default function PreAuth() {
//   const router = useRouter()
//   return (
//     <div
//       style={{ backgroundColor: "#FBFBFB", height: "100vh" }}
//       className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
//     >
//       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         <img
//           className="mx-auto h-116 w-244 mb-20" 
//           src="https://m1r.ai/bdebq.png"
//           alt="Digitech Space"
//         />  
//       </div>
//       <div className="my-6">
//         <button
//           type="button" 
//           onClick={() => router.push('/auth/signin')}
//           className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//         >
//           Sign in
//         </button>
//       </div>
//       <div className="flex items-center my-3">
//         <div className="flex-grow border-t border-gray-300"></div>
//         <span className="mx-4 text-gray-500">or</span>
//         <div className="flex-grow border-t border-gray-300"></div>
//       </div>
//       <div className="my-6">
//         <button
//           type="button" 
//           onClick={() => router.push('/auth/signup')}
//           className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//         >
//           Create Account
//         </button>
//       </div>
//       <div className="my-6">
//   <button
//     type="button"
//     className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//   >
//     <Image
//       width={20}
//       height={20}
//       src="/google.png"
//       alt="Google"
//       className="flex-shrink-0 mr-4" 
//     />
//     Continue with Google
//   </button>
//   <button
//     type="button"
//     className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//   >
//     <img
//       className="w-6 h-6 flex-shrink-0 mr-4" 
//       src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png"
//       alt="Facebook"
//     />
//     Continue with Facebook
//   </button>
//   <button
//     type="button"
//     className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//   >
//     <img
//       className="w-6 h-6 flex-shrink-0 mr-4"
//       src="/github.png"
//       alt="Github"
//     />
//     Continue with Github
//   </button>
// </div>

//       </div>
//     </div>
//   );
// }