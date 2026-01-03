import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";

function AdminLoginPage() {
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <Link
                        to="/"
                        className="text-3xl font-bold text-red-600 hover:text-red-700"
                    >
                        🌍 GlobeTrotter
                    </Link>
                    <p className="text-sm text-gray-600 mt-2">Administrator Access</p>
                </div>
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <AdminLogin setUser={handleSetUser} />
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Not an admin?{" "}
                            <Link
                                to="/login"
                                className="text-red-600 hover:text-red-700 font-semibold"
                            >
                                User Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;
