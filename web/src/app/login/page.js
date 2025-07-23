"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import {
  Sun,
  Moon,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Bot,
  FileText,
} from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const { isLoaded, signIn, setActive } = useSignIn();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  // Initialize theme from state (no localStorage)
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard"); // Use router.push instead of window.location.href
      }
    } catch (err) {
      setError(err.errors[0]?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const themeClasses = {
    container: isDarkMode
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      : "bg-gradient-to-br from-gray-100 via-white to-gray-50",
    card: isDarkMode
      ? "bg-gray-800/80 border-gray-700/50"
      : "bg-white/90 border-gray-200/50",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    input: isDarkMode
      ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDarkMode
      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
    accent: isDarkMode ? "text-blue-400" : "text-blue-600",
    error: isDarkMode
      ? "bg-red-900/20 border-red-700/50 text-red-300"
      : "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${themeClasses.container} p-2 sm:p-4 relative overflow-hidden transition-all duration-500`}
    >
      {/* Animated Background Elements - Scaled for smaller screens */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/4 -left-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 ${
            isDarkMode ? "bg-blue-500/10" : "bg-blue-400/20"
          } rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-1/4 -right-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 ${
            isDarkMode ? "bg-purple-500/10" : "bg-purple-400/20"
          } rounded-full blur-3xl animate-pulse delay-700`}
        ></div>
      </div>

      {/* Theme Toggle - Smaller on mobile */}
      <button
        onClick={toggleTheme}
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-full ${themeClasses.card} backdrop-blur-xl shadow-lg border transition-all duration-300 hover:scale-110 z-20`}
      >
        {isDarkMode ? (
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        )}
      </button>

      {/* Main Login Card - Ultra responsive sizing for all screen types */}
      <div
        className={`relative z-10 ${themeClasses.card} backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-md border transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl`}
      >
        {/* Header with AI Branding - Ultra compact */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl mb-2 sm:mb-3 transform transition-transform duration-300 hover:rotate-6">
            <div className="relative">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
              <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white absolute -top-0.5 -right-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-0.5" />
            </div>
          </div>
          <h1
            className={`text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl font-bold mb-1 bg-gradient-to-r ${
              isDarkMode
                ? "from-white to-gray-300"
                : "from-gray-900 to-gray-600"
            } bg-clip-text text-transparent`}
          >
            Resume Builder AI
          </h1>
          <p
            className={`${themeClasses.textSecondary} text-xs flex items-center justify-center gap-1`}
          >
            <Sparkles className="w-3 h-3" />
            AI-Powered Career Success
          </p>
        </div>

        {/* Error Message - Ultra compact */}
        {error && (
          <div
            className={`${themeClasses.error} backdrop-blur-sm border px-2.5 py-1.5 rounded-lg mb-3 transform transition-all duration-300 animate-shake`}
          >
            <div className="flex items-start">
              <div className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Login Form - Ultra compact spacing */}
        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-3.5">
          <div className="space-y-2.5 sm:space-y-3">
            {/* Email Field */}
            <div className="relative group">
              <label
                htmlFor="email"
                className={`block ${themeClasses.textSecondary} font-medium mb-1 text-xs transition-colors duration-200 group-focus-within:${themeClasses.accent}`}
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 pl-8 sm:pl-10 ${themeClasses.input} backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 text-sm`}
                />
                <Mail
                  className={`absolute left-2.5 sm:left-3 top-2 sm:top-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 ${themeClasses.textMuted} transition-colors duration-200 group-focus-within:text-blue-500`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label
                htmlFor="password"
                className={`block ${themeClasses.textSecondary} font-medium mb-1 text-xs transition-colors duration-200 group-focus-within:${themeClasses.accent}`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-2.5 py-2 sm:px-3 sm:py-2.5 pl-8 sm:pl-10 pr-8 sm:pr-10 ${themeClasses.input} backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 text-sm`}
                />
                <Lock
                  className={`absolute left-2.5 sm:left-3 top-2 sm:top-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 ${themeClasses.textMuted} transition-colors duration-200 group-focus-within:text-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-2.5 sm:right-3 top-2 sm:top-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 ${themeClasses.textMuted} hover:${themeClasses.textSecondary} transition-colors duration-200`}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me & Forgot Password - Smaller */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 bg-transparent border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className={`ml-1.5 text-xs ${themeClasses.textSecondary}`}>
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className={`text-xs ${themeClasses.accent} hover:underline font-medium`}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button - Ultra compact */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${themeClasses.button} text-white py-2 sm:py-2.5 rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-1.5 text-sm`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>

          {/* OAuth Buttons - Ultra compact */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-300"
                }`}
              ></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span
                className={`px-2 ${isDarkMode ? "bg-gray-800" : "bg-white"} ${
                  themeClasses.textMuted
                }`}
              >
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            className={`w-full ${themeClasses.card} backdrop-blur-sm border py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 ${themeClasses.text} text-sm`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="hidden sm:inline">Continue with Google</span>
            <span className="sm:hidden">Google</span>
          </button>
        </form>

        {/* Footer - Ultra compact */}
        <div className="mt-4 sm:mt-5 text-center">
          <p className={`${themeClasses.textSecondary} text-xs`}>
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className={`${themeClasses.accent} font-semibold hover:underline transition-colors duration-200`}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}

export default Login;
