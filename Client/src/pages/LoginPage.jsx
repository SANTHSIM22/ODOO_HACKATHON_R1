import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../components/Login";

function LoginPage() {
  const navigate = useNavigate();


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {

      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSetUser = (userData) => {
 
    localStorage.setItem("user", JSON.stringify(userData));

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="text-3xl font-bold text-indigo-600 hover:text-indigo-700"
          >
            🌍 GlobeTrotter
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-xl p-6">
          <Login setUser={handleSetUser} />
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
