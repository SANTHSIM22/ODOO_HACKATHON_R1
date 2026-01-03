import { Link } from "react-router-dom";

function Footer() {
    const footerLinks = [
        { label: "Features", href: "/#features" },
        { label: "About", href: "/#about" },
        { label: "How It Works", href: "/#how-it-works" },
        { label: "Privacy", href: "/#privacy" },
        { label: "Terms", href: "/#terms" },
    ];

    const socialLinks = [
        {
            name: "Twitter",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
            ),
        },
        {
            name: "LinkedIn",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            ),
        },
        {
            name: "Instagram",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
       
    ];

    return (
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
                        <span className="text-xl font-bold text-gray-900">GlobeTrotter</span>
                    </div>

                    {/* Tagline */}
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Empowering travelers to plan unforgettable journeys with intelligent
                        tools and seamless experiences.
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8">
                    {footerLinks.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm text-gray-600 hover:text-red-700 transition-colors duration-200"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Social Links */}
                <div className="flex justify-center space-x-4 mb-8">
                    {socialLinks.map((social) => (
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
    );
}

export default Footer;
