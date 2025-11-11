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
  const API_URL = 'https://verifyai-1.onrender.com/api/auth/login';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(API_URL, {
        username: email,
        password,
      }, { withCredentials: true });

      if (response.status === 200 || response.data.success) {
        navigate('/Dash');
      } else {
        setError(response.data.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      if (err.response) setError(err.response.data.message || 'Invalid email or password.');
      else if (err.request) setError('Cannot connect to the server.');
      else setError('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="relative text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* 🌊 Enhanced Pulsing Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 overflow-hidden">
        {/* Layer 1 – main soft wave */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_35%,rgba(99,175,255,0.65),transparent_70%)] animate-wave-1"></div>
        {/* Layer 2 – deeper blue wave */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_65%,rgba(40,120,255,0.55),transparent_70%)] animate-wave-2"></div>
        {/* Layer 3 – white highlight pulse */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.5),transparent_70%)] mix-blend-overlay animate-wave-3"></div>
      </div>

      {/* Header (same as before) */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">VerifyAI</h1>
        </div>
        <div className="flex items-center gap-4">
          <a className="text-gray-600 hover:text-blue-600 transition" href="#">
            Login
          </a>
          <a
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition"
            href="#"
          >
            Register
          </a>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl space-y-6 border border-blue-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500">Log in to your account to continue</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-700 pb-1">Email</p>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white h-12 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-700 pb-1">Password</p>
            <div className="flex items-stretch rounded-lg border border-gray-300 bg-white">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="flex-1 h-12 px-3 text-gray-800 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="flex items-center justify-center px-3 text-gray-500 cursor-pointer hover:text-blue-500 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </div>
            </div>
          </label>

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <p className="text-sm text-gray-700">Remember Me</p>
            </label>
            <a className="text-sm text-blue-500 hover:text-blue-700" href="#">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition"
          >
            Log In
          </button>

          {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}
        </form>

        <div className="flex items-center py-2">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition text-gray-700 font-medium">
            <span className="text-red-500 text-lg font-bold">G</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition text-gray-700 font-medium">
            <span className="text-green-600 text-lg font-bold">M</span> Microsoft
          </button>
        </div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-500 text-sm z-10">
        <a className="hover:text-blue-600" href="#">Terms of Service</a>
        <span className="mx-2">·</span>
        <a className="hover:text-blue-600" href="#">Privacy Policy</a>
      </footer>

      {/* 💫 More dynamic wave animation */}
      <style>{`
        @keyframes wavePulse1 {
          0% { transform: translate(-8%, -5%) scale(1.05); opacity: 0.6; }
          50% { transform: translate(8%, 5%) scale(1.12); opacity: 0.85; }
          100% { transform: translate(-8%, -5%) scale(1.05); opacity: 0.6; }
        }

        @keyframes wavePulse2 {
          0% { transform: translate(5%, 10%) scale(1.03); opacity: 0.5; }
          50% { transform: translate(-5%, -10%) scale(1.1); opacity: 0.8; }
          100% { transform: translate(5%, 10%) scale(1.03); opacity: 0.5; }
        }

        @keyframes wavePulse3 {
          0% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.8; }
          100% { transform: translateY(0px); opacity: 0.3; }
        }

        .animate-wave-1 {
          animation: wavePulse1 15s ease-in-out infinite alternate;
        }
        .animate-wave-2 {
          animation: wavePulse2 20s ease-in-out infinite alternate-reverse;
        }
        .animate-wave-3 {
          animation: wavePulse3 10s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default Login;
