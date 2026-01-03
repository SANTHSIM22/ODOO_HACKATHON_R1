import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recentTrips, setRecentTrips] = useState([]);
    const [recommendedDestinations, setRecommendedDestinations] = useState([]);

    useEffect(() => {

        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        setRecentTrips([
            {
                id: 1,
                destination: "Paris, France",
                startDate: "2026-02-15",
                endDate: "2026-02-22",
                budget: 2500,
                status: "upcoming",
                image: "🗼"
            },
            {
                id: 2,
                destination: "Tokyo, Japan",
                startDate: "2026-03-10",
                endDate: "2026-03-20",
                budget: 3200,
                status: "upcoming",
                image: "🗾"
            },
            {
                id: 3,
                destination: "New York, USA",
                startDate: "2025-12-05",
                endDate: "2025-12-12",
                budget: 1800,
                status: "completed",
                image: "🗽"
            }
        ]);

        setRecommendedDestinations([
            {
                id: 1,
                name: "Bali, Indonesia",
                description: "Tropical paradise with stunning beaches",
                estimatedBudget: 1500,
                image: "🏝️"
            },
            {
                id: 2,
                name: "Rome, Italy",
                description: "Ancient history meets modern culture",
                estimatedBudget: 2000,
                image: "🏛️"
            },
            {
                id: 3,
                name: "Dubai, UAE",
                description: "Luxury and innovation in the desert",
                estimatedBudget: 2800,
                image: "🏙️"
            },
            {
                id: 4,
                name: "Barcelona, Spain",
                description: "Art, architecture, and Mediterranean vibes",
                estimatedBudget: 1800,
                image: "🏖️"
            }
        ]);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handlePlanNewTrip = () => {

        alert("Trip planning feature coming soon!");
    };

    const calculateTotalBudget = () => {
        return recentTrips
            .filter(trip => trip.status === "upcoming")
            .reduce((sum, trip) => sum + trip.budget, 0);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    const upcomingTrips = recentTrips.filter(trip => trip.status === "upcoming");
    const totalBudget = calculateTotalBudget();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">🌍</span>
                            <h1 className="text-2xl font-bold text-indigo-600">GlobeTrotter</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 font-medium hidden sm:inline">
                                {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 font-semibold text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome back, {user.name}! 👋
                    </h2>
                    <p className="text-lg text-gray-600">
                        Ready to plan your next adventure?
                    </p>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Total Budget</h3>
                            <span className="text-3xl">💰</span>
                        </div>
                        <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
                        <p className="text-sm opacity-90 mt-1">For upcoming trips</p>
                    </div>

            
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Upcoming Trips</h3>
                            <span className="text-3xl">✈️</span>
                        </div>
                        <p className="text-3xl font-bold">{upcomingTrips.length}</p>
                        <p className="text-sm opacity-90 mt-1">Adventures awaiting</p>
                    </div>


                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition duration-300 cursor-pointer"
                        onClick={handlePlanNewTrip}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">Plan New Trip</h3>
                            <span className="text-3xl">➕</span>
                        </div>
                        <p className="text-sm opacity-90 mt-1">Start planning your next adventure</p>
                        <div className="mt-4 bg-white bg-opacity-20 rounded-lg py-2 px-4 text-center font-semibold hover:bg-opacity-30 transition">
                            Get Started →
                        </div>
                    </div>
                </div>
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">Your Trips</h3>
                        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                            View All →
                        </button>
                    </div>

                    {recentTrips.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg mb-4">No trips yet!</p>
                            <button
                                onClick={handlePlanNewTrip}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold"
                            >
                                Plan Your First Trip
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentTrips.map((trip) => (
                                <div
                                    key={trip.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer"
                                >
                                    <div className={`h-2 ${trip.status === 'upcoming' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="text-3xl">{trip.image}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${trip.status === 'upcoming'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {trip.status}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
                                                    {trip.destination}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center space-x-2">
                                                <span>📅</span>
                                                <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span>💵</span>
                                                <span className="font-semibold text-gray-800">${trip.budget.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button className="mt-4 w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition font-semibold text-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

        
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">Recommended Destinations</h3>
                        <button className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                            Explore More →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedDestinations.map((destination) => (
                            <div
                                key={destination.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                            >
                                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 h-32 flex items-center justify-center text-6xl">
                                    {destination.image}
                                </div>
                                <div className="p-5">
                                    <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                                        {destination.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {destination.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm">
                                            <span className="text-gray-500">From</span>
                                            <span className="font-bold text-gray-800 ml-1">
                                                ${destination.estimatedBudget.toLocaleString()}
                                            </span>
                                        </div>
                                        <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition text-sm font-semibold">
                                            Explore
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>


            <footer className="bg-white mt-12 border-t border-gray-200">
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
