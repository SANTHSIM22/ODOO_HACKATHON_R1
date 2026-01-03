import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    country: "",
    additionalInfo: "",
    profileImage: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchUserTrips(parsedUser._id);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEdit = () => {
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      city: user.city || "",
      country: user.country || "",
      additionalInfo: user.additionalInfo || "",
      profileImage: user.profileImage || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      city: "",
      country: "",
      additionalInfo: "",
      profileImage: "",
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `${API_URL}/auth/update-profile/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`${API_URL}/user-trips/${tripId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Trip deleted successfully!");
        setTrips(trips.filter((trip) => trip._id !== tripId));
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

    if (now < start)
      return {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-800",
        key: "upcoming",
      };
    if (now > end)
      return {
        label: "Completed",
        color: "bg-gray-100 text-gray-800",
        key: "completed",
      };
    return {
      label: "Ongoing",
      color: "bg-green-100 text-green-800",
      key: "ongoing",
    };
  };

  const getStatusTrips = (status) => {
    return trips.filter((trip) => {
      const tripStatus = getTripStatus(trip.startDate, trip.endDate);
      return tripStatus.key === status;
    });
  };

  const preplannedTrips = [
    ...getStatusTrips("upcoming"),
    ...getStatusTrips("ongoing"),
  ];
  const previousTrips = getStatusTrips("completed");

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 font-semibold">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-2xl font-bold text-gray-900 hover:text-red-600 transition"
            >
              GlobeTrotter
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/my-trips")}
                className="px-5 py-2 text-gray-700 hover:text-red-600 font-semibold transition"
              >
                My Trips
              </button>
              <button
                onClick={() => navigate("/community-tab")}
                className="px-5 py-2 text-gray-700 hover:text-red-600 font-semibold transition"
              >
                Community
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            User Profile
          </h1>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-red-600 shadow-lg bg-gray-100 flex items-center justify-center">
                {(isEditing ? editForm.profileImage : user.profileImage) ? (
                  <img
                    src={isEditing ? editForm.profileImage : user.profileImage}
                    alt={user.name || user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<div class="text-6xl font-bold text-red-600">${(
                        user.firstName?.[0] ||
                        user.name?.[0] ||
                        user.username?.[0] ||
                        "U"
                      ).toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="text-6xl font-bold text-red-600">
                    {(
                      user.firstName?.[0] ||
                      user.name?.[0] ||
                      user.username?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </div>
                )}
              </div>
              <p className="text-center mt-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {isEditing ? "Profile Photo" : "Image of the User"}
              </p>
            </div>

            {/* User Details / Edit Form */}
            <div className="flex-1 bg-gray-50 rounded-xl border-2 border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {user.username || user.name}
                  </h2>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {/* Profile Image URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      value={editForm.profileImage}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          profileImage: e.target.value,
                        })
                      }
                      placeholder="Enter image URL"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstName: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastName: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phoneNumber}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      City
                    </label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) =>
                        setEditForm({ ...editForm, city: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Country
                    </label>
                    <input
                      type="text"
                      value={editForm.country}
                      onChange={(e) =>
                        setEditForm({ ...editForm, country: e.target.value })
                      }
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      About
                    </label>
                    <textarea
                      value={editForm.additionalInfo}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          additionalInfo: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Name:</span>{" "}
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.name || "Not provided"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {user.email || "Not provided"}
                  </p>
                  {user.phoneNumber && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Phone:</span>{" "}
                      {user.phoneNumber}
                    </p>
                  )}
                  {user.city && user.country && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Location:</span>{" "}
                      {user.city}, {user.country}
                    </p>
                  )}
                  {user.additionalInfo && (
                    <p className="text-gray-700">
                      <span className="font-semibold">About:</span>{" "}
                      {user.additionalInfo}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preplanned Trips */}
        <section className="mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Preplanned Trips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preplannedTrips.length > 0 ? (
              preplannedTrips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  getTripStatus={getTripStatus}
                  calculateDuration={calculateDuration}
                  navigate={navigate}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No preplanned trips yet</p>
              </div>
            )}
          </div>
        </section>

        {/* Previous Trips */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            Previous Trips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousTrips.length > 0 ? (
              previousTrips.map((trip) => (
                <TripCard
                  key={trip._id}
                  trip={trip}
                  getTripStatus={getTripStatus}
                  calculateDuration={calculateDuration}
                  navigate={navigate}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500">No previous trips yet</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// TripCard Component
function TripCard({
  trip,
  getTripStatus,
  calculateDuration,
  navigate,
  handleDelete,
}) {
  const status = getTripStatus(trip.startDate, trip.endDate);
  const duration = calculateDuration(trip.startDate, trip.endDate);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-red-300 transition-all duration-300 group">
      {trip.coverPhoto ? (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={trip.coverPhoto}
            alt={trip.tripName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 font-semibold">Image</div>';
            }}
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-400 font-semibold">Image</span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-black group-hover:text-red-600 transition flex-1">
            {trip.tripName}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ml-2 flex-shrink-0 ${status.color}`}
          >
            {status.label}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {trip.description}
        </p>

        <div className="space-y-3 mb-6 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-4">→</span>
            <span>
              {new Date(trip.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-4">◆</span>
            <span>
              {duration} {duration === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2 w-4">✦</span>
            <span>
              {trip.destinations?.length || 0} destination
              {trip.destinations?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate(`/trip/${trip._id}`)}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold text-sm shadow-sm"
          >
            View Details
          </button>
          <button
            onClick={() => handleDelete(trip._id)}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
