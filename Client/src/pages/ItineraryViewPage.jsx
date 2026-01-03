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

    // Get all destinations with dates
    const destinationsWithDates = trip.destinations.filter(
      (dest) => dest.startDate && dest.endDate
    );

    if (destinationsWithDates.length === 0) {
      // If no destinations have dates, create a basic structure
      return [
        {
          date: new Date(trip.startDate),
          dayNumber: 1,
          destinations: trip.destinations,
        },
      ];
    }

    // Sort destinations by start date
    destinationsWithDates.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    // Group destinations by overlapping or sequential dates
    const itinerary = [];

    destinationsWithDates.forEach((destination) => {
      const startDate = new Date(destination.startDate);
      const endDate = new Date(destination.endDate);

      // Create days for this destination
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toDateString();
        let dayItem = itinerary.find(
          (item) => item.date.toDateString() === dateStr
        );

        if (!dayItem) {
          dayItem = {
            date: new Date(d),
            dayNumber: itinerary.length + 1,
            destinations: [],
          };
          itinerary.push(dayItem);
        }

        if (!dayItem.destinations.find((d) => d._id === destination._id)) {
          dayItem.destinations.push(destination);
        }
      }
    });

    return itinerary;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading itinerary...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Trip not found</div>
      </div>
    );
  }

  const days = generateDayWiseItinerary();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/trip/${tripId}`)}
                className="text-slate-600 hover:text-slate-800"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Itinerary View
                </h1>
                <p className="text-xs text-slate-500">{trip.tripName}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Group by:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="day">Day</option>
                <option value="city">City</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="date">Date</option>
                <option value="cost">Cost</option>
              </select>
            </div>

            <button
              onClick={() =>
                setViewMode(viewMode === "list" ? "calendar" : "list")
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
            >
              {viewMode === "list" ? "📅" : "📋"} Filter
            </button>
          </div>
        </div>

        {/* Itinerary Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Itinerary for {trip.tripName}
          </h2>
          <p className="text-slate-600">
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
        <div className="space-y-8">
          {days.map((day, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm opacity-90">
                      Day {day.dayNumber}
                    </div>
                    <div className="text-xl font-bold">
                      {day.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Physical Activity</div>
                    <div className="text-lg font-semibold">Expense</div>
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="p-6 space-y-4">
                {day.destinations && day.destinations.length > 0 ? (
                  day.destinations.map((destination, destIndex) => (
                    <div key={destIndex} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          <h3 className="font-semibold text-slate-800">
                            {destination.name}
                          </h3>
                        </div>
                        <div className="text-sm text-slate-600">
                          Budget: ${destination.budget || "0"}
                        </div>
                      </div>

                      {destination.activities &&
                      destination.activities.length > 0 ? (
                        <div className="ml-4 space-y-2">
                          {destination.activities.map((activity, actIndex) => (
                            <div
                              key={actIndex}
                              className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-200"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-slate-800">
                                    {typeof activity === "string"
                                      ? activity
                                      : activity.name}
                                  </div>
                                  {typeof activity === "object" &&
                                    activity.time && (
                                      <div className="text-xs text-slate-500 mt-1">
                                        🕐 {activity.time}
                                      </div>
                                    )}
                                </div>
                                <div className="text-sm font-semibold text-indigo-600 ml-4">
                                  $
                                  {typeof activity === "object"
                                    ? activity.budget || "0"
                                    : "0"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-4">
                          <div className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                            <div className="text-sm text-slate-500 italic">
                              No activities planned
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No destinations planned for this day</p>
                  </div>
                )}
              </div>

              {/* Day Total */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">
                    Day {day.dayNumber} Total
                  </span>
                  <span className="font-bold text-slate-800">
                    $
                    {day.destinations
                      .reduce((sum, dest) => {
                        const budget = dest.budget
                          ? parseFloat(dest.budget.replace(/[^0-9.-]+/g, "")) ||
                            0
                          : 0;
                        return sum + budget;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trip Summary */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Trip Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Total Days</div>
              <div className="text-2xl font-bold text-indigo-600">
                {days.length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Destinations</div>
              <div className="text-2xl font-bold text-indigo-600">
                {trip.destinations?.length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Total Budget</div>
              <div className="text-2xl font-bold text-indigo-600">
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
      </main>
    </div>
  );
}

export default ItineraryViewPage;
