import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import AnimatedBackground from "../components/layout/AnimatedBackground";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSetUser = (userData) => {
    localStorage.setItem("admin", JSON.stringify(userData));
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="pt-24 pb-12 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Main Container */}
        <div className="relative z-10 w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/50 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Administrator Access
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to access the admin dashboard
              </p>
            </div>

            <AdminLogin setUser={handleSetUser} />

            <p className="text-center text-gray-600 text-sm mt-8">
              Not an admin?{" "}
              <Link
                to="/login"
                className="text-red-700 hover:text-red-800 font-bold transition-colors"
              >
                User Login
              </Link>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 text-center animate-fade-in-up">
            <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
              <span className="text-green-500">✓</span> Secure admin login •
              Your data is encrypted
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminLoginPage;
