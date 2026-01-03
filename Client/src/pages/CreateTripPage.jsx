import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function CreateTripPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [availablePackages, setAvailablePackages] = useState([]);
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const [formData, setFormData] = useState({
        tripName: "",
        description: "",
        startDate: "",
        endDate: "",
        coverPhoto: "",
        selectedPackageId: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAvailablePackages();
    }, []);

    useEffect(() => {
        // Check for packageId in URL parameters
        const urlParams = new URLSearchParams(location.search);
        const packageId = urlParams.get('packageId');

        if (packageId && availablePackages.length > 0) {
            const pkg = availablePackages.find(p => p._id === packageId);
            if (pkg) {
                selectPackage(pkg);
            }
        }
    }, [availablePackages, location.search]);

    const fetchAvailablePackages = async () => {
        try {
            const response = await fetch(`${API_URL}/trips`);
            const data = await response.json();
            if (data.success) {
                setAvailablePackages(data.trips);
                setFilteredPackages(data.trips);
            }
        } catch (error) {
            console.error("Error fetching packages:", error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowResults(true);

        if (query.trim() === "") {
            setFilteredPackages(availablePackages);
        } else {
            const filtered = availablePackages.filter(pkg =>
                pkg.destination.toLowerCase().includes(query.toLowerCase()) ||
                pkg.description.toLowerCase().includes(query.toLowerCase()) ||
                pkg.category?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPackages(filtered);
        }
    };

    const selectPackage = (pkg) => {
        setSelectedPackage(pkg);
        setShowResults(false);
        setSearchQuery(pkg.destination);


        setFormData({
            tripName: `${pkg.destination} Trip`,
            description: pkg.description,
            startDate: pkg.startDate.split('T')[0],
            endDate: pkg.endDate.split('T')[0],
            coverPhoto: pkg.imageUrl || "",
            selectedPackageId: pkg._id
        });
    };

    const clearSelection = () => {
        setSelectedPackage(null);
        setSearchQuery("");
        setFilteredPackages(availablePackages);
        setFormData({
            tripName: "",
            description: "",
            startDate: "",
            endDate: "",
            coverPhoto: "",
            selectedPackageId: ""
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/user-trips`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user._id || user.id,
                    packageId: formData.selectedPackageId || null
                })
            });

            const data = await response.json();

            if (data.success) {
                alert("Trip booked successfully!");
                navigate("/my-trips");
            } else {
                alert(data.message || "Failed to book trip");
            }
        } catch (error) {
            console.error("Error booking trip:", error);
            alert("Error booking trip");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate("/login");
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
                            <h1 className="text-xl font-bold text-slate-800">Plan a New Trip</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Search Destinations</h2>
                        <p className="text-slate-600">Search for a place and select from available travel packages</p>
                    </div>

                    <div className="relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                onFocus={() => setShowResults(true)}
                                placeholder="Search for destinations (e.g., Paris, Tokyo, Bali)..."
                                className="w-full px-6 py-4 pr-12 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                🔍
                            </div>
                        </div>

                   {showResults && !selectedPackage && searchQuery && (
                            <div className="absolute w-full mt-2 bg-white border-2 border-indigo-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-10">
                                {filteredPackages.length > 0 ? (
                                    <div className="p-2">
                                        {filteredPackages.map((pkg) => (
                                            <button
                                                key={pkg._id}
                                                onClick={() => selectPackage(pkg)}
                                                className="w-full p-4 hover:bg-indigo-50 rounded-lg transition text-left group"
                                            >
                                                <div className="flex items-start space-x-4">
                                                    {pkg.imageUrl ? (
                                                        <img
                                                            src={pkg.imageUrl}
                                                            alt={pkg.destination}
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-3xl">
                                                            {pkg.image}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600">{pkg.destination}</h3>
                                                        <p className="text-sm text-slate-600 line-clamp-1">{pkg.description}</p>
                                                        <div className="flex items-center space-x-4 mt-1 text-xs text-slate-500">
                                                            <span>💰 ${pkg.budget}</span>
                                                            <span>📅 {new Date(pkg.startDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        <span className="text-4xl mb-2 block">🔍</span>
                                        <p>No destinations found matching "{searchQuery}"</p>
                                        <p className="text-sm mt-2">Try searching for different locations</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedPackage && (
                        <div className="mt-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 border-2 border-indigo-300">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4 flex-1">
                                    {selectedPackage.imageUrl ? (
                                        <img
                                            src={selectedPackage.imageUrl}
                                            alt={selectedPackage.destination}
                                            className="w-24 h-24 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-4xl">
                                            {selectedPackage.image}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800">{selectedPackage.destination}</h3>
                                                <p className="text-sm text-slate-600 mt-1">{selectedPackage.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6 mt-3 text-sm text-slate-700">
                                            <span className="font-semibold">💰 ${selectedPackage.budget} per person</span>
                                            <span>📅 {new Date(selectedPackage.startDate).toLocaleDateString()} - {new Date(selectedPackage.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-3">
                                            <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                                                ✓ Package Selected
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={clearSelection}
                                    className="ml-4 text-slate-500 hover:text-red-600 transition"
                                    title="Clear selection"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {selectedPackage && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Your Booking</h2>
                            <p className="text-slate-600">Select your travel dates for this package</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                        
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                                <div className="flex items-start space-x-4">
                                    {selectedPackage.imageUrl ? (
                                        <img
                                            src={selectedPackage.imageUrl}
                                            alt={selectedPackage.destination}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-3xl">
                                            {selectedPackage.image}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800">{selectedPackage.destination}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{selectedPackage.description}</p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm">
                                            <span className="font-semibold text-indigo-700">💰 ${selectedPackage.budget} per person</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                         
                            <div className="space-y-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start space-x-2">
                                        <span className="text-xl">📅</span>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 text-sm">Choose Your Travel Dates</h4>
                                            <p className="text-xs text-slate-600 mt-1">
                                                Select when you want to travel. The package itinerary will be the same, but you choose your dates.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Your Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Your End Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            required
                                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {formData.startDate && formData.endDate && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                                        <span className="font-semibold text-green-800">
                                            ✓ Trip Duration: {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
                                        </span>
                                    </div>
                                )}
                            </div>

                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Any special requests or notes for your trip..."
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                />
                            </div>

                       
                            <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                                <h4 className="font-semibold text-slate-800">Booking Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Package:</span>
                                        <span className="font-semibold text-slate-800">{selectedPackage.destination}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Price per person:</span>
                                        <span className="font-semibold text-slate-800">${selectedPackage.budget.toLocaleString()}</span>
                                    </div>
                                    {formData.startDate && formData.endDate && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Your dates:</span>
                                            <span className="font-semibold text-slate-800">
                                                {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                          
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition font-bold text-lg shadow-lg shadow-indigo-500/30 disabled:bg-indigo-400"
                                >
                                    {loading ? "Processing..." : "✓ Confirm Booking"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>


                        <div className="mt-6 text-center text-sm text-slate-500">
                            <p>Need a fully custom trip? <button onClick={() => navigate("/custom-trip")} className="text-indigo-600 hover:text-indigo-700 font-semibold">Create a custom trip plan</button> instead</p>
                        </div>
                    </div>
                )}

                   
                {!selectedPackage && (
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-3">💡 How to Book a Trip</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start">
                                <span className="mr-2">1.</span>
                                <span>Search for your desired destination in the search box above</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">2.</span>
                                <span>Browse through available packages and select one that interests you</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">3.</span>
                                <span>Review the package details and customize dates or description if needed</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">4.</span>
                                <span>Click "Book This Trip" to add it to your trips</span>
                            </li>
                        </ul>
                    </div>
                )}
            </main>
        </div>
    );
}

export default CreateTripPage;
