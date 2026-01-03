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
            const tripsArray = Array.isArray(data)
                ? data
                : data.success
                    ? data.trips
                    : [];
            const formattedTrips = tripsArray.map((trip) => ({
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
                specialOffer: trip.specialOffer,
                recommendedByTravelers: trip.recommendedByTravelers,
            }));
            setAvailableTrips(formattedTrips);
        } catch (error) {
            console.error("Error fetching trips:", error);
            setAvailableTrips([]);
        }
    };

    const fetchRecommendedTrips = async () => {
        try {
            const response = await fetch(`${API_URL}/trips/recommended`);
            const data = await response.json();
            const tripsArray = Array.isArray(data)
                ? data
                : data.success
                    ? data.trips
                    : [];
            const formattedDestinations = tripsArray.map((trip) => ({
                id: trip._id,
                name: trip.destination,
                description: trip.description,
                estimatedBudget: trip.budget,
                image: trip.image,
                imageUrl: trip.imageUrl,
            }));
            setRecommendedDestinations(formattedDestinations);
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

    const regionalSelections = [
        { id: 1, name: "Europe", color: "from-blue-500 to-blue-600" },
        { id: 2, name: "Asia", color: "from-emerald-500 to-emerald-600" },
        { id: 3, name: "Americas", color: "from-violet-500 to-violet-600" },
        { id: 4, name: "Africa", color: "from-amber-500 to-amber-600" },
        { id: 5, name: "Oceania", color: "from-cyan-500 to-cyan-600" },
    ];

    const previousTrips = [
        { id: 1, destination: "Paris, France", date: "Dec 2025" },
        { id: 2, destination: "Tokyo, Japan", date: "Nov 2025" },
        { id: 3, destination: "New York, USA", date: "Oct 2025" },
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse text-xl text-gray-600">
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    const availableTripsCount = calculateTotalTrips();
    const averageBudget = calculateAverageBudget();

    // Filter trips based on search query
    const filteredAvailableTrips = availableTrips.filter((trip) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            trip.destination?.toLowerCase().includes(query) ||
            trip.description?.toLowerCase().includes(query) ||
            trip.category?.toLowerCase().includes(query)
        );
    });

    const filteredRecommendedDestinations = recommendedDestinations.filter(
        (destination) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                destination.name?.toLowerCase().includes(query) ||
                destination.description?.toLowerCase().includes(query)
            );
        }
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            <h1 className="text-2xl font-bold text-black">GlobeTrotter</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => navigate("/my-trips")}
                                className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition duration-200"
                            >
                                My Trips
                            </button>
                            <button
                                onClick={() => navigate("/community-tab")}
                                className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition duration-200"
                            >
                                Community
                            </button>
                            <button
                                onClick={() => navigate("/dashboard/profile")}
                                className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition duration-200"
                            >
                                Profile
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold hover:bg-red-700 transition duration-200 overflow-hidden"
                                >
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.parentElement.innerHTML = `<span class="text-white font-semibold">${user.name
                                                    .charAt(0)
                                                    .toUpperCase()}</span>`;
                                            }}
                                        />
                                    ) : (
                                        user.name.charAt(0).toUpperCase()
                                    )}
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsDropdownOpen(false)}
                                        ></div>

                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
                                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition duration-200 border-t border-gray-200"
                                            >
                                                <span className="font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-black">
                        Welcome back, {user.name}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Explore amazing travel packages and book your next adventure
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Available Packages
                                </p>
                                <p className="text-4xl font-bold text-black mt-2">
                                    {availableTripsCount}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                    Travel packages to explore
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                <span className="text-red-600 font-semibold">✦</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Average Price
                                </p>
                                <p className="text-4xl font-bold text-black mt-2">
                                    ${averageBudget.toLocaleString()}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">Per package</p>
                            </div>
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                <span className="text-red-600 font-semibold">$</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Special Offers
                                </p>
                                <p className="text-4xl font-bold text-black mt-2">
                                    {recommendedDestinations.length}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                    Recommended destinations
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                <span className="text-red-600 font-semibold">★</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Section */}
                <div className="mb-8 rounded-2xl shadow-md overflow-hidden bg-gradient-to-r from-red-600 to-red-700 border border-red-700">
                    <div className="px-8 py-12 md:py-16 text-center">
                        <h2 className="text-4xl font-bold text-white mb-3">
                            Discover Your Next Adventure
                        </h2>
                        <p className="text-red-100 text-lg">
                            Explore the world with GlobeTrotter
                        </p>
                    </div>
                </div>

                {/* Search Bar with Filters */}
                <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Search for destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
                                Group by
                            </button>
                            <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
                                Filter
                            </button>
                            <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
                                Sort by
                            </button>
                        </div>
                    </div>
                </div>

                {/* Available Travel Packages */}
                <div className="mb-12">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-black">
                            Available Travel Packages
                        </h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Browse and book amazing destinations
                            {searchQuery && (
                                <span className="text-red-600 font-semibold">
                                    {" "}
                                    - {filteredAvailableTrips.length} result
                                    {filteredAvailableTrips.length !== 1 ? "s" : ""} for "
                                    {searchQuery}"
                                </span>
                            )}
                        </p>
                    </div>

                    {filteredAvailableTrips.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl font-bold text-gray-400">→</span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">
                                {searchQuery
                                    ? `No packages found for "${searchQuery}"`
                                    : "No packages available yet"}
                            </h4>
                            <p className="text-gray-600">
                                {searchQuery
                                    ? "Try a different search term"
                                    : "Check back soon for exciting travel packages"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAvailableTrips.map((trip) => (
                                <div
                                    key={trip.id}
                                    className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-300 transition-all duration-300 group cursor-pointer"
                                >
                                    {trip.imageUrl ? (
                                        <div className="relative h-56 overflow-hidden bg-gray-100">
                                            <img
                                                src={trip.imageUrl}
                                                alt={trip.destination}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 font-semibold">Image</div>`;
                                                }}
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${trip.status === "available"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-200 text-gray-700"
                                                        }`}
                                                >
                                                    {trip.status === "available" ? "Available" : "Past"}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                            <span className="text-gray-400 font-semibold">Image</span>
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${trip.status === "available"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-200 text-gray-700"
                                                        }`}
                                                >
                                                    {trip.status === "available" ? "Available" : "Past"}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h4 className="text-xl font-bold text-black mb-2 group-hover:text-red-600 transition">
                                            {trip.destination}
                                        </h4>
                                        {trip.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {trip.description}
                                            </p>
                                        )}

                                        {/* Special Badges */}
                                        {(trip.specialOffer > 0 || trip.recommendedByTravelers) && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {trip.specialOffer > 0 && (
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                                        Special Offer: $
                                                        {trip.specialOffer.toLocaleString()}
                                                    </span>
                                                )}
                                                {trip.recommendedByTravelers && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                                        Recommended by Travelers
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <img
                                                    src="/assets/images/location.png"
                                                    alt="Location"
                                                    className="w-4 h-4 mr-2 inline-block"
                                                />
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
                                                    <span className="font-bold text-black text-lg">
                                                        ${trip.budget.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        per person
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleBookTrip(trip.id)}
                                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold text-sm shadow-sm"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recommended Destinations */}
                <div className="mb-12">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-black">
                            Recommended Destinations
                        </h3>
                        <p className="text-gray-600 text-sm mt-2">
                            Handpicked by our travel experts
                            {searchQuery && filteredRecommendedDestinations.length > 0 && (
                                <span className="text-red-600 font-semibold">
                                    {" "}
                                    - {filteredRecommendedDestinations.length} result
                                    {filteredRecommendedDestinations.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </p>
                    </div>

                    {filteredRecommendedDestinations.length === 0 && searchQuery ? (
                        <div className="bg-white rounded-2xl shadow-md border border-dashed border-gray-300 p-8 text-center">
                            <p className="text-gray-500">
                                No recommended destinations match your search
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredRecommendedDestinations.map((destination) => (
                                <div
                                    key={destination.id}
                                    className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-300 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                                >
                                    {destination.imageUrl ? (
                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            <img
                                                src={destination.imageUrl}
                                                alt={destination.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                    e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 font-semibold">Image</div>`;
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                            <span className="text-gray-400 font-semibold">Image</span>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <h4 className="text-lg font-bold text-black mb-2 group-hover:text-red-600 transition">
                                            {destination.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {destination.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">Starting from</p>
                                                <p className="text-lg font-bold text-black">
                                                    ${destination.estimatedBudget.toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleBookTrip(destination.id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold shadow-sm"
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Regional Selections */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-black mb-6">
                        Top Regional Selections
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {regionalSelections.map((region) => (
                            <div
                                key={region.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-red-300"
                            >
                                <div
                                    className={`aspect-square bg-gradient-to-br ${region.color} flex items-center justify-center`}
                                >
                                    <span className="text-white font-semibold text-sm">
                                        {region.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="p-4 text-center">
                                    <h4 className="font-semibold text-gray-800 text-sm">
                                        {region.name}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Previous Trips */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-black mb-6">Previous Trips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {previousTrips.map((trip) => (
                            <div
                                key={trip.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border border-gray-200 hover:border-red-300"
                            >
                                <div className="h-40 bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
                                    <span className="text-gray-400 font-semibold">Image</span>
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
            </main>

            {/* Footer */}
            <footer className="bg-white mt-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-gray-600 text-sm">
                        © 2026 GlobeTrotter. Your journey begins here.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default DashboardPage;
