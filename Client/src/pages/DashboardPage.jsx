import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handlePlanNewTrip = () => {
        alert("Trip planning feature coming soon!");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FFE6D4] to-[#FFC69D] flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    // Top Regional Selections data
    const regionalSelections = [
        { id: 1, name: "Europe", image: "🇪🇺" },
        { id: 2, name: "Asia", image: "🌏" },
        { id: 3, name: "Americas", image: "🌎" },
        { id: 4, name: "Africa", image: "🌍" },
        { id: 5, name: "Oceania", image: "🏝️" }
    ];

    // Previous Trips data
    const previousTrips = [
        {
            id: 1,
            destination: "Paris, France",
            date: "Dec 2025",
            image: "🗼"
        },
        {
            id: 2,
            destination: "Tokyo, Japan",
            date: "Nov 2025",
            image: "🗾"
        },
        {
            id: 3,
            destination: "New York, USA",
            date: "Oct 2025",
            image: "🗽"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFE6D4] to-[#FFC69D]">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-[#E06B80]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">🌍</span>
                            <h1 className="text-2xl font-bold text-[#CD2C58]">GlobeTrotter</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-[#E06B80] flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Banner Section */}
                <div className="mb-6 bg-gradient-to-r from-[#CD2C58] to-[#E06B80] rounded-2xl shadow-lg overflow-hidden h-48 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="relative z-10 text-center text-white">
                        <h2 className="text-4xl font-bold mb-2">Discover Your Next Adventure</h2>
                        <p className="text-lg opacity-90">Explore the world with GlobeTrotter</p>
                    </div>
                </div>

                {/* Search Bar with Filters */}
                <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <div className="flex-1 w-full">
                            <input
                                type="text"
                                placeholder="Search for..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CD2C58] transition"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border-2 border-[#E06B80] text-[#CD2C58] rounded-lg hover:bg-[#FFE6D4] transition font-semibold text-sm">
                                Group by
                            </button>
                            <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border-2 border-[#E06B80] text-[#CD2C58] rounded-lg hover:bg-[#FFE6D4] transition font-semibold text-sm">
                                Filter
                            </button>
                            <button className="flex-1 md:flex-none px-4 py-2.5 bg-white border-2 border-[#E06B80] text-[#CD2C58] rounded-lg hover:bg-[#FFE6D4] transition font-semibold text-sm">
                                Sort by...
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Regional Selections */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#CD2C58] mb-4">Top Regional Selections</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {regionalSelections.map((region) => (
                            <div
                                key={region.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-[#E06B80]"
                            >
                                <div className="aspect-square bg-gradient-to-br from-[#FFC69D] to-[#FFE6D4] flex items-center justify-center text-6xl">
                                    {region.image}
                                </div>
                                <div className="p-4 text-center">
                                    <h4 className="font-bold text-gray-800">{region.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Previous Trips */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-[#CD2C58]">Previous Trips</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {previousTrips.map((trip) => (
                            <div
                                key={trip.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-[#E06B80]"
                            >
                                <div className="h-40 bg-gradient-to-br from-[#CD2C58] to-[#E06B80] flex items-center justify-center text-7xl">
                                    {trip.image}
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

                {/* Plan a Trip Button */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={handlePlanNewTrip}
                        className="bg-[#CD2C58] text-white px-6 py-3 rounded-full hover:bg-[#E06B80] transition duration-300 font-semibold shadow-lg flex items-center space-x-2 transform hover:scale-105"
                    >
                        <span className="text-xl">➕</span>
                        <span>Plan a trip</span>
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white mt-12 border-t-2 border-[#E06B80]">
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
