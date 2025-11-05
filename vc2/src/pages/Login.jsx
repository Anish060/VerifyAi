import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const API_URL = 'https://verifyai-1.onrender.comapi/auth/login'; // Adjust to your backend URL

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // 1. Send login credentials to the backend
            const response = await axios.post(
  API_URL,
  {
    username: email, // backend expects 'username'
    password: password,
  },
  {
    withCredentials: true, // ✅ allows browser to store JWT cookie
  }
);


            // The backend should handle verification and SET THE JWT COOKIE
            // in the response header (Set-Cookie: jwt=...). 
            // Axios handles this automatically in the background.

            if (response.status === 200 || response.data.success) {
                console.log('Login successful:', response.data);
                
                // 2. Navigate to the dashboard on success
                navigate('/Dash'); 

            } else {
                // This block typically won't be hit unless the backend returns a 200 
                // status code with an explicit 'success: false' payload.
                setError(response.data.message || 'Login failed. Please check credentials.');
            }
        } catch (err) {
            // 3. Handle network errors or non-200 status codes (like 401 Unauthorized)
            if (err.response) {
                // Server responded with a status code outside the 2xx range
                setError(err.response.data.message || 'Invalid email or password.');
            } else if (err.request) {
                // Request was made but no response received (server down/blocked)
                setError('Cannot connect to the server.');
            } else {
                // Something else happened
                setError('An unexpected error occurred during login.');
            }
            console.error('Login error:', err);
        }
    };

  return (
    // Use a light background color for the overall page body
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center relative">
      {/* Header - Adjusted for the light background and color scheme */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Removed the 'verified_user' icon and h1 for 'VerifyAI' from the left to match the reference image */}
          <h1 className="text-2xl font-bold text-gray-800">VerifyAI</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* 'Login' link style adjusted to be less emphasized, matching the reference image */}
          <a className="text-gray-600 hover:text-blue-500" href="#">
            Login
          </a>
          {/* 'Register' button style adjusted to match the light blue background of the reference image */}
          <a
            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
            href="#"
          >
            Register
          </a>
        </div>
      </header>

      {/* Main Login Form - Background set to white with a subtle shadow */}
      <main className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight tracking-normal text-gray-800">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-base font-normal leading-normal">
            Log in to your account to continue
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <label className="flex flex-col">
            <p className="text-sm font-medium leading-normal pb-1 text-gray-700">Email</p>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-gray-300 bg-white focus:border-blue-500 h-12 placeholder:text-gray-400 p-3 text-base font-normal leading-normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password */}
          <label className="flex flex-col">
            <p className="text-sm font-medium leading-normal pb-1 text-gray-700">Password</p>
            <div className="flex w-full flex-1 items-stretch rounded-lg">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-gray-300 bg-white focus:border-blue-500 h-12 placeholder:text-gray-400 p-3 pr-2 text-base font-normal leading-normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="text-gray-500 flex border border-gray-300 bg-white items-center justify-center pr-3 rounded-r-lg border-l-0 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </div>
            </div>
          </label>

          {/* Remember Me & Forgot */}
          <div className="flex justify-between items-center">
            <label className="flex gap-x-2 flex-row items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                // Checkbox colors adjusted to a simple blue theme
                className="h-4 w-4 rounded border-gray-400 border bg-white text-blue-500 checked:bg-blue-500 checked:border-blue-500 focus:ring-0 focus:ring-offset-0 focus:border-blue-500/50"
              />
              <p className="text-sm font-normal leading-normal text-gray-700">Remember Me</p>
            </label>
            <a className="text-sm text-blue-500 hover:text-blue-700" href="#">
              Forgot Password?
            </a>
          </div>

          {/* Log In Button - Crucial change to a solid, more vivid blue */}
          <button
            type="submit"
            // Using a standard Tailwind blue, adjust this to your specific primary color if needed
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-all duration-200"
          >
            Log In
          </button>
        </form>

        {/* Or continue with */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">
            Or continue with:
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Buttons - Adjusted border/text colors and removed broken image sources */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition-all duration-200 text-gray-700 font-medium">
            {/* Replaced broken image source with a generic icon placeholder or text to maintain the layout */}
            <span className="text-red-500 text-lg font-bold">G</span> 
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition-all duration-200 text-gray-700 font-medium">
            {/* Replaced broken image source with a generic icon placeholder or text to maintain the layout */}
            <span className="text-green-600 text-lg font-bold">M</span>
            <span>Microsoft</span>
          </button>
        </div>
      </main>

      {/* Footer - Adjusted colors to match the subtle text at the bottom */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <div className="text-gray-500 text-sm">
          <a className="hover:text-blue-500" href="#">
            Terms of Service
          </a>
          <span className="mx-2">·</span>
          <a className="hover:text-blue-500" href="#">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Login;