import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [trips, setTrips] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    image: "🌍",
    imageUrl: "",
    category: "recommended",
    activities: [],
  });

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
          description: "",
          startDate: "",
          endDate: "",
          budget: "",
          image: "🌍",
          imageUrl: "",
          category: "recommended",
          activities: [],
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
      description: trip.description,
      startDate: trip.startDate.split("T")[0],
      endDate: trip.endDate.split("T")[0],
      budget: trip.budget,
      image: trip.image,
      imageUrl: trip.imageUrl,
      category: trip.category,
      activities: trip.activities || [],
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
      description: "",
      startDate: "",
      endDate: "",
      budget: "",
      image: "🌍",
      imageUrl: "",
      category: "recommended",
      activities: [],
    });
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const emojiOptions = [
    "🌍",
    "🗼",
    "🗾",
    "🗽",
    "🏝️",
    "🏛️",
    "🏙️",
    "🏖️",
    "⛰️",
    "🏔️",
    "🌴",
    "🎡",
    "🎢",
    "🎪",
    "🎭",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🔐</span>
              <div>
                <h1 className="text-2xl font-bold text-red-600">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">GlobeTrotter Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium hidden sm:inline">
                {admin.name || admin.username}
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Trip Management
              </h2>
              <p className="text-gray-600">
                Manage trips that appear on user dashboards
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-600 transition duration-200 font-semibold shadow-lg"
            >
              {showAddForm ? "Cancel" : "+ Add New Trip"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., France"
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon Emoji
                  </label>
                  <select
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {emojiOptions.map((emoji) => (
                      <option key={emoji} value={emoji}>
                        {emoji} {emoji}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="popular">Popular</option>
                    <option value="featured">Featured</option>
                  </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    + Add Activity
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
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200 font-semibold disabled:bg-red-400"
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
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            All Trips ({trips.length})
          </h3>

          {trips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No trips yet!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
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
                      Icon
                    </th>
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
                      <td className="px-4 py-4 whitespace-nowrap text-2xl">
                        {trip.image}
                      </td>
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
                          className="text-indigo-600 hover:text-indigo-900 mr-3 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trip._id)}
                          className="text-red-600 hover:text-red-900 font-semibold"
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
    </div>
  );
}

export default AdminDashboardPage;
