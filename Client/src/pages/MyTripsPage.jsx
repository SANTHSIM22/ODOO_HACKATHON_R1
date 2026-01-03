import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function MyTripsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("startDate");
  const [viewMode, setViewMode] = useState("grouped");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchUserTrips(parsedUser._id || parsedUser.id);
  }, [navigate]);

  const fetchUserTrips = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/user-trips/${userId}`);
      const data = await response.json();
      if (data.success) {
        setTrips(data.trips);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`${API_URL}/user-trips/${tripId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Trip deleted successfully!");
        setTrips(trips.filter((trip) => trip._id !== tripId));
      } else {
        alert(data.message || "Failed to delete trip");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Error deleting trip");
    }
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getTripStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start)
      return {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-800",
        key: "upcoming",
      };
    if (now > end)
      return {
        label: "Completed",
        color: "bg-gray-100 text-gray-800",
        key: "completed",
      };
    return {
      label: "Ongoing",
      color: "bg-green-100 text-green-800",
      key: "ongoing",
    };
  };

  const getFilteredAndSortedTrips = () => {
    let filtered = [...trips];

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (trip) =>
          trip.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.destinations?.some((dest) =>
            dest.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((trip) => {
        const status = getTripStatus(trip.startDate, trip.endDate);
        return status.key === filterStatus;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "startDate":
          return new Date(a.startDate) - new Date(b.startDate);
        case "startDate-desc":
          return new Date(b.startDate) - new Date(a.startDate);
        case "name":
          return a.tripName.localeCompare(b.tripName);
        case "name-desc":
          return b.tripName.localeCompare(a.tripName);
        case "duration":
          const durationA = calculateDuration(a.startDate, a.endDate);
          const durationB = calculateDuration(b.startDate, b.endDate);
          return durationA - durationB;
        case "duration-desc":
          const durationA2 = calculateDuration(a.startDate, a.endDate);
          const durationB2 = calculateDuration(b.startDate, b.endDate);
          return durationB2 - durationA2;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getGroupedTrips = () => {
    const filtered = getFilteredAndSortedTrips();
    const grouped = {
      ongoing: [],
      upcoming: [],
      completed: [],
    };

    filtered.forEach((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      grouped[status.key].push(trip);
    });

    return grouped;
  };

  const displayTrips =
    viewMode === "grouped"
      ? getGroupedTrips()
      : { all: getFilteredAndSortedTrips() };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-600 hover:text-black font-semibold transition"
                >
                  ← Back
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-black">My Trips</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage and track all your travel plans
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/create-trip")}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
              >
                + New Trip
              </button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trips..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-lg"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
              >
                <option value="startDate">Date (Earliest)</option>
                <option value="startDate-desc">Date (Latest)</option>
                <option value="name">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="duration">Duration (Short)</option>
                <option value="duration-desc">Duration (Long)</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1 bg-gray-50">
                <button
                  onClick={() => setViewMode("grouped")}
                  className={`flex-1 px-3 py-2 rounded font-semibold text-xs transition ${
                    viewMode === "grouped"
                      ? "bg-red-600 text-white"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Grouped
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 px-3 py-2 rounded font-semibold text-xs transition ${
                    viewMode === "list"
                      ? "bg-red-600 text-white"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-pulse text-gray-600 text-lg">
              Loading your trips...
            </div>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-gray-400">→</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Start planning your first adventure today
            </p>
            <button
              onClick={() => navigate("/create-trip")}
              className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Stats */}
            {viewMode === "grouped" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Ongoing Trips
                      </p>
                      <p className="text-4xl font-bold text-green-600 mt-2">
                        {displayTrips.ongoing.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">▶</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Upcoming Trips
                      </p>
                      <p className="text-4xl font-bold text-blue-600 mt-2">
                        {displayTrips.upcoming.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">⊙</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Completed Trips
                      </p>
                      <p className="text-4xl font-bold text-gray-600 mt-2">
                        {displayTrips.completed.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trips Display */}
            {viewMode === "grouped" ? (
              Object.entries(displayTrips).map(([statusKey, statusTrips]) => {
                const statusConfig = {
                  ongoing: {
                    title: "Ongoing Trips",
                    color: "border-green-200 bg-green-50",
                    textColor: "text-green-700",
                  },
                  upcoming: {
                    title: "Upcoming Trips",
                    color: "border-blue-200 bg-blue-50",
                    textColor: "text-blue-700",
                  },
                  completed: {
                    title: "Completed Trips",
                    color: "border-gray-200 bg-gray-50",
                    textColor: "text-gray-700",
                  },
                };

                return (
                  <div key={statusKey} className="space-y-4">
                    <div
                      className={`rounded-xl px-6 py-4 border-2 ${statusConfig[statusKey].color}`}
                    >
                      <h2
                        className={`text-lg font-bold ${statusConfig[statusKey].textColor}`}
                      >
                        {statusConfig[statusKey].title}
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          ({statusTrips.length})
                        </span>
                      </h2>
                    </div>
                    {statusTrips.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {statusTrips.map((trip) => (
                          <TripCard
                            key={trip._id}
                            trip={trip}
                            getTripStatus={getTripStatus}
                            calculateDuration={calculateDuration}
                            navigate={navigate}
                            handleDelete={handleDelete}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                        <p className="text-gray-500 font-medium">
                          No {statusConfig[statusKey].title.toLowerCase()} at
                          the moment
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div>
                {displayTrips.all.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-16 text-center">
                    <div className="text-4xl mb-4 text-gray-400">→</div>
                    <h3 className="text-2xl font-bold text-black mb-2">
                      No trips found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or filters
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTrips.all.map((trip) => (
                      <TripCard
                        key={trip._id}
                        trip={trip}
                        getTripStatus={getTripStatus}
                        calculateDuration={calculateDuration}
                        navigate={navigate}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// TripCard Component
function TripCard({
  trip,
  getTripStatus,
  calculateDuration,
  navigate,
  handleDelete,
}) {
  const status = getTripStatus(trip.startDate, trip.endDate);
  const duration = calculateDuration(trip.startDate, trip.endDate);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-300 transition-all duration-300 group">
      {trip.coverPhoto ? (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={trip.coverPhoto}
            alt={trip.tripName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 font-semibold">Image</div>';
            }}
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-400 font-semibold">Image</span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-black group-hover:text-red-600 transition flex-1">
            {trip.tripName}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ml-2 flex-shrink-0 ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {trip.description}
        </p>

        <div className="space-y-3 mb-6 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-4">→</span>
            <span>
              {new Date(trip.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-4">◆</span>
            <span>
              {duration} {duration === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-4">✦</span>
            <span>
              {trip.destinations?.length || 0} destination
              {trip.destinations?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate(`/trip/${trip._id}`)}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold text-sm shadow-sm"
          >
            View Details
          </button>
          <button
            onClick={() => handleDelete(trip._id)}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyTripsPage;
