import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-2xl font-bold text-gray-900 hover:text-red-600 transition"
            >
              GlobeTrotter
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/my-trips")}
                className="px-5 py-2 text-gray-700 hover:text-red-600 font-semibold transition"
              >
                My Trips
              </button>
              <button
                onClick={() => navigate("/community-tab")}
                className="px-5 py-2 text-gray-700 hover:text-red-600 font-semibold transition"
              >
                Community
              </button>
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="px-5 py-2 text-gray-700 hover:text-red-600 font-semibold transition"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-2">
            Search Destinations & Activities
          </h1>
          <p className="text-gray-600">
            Find destinations, explore activities, and add them to your trip
            itinerary
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-6 mb-8">
          {/* Search Type Toggle */}
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSearchType("All")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  searchType === "All"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSearchType("Cities")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  searchType === "Cities"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Destinations
              </button>
              <button
                onClick={() => setSearchType("Activities")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  searchType === "Activities"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          <div className="mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("Recommended")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === "Recommended"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setSortBy("Budget: Low to High")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === "Budget: Low to High"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Budget: Low to High
              </button>
              <button
                onClick={() => setSortBy("Budget: High to Low")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === "Budget: High to Low"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">
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
                className="bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-300 transition-all duration-300"
              >
                {/* Trip Image */}
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={
                      trip.imageUrl ||
                      trip.image ||
                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800"
                    }
                    alt={trip.destination}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
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
                    className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold uppercase tracking-wide"
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
          <div className="bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-300 p-16 text-center">
            <p className="text-gray-500 font-semibold mb-2">No results found</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CitySearchPage;
