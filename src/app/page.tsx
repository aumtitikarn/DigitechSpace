'use client';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function PreAuth() {
  const router = useRouter()
  return (
    <div
      style={{ backgroundColor: "#FBFBFB", height: "100vh" }}
      className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
    >
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-116 w-244 mb-20" 
          src="https://m1r.ai/bdebq.png"
          alt="Digitech Space"
        />  
      </div>
      <div className="my-6">
        <button
          type="button" 
          onClick={() => router.push('/auth/signin')}
          className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign in
        </button>
      </div>
      <div className="flex items-center my-3">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="my-6">
        <button
          type="button" 
          className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create Account
        </button>
      </div>
      <div className="my-6">
  <button
    type="button"
    className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    <Image
      width={20}
      height={20}
      src="/google.png"
      alt="Google"
      className="flex-shrink-0 mr-4" 
    />
    Continue with Google
  </button>
  <button
    type="button"
    className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    <img
      className="w-6 h-6 flex-shrink-0 mr-4" 
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png"
      alt="Facebook"
    />
    Continue with Facebook
  </button>
  <button
    type="button"
    className="my-6 text-black flex w-full justify-center items-center rounded-full border-2 border-gray-400 bg-[#FFFFFF] px-3 py-3 text-sm font-semibold leading-6 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  >
    <img
      className="w-8 h-6 flex-shrink-0 mr-4"
      src="https://s3-alpha-sig.figma.com/img/ebb6/9ba4/c7a30d590f27c263d7fa57c2c10ac6f4?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X3IAGkJN2FRNNtswaiW5wGcmto8BZ~ERopqyQCofNfKTmeMybrl5B1ACTF1Y9JgTyLPRLqLSLrF1kxPDJh1WeToo1fpNxVBgtLmNixNehbMmQ2mXNuFVOlgOBZrq-2z5qe7CTfp4hFHQsZaATfsS~o2G8XAd2rO8ROM6faPnOqCTZanA9pXShBmv5HLalqNhZC7LTy9c9DZ4iUfb7unG6R36TM7i4g0N4BF6D2cVowQo8d1B~Xic4QGKvtCkAInnmT6vuYct1KmwugSIeI2Qim5HhVEm7NMZ3IwnYfNsQR8VI9FGSAuEMwCxYkBk7SZof0djM4VoeRpa8csU1UAZug__"
      alt="Github"
    />
    Continue with Github
  </button>
</div>

      </div>
    </div>
  );
}