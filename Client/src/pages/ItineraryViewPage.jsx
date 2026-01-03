import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 font-semibold">Loading itinerary...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 font-semibold">Trip not found</div>
      </div>
    );
  }

  const days = generateDayWiseItinerary();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-red-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/trip/${tripId}`)}
                className="text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                  Itinerary View
                </h1>
                <p className="text-sm text-gray-600 mt-1">{trip.tripName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Profile
              </button>
              <button
                onClick={handleBackToDashboard}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold uppercase tracking-wide"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities..."
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 font-semibold uppercase tracking-wide">
                Group by:
              </span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium bg-white"
              >
                <option value="day">Day</option>
                <option value="city">City</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 font-semibold uppercase tracking-wide">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium bg-white"
              >
                <option value="date">Date</option>
                <option value="cost">Cost</option>
              </select>
            </div>

            <button
              onClick={() =>
                setViewMode(viewMode === "list" ? "calendar" : "list")
              }
              className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold uppercase tracking-wide shadow-md hover:shadow-lg"
            >
              {viewMode === "list" ? "Calendar" : "List"} View
            </button>
          </div>
        </div>

        {/* Itinerary Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
            {trip.tripName}
          </h2>
          <p className="text-gray-700 font-medium">
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

        {/* Day-wise Itinerary */}
        {days.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-12 text-center">
            <div className="text-gray-500">
              <p className="text-lg font-semibold mb-2">
                No Itinerary Available
              </p>
              <p className="text-sm">
                Add destinations with dates and activities to view your day-wise
                itinerary.
              </p>
            </div>
          </div>
        ) : viewMode === "calendar" ? (
          /* Calendar View */
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gray-100 px-6 py-4 border-b-2 border-gray-300">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  <span className="text-2xl font-bold text-gray-700">←</span>
                </button>
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition"
                >
                  <span className="text-2xl font-bold text-gray-700">→</span>
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b-2 border-gray-300">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="text-center py-3 font-bold text-gray-700 text-sm uppercase tracking-wide border-r border-gray-300 last:border-r-0"
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
                  className={`min-h-32 border-r border-b border-gray-300 last:border-r-0 p-2 ${
                    day ? "bg-white hover:bg-gray-50" : "bg-gray-100"
                  }`}
                >
                  {day && (
                    <>
                      <div className="text-right mb-1">
                        <span className="text-lg font-semibold text-gray-700">
                          {day.date}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold truncate hover:bg-red-600 cursor-pointer transition"
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
          <div className="space-y-8">
            {days.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border-2 border-red-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-red-300"
              >
                {/* Day Header */}
                <div className="bg-red-600 text-white px-6 py-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-wide opacity-90">
                        Day {day.dayNumber}
                      </div>
                      <div className="text-2xl font-bold mt-1">
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
                      <div className="text-sm font-semibold uppercase tracking-wide opacity-90">
                        Daily
                      </div>
                      <div className="text-xl font-bold mt-1">Budget</div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div className="p-6 space-y-3">
                  {day.activities && day.activities.length > 0 ? (
                    day.activities.map((activity, actIndex) => (
                      <div
                        key={actIndex}
                        className="bg-white rounded-lg px-5 py-4 border-2 border-red-200 hover:border-red-300 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                {activity.destinationName}
                              </span>
                            </div>
                            <div className="text-base font-semibold text-gray-900">
                              {activity.name}
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              {activity.time && (
                                <div className="text-sm text-gray-700 font-medium bg-red-50 px-3 py-1 rounded-md border border-red-200">
                                  <span className="uppercase tracking-wide text-xs font-semibold">
                                    Time:
                                  </span>{" "}
                                  {activity.time}
                                </div>
                              )}
                              <div className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-200">
                                <span className="uppercase tracking-wide text-xs font-semibold">
                                  Budget:
                                </span>{" "}
                                ${activity.budget || "0"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="font-medium">
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
    </div>
  );
}

export default ItineraryViewPage;
