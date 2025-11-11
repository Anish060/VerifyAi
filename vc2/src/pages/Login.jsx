import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const API_URL = "https://verifyai-1.onrender.com/api/auth/login";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        API_URL,
        { username: email, password },
        { withCredentials: true }
      );

      if (response.status === 200 || response.data.success) {
        navigate("/Dash");
      } else {
        setError(response.data.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      if (err.response) setError(err.response.data.message || "Invalid email or password.");
      else if (err.request) setError("Cannot connect to the server.");
      else setError("An unexpected error occurred during login.");
    }
  };

  return (
    <div className="relative text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* 🌊 DeepSeek-Style Animated Energy Field */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#eaf1ff] via-[#b9d1ff] to-[#1a4cff]">
        {/* Layered animated waves */}
        <div className="wave-field wave1"></div>
        <div className="wave-field wave2"></div>
        <div className="wave-field wave3"></div>

        {/* Glow overlay for subtle shine */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.4),transparent_70%)] mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold text-gray drop-shadow-lg tracking-tight">VerifyAI</h1>
        <div className="flex items-center gap-4">
          <a className="text-gray/90 hover:text-blue-200 font-medium transition" href="#">
            Login
          </a>
          <a
            className="px-4 py-2 rounded-lg bg-white/15 text-gray font-medium border border-white/30 hover:bg-white/25 hover:text-blue-200 transition backdrop-blur-sm"
            href="#"
          >
            Register
          </a>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] space-y-6 border border-white/40">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
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
            <a className="text-sm text-blue-600 hover:text-blue-700 font-medium" href="#">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-md transition"
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
          <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition text-gray-700 font-medium">
            <span className="text-red-500 text-lg font-bold">G</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition text-gray-700 font-medium">
            <span className="text-green-600 text-lg font-bold">M</span> Microsoft
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-white/80 text-sm z-10">
        <a className="hover:text-white" href="#">Terms of Service</a>
        <span className="mx-2">·</span>
        <a className="hover:text-white" href="#">Privacy Policy</a>
      </footer>

      {/* 🌌 Elegant Wave Animation Styles */}
      <style>{`
        .wave-field {
          position: absolute;
          width: 240%;
          height: 180%;
          top: -10%;
          left: -70%;
          border-radius: 50%;
          opacity: 0.7;
          filter: blur(80px);
          mix-blend-mode: screen;
          animation: diagonalFlow 14s ease-in-out infinite alternate;
        }

        .wave1 {
          background: radial-gradient(circle at 40% 60%, rgba(0,102,255,0.6), rgba(100,170,255,0.2) 70%, transparent 100%);
          animation-delay: 0s;
        }

        .wave2 {
          background: radial-gradient(circle at 50% 70%, rgba(0,140,255,0.7), rgba(180,210,255,0.25) 70%, transparent 100%);
          animation-delay: 3s;
        }

        .wave3 {
          background: radial-gradient(circle at 55% 80%, rgba(60,160,255,0.8), rgba(220,235,255,0.3) 70%, transparent 100%);
          animation-delay: 6s;
        }

        @keyframes diagonalFlow {
          0% {
            transform: translate(-10%, 10%) scale(1.05) rotate(10deg);
            opacity: 0.7;
          }
          50% {
            transform: translate(15%, -15%) scale(1.25) rotate(15deg);
            opacity: 0.9;
          }
          100% {
            transform: translate(-10%, 10%) scale(1.05) rotate(10deg);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
