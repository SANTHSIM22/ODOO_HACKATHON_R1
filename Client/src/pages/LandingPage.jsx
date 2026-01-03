import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function LandingPage() {
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (id) => (el) => {
    if (el) sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Custom Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }

        .opacity-0-initial {
          opacity: 0;
        }

        .gradient-text {
          background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .line-decoration::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #b91c1c, #ef4444);
          border-radius: 2px;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 animate-fade-in-left">
            <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                GlobeTrotter
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">Travel Planning</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center space-x-10 animate-fade-in-down">
            <a
              href="#features"
              className="text-gray-600 hover:text-red-700 font-medium transition-all duration-300 text-sm relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-red-700 font-medium transition-all duration-300 text-sm relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-red-700 font-medium transition-all duration-300 text-sm relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-red-700 font-medium transition-all duration-300 text-sm relative group"
            >
              Testimonials
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="flex items-center space-x-4 animate-fade-in-right">
            <Link
              to="/login"
              className="px-5 py-2.5 text-gray-700 hover:text-red-700 font-medium transition-all duration-300 text-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg hover:from-red-800 hover:to-red-900 transition-all duration-300 font-medium text-sm shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Full Screen */}
        <section className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-red-50">
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full opacity-30 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200 rounded-full opacity-20 blur-3xl animate-pulse-slow delay-200"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-50 to-transparent rounded-full opacity-50"></div>
          </div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="opacity-0-initial animate-fade-in-up">
                  <span className="inline-flex items-center px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                    Travel Planning Reimagined
                  </span>
                </div>

                <h2 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] opacity-0-initial animate-fade-in-up delay-100">
                  Plan Your
                  <span className="block gradient-text">Perfect Journey</span>
                </h2>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl opacity-0-initial animate-fade-in-up delay-200">
                  GlobeTrotter empowers you to create personalized multi-city
                  itineraries, manage budgets intelligently, and visualize your
                  travel plans through an intuitive platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 opacity-0-initial animate-fade-in-up delay-300">
                  <Link
                    to="/register"
                    className="group px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 text-white font-medium rounded-xl hover:from-red-800 hover:to-red-900 transition-all duration-300 text-center shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300 flex items-center justify-center space-x-2"
                  >
                    <span>Start Planning Today</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <a
                    href="#how-it-works"
                    className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-red-700 hover:text-red-700 transition-all duration-300 text-center flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Watch Demo</span>
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-8 pt-4 opacity-0-initial animate-fade-in-up delay-400">
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-medium text-gray-600"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-red-700 flex items-center justify-center text-xs font-medium text-white">
                      +5K
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">5,000+</span>{" "}
                    travelers trust us
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative opacity-0-initial animate-fade-in-right delay-300">
                <div className="relative">
                  {/* Main Card */}
                  <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-float">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          European Adventure
                        </h3>
                        <p className="text-sm text-gray-500">
                          Jun 15 - Jun 27, 2025
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-red-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      {[
                        {
                          city: "Paris, France",
                          nights: 3,
                          color: "bg-red-700",
                        },
                        { city: "Rome, Italy", nights: 4, color: "bg-red-500" },
                        {
                          city: "Barcelona, Spain",
                          nights: 4,
                          color: "bg-red-400",
                        },
                      ].map((stop, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-3 h-3 ${stop.color} rounded-full`}
                            ></div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {stop.city}
                              </p>
                              <p className="text-xs text-gray-500">
                                {stop.nights} nights
                              </p>
                            </div>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                      <div>
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <p className="text-2xl font-bold text-gray-900">
                          $4,250
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">12 Days</p>
                        <p className="text-sm font-medium text-red-700">
                          3 Cities
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-fade-in delay-500">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Trip Saved
                        </p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-fade-in delay-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-red-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Under Budget
                        </p>
                        <p className="text-xs text-green-600">-$320 saved</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Shapes */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-100 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-50 rounded-full opacity-60 blur-xl"></div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-gray-300 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          id="stats"
          ref={addToRefs("stats")}
          className={`border-y border-gray-100 bg-white transition-all duration-1000 ${
            isVisible.stats ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "500+", label: "Global Destinations" },
                { value: "50K+", label: "Trips Planned" },
                { value: "10K+", label: "Active Travelers" },
                { value: "98%", label: "Satisfaction Rate" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`text-center transition-all duration-700 ${
                    isVisible.stats ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="text-4xl lg:text-5xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="about" ref={addToRefs("about")} className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div
                className={`transition-all duration-1000 ${
                  isVisible.about ? "animate-fade-in-left" : "opacity-0"
                }`}
              >
                <p className="text-red-700 font-semibold mb-4 tracking-wide uppercase text-sm">
                  Our Vision
                </p>
                <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight relative line-decoration">
                  Transforming How You Experience Travel
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  GlobeTrotter is designed to be a personalized, intelligent,
                  and collaborative platform that fundamentally changes how
                  individuals plan and experience travel.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We empower users to dream, design, and organize trips with
                  ease through an end-to-end planning tool that combines
                  flexibility with interactivity.
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 text-red-700 font-medium hover:text-red-800 transition-colors group"
                >
                  <span>Learn more about our mission</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>

              <div
                className={`grid grid-cols-2 gap-5 transition-all duration-1000 ${
                  isVisible.about ? "animate-fade-in-right" : "opacity-0"
                }`}
              >
                {[
                  {
                    icon: (
                      <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "User-Centric",
                    desc: "Designed around your travel preferences",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    ),
                    title: "Intelligent",
                    desc: "Smart recommendations and optimization",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ),
                    title: "Collaborative",
                    desc: "Plan trips with friends and family",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6 text-red-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "Global Reach",
                    desc: "Access destinations worldwide",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover-lift"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 border border-red-100">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          ref={addToRefs("features")}
          className="bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div
              className={`text-center mb-20 transition-all duration-1000 ${
                isVisible.features ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <p className="text-red-700 font-semibold mb-4 tracking-wide uppercase text-sm">
                Platform Features
              </p>
              <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Everything You Need to Plan
                <span className="block gradient-text">the Perfect Trip</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From itinerary building to budget management, our comprehensive
                suite of tools ensures a seamless travel planning experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-7 h-7 text-red-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  ),
                  title: "Itinerary Builder",
                  desc: "Construct comprehensive day-wise trip plans with an interactive interface.",
                },
                {
                  icon: (
                    <svg
                      className="w-7 h-7 text-red-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "Budget Management",
                  desc: "Track expenses with detailed breakdowns by category.",
                },
                {
                  icon: (
                    <svg
                      className="w-7 h-7 text-red-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  ),
                  title: "City Discovery",
                  desc: "Search and explore destinations with detailed information.",
                },
                {
                  icon: (
                    <svg
                      className="w-7 h-7 text-red-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "Trip Calendar",
                  desc: "Visualize your journey with calendar-based or timeline views.",
                },
                {
                  icon: (
                    <svg
                      className="w-7 h-7 text-red-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ),
                  title: "Activity Search",
                  desc: "Browse curated experiences including sightseeing and tours.",
                },
                {
                  icon: (
                    <svg
                      className="w-7 h-7 text-red-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  ),
                  title: "Share Itineraries",
                  desc: "Create public sharable links for your travel plans.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl p-8 border border-gray-100 hover-lift transition-all duration-700 ${
                    isVisible.features ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="cta"
          ref={addToRefs("cta")}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-800 to-red-900"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div
            className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 transition-all duration-1000 ${
              isVisible.cta ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Travel Planning?
              </h3>
              <p className="text-xl text-red-100 mb-10 leading-relaxed">
                Join thousands of travelers who are already creating
                personalized, budget-conscious itineraries.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Link
                  to="/register"
                  className="group px-10 py-4 bg-white text-red-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Create Free Account</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-red-700 transition-all duration-300 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Compact Footer - White/Red Theme */}
      {/* Footer - Elegant Centered Design */}
      <footer className="bg-gradient-to-b from-gray-50 to-white">
        {/* Red Accent Line */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-red-700 to-red-800"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Main Footer Content */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="inline-flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                GlobeTrotter
              </span>
            </div>

            {/* Tagline */}
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Empowering travelers to plan unforgettable journeys with
              intelligent tools and seamless experiences.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
            {["Features", "About", "How It Works", "Privacy", "Terms"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm text-gray-600 hover:text-red-700 transition-colors duration-200"
                >
                  {item}
                </a>
              )
            )}
          </nav>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-8">
            {[
              {
                name: "Twitter",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                ),
              },
              {
                name: "LinkedIn",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                ),
              },
              {
                name: "Instagram",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                ),
              },
              {
                name: "GitHub",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-700 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © 2025 GlobeTrotter. Made with ❤️ for travelers worldwide.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-xs text-gray-500 hover:text-red-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs px-4 py-2 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-full hover:from-red-800 hover:to-red-900 transition-all shadow-md shadow-red-200"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
