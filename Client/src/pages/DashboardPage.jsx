import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [availableTrips, setAvailableTrips] = useState([]);
  const [recommendedDestinations, setRecommendedDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    fetchTrips();
    fetchRecommendedTrips();
  }, [navigate]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/trips`);
      const data = await response.json();
      if (data.success) {
        const formattedTrips = data.trips.map((trip) => ({
          id: trip._id,
          destination: trip.destination,
          description: trip.description,
          startDate: trip.startDate,
          endDate: trip.endDate,
          budget: trip.budget,
          status: new Date(trip.startDate) > new Date() ? "available" : "past",
          image: trip.image,
          imageUrl: trip.imageUrl,
          category: trip.category,
        }));
        setAvailableTrips(formattedTrips);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      setAvailableTrips([]);
    }
  };

  const fetchRecommendedTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/trips/recommended`);
      const data = await response.json();
      if (data.success) {
        const formattedDestinations = data.trips.map((trip) => ({
          id: trip._id,
          name: trip.destination,
          description: trip.description,
          estimatedBudget: trip.budget,
          image: trip.image,
          imageUrl: trip.imageUrl,
        }));
        setRecommendedDestinations(formattedDestinations);
      }
    } catch (error) {
      console.error("Error fetching recommended trips:", error);
      setRecommendedDestinations([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBookTrip = (tripId) => {
    navigate(`/create-trip?packageId=${tripId}`);
  };

  const calculateTotalTrips = () => {
    return availableTrips.filter((trip) => trip.status === "available").length;
  };

  const calculateAverageBudget = () => {
    const availableTripsOnly = availableTrips.filter(
      (trip) => trip.status === "available"
    );
    if (availableTripsOnly.length === 0) return 0;
    const total = availableTripsOnly.reduce(
      (sum, trip) => sum + trip.budget,
      0
    );
    return Math.round(total / availableTripsOnly.length);
  };

  const handlePlanNewTrip = () => {
    navigate("/plan-trip");
  };

  // Top Regional Selections data
  const regionalSelections = [
    { id: 1, name: "Europe", image: "" },
    { id: 2, name: "Asia", image: "" },
    { id: 3, name: "Americas", image: "" },
    { id: 4, name: "Africa", image: "" },
    { id: 5, name: "Oceania", image: "" },
  ];

  // Previous Trips data
  const previousTrips = [
    {
      id: 1,
      destination: "Paris, France",
      date: "Dec 2025",
      image: "",
    },
    {
      id: 2,
      destination: "Tokyo, Japan",
      date: "Nov 2025",
      image: "",
    },
    {
      id: 3,
      destination: "New York, USA",
      date: "Oct 2025",
      image: "",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-slate-600">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  const availableTripsCount = calculateTotalTrips();
  const averageBudget = calculateAverageBudget();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-rose-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-rose-600">GlobeTrotter</h1>
            </div>
            <div className="relative">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-rose-600 transition duration-200"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>

                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-rose-400 z-20 overflow-hidden">
                    {/* User Info Section */}
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-rose-400">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/my-trips");
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 transition duration-200"
                    >
                      <span className="font-medium">My Trips</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50 transition duration-200 border-t border-gray-100"
                    >
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-800">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-slate-600 mt-1">
            Explore amazing travel packages and book your next adventure
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  Available Packages
                </h3>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🌍</span>
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">{availableTripsCount}</p>
              <p className="text-sm opacity-90">Travel packages to explore</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  Average Price
                </h3>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">
                ${averageBudget.toLocaleString()}
              </p>
              <p className="text-sm opacity-90">Per package</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  Special Offers
                </h3>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🎁</span>
                </div>
              </div>
              <p className="text-4xl font-bold mb-1">
                {recommendedDestinations.length}
              </p>
              <p className="text-sm opacity-90">Recommended destinations</p>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <div className="mb-6 rounded-2xl shadow-lg overflow-hidden h-48 flex items-center justify-center relative bg-gradient-to-r from-rose-600 to-rose-500">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500"></div>
          <div className="relative z-10 text-center text-white">
            <h2 className="text-4xl font-bold mb-2">
              Discover Your Next Adventure
            </h2>
            <p className="text-lg opacity-90">
              Explore the world with GlobeTrotter
            </p>
          </div>
        </div>

        {/* Search Bar with Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search for destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-600 transition"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border-2 border-rose-400 text-rose-600 rounded-lg hover:bg-orange-50 transition font-semibold text-sm">
                Group by
              </button>
              <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border-2 border-rose-400 text-rose-600 rounded-lg hover:bg-orange-50 transition font-semibold text-sm">
                Filter
              </button>
              <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border-2 border-rose-400 text-rose-600 rounded-lg hover:bg-orange-50 transition font-semibold text-sm">
                Sort by...
              </button>
            </div>
          </div>
        </div>

        {/* Available Travel Packages */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                Available Travel Packages
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Browse and book amazing destinations
              </p>
            </div>
          </div>

          {availableTrips.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✈️</span>
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                No packages available yet!
              </h4>
              <p className="text-slate-600 mb-6">
                Check back soon for exciting travel packages
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group cursor-pointer"
                >
                  {trip.imageUrl ? (
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      <img
                        src={trip.imageUrl}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-6xl">${trip.image}</div>`;
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                            trip.status === "available"
                              ? "bg-emerald-500/90 text-white"
                              : "bg-slate-500/90 text-white"
                          }`}
                        >
                          {trip.status === "available"
                            ? "🟢 Available"
                            : "⚪ Past"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-56 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <span className="text-7xl">{trip.image}</span>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                            trip.status === "available"
                              ? "bg-emerald-500/90 text-white"
                              : "bg-slate-500/90 text-white"
                          }`}
                        >
                          {trip.status === "available"
                            ? "🟢 Available"
                            : "⚪ Past"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition">
                      {trip.destination}
                    </h4>
                    {trip.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {trip.description}
                      </p>
                    )}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="mr-2">📅</span>
                        <span>
                          {new Date(trip.startDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}{" "}
                          -{" "}
                          {new Date(trip.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm">
                          <span className="mr-2">💵</span>
                          <span className="font-bold text-slate-800 text-lg">
                            ${trip.budget.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">
                            per person
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookTrip(trip.id)}
                      className="w-full bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700 transition font-semibold text-sm shadow-lg shadow-indigo-500/30"
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Destinations */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">
                Recommended Destinations
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Handpicked by our travel experts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedDestinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
              >
                {destination.imageUrl ? (
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-6xl">${destination.image}</div>`;
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <span className="text-6xl">{destination.image}</span>
                  </div>
                )}
                <div className="p-5">
                  <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition">
                    {destination.name}
                  </h4>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="text-lg font-bold text-slate-800">
                        ${destination.estimatedBudget.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookTrip(destination.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition text-sm font-semibold shadow-lg shadow-indigo-500/30"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regional Selections */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-rose-600 mb-4">
            Top Regional Selections
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {regionalSelections.map((region) => (
              <div
                key={region.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-rose-400"
              >
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden">
                  {region.image ? (
                    <img
                      src={region.image}
                      alt={region.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Image placeholder
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-gray-800">{region.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Trips */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-rose-600">Previous Trips</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-rose-400"
              >
                <div className="h-40 bg-gradient-to-br from-rose-600 to-rose-500 flex items-center justify-center overflow-hidden">
                  {trip.image ? (
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-sm">Image placeholder</div>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-gray-800 mb-1">
                    {trip.destination}
                  </h4>
                  <p className="text-sm text-gray-600">{trip.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan a Trip Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handlePlanNewTrip}
            className="bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-500 transition duration-300 font-semibold shadow-lg transform hover:scale-105"
          >
            <span>Plan a trip</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t-2 border-rose-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2026 GlobeTrotter. Your journey begins here. 🌍
          </p>
        </div>
      </footer>
    </div>
  );
}

export default DashboardPage;
