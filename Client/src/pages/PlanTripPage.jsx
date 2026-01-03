import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PlanTripPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        tripName: "",
        startDate: "",
        place: "",
        endDate: ""
    });

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            navigate("/login");
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle trip creation logic here
        console.log("Trip data:", formData);
        alert("Trip created successfully!");
        navigate("/dashboard");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FFE6D4] to-[#FFC69D] flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    // Suggestion cards data - image placeholders
    const suggestions = [
        { id: 1, title: "Suggestion 1", image: "" },
        { id: 2, title: "Suggestion 2", image: "" },
        { id: 3, title: "Suggestion 3", image: "" },
        { id: 4, title: "Suggestion 4", image: "" },
        { id: 5, title: "Suggestion 5", image: "" },
        { id: 6, title: "Suggestion 6", image: "" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFE6D4] to-[#FFC69D]">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-[#E06B80]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-[#CD2C58]">GlobeTrotter</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="px-4 py-2 bg-gradient-to-r from-[#CD2C58] to-[#E06B80] text-white rounded-lg hover:from-[#E06B80] hover:to-[#CD2C58] transition duration-300 font-semibold shadow-md flex items-center space-x-2"
                            >

                                <span>Back to Dashboard</span>
                            </button>
                            <div className="relative">
                                <div
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-[#E06B80] flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-[#CD2C58] transition duration-200"
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <>
                                        {/* Backdrop to close dropdown when clicking outside */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsDropdownOpen(false)}
                                        ></div>

                                        {/* Dropdown Content */}
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border-2 border-[#E06B80] z-20 overflow-hidden">
                                            {/* User Info Section */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-[#FFE6D4] to-[#FFC69D] border-b border-[#E06B80]">
                                                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                                            </div>

                                            {/* Logout Button */}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-[#FFE6D4] transition duration-200"
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
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Plan a new Trip Section */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#E06B80] mb-8">
                    {/* Header Band */}
                    <div className="bg-gradient-to-r from-[#CD2C58] to-[#E06B80] py-4 px-8">
                        <h2 className="text-3xl font-bold text-white text-center">Plan a new Trip</h2>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Trip Name */}
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 w-40 flex-shrink-0">
                                    Plan a new trip
                                </label>
                                <input
                                    type="text"
                                    name="tripName"
                                    value={formData.tripName}
                                    onChange={handleInputChange}
                                    placeholder="Enter trip name"
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CD2C58] transition"
                                    required
                                />
                            </div>

                            {/* Place */}
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 w-40 flex-shrink-0">
                                    Select a Place
                                </label>
                                <input
                                    type="text"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleInputChange}
                                    placeholder="Enter destination"
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CD2C58] transition"
                                    required
                                />
                            </div>

                            {/* Start Date */}
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                                <label className="text-sm font-semibold text-gray-700 w-40 flex-shrink-0">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CD2C58] transition"
                                    required
                                />
                            </div>

                            {/* End Date */}
                            <div className="flex items-center gap-4 pb-4">
                                <label className="text-sm font-semibold text-gray-700 w-40 flex-shrink-0">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#CD2C58] transition"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#CD2C58] text-white px-6 py-3 rounded-lg hover:bg-[#E06B80] transition duration-300 font-semibold shadow-lg transform hover:scale-105 mt-6"
                            >
                                Create Trip
                            </button>
                        </form>
                    </div>
                </div>

                {/* Suggestions Section */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#E06B80]">
                    {/* Header Band */}
                    <div className="bg-gradient-to-r from-[#CD2C58] to-[#E06B80] py-4 px-8">
                        <h3 className="text-2xl font-bold text-white text-center">
                            Suggestion for Places to Visit/Activities to prefer
                        </h3>
                    </div>

                    {/* Suggestions Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="bg-gradient-to-br from-[#FFC69D] to-[#FFE6D4] rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-[#E06B80] aspect-square flex items-center justify-center"
                                >
                                    {suggestion.image ? (
                                        <img
                                            src={suggestion.image}
                                            alt={suggestion.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-sm text-center p-4">
                                            Image placeholder
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PlanTripPage;
