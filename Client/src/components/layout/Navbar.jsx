import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    const navLinks = [
        { label: "Features", href: "/#features" },
        { label: "About", href: "/#about" },
        { label: "Testimonials", href: "/#testimonials" },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3 animate-fade-in-left">
                        <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                GlobeTrotter
                            </h1>
                            <p className="text-xs text-gray-500 -mt-0.5">Travel Planning</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10 animate-fade-in-down">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-gray-600 hover:text-red-700 font-medium transition-all duration-300 text-sm relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-4 animate-fade-in-right">
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

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:text-red-700 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            >
                {/* Backdrop with heavy blur and click-to-close */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-500 cursor-pointer ${isMobileMenuOpen ? "opacity-100" : "opacity-0"
                        }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                ></div>

                {/* Frosted Glass Sidebar */}
                <div
                    className={`absolute right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                        } border-l border-white/20 flex flex-col`}
                >
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block leading-none">
                                    GlobeTrotter
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">
                                    Explorer
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Sidebar Links */}
                    <div className="flex-1 overflow-y-auto py-10 px-6">
                        <nav className="flex flex-col space-y-2">
                            {navLinks.map((item, idx) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`group flex items-center justify-between p-4 rounded-2xl text-gray-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-300 ${isMobileMenuOpen
                                            ? "translate-x-0 opacity-100"
                                            : "translate-x-10 opacity-0"
                                        }`}
                                    style={{ transitionDelay: `${idx * 50 + 100}ms` }}
                                >
                                    <span className="text-base font-semibold tracking-wide">
                                        {item.label}
                                    </span>
                                    <svg
                                        className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
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
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Sidebar Footer (Auth) */}
                    <div className="p-8 border-t border-gray-100/50 space-y-4 bg-white/50">
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center w-full py-4 px-4 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-red-700 to-red-800 text-white font-bold shadow-xl shadow-red-200 hover:shadow-red-300 transition-all active:scale-95"
                        >
                            Get Started
                        </Link>
                        <p className="text-center text-[10px] text-gray-400 mt-4">
                            © 2026 GlobeTrotter Inc.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
