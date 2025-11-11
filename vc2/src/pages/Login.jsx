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
        console.log('Login successful:', response.data);
        navigate('/Dash');
      } else {
        setError(response.data.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      if (err.response) setError(err.response.data.message || 'Invalid email or password.');
      else if (err.request) setError('Cannot connect to the server.');
      else setError('An unexpected error occurred during login.');
      console.error('Login error:', err);
    }
  };

  return (
    // ✅ Replaced gray background with animated gradient
    <div className="relative text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center overflow-hidden">
      
      {/* ✨ Animated gradient background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-700 bg-[length:200%_200%] animate-gradient"></div>

      {/* 💫 Floating glow particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-2xl animate-float"
            style={{
              width: `${Math.random() * 120 + 60}px`,
              height: `${Math.random() * 120 + 60}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Overlay dimming for readability */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* ✅ Keep your original header and login form */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">VerifyAI</h1>
        </div>
        <div className="flex items-center gap-4">
          <a className="text-gray-200 hover:text-blue-300" href="#">Login</a>
          <a className="px-4 py-2 rounded-lg bg-blue-200/30 text-white border border-blue-300 hover:bg-blue-300/40 backdrop-blur-sm" href="#">
            Register
          </a>
        </div>
      </header>

      {/* Main Login Form */}
      <main className="relative z-10 w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl space-y-6 border border-white/40">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-800">
            Welcome Back!
          </h2>
          <p className="text-gray-500">Log in to your account to continue</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-700 pb-1">Email</p>
            <input
              type="email"
              placeholder="your.email@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white h-12 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="flex flex-col">
            <p className="text-sm font-medium text-gray-700 pb-1">Password</p>
            <div className="flex w-full items-stretch rounded-lg border border-gray-300 bg-white">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="flex-1 h-12 px-3 text-gray-800 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="flex items-center justify-center px-3 text-gray-500 cursor-pointer hover:text-blue-500"
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
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-200"
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

      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-200 text-sm z-10">
        <a className="hover:text-blue-300" href="#">Terms of Service</a>
        <span className="mx-2">·</span>
        <a className="hover:text-blue-300" href="#">Privacy Policy</a>
      </footer>

      {/* 🌈 Background Animation Styles */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradientMove 12s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        .animate-float {
          animation: float 16s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
