import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  ChevronRight,
  TrendingUp,
  Award,
  Globe,
  Zap,
  Filter,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronLeft,
  Camera,
  Layers,
  CheckCircle2,
  Timer,
  User as UserIcon,
  Edit,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Footer from "../components/layout/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function MyTripsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("startDate");
  const [viewMode, setViewMode] = useState("grouped");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
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
                onClick={() => navigate("/dashboard")}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all font-bold uppercase tracking-wider"
              >
                Dashboard
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Dynamic Hero Section */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 md:p-16 mb-12 text-left shadow-2xl shadow-red-200/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 border border-red-500/20">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative z-10 max-w-xl text-center md:text-left w-full">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-[11px] md:text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
              Personal Travel Vault
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              My <span className="text-red-200">Adventures</span>
            </h2>
            <p className="text-lg text-red-50 leading-relaxed font-semibold opacity-90 mb-10">
              Rediscover your past memories, track current journeys, and plan
              for future explorations.
            </p>
            <button
              onClick={() => navigate("/create-trip")}
              className="bg-white text-red-600 px-10 py-4 rounded-2xl hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-300 font-bold uppercase tracking-wider shadow-2xl shadow-black/10 flex items-center gap-3 mx-auto md:mx-0 group w-full md:w-auto justify-center"
            >
              <Plus
                size={20}
                className="group-hover:rotate-90 transition-transform"
              />
              Start New Journey
            </button>
          </div>

          <div className="relative z-10 hidden lg:block pr-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 text-white min-w-[160px] hover:bg-white/20 transition-all cursor-default group/card">
                <Globe
                  size={28}
                  className="text-red-300 mb-3 group-hover/card:scale-110 transition-transform"
                />
                <p className="text-3xl font-black">{trips.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Trips Recorded
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 text-white min-w-[160px] hover:bg-white/20 transition-all cursor-default group/card">
                <Clock
                  size={28}
                  className="text-red-300 mb-3 group-hover/card:scale-110 transition-transform"
                />
                <p className="text-3xl font-black">
                  {trips.filter((t) => new Date(t.endDate) < new Date()).length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Past Memories
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="flex-1 relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by trip name, destination or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm font-medium"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <div className="relative flex-1 md:w-48">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm font-bold text-gray-700 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Active Journeys</option>
                <option value="upcoming">Future Adventures</option>
                <option value="completed">Past Memories</option>
              </select>
            </div>

            <div className="relative flex-1 md:w-48">
              <Layers
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm font-bold text-gray-700 appearance-none cursor-pointer"
              >
                <option value="startDate">Earliest First</option>
                <option value="startDate-desc">Latest First</option>
                <option value="name">A - Z</option>
                <option value="duration">Short Trips</option>
                <option value="duration-desc">Long Trips</option>
              </select>
            </div>

            <div className="flex bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
              <button
                onClick={() => setViewMode("grouped")}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  viewMode === "grouped"
                    ? "bg-red-600 text-white shadow-lg shadow-red-200"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="Grouped View"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-red-600 text-white shadow-lg shadow-red-200"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                title="List View"
              >
                <List size={20} />
              </button>
            </div>

            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
                setSortBy("startDate");
              }}
              className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
              title="Reset Filters"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">
                Retrieving your journeys...
              </p>
            </div>
          ) : trips.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-12 md:p-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe size={32} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                No trips found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto font-medium mb-10">
                Your travel history is currently empty. Start your journey by
                creating your first trip package.
              </p>
              <button
                onClick={() => navigate("/create-trip")}
                className="bg-red-600 text-white px-8 py-4 rounded-2xl hover:bg-red-700 transition-all font-bold uppercase tracking-widest text-xs shadow-xl shadow-red-100"
              >
                Start Planning Now
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Summary Stats */}
              {viewMode === "grouped" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                        <Zap size={24} />
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        Active
                      </span>
                    </div>
                    <p className="text-4xl font-black text-gray-900 leading-none">
                      {displayTrips.ongoing.length}
                    </p>
                    <p className="text-sm font-bold text-gray-400 mt-1">
                      Active Journeys
                    </p>
                  </div>

                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                        <Calendar size={24} />
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        Future
                      </span>
                    </div>
                    <p className="text-4xl font-black text-gray-900 leading-none">
                      {displayTrips.upcoming.length}
                    </p>
                    <p className="text-sm font-bold text-gray-400 mt-1">
                      Upcoming Escapes
                    </p>
                  </div>

                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gray-50 text-gray-600 rounded-2xl group-hover:bg-gray-900 group-hover:text-white transition-colors duration-500">
                        <Clock size={24} />
                      </div>
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        Past
                      </span>
                    </div>
                    <p className="text-4xl font-black text-gray-900 leading-none">
                      {displayTrips.completed.length}
                    </p>
                    <p className="text-sm font-bold text-gray-400 mt-1">
                      Past Memories
                    </p>
                  </div>
                </div>
              )}

              {/* Trips Display */}
              <div className="space-y-20">
                {viewMode === "grouped" ? (
                  Object.entries(displayTrips).map(
                    ([statusKey, statusTrips]) => {
                      const statusConfig = {
                        ongoing: {
                          title: "Active Journeys",
                          subtitle: "Trips you're currently exploring",
                          color: "bg-green-50 text-green-600",
                          icon: <Zap size={20} />,
                        },
                        upcoming: {
                          title: "Upcoming Escapes",
                          subtitle: "The adventures waiting for you",
                          color: "bg-blue-50 text-blue-600",
                          icon: <Calendar size={20} />,
                        },
                        completed: {
                          title: "Past Memories",
                          subtitle: "Your completed world explorations",
                          color: "bg-gray-100 text-gray-600",
                          icon: <Clock size={20} />,
                        },
                      };

                      if (statusKey === "all") return null;

                      return (
                        <div key={statusKey} className="space-y-8">
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8">
                            <div className="flex items-center gap-5">
                              <div
                                className={`p-4 rounded-[1.25rem] ${statusConfig[statusKey].color} shadow-sm`}
                              >
                                {statusConfig[statusKey].icon}
                              </div>
                              <div>
                                <h3 className="text-3xl font-black text-gray-900">
                                  {statusConfig[statusKey].title}
                                </h3>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                                  {statusConfig[statusKey].subtitle} •{" "}
                                  {statusTrips.length} Destinations
                                </p>
                              </div>
                            </div>
                          </div>

                          {statusTrips.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                            <div className="bg-white/30 rounded-[2.5rem] border border-dashed border-gray-200 py-20 text-center">
                              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus size={24} className="text-gray-300" />
                              </div>
                              <p className="text-gray-400 font-black uppercase tracking-widest text-[11px]">
                                No {statusConfig[statusKey].title.toLowerCase()}{" "}
                                recorded
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            </div>
          )}
        </div>
      </main>

      <Footer />
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

  const statusColors = {
    upcoming: "bg-blue-600 shadow-blue-200",
    ongoing: "bg-green-600 shadow-green-200",
    completed: "bg-gray-600 shadow-gray-200",
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-trip/${trip._id}`);
  };

  return (
    <div
      className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer"
      onClick={() => navigate(`/trip/${trip._id}`)}
    >
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {trip.coverPhoto ? (
          <img
            src={trip.coverPhoto}
            alt={trip.tripName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-200">
            <Camera size={48} />
          </div>
        )}

        <div className="absolute top-6 right-6 flex flex-col gap-2">
          <div
            className={`px-4 py-2 ${
              statusColors[status.key]
            } text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg text-center`}
          >
            {status.label}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-gray-700 shadow-lg hover:bg-gray-900 hover:text-white transition-all duration-300 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              title="Edit Journey"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(trip._id);
              }}
              className="p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-75"
              title="Delete Journey"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6">
          <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
            <Clock size={14} className="text-red-400" />
            {duration} {duration === 1 ? "Day" : "Days"} Adventure
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors mb-4 line-clamp-1">
          {trip.tripName}
        </h3>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Calendar size={16} className="text-red-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              {new Date(trip.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -
              {new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <div className="p-2 bg-gray-50 rounded-lg">
              <MapPin size={16} className="text-red-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              {trip.destinations?.length || 0}{" "}
              {trip.destinations?.length === 1 ? "Stop" : "Stops"} in Itinerary
            </span>
          </div>
        </div>

        <button className="mt-auto w-full py-4 bg-gray-900 group-hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-gray-200 group-hover:shadow-red-200">
          View Full Journey
          <ChevronRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}

export default MyTripsPage;
