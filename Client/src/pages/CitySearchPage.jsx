import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  LogOut,
  User as UserIcon,
  TrendingUp,
  Award,
  Globe,
  Zap,
} from "lucide-react";
import Footer from "../components/layout/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CitySearchPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [searchType, setSearchType] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchTrips();
  }, [navigate]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/trips`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched trips data:", data);
        console.log("First trip activities:", data[0]?.activities);
        setTrips(Array.isArray(data) ? data : []);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddToTrip = async (trip) => {
    try {
      const response = await fetch(`${API_URL}/user-trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          tripId: trip._id,
          destination: trip.destination,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "preplanned",
        }),
      });

      if (response.ok) {
        alert(`${trip.destination} added to your trips!`);
      } else {
        alert("Failed to add trip. Please try again.");
      }
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const allCountries = [
    "All",
    ...new Set(trips.map((t) => t.country).filter(Boolean)),
  ];
  const allCategories = [
    "All",
    ...new Set(trips.map((t) => t.category).filter(Boolean)),
  ];
  const allActivities = [
    "All",
    ...new Set(trips.flatMap((t) => t.activities || []).filter(Boolean)),
  ];

  let processedTrips = trips;

  // Apply search query filter
  if (searchQuery.trim()) {
    processedTrips = processedTrips.filter((trip) => {
      const matchesSearch =
        trip.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.activities?.some((activity) =>
          activity.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesSearch;
    });
  }

  // Filter by search type
  if (searchType === "Activities" && selectedActivity !== "All") {
    processedTrips = processedTrips.filter((t) =>
      t.activities?.some((activity) => activity === selectedActivity)
    );
  }

  if (selectedCountry !== "All") {
    processedTrips = processedTrips.filter(
      (t) => t.country === selectedCountry
    );
  }
  if (selectedCategory !== "All") {
    processedTrips = processedTrips.filter(
      (t) => t.category === selectedCategory
    );
  }
  if (selectedActivity !== "All" && searchType !== "Activities") {
    processedTrips = processedTrips.filter((t) =>
      t.activities?.includes(selectedActivity)
    );
  }

  if (sortBy === "Budget: Low to High") {
    processedTrips.sort((a, b) => (a.budget || 0) - (b.budget || 0));
  } else if (sortBy === "Budget: High to Low") {
    processedTrips.sort((a, b) => (b.budget || 0) - (a.budget || 0));
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation - Dashboard Style */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                GlobeTrotter
              </h1>
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => navigate("/cities")}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all font-bold uppercase tracking-wider"
              >
                Cities
              </button>
              <button
                onClick={() => navigate("/my-trips")}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all font-bold uppercase tracking-wider"
              >
                My Trips
              </button>
              <button
                onClick={() => navigate("/community-tab")}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all font-bold uppercase tracking-wider"
              >
                Community
              </button>

              <div className="relative ml-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold hover:bg-red-700 transition overflow-hidden shadow-md ring-2 ring-white"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/dashboard/profile")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <UserIcon size={16} className="text-red-600" />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-50"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Premium Hero Section */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 md:p-12 mb-12 text-left shadow-2xl shadow-red-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
              Dashboard / Cities
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Search <span className="text-red-200">Destinations</span>
            </h2>
            <p className="text-base md:text-lg text-red-50 leading-relaxed font-semibold opacity-90">
              Find destinations, explore activities, and add them to your trip
              itinerary
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white rounded-[2rem] p-4 shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search destinations, countries, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 mb-8">
          {/* Search Type Toggle */}
          <div className="mb-6">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSearchType("All")}
                className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  searchType === "All"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSearchType("Cities")}
                className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  searchType === "Cities"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Destinations
              </button>
              <button
                onClick={() => setSearchType("Activities")}
                className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  searchType === "Activities"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Activities
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Search destinations, countries, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {allCountries.map((country) => (
                  <option key={country} value={country}>
                    {country === "All"
                      ? "All Countries"
                      : country || "No Country"}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All"
                      ? "All Categories"
                      : category || "No Category"}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="All">All Activities</option>
                {allActivities.map((activity) => (
                  <option key={activity} value={activity}>
                    {activity}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div className="mt-6">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSortBy("Recommended")}
                className={`px-4 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  sortBy === "Recommended"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setSortBy("Budget: Low to High")}
                className={`px-4 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  sortBy === "Budget: Low to High"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Budget: Low to High
              </button>
              <button
                onClick={() => setSortBy("Budget: High to Low")}
                className={`px-4 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                  sortBy === "Budget: High to Low"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Budget: High to Low
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-600 mt-4">Loading results...</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-900 font-black text-sm uppercase tracking-wider">
              {processedTrips.length} result
              {processedTrips.length !== 1 ? "s" : ""} found
              {searchType !== "All" && (
                <span className="text-red-600"> ({searchType})</span>
              )}
            </p>
          </div>
        )}

        {/* Cities Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedTrips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-red-200/50 hover:border-red-300 transition-all duration-500 group cursor-pointer"
              >
                {/* Trip Image */}
                <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={
                      trip.imageUrl ||
                      trip.image ||
                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"
                    }
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";
                    }}
                  />
                </div>

                {/* Trip Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {trip.destination}
                      </h3>
                      {trip.country && (
                        <p className="text-sm text-red-600 font-semibold">
                          📍 {trip.country}
                        </p>
                      )}
                    </div>
                    {trip.category && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full">
                        {trip.category}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {trip.description || "Explore this amazing destination!"}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.budget && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        ${trip.budget} Budget
                      </span>
                    )}
                    {trip.activities && trip.activities.length > 0 && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {trip.activities.length}{" "}
                        {trip.activities.length === 1
                          ? "Activity"
                          : "Activities"}
                      </span>
                    )}
                  </div>

                  {/* Activities Display */}
                  {trip.activities && trip.activities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Activities:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {trip.activities.slice(0, 3).map((activity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                        {trip.activities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{trip.activities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add to Trip Button */}
                  <button
                    onClick={() => handleAddToTrip(trip)}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl hover:from-red-700 hover:to-red-900 transition-all font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-200/50 group-hover:shadow-2xl group-hover:shadow-red-300/50"
                  >
                    Add to My Trips
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && processedTrips.length === 0 && (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-dashed border-gray-300 p-16 text-center">
            <p className="text-gray-900 font-black text-xl mb-2 uppercase tracking-wider">
              No results found
            </p>
            <p className="text-gray-500 font-medium">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CitySearchPage;
