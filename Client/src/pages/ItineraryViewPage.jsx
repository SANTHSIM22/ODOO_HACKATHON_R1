import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Calendar as CalendarIcon,
  List,
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Users,
} from "lucide-react";
import Footer from "../components/layout/Footer";

const API_URL = "http://localhost:5000/api";

function ItineraryViewPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  const [groupBy, setGroupBy] = useState("day"); // day or city
  const [sortBy, setSortBy] = useState("date"); // date or cost
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      // Find activities for this date
      const activitiesForDate = [];

      if (trip && trip.destinations) {
        trip.destinations.forEach((destination) => {
          if (destination.activities) {
            destination.activities.forEach((activity) => {
              if (activity.day) {
                const tripStartDate = new Date(trip.startDate);
                const activityDate = new Date(tripStartDate);
                activityDate.setDate(
                  tripStartDate.getDate() + (activity.day - 1)
                );

                if (
                  activityDate.getFullYear() === date.getFullYear() &&
                  activityDate.getMonth() === date.getMonth() &&
                  activityDate.getDate() === date.getDate()
                ) {
                  activitiesForDate.push({
                    ...activity,
                    destinationName: destination.name,
                  });
                }
              }
            });
          }
        });
      }

      days.push({
        date: day,
        fullDate: date,
        activities: activitiesForDate,
      });
    }

    return days;
  };

  const changeMonth = (direction) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1
      )
    );
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(userData));
    fetchTripDetails();
  }, [tripId, navigate]);

  const fetchTripDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/user-trips/trip/${tripId}`);
      const data = await response.json();
      if (data.success) {
        setTrip(data.trip);
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateDayWiseItinerary = () => {
    if (!trip || !trip.destinations || trip.destinations.length === 0)
      return [];

    // Collect all unique day numbers from activities
    const dayMap = new Map();

    trip.destinations.forEach((destination) => {
      if (destination.activities && destination.activities.length > 0) {
        destination.activities.forEach((activity) => {
          if (typeof activity === "object" && activity.day) {
            const dayNumber = parseInt(activity.day);

            if (!dayMap.has(dayNumber)) {
              dayMap.set(dayNumber, {
                dayNumber: dayNumber,
                activities: [],
              });
            }

            dayMap.get(dayNumber).activities.push({
              ...activity,
              destinationName: destination.name,
              destinationBudget: destination.budget,
            });
          }
        });
      }
    });

    // Convert map to sorted array
    const itinerary = Array.from(dayMap.values()).sort(
      (a, b) => a.dayNumber - b.dayNumber
    );

    return itinerary;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-black text-xl mb-2 uppercase tracking-wider">
            Trip not found
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const days = generateDayWiseItinerary();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header - Dashboard Style */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/trip/${tripId}`)}
                className="flex items-center gap-2 text-gray-700 hover:text-red-700 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back</span>
              </button>
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

              {user && (
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
                          onClick={() => {
                            localStorage.removeItem("user");
                            navigate("/login");
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-50"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Controls */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative group">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities..."
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium text-sm"
              >
                <option value="day">Group by Day</option>
                <option value="city">Group by City</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="cost">Sort by Cost</option>
              </select>

              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "calendar" : "list")
                }
                className="px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center gap-2"
              >
                {viewMode === "list" ? (
                  <>
                    <CalendarIcon size={16} />
                    <span>Calendar</span>
                  </>
                ) : (
                  <>
                    <List size={16} />
                    <span>List</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Itinerary Title */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-[2.5rem] p-8 md:p-12 mb-12 text-center shadow-2xl shadow-red-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              {trip.tripName}
            </h2>
            <p className="text-lg text-red-50 font-semibold">
              {new Date(trip.startDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Day-wise Itinerary */}
        {days.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-16 text-center">
            <div className="text-gray-500">
              <p className="text-xl font-black mb-2 uppercase tracking-wider text-gray-900">
                No Itinerary Available
              </p>
              <p className="text-sm font-medium">
                Add destinations with dates and activities to view your day-wise
                itinerary.
              </p>
            </div>
          </div>
        ) : viewMode === "calendar" ? (
          /* Calendar View */
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-white/20 rounded-lg transition flex items-center justify-center"
                >
                  <ChevronLeft className="text-white" size={28} />
                </button>
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-white/20 rounded-lg transition flex items-center justify-center"
                >
                  <ChevronRight className="text-white" size={28} />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 bg-gray-50">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="text-center py-3 font-black text-gray-900 text-xs uppercase tracking-widest border-r border-gray-200 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`min-h-32 border-r border-b border-gray-100 last:border-r-0 p-2 ${
                    day ? "bg-white hover:bg-gray-50" : "bg-gray-50"
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-right mb-1">
                        <span className="text-lg font-black text-gray-900">
                          {day.date}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-2 py-1 rounded-lg font-bold truncate hover:from-red-700 hover:to-red-800 cursor-pointer transition shadow-sm"
                            title={`${activity.destinationName} - ${activity.name} at ${activity.time}`}
                          >
                            {activity.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {days.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-red-200/50 transition-all duration-500"
              >
                {/* Day Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest opacity-90">
                        Day {day.dayNumber}
                      </div>
                      <div className="text-2xl font-black mt-2">
                        {trip.startDate &&
                          new Date(
                            new Date(trip.startDate).getTime() +
                              (day.dayNumber - 1) * 24 * 60 * 60 * 1000
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black uppercase tracking-widest opacity-90">
                        Daily
                      </div>
                      <div className="text-xl font-black mt-2">Budget</div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div className="p-8 space-y-4">
                  {day.activities && day.activities.length > 0 ? (
                    day.activities.map((activity, actIndex) => (
                      <div
                        key={actIndex}
                        className="bg-gray-50 rounded-2xl px-6 py-5 border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin size={14} className="text-red-600" />
                              <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
                                {activity.destinationName}
                              </span>
                            </div>
                            <div className="text-lg font-black text-gray-900 mb-3">
                              {activity.name}
                            </div>
                            <div className="flex items-center gap-3">
                              {activity.time && (
                                <div className="text-sm text-gray-700 font-bold bg-white px-4 py-2 rounded-xl border border-gray-200 flex items-center gap-2">
                                  <Clock size={14} className="text-red-600" />
                                  {activity.time}
                                </div>
                              )}
                              <div className="text-sm font-black text-red-700 bg-red-50 px-4 py-2 rounded-xl border border-red-200 flex items-center gap-2">
                                <DollarSign
                                  size={14}
                                  className="text-red-600"
                                />
                                ${activity.budget || "0"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
                      <p className="font-bold text-sm uppercase tracking-wider">
                        No activities planned for this day
                      </p>
                    </div>
                  )}
                </div>

                {/* Day Total */}
                <div className="bg-red-50 px-6 py-4 border-t-2 border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 uppercase tracking-wide">
                      Day {day.dayNumber} Total
                    </span>
                    <span className="font-bold text-red-600 text-lg">
                      $
                      {day.activities
                        .reduce((sum, activity) => {
                          const budget =
                            parseFloat(
                              activity.budget?.replace?.(/[^0-9.-]+/g, "") ||
                                "0"
                            ) || 0;
                          return sum + budget;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trip Summary */}
        {days.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-8 border-2 border-red-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Trip Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                <div className="text-sm text-gray-700 mb-2 font-semibold uppercase tracking-wide">
                  Total Days
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {days.length}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                <div className="text-sm text-gray-700 mb-2 font-semibold uppercase tracking-wide">
                  Destinations
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {trip.destinations?.length || 0}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                <div className="text-sm text-gray-700 mb-2 font-semibold uppercase tracking-wide">
                  Total Budget
                </div>
                <div className="text-3xl font-bold text-red-600">
                  $
                  {trip.destinations
                    ?.reduce((sum, dest) => {
                      const budget = dest.budget
                        ? parseFloat(dest.budget.replace(/[^0-9.-]+/g, "")) || 0
                        : 0;
                      return sum + budget;
                    }, 0)
                    .toFixed(2) || "0.00"}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ItineraryViewPage;
