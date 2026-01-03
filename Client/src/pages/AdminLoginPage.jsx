import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";

function AdminLoginPage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleSetUser = (userData) => {
        setUser(userData);
    };

    if (user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome, Administrator!
                    </h1>
                    <div className="space-y-2 mb-6">
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Name:</span> {user.name}
                        </p>
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Username:</span> {user.username}
                        </p>
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Role:</span>{" "}
                            <span className="text-red-600 font-bold">Administrator</span>
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setUser(null);
                            navigate("/");
                        }}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 font-semibold"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

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
