import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function CustomTripPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    });

    const [formData, setFormData] = useState({
        tripName: "",
        description: "",
        startDate: "",
        endDate: "",
        coverPhoto: ""
    });

    const [loading, setLoading] = useState(false);

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
                    packageId: null // Custom trip, no package
                })
            });

            const data = await response.json();

            if (data.success) {
                alert("Custom trip created successfully!");
                navigate("/my-trips");
            } else {
                alert(data.message || "Failed to create trip");
            }
        } catch (error) {
            console.error("Error creating trip:", error);
            alert("Error creating trip");
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => navigate("/my-trips")}
                                className="text-slate-600 hover:text-slate-800"
                            >
                                ← Back
                            </button>
                            <h1 className="text-xl font-bold text-slate-800">Create Custom Trip</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Plan Your Custom Trip</h2>
                        <p className="text-slate-600">Create a personalized trip plan with your own details and itinerary</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Trip Name *
                            </label>
                            <input
                                type="text"
                                name="tripName"
                                value={formData.tripName}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., Summer Europe Adventure"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Trip Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="4"
                                placeholder="Describe your trip plans, goals, or what you're looking forward to..."
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Cover Photo URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="coverPhoto"
                                value={formData.coverPhoto}
                                onChange={handleInputChange}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <p className="text-xs text-slate-500 mt-2">Add a URL to a cover image for your trip</p>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg shadow-indigo-500/30 disabled:bg-indigo-400"
                            >
                                {loading ? "Creating..." : "Create Custom Trip"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/my-trips")}
                                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3"> Custom Trip Planning Tips</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>Give your trip a memorable name that captures its essence</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>Set realistic dates and allow buffer time for travel</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>Add destinations and activities after creating your trip</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">✓</span>
                            <span>You have full control over all aspects of your custom trip</span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}

export default CustomTripPage;
