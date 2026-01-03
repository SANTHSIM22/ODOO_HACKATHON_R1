import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const isLandingPage = location.pathname === "/";

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "About", href: "#about" },
        { name: "Testimonials", href: "#testimonials" },
    ];

    const getHref = (href) => {
        return isLandingPage ? href : `/${href}`;
    };

    return (
        <>
            <style>{`
                .glass-effect {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3">
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
                    <nav className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={getHref(link.href)}
                                className="text-gray-600 hover:text-red-700 font-medium transition-all duration-300 text-sm relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
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
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300 animate-fade-in"
                    style={{
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu Overlay */}
            <div
                className={`lg:hidden fixed top-0 bottom-0 right-0 w-3/4 max-w-sm bg-white z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex justify-end p-4 border-b border-gray-100">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="flex flex-col px-4 py-6 space-y-4 h-[calc(100vh-80px)] overflow-y-auto">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={getHref(link.href)}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-gray-700 hover:text-red-700 font-medium transition-all duration-300 text-base py-3 px-4 rounded-lg hover:bg-red-50"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="pt-6 mt-4 border-t border-gray-100 space-y-3">
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-center px-5 py-3 text-gray-700 hover:text-red-700 font-medium transition-all duration-300 text-base border border-gray-200 rounded-lg hover:border-red-700"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-center px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 text-white rounded-lg hover:from-red-800 hover:to-red-900 transition-all duration-300 font-medium text-base shadow-lg shadow-red-200"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navbar;
