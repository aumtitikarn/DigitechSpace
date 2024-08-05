'use client';
export default function login() {
    return (
      <div 
      style={{ backgroundColor: "#FBFBFB" , height: '100vh'}}
      className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-116 w-244"
            src="https://m1r.ai/bdebq.png"
            alt="Digitech Space"
          />
          <h2 
            style={{ color: '#33539B', fontSize: '29px' }}
            className="mt-10 text-center font-bold leading-9 tracking-tight"
          >
          Sign in
        </h2>
        </div>
  
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              
              <div className="mt-3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  required
                  className="mt-3 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                />
                 <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  required
                  className="mt-3 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                />
                <div className="text-sm">
                  <a
                    href="#"
                    style={{ color: '#33539B' }}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
  
            
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="flex items-center my-3">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">Or continue with</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
        </div>
      </div>
    );
  }