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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* ✨ Animated gradient background like DeepSeek */}
      <div className="absolute inset-0 bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-purple-700 to-indigo-600 animate-gradient"></div>

      {/* 🪶 Floating particle lights */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-2xl animate-float"
            style={{
              width: `${Math.random() * 150 + 80}px`,
              height: `${Math.random() * 150 + 80}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Overlay for dimming effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      {/* 🌟 Main Login Form */}
      <main className="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl space-y-6 border border-white/40">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-gray-500">Log in to your VerifyAI account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-700">Email</p>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="rounded-lg border border-gray-300 bg-white/80 h-12 px-3 text-base text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password */}
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-700">Password</p>
            <div className="flex items-stretch rounded-lg border border-gray-300 bg-white/80">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="flex-1 h-12 px-3 text-gray-900 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="flex items-center justify-center px-3 text-gray-500 cursor-pointer hover:text-blue-500 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </div>
            </div>
          </label>

          {/* Remember Me & Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all duration-200"
          >
            Log In
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-center text-red-500 text-sm font-medium mt-2">
              {error}
            </p>
          )}
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            <span className="text-red-500 font-bold">G</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            <span className="text-green-600 font-bold">M</span> Microsoft
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-300 text-xs z-10">
        © {new Date().getFullYear()} VerifyAI. All rights reserved.
      </footer>

      {/* 🌀 Custom Animations */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 10s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 0.8; }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
