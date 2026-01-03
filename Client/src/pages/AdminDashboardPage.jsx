import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AnimatedBackground from "../components/layout/AnimatedBackground";

const API_URL = "http://localhost:5000/api";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [trips, setTrips] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    continent: "Asia",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    image: "",
    imageUrl: "",
    category: "recommended",
    activities: [],
    specialOffer: 0,
    recommendedByTravelers: false,
  });
  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      navigate("/admin/login");
      return;
    }

    const parsedAdmin = JSON.parse(adminData);
    setAdmin(parsedAdmin);
    fetchTrips();
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
      setTrips(tripsArray);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingTrip
        ? `${API_URL}/trips/${editingTrip._id}`
        : `${API_URL}/trips`;

      const method = editingTrip ? "PUT" : "POST";

      console.log("Submitting form data:", formData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          editingTrip
            ? "Trip updated successfully!"
            : "Trip created successfully!"
        );
        setShowAddForm(false);
        setEditingTrip(null);
        setFormData({
          destination: "",
          country: "",
          continent: "Asia",
          description: "",
          startDate: "",
          endDate: "",
          budget: "",
          image: "",
          imageUrl: "",
          category: "recommended",
          activities: [],
          specialOffer: 0,
          recommendedByTravelers: false,
        });
        fetchTrips();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving trip");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      destination: trip.destination,
      country: trip.country || "",
      continent: trip.continent || "Asia",
      description: trip.description,
      startDate: trip.startDate.split("T")[0],
      endDate: trip.endDate.split("T")[0],
      budget: trip.budget,
      image: trip.image,
      imageUrl: trip.imageUrl,
      category: trip.category,
      activities: trip.activities || [],
      specialOffer: trip.specialOffer !== undefined ? trip.specialOffer : 0,
      recommendedByTravelers:
        trip.recommendedByTravelers !== undefined
          ? trip.recommendedByTravelers
          : false,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`${API_URL}/trips/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Trip deleted successfully!");
        fetchTrips();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Error deleting trip");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/trips/${id}/toggle`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (data.success) {
        fetchTrips();
      } else {
        alert(data.message || "Toggle failed");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Error toggling status");
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingTrip(null);
    setFormData({
      destination: "",
      country: "",
      continent: "Asia",
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
      image: "",
      imageUrl: "",
      category: "recommended",
      activities: [],
      specialOffer: 0,
      recommendedByTravelers: false,
    });
  };

  if (!admin) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-xl text-gray-600 relative z-10">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage trips and travel destinations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium hidden sm:inline">
                {admin.name || admin.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-6 py-2.5 rounded-lg transition-all duration-300 font-semibold text-sm shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Trip Management
              </h2>
              <p className="text-gray-600">
                Manage trips that appear on user dashboards
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-xl"
            >
              {showAddForm ? "Cancel" : "Add New Trip"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTrip ? "Edit Trip" : "Add New Trip"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                    placeholder="e.g., Paris, France"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                    placeholder="e.g., France"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Continent *
                  </label>
                  <select
                    name="continent"
                    value={formData.continent}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                  >
                    <option value="Africa">Africa</option>
                    <option value="Antarctica">Antarctica</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="North America">North America</option>
                    <option value="Oceania">Oceania</option>
                    <option value="South America">South America</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget ($) *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                    placeholder="e.g., 2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="popular">Popular</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Offer Price ($)
                  </label>
                  <input
                    type="number"
                    name="specialOffer"
                    value={formData.specialOffer}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                    placeholder="Enter special price (0 = no offer)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave as 0 if no special offer
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="recommendedByTravelers"
                      checked={formData.recommendedByTravelers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recommendedByTravelers: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Recommended by Travelers
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a URL to display an actual image instead of just an emoji
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                  placeholder="Brief description of the trip..."
                />
              </div>

              {/* Activities Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Activities Available at This Place
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newActivity = prompt("Enter activity name:");
                      if (newActivity && newActivity.trim()) {
                        console.log("Current activities:", formData.activities);
                        console.log("Adding activity:", newActivity.trim());
                        const updatedActivities = [
                          ...(formData.activities || []),
                          newActivity.trim(),
                        ];
                        console.log("Updated activities:", updatedActivities);
                        setFormData({
                          ...formData,
                          activities: updatedActivities,
                        });
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white text-sm rounded-lg transition-all duration-300 font-semibold shadow-lg"
                  >
                    Add Activity
                  </button>
                </div>

                {formData.activities && formData.activities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">
                          {activity}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              activities: formData.activities.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                          className="text-red-600 hover:text-red-800 font-bold text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No activities added yet. Click "+ Add Activity" to add some.
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white py-4 px-4 rounded-xl transition-all duration-300 font-bold shadow-xl shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {loading
                    ? "Saving..."
                    : editingTrip
                    ? "Update Trip"
                    : "Create Trip"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 px-4 rounded-xl transition-all duration-300 font-bold active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            All Trips ({trips.length})
          </h3>

          {trips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No trips yet!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-6 py-3 rounded-lg transition-all duration-300 font-semibold shadow-xl"
              >
                Add Your First Trip
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trips.map((trip) => (
                    <tr key={trip._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {trip.imageUrl ? (
                          <img
                            src={trip.imageUrl}
                            alt={trip.destination}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "";
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900">
                          {trip.destination}
                        </div>
                        <div className="text-sm text-gray-500">
                          {trip.description}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(trip.startDate).toLocaleDateString()} -{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${trip.budget.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {trip.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(trip._id)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            trip.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {trip.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(trip)}
                          className="text-blue-600 hover:text-blue-800 mr-3 font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trip._id)}
                          className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboardPage;
