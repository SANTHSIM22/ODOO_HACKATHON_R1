import { Link } from "react-router-dom";

function Footer() {
  const footerLinks = [
    { label: "Features", href: "/#features" },
    { label: "About", href: "/#about" },
    { label: "Privacy", href: "/#privacy" },
    { label: "Terms", href: "/#terms" },
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
            <span className="text-xl font-bold text-gray-900">
              GlobeTrotter
            </span>
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

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 flex justify-center items-center">
          <p className="text-xs text-gray-400">
            © 2026 GlobeTrotter. Made with ❤️ for travelers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
