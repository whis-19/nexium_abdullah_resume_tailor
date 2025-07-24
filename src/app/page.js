"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Moon,
  Sun,
  Sparkles,
  Zap,
  Download,
  Share,
  Move,
  Wand2,
  Shield,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Brain,
  FileText,
  Palette,
  Globe,
  Target,
  Clock,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from '../components/ThemeToggle';

// Modal component (copied and adapted from dashboard/page.jsx)
const Modal = ({ message, onClose, isDark }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
    <div className={`p-6 rounded-lg shadow-xl max-w-sm mx-auto text-center border ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}>
      <p className="text-lg font-semibold mb-4">{message}</p>
      <div className="flex justify-center">
        <button
          onClick={onClose}
          className={`py-2 px-5 rounded-lg font-semibold transition duration-300 ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Okay
        </button>
      </div>
    </div>
  </div>
);

export default function Home() {
  // ============ STATE MANAGEMENT ============
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState(null);

  // ============ SCROLL EFFECT HANDLER ============
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============ THEME TOGGLE FUNCTION ============
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // ============ THEME CLASSES ============
  const themeClasses = {
    background: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    cardBg: isDarkMode ? "bg-gray-800" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    accent: "bg-gradient-to-r from-purple-600 to-blue-600",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    hover: isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100",
  };

  // ============ NAVIGATION BAR COMPONENT ============
  const NavigationBar = () => (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? `${themeClasses.cardBg} shadow-lg backdrop-blur-md border-b ${themeClasses.border}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-lg ${themeClasses.accent} flex items-center justify-center`}
            >
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${themeClasses.text}`}>
              AI ResumeBuilder
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <ThemeToggle isDark={isDarkMode} toggleTheme={toggleTheme} />

            {/* Get Started Button */}
            <Link
              href="/dashboard"
              className={`px-6 py-2 ${themeClasses.accent} text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg`}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );

  // ============ HERO SECTION COMPONENT ============
  const HeroSection = () => (
    <section
      className={`min-h-screen flex items-center ${themeClasses.background} pt-16`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  AI-Powered Resume Builder
                </span>
              </div>

              <h1
                className={`text-5xl md:text-6xl font-bold ${themeClasses.text} leading-tight`}
              >
                Create Your
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  Perfect Resume
                </span>{" "}
                in Minutes
              </h1>

              <p className={`text-xl ${themeClasses.textSecondary} max-w-2xl`}>
                Transform your career with AI-powered resume building. Get
                personalized suggestions, professional templates, and land your
                dream job faster than ever.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className={`px-8 py-4 ${themeClasses.accent} text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 transform duration-200 shadow-xl flex items-center justify-center space-x-2`}
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <button
                className={`px-8 py-4 ${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border} rounded-xl font-semibold text-lg ${themeClasses.hover} transition-colors`}
                onClick={() => setComingSoonFeature('Watch Demo feature')}
              >
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white dark:border-gray-900"
                  ></div>
                ))}
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className={`text-sm ${themeClasses.textSecondary}`}>
                  Trusted by 50,000+ professionals
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div
                className={`${themeClasses.cardBg} rounded-2xl shadow-2xl p-8 border ${themeClasses.border}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${themeClasses.text}`}>
                      Resume Preview
                    </h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded w-3/4"></div>
                    <div
                      className={`h-2 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      } rounded w-1/2`}
                    ></div>
                    <div
                      className={`h-2 ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-200"
                      } rounded w-2/3`}
                    ></div>

                    <div className="pt-4 space-y-2">
                      <div
                        className={`h-3 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-full`}
                      ></div>
                      <div
                        className={`h-3 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-4/5`}
                      ></div>
                      <div
                        className={`h-3 ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        } rounded w-3/5`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-75"></div>
          </div>
        </div>
      </div>
    </section>
  );

  // ============ FEATURES SECTION DATA ============
  const featuresData = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Content",
      description:
        "Input job descriptions and get tailored bullet points with perfect grammar and tone.",
      color: "from-purple-500 to-blue-500",
    },
    {
      icon: <Move className="h-8 w-8" />,
      title: "Drag & Drop Builder",
      description:
        "Easily customize your resume with intuitive drag-and-drop section reordering.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Professional Templates",
      description:
        "Choose from Modern, Classic, and Minimalist designs that stand out.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: "Export & Share",
      description:
        "Download as PDF or generate shareable links to showcase your resume anywhere.",
      color: "from-teal-500 to-green-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Cloud Storage",
      description:
        "Save multiple resumes safely with secure cloud backup.",
      color: "from-green-500 to-yellow-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Optimization",
      description:
        "AI analyzes and optimizes your content for ATS systems and recruiters.",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  // ============ FEATURES SECTION COMPONENT ============
  const FeaturesSection = () => (
    <section id="features" className={`py-20 ${themeClasses.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${themeClasses.text}`}>
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Perfect Resumes
            </span>
          </h2>
          <p
            className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}
          >
            Everything you need to create, customize, and share professional
            resumes that get results
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className={`group ${themeClasses.cardBg} p-8 rounded-2xl border ${themeClasses.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
              >
                {feature.icon}
              </div>

              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-3`}>
                {feature.title}
              </h3>

              <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ============ HOW IT WORKS SECTION DATA ============
  const stepsData = [
    {
      step: "01",
      title: "Choose Template",
      description:
        "Get start and select from our professional templates.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      step: "02",
      title: "Add Job Description",
      description:
        "Paste the job description you're applying for and let our AI analyze the requirements.",
      icon: <Target className="h-6 w-6" />,
    },
    {
      step: "03",
      title: "AI Generates Content",
      description:
        "Get tailored bullet points, optimized keywords, and perfect grammar automatically.",
      icon: <Wand2 className="h-6 w-6" />,
    },
    {
      step: "04",
      title: "Customize & Export",
      description:
        "Fine-tune your resume with drag-and-drop editing, then download or share instantly.",
      icon: <Download className="h-6 w-6" />,
    },
  ];

  // ============ HOW IT WORKS SECTION COMPONENT ============
  const HowItWorksSection = () => (
    <section className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${themeClasses.text}`}>
            How It Works
          </h2>
          <p
            className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}
          >
            Create your perfect resume in just 4 simple steps
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stepsData.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div
                  className={`${themeClasses.cardBg} p-6 rounded-2xl border ${themeClasses.border} text-center relative z-10`}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div
                      className={`w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 mt-4`}
                  >
                    <div className="text-purple-600">{step.icon}</div>
                  </div>

                  {/* Content */}
                  <h3
                    className={`text-lg font-semibold ${themeClasses.text} mb-2`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`${themeClasses.textSecondary} text-sm leading-relaxed`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // ============ STATS SECTION COMPONENT ============
  const StatsSection = () => (
    <section className={`py-20 ${themeClasses.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}
            >
              50K+
            </div>
            <p className={`${themeClasses.textSecondary} font-medium`}>
              Resumes Created
            </p>
          </div>

          <div className="space-y-2">
            <div
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent`}
            >
              95%
            </div>
            <p className={`${themeClasses.textSecondary} font-medium`}>
              Success Rate
            </p>
          </div>

          <div className="space-y-2">
            <div
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent`}
            >
              24/7
            </div>
            <p className={`${themeClasses.textSecondary} font-medium`}>
              AI Support
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // ============ CTA SECTION COMPONENT ============
  const CTASection = () => (
    <section className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className={`text-4xl md:text-5xl font-bold ${themeClasses.text}`}>
            Ready to Build Your
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Dream Resume?
            </span>
          </h2>

          <p
            className={`text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto`}
          >
            Join thousands of professionals who've transformed their careers
            with our AI-powered resume builder.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className={`px-8 py-4 ${themeClasses.accent} text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-xl`}
            >
              Start Building Now
            </Link>
            <button
              className={`px-8 py-4 ${themeClasses.cardBg} ${themeClasses.text} border ${themeClasses.border} rounded-xl font-semibold text-lg ${themeClasses.hover} transition-colors`}
              onClick={() => setComingSoonFeature('View Examples feature')}
            >
              View Examples
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // ============ FOOTER COMPONENT ============
  const Footer = () => (
    <footer
      className={`py-12 ${themeClasses.background} border-t ${themeClasses.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-lg ${themeClasses.accent} flex items-center justify-center`}
              >
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${themeClasses.text}`}>
                AI ResumeBuilder
              </span>
            </div>
            <p className={`${themeClasses.textSecondary} text-sm`}>
              Create professional resumes with the power of AI.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className={`font-semibold ${themeClasses.text} mb-4`}>
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold ${themeClasses.text} mb-4`}>
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold ${themeClasses.text} mb-4`}>
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`mt-8 pt-8 border-t ${themeClasses.border} text-center`}
        >
          <p className={`${themeClasses.textSecondary} text-sm`}>
            © 2025 AI ResumeBuilder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );

  // ============ MAIN COMPONENT RENDER ============
  return (
    <div
      className={`min-h-screen ${themeClasses.background} transition-colors duration-300`}
    >
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
      <Footer />
      {comingSoonFeature && (
        <Modal
          message={`${comingSoonFeature} coming soon!`}
          onClose={() => setComingSoonFeature(null)}
          isDark={isDarkMode}
        />
      )}
      {showModal && !comingSoonFeature && (
        <Modal
          message="Coming Soon!"
          onClose={() => setShowModal(false)}
          isDark={isDarkMode}
        />
      )}
    </div>
  );
}
