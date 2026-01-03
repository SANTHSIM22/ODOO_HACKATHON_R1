import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function MyTripsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

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
                method: "DELETE"
            });

            const data = await response.json();

            if (data.success) {
                alert("Trip deleted successfully!");
                setTrips(trips.filter(trip => trip._id !== tripId));
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

        if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
        if (now > end) return { label: "Completed", color: "bg-slate-100 text-slate-800" };
        return { label: "Ongoing", color: "bg-green-100 text-green-800" };
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="text-slate-600 hover:text-slate-800"
                            >
                                ← Back
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">My Trips</h1>
                                <p className="text-xs text-slate-500">Manage your travel plans</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/create-trip")}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm shadow-lg shadow-indigo-500/30"
                        >
                            + New Trip
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-pulse text-slate-600">Loading your trips...</div>
                    </div>
                ) : trips.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">✈️</span>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No trips yet!</h3>
                        <p className="text-slate-600 mb-6">Start planning your first adventure</p>
                        <button
                            onClick={() => navigate("/create-trip")}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg shadow-indigo-500/30"
                        >
                            Create Your First Trip
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => {
                            const status = getTripStatus(trip.startDate, trip.endDate);
                            const duration = calculateDuration(trip.startDate, trip.endDate);

                            return (
                                <div
                                    key={trip._id}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group"
                                >
                                    {trip.coverPhoto ? (
                                        <div className="h-48 overflow-hidden bg-slate-100">
                                            <img
                                                src={trip.coverPhoto}
                                                alt={trip.tripName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-6xl">🗺️</div>';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                            <span className="text-6xl">🗺️</span>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition flex-1">
                                                {trip.tripName}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                            {trip.description}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <span className="mr-2">📅</span>
                                                <span>
                                                    {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600">
                                                <span className="mr-2">⏱️</span>
                                                <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-slate-600">
                                                <span className="mr-2">📍</span>
                                                <span>{trip.destinations?.length || 0} destination{trip.destinations?.length !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => navigate(`/trip/${trip._id}`)}
                                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(trip._id)}
                                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyTripsPage;
