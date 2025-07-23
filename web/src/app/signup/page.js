"use client";
import React, { useState, createContext, useContext } from "react";
import { useSignUp } from "@clerk/nextjs";

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Password Strength Hook
const usePasswordStrength = (password) => {
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, text: "", color: "" };

    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return { score, text: "Weak", color: "text-red-400" };
    if (score <= 3) return { score, text: "Fair", color: "text-yellow-400" };
    if (score <= 4) return { score, text: "Good", color: "text-blue-400" };
    return { score, text: "Strong", color: "text-green-400" };
  };

  return getStrength(password);
};

// Icons (using simple SVG for demonstration, in a real app you might use a library like 'lucide-react')
const EmailIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const EyeIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
);

const FileText = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Bot = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 4V2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v-2z" />
  </svg>
);

const Sparkles = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0L9.4 8.3L0 9.5L7.2 14.7L5.8 24L12 18.5L18.2 24L16.8 14.7L24 9.5L14.6 8.3L12 0z" />
  </svg>
);

const Sun = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
);

const Moon = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

// Input Component
const Input = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  rightElement,
  className = "",
}) => {
  const { isDark } = useTheme();

  const themeClasses = {
    input: isDark
      ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-transparent"
      : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500",
    icon: isDark ? "text-gray-400" : "text-gray-500",
  };

  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`w-4 h-4 ${themeClasses.icon}`} />
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full ${Icon ? "pl-10" : "pl-3"} ${
          rightElement ? "pr-10" : "pr-3"
        } py-2 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          themeClasses.input
        } ${className}`}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
};

// Button Component
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  size = "md",
}) => {
  const { isDark } = useTheme();

  const variants = {
    primary: `bg-gradient-to-r ${
      isDark
        ? "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        : "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
    } text-white`,
    secondary: `${
      isDark
        ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
        : "bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300"
    } border`,
  };

  const sizes = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDark ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"
      } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
        variants[variant]
      } ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
  const { isDark } = useTheme();
  const strength = usePasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-1 space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-xs ${strength.color}`}>{strength.text}</span>
        <span
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          {strength.score}/5
        </span>
      </div>
      <div
        className={`w-full h-1 rounded-full ${
          isDark ? "bg-gray-600" : "bg-gray-200"
        }`}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor:
              strength.score <= 2
                ? "#ef4444"
                : strength.score <= 3
                ? "#eab308"
                : strength.score <= 4
                ? "#3b82f6"
                : "#10b981",
          }}
        />
      </div>
    </div>
  );
};

// Theme Toggle Button
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-full backdrop-blur-xl shadow-lg border transition-all duration-300 hover:scale-110 z-20
      ${
        isDark
          ? "bg-gray-800/80 border-gray-700/50"
          : "bg-white/90 border-gray-200/50"
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
      )}
    </button>
  );
};

// Main Signup Component
const ClerkSignup = () => {
  const { isDark } = useTheme();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Theme classes object using isDark for dynamic styling
  const themeClasses = {
    container: isDark
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      : "bg-gradient-to-br from-gray-100 via-white to-gray-50",
    card: isDark
      ? "bg-gray-800/80 border-gray-700/50"
      : "bg-white/90 border-gray-200/50",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    textMuted: isDark ? "text-gray-400" : "text-gray-500",
    input: isDark
      ? "bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
      : "bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500",
    button: isDark
      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
    accent: isDark ? "text-blue-400" : "text-blue-600",
    error: isDark
      ? "bg-red-900/20 border-red-700/50 text-red-300"
      : "bg-red-50 border-red-200 text-red-700",
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    if (!isLoaded) return;

    // Basic validation
    if (password.length < 8) {
      setErr("Password must be at least 8 characters long");
      return;
    }
    if (!agreeTerms) {
      setErr("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      // Get CAPTCHA token if needed
      const captchaToken = window.Clerk?.captcha?.getToken?.();

      const result = await signUp.create({
        emailAddress: email,
        password,
        captchaToken, // Pass the token (can be undefined if disabled)
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        setPendingVerification(true);
      }
    } catch (error) {
      console.error("Signup error", error);
      setErr(error.errors?.[0]?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const completeSignup = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignup.status === "complete") {
        await setActive({ session: completeSignup.createdSessionId });
        window.location.href = "/dashboard";
      } else {
        setErr("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error", error);
      setErr(error.errors?.[0]?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${themeClasses.container} p-2 sm:p-4 relative overflow-hidden transition-all duration-500`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute -top-1/4 -left-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 ${
              isDark ? "bg-blue-500/10" : "bg-blue-400/20"
            } rounded-full blur-3xl animate-pulse`}
          ></div>
          <div
            className={`absolute -bottom-1/4 -right-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 ${
              isDark ? "bg-purple-500/10" : "bg-purple-400/20"
            } rounded-full blur-3xl animate-pulse delay-700`}
          ></div>
        </div>

        {/* Theme Toggle - Smaller on mobile */}
        <ThemeToggle />

        <div
          className={`relative z-10 ${themeClasses.card} backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6 w-full max-w-xs sm:max-w-sm md:max-w-xs lg:max-w-sm xl:max-w-md border transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl`}
        >
          <div className="text-center mb-3 sm:mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl mb-2 sm:mb-3 transform transition-transform duration-300 hover:rotate-6">
              <EmailIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h1
              className={`text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl font-bold mb-1 bg-gradient-to-r ${
                isDark ? "from-white to-gray-300" : "from-gray-900 to-gray-600"
              } bg-clip-text text-transparent`}
            >
              Verify Your Email
            </h1>
            <p
              className={`${themeClasses.textSecondary} text-xs flex items-center justify-center gap-1`}
            >
              Enter the verification code sent to {email}
            </p>
          </div>

          {err && (
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
                <span className="text-xs font-medium">{err}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="code"
                className={`block font-medium mb-1 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Verification Code
              </label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              loading={isLoading}
              variant="primary"
              onClick={handleVerification}
            >
              Verify Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${themeClasses.container} p-2 sm:p-4 relative overflow-hidden transition-all duration-500`}
    >
      {/* Animated Background Elements - Scaled for smaller screens */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/4 -left-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 ${
            isDark ? "bg-blue-500/10" : "bg-blue-400/20"
          } rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-1/4 -right-1/4 w-32 h-32 sm:w-64 sm:h-64 lg:w-96 lg:h-96 ${
            isDark ? "bg-purple-500/10" : "bg-purple-400/20"
          } rounded-full blur-3xl animate-pulse delay-700`}
        ></div>
      </div>

      {/* Theme Toggle - Smaller on mobile */}
      <ThemeToggle />

      {/* Main Login Card - Adjusted for a smaller, more compact size */}
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
              isDark ? "from-white to-gray-300" : "from-gray-900 to-gray-600"
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
        {err && (
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
              <span className="text-xs font-medium">{err}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-3 sm:space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className={`block font-medium mb-1 text-sm ${themeClasses.textSecondary}`}
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={EmailIcon}
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className={`block font-medium mb-1 text-sm ${themeClasses.textSecondary}`}
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={LockIcon}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${
                    isDark
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-4 h-4" />
                  ) : (
                    <EyeIcon className="w-4 h-4" />
                  )}
                </button>
              }
            />
            <PasswordStrength password={password} />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={`block font-medium mb-1 text-sm ${themeClasses.textSecondary}`}
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={LockIcon}
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className={`w-4 h-4 rounded focus:ring-blue-500 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-blue-500"
                    : "border-gray-300 text-blue-600"
                }`}
                required
              />
            </div>
            <label
              htmlFor="terms"
              className={`ml-2 text-sm ${themeClasses.textSecondary}`}
            >
              I agree to the{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Terms & Conditions
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            loading={isLoading}
            variant="primary"
            onClick={handleSignup}
          >
            {!isLoading && <LockIcon className="w-4 h-4 mr-2" />}
            Create Account
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${
                isDark ? "border-gray-600" : "border-gray-300"
              }`}
            ></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span
              className={`px-2 ${
                isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
              }`}
            >
              Or continue with
            </span>
          </div>
        </div>
        {/* Google Sign Up Button */}
        <Button type="button" variant="secondary">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285f4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#ea4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className={`text-sm ${themeClasses.textMuted}`}>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// App Component with Theme Provider
const App = () => {
  return (
    <ThemeProvider>
      <ClerkSignup />
    </ThemeProvider>
  );
};

export default App;
