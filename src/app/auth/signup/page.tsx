'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phonenumber: '',
    username: '',
    email: '',
    password: '',
    confirmpassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
        setError('Passwords do not match');
        return;
    }

    try {
        // Check if email exists in the system
        const resCheckUser = await fetch("/api/usercheck", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formData.email })
        });

        if (resCheckUser.ok) {
            const data = await resCheckUser.json();
            if (data.message === 'Email has already been used.') {
                setError('Email has already been used.');
                return;
            }

            // If email is available, proceed with signup
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/Ai/role'); //ต้องทำครั้งเดียวเข้าสู่ระบบครั้งแรก
            } else {
                const data = await res.json();
                setError(data.message || 'Email has already been used.');
            }
        } else {
            setError('An error occurred while checking the email');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('Something went wrong');
    }
};

  

  return (
    <div
      style={{ backgroundColor: "#FBFBFB", height: '100vh' }}
      className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-24 w-auto"
          src="https://m1r.ai/bdebq.png"
          alt="Digitech Space"
        />
        <h2
          style={{ color: '#33539B', fontSize: '29px' }}
          className="mt-7 text-center text-2xl font-bold leading-9 tracking-tight"
        >
          Sign Up
        </h2>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            id="firstname"
            name="firstname"
            type="text"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="First name"
            required
            className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 mt-3"
          />
          <input
            id="lastname"
            name="lastname"
            type="text"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Last name"
            required
            className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
          />
          <input
            id="phonenumber"
            name="phonenumber"
            type="text"
            value={formData.phonenumber}
            onChange={handleChange}
            placeholder="Phone number"
            required
            className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
          />
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
          />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm mt-3 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
          />
          <div className="relative mt-3">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <Image
                width={20}
                height={20}
                src={showPassword ? "/hide.png" : "/hide.png"}
                alt="Toggle visibility"
              />
            </button>
          </div>
          <div className="relative mt-3">
            <input
              id="confirmpassword"
              name="confirmpassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmpassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="block w-full px-3 py-2 bg-white border border-slate-300 shadow-sm placeholder-slate-400 rounded-md sm:text-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <Image
                width={20}
                height={20}
                src={showConfirmPassword ? "/hide.png" : "/hide.png"}
                alt="Toggle visibility"
              />
            </button>
          </div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-[#33539B] px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33539B]"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
        <div className="flex items-center my-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">Or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="flex flex-row space-x-4">
            <button className="flex-1 flex items-center justify-center rounded-lg border-2 border-sky-600 px-4 py-2">
              <Image
                width={20}
                height={20}
                src="/google.png"
                alt="Google"
                className="flex-shrink-0 mr-4 ml-5"
              />
            </button>
            <button className="flex-1 flex items-center justify-center rounded-lg border-2 border-sky-600 px-4 py-2">
              <img
                className="w-6 h-6 flex-shrink-0 mr-4 ml-5"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png"
                alt="Facebook"
              />
            </button>
            <button className="flex-1 flex items-center justify-center rounded-lg border-2 border-sky-600 px-4 py-2">
              <img
                className="w-8 h-6 flex-shrink-0 mr-4 ml-5"
                src="https://s3-alpha-sig.figma.com/img/ebb6/9ba4/c7a30d590f27c263d7fa57c2c10ac6f4?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X3IAGkJN2FRNNtswaiW5wGcmto8BZ~ERopqyQCofNfKTmeMybrl5B1ACTF1Y9JgTyLPRLqLSLrF1kxPDJh1WeToo1fpNxVBgtLmNixNehbMmQ2mXNuFVOlgOBZrq-2z5qe7CTfp4hFHQsZaATfsS~o2G8XAd2rO8ROM6faPnOqCTZanA9pXShBmv5HLalqNhZC7LTy9c9DZ4iUfb7unG6R36TM7i4g0N4BF6D2cVowQo8d1B~Xic4QGKvtCkAInnmT6vuYct1KmwugSIeI2Qim5HhVEm7NMZ3IwnYfNsQR8VI9FGSAuEMwCxYkBk7SZof0djM4VoeRpa8csU1UAZug__"
                alt="Github"
              />
            </button>
          </div>
          <div>
            <p className="text-center mt-20">By signing up, you agree to the
              <u><b>Terms of Service </b></u>
              and
              <u><b>Privacy Policy</b></u>
              , including
              <u><b>Cookie Use.</b></u>
            </p>
          </div>
      </div>
    </div>
  );
}
