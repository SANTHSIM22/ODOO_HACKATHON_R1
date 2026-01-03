import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h1>
          <div className="space-y-2 mb-6">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-3 px-4 text-center font-semibold transition duration-200 ${
                showLogin
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-3 px-4 text-center font-semibold transition duration-200 ${
                !showLogin
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Register
            </button>
          </div>
          <div className="p-6">
            {showLogin ? (
              <Login setUser={setUser} />
            ) : (
              <Register setUser={setUser} setShowLogin={setShowLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
