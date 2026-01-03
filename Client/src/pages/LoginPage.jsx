import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "../components/Login";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (username && password) {
        const userData = { username, name: username };
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
      } else {
        setError("Please fill in all fields");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h1 className="text-3xl font-bold text-black">GlobeTrotter</h1>
          </div>
          <p className="text-black text-sm">Plan your perfect journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl">
          <h2 className="text-2xl font-bold text-black mb-2">Welcome Back</h2>
          <p className="text-black text-sm mb-6">
            Sign in to continue planning your adventures
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 bg-white text-red-600 cursor-pointer"
                />
                <span className="text-black">Remember me</span>
              </label>
              <Link
                to="#"
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>



          <p className="text-center text-black text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-xs flex items-center justify-center gap-2">
            <span>✓</span> Secure login • Your data is encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
