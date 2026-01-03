import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  Edit2,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Globe,
  Camera,
  X,
  Plus,
  Info,
  ArrowLeft,
} from "lucide-react";
import Footer from "../components/layout/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAllPlanned, setShowAllPlanned] = useState(false);
  const [showAllPrevious, setShowAllPrevious] = useState(false);

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
      if (data.success && data.trips.length > 0) {
        // Merge real trips with demo trips for visual excellence
        setTrips((prev) => [
          ...data.trips,
          ...prev.filter(
            (t) => !data.trips.some((rt) => rt.tripName === t.tripName)
          ),
        ]);
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
    if (tripId.startsWith("demo")) {
      setTrips(trips.filter((trip) => trip._id !== tripId));
      return;
    }
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
        label: "Planned",
        color: "bg-blue-50 text-blue-700 border-blue-100",
        key: "planned",
        icon: <Clock size={14} />,
      };
    if (now > end)
      return {
        label: "Previous",
        color: "bg-gray-50 text-gray-700 border-gray-200",
        key: "previous",
        icon: <CheckCircle2 size={14} />,
      };
    return {
      label: "Ongoing",
      color: "bg-green-50 text-green-700 border-green-100",
      key: "ongoing",
      icon: <Globe size={14} />,
    };
  };

  // Helper inside component to avoid missing CheckCircle2 if needed
  const CheckCircle2 = ({ size }) => (
    <span className="text-green-500 font-bold">✓</span>
  );

  const getStatusTrips = (status) => {
    return trips.filter((trip) => {
      const tripStatus = getTripStatus(trip.startDate, trip.endDate);
      return tripStatus.key === status;
    });
  };

  const plannedTrips = getStatusTrips("planned");
  const ongoingTrips = getStatusTrips("ongoing");
  const previousTrips = getStatusTrips("previous");

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold">
          Bringing your world together...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Minimalist Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                GlobeTrotter
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/my-trips")}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all"
              >
                My Trips
              </button>
              <button
                onClick={() => navigate("/community-tab")}
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-red-700 rounded-lg hover:bg-red-50 transition-all"
              >
                Community
              </button>

              <div className="relative ml-2">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold hover:bg-red-700 transition overflow-hidden shadow-md ring-2 ring-white"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up">
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">
                          {user.name || user.username}
                        </p>
                        <p className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Hero Section */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden mb-12 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-600 to-red-800"></div>

          <div className="relative pt-16 px-8 pb-10 flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl">
                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-gray-50 flex items-center justify-center text-3xl font-black text-red-600">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>
                      {(
                        user.firstName?.[0] ||
                        user.name?.[0] ||
                        user.username?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="absolute bottom-4 right-4 p-3 bg-red-600 text-white rounded-2xl shadow-xl border-4 border-white cursor-pointer hover:scale-110 transition-transform">
                  <Camera size={20} />
                </div>
              )}
            </div>

            {/* User Meta */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.name || user.username}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <Mail size={16} className="text-red-500" />
                  {user.email}
                </span>
                {user.city && (
                  <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <MapPin size={16} className="text-red-500" />
                    {user.city}, {user.country}
                  </span>
                )}
                {user.phoneNumber && (
                  <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                    <Phone size={16} className="text-red-500" />
                    {user.phoneNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-2xl transition-all border border-gray-100 group shadow-sm"
                >
                  <Edit2
                    size={18}
                    className="text-red-600 group-hover:rotate-12 transition-transform"
                  />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-2xl transition-all border border-gray-100"
                >
                  <X size={18} />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="px-8 pb-10 border-t border-gray-50 pt-8 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                      Profile Image URL
                    </label>
                    <div className="relative">
                      <Camera
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={editForm.profileImage}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            profileImage: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium shadow-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
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
                      className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) =>
                          setEditForm({ ...editForm, city: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={editForm.country}
                        onChange={(e) =>
                          setEditForm({ ...editForm, country: e.target.value })
                        }
                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
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
                      rows={5}
                      className="w-full bg-white border border-gray-200 rounded-3xl p-6 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium resize-none shadow-sm"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-10 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}

          {!isEditing && user.additionalInfo && (
            <div className="px-8 pb-10">
              <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100/50">
                <p className="text-gray-600 font-medium italic leading-relaxed">
                  "{user.additionalInfo}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trips Sections */}
        <div className="space-y-16">
          {/* Ongoing and Planned */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-xl text-red-600">
                  <Globe size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Planned Trips
                </h3>
              </div>
              {ongoingTrips.length + plannedTrips.length > 3 ? (
                <button
                  onClick={() => setShowAllPlanned(!showAllPlanned)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                >
                  {showAllPlanned ? "Show Less" : "Show More"}
                  {showAllPlanned ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              ) : (
                <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest">
                  {ongoingTrips.length + plannedTrips.length} Trips
                </span>
              )}
            </div>

            {ongoingTrips.length === 0 && plannedTrips.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Plus size={32} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  No planned trips
                </h4>
                <p className="text-gray-500 mb-8 font-medium">
                  Ready for a new adventure? Start planning your next trip!
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-8 py-3.5 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-200"
                >
                  Plan New Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...ongoingTrips, ...plannedTrips]
                  .slice(0, showAllPlanned ? undefined : 3)
                  .map((trip) => (
                    <TripCard
                      key={trip._id}
                      trip={trip}
                      getTripStatus={getTripStatus}
                      calculateDuration={calculateDuration}
                      navigate={navigate}
                      handleDelete={handleDelete}
                    />
                  ))}
              </div>
            )}
          </section>

          {/* Previous Trips */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5  bg-red-50 rounded-xl text-red-600">
                  <Calendar size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Previous Trips
                </h3>
              </div>
              {previousTrips.length > 3 ? (
                <button
                  onClick={() => setShowAllPrevious(!showAllPrevious)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                >
                  {showAllPrevious ? "Show Less" : "Show More"}
                  {showAllPrevious ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              ) : (
                <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-widest">
                  {previousTrips.length} Completed
                </span>
              )}
            </div>

            {previousTrips.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center">
                <p className="text-gray-500 font-medium font-bold italic">
                  No previous adventures recorded yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {previousTrips
                  .slice(0, showAllPrevious ? undefined : 3)
                  .map((trip) => (
                    <TripCard
                      key={trip._id}
                      trip={trip}
                      getTripStatus={getTripStatus}
                      calculateDuration={calculateDuration}
                      navigate={navigate}
                      handleDelete={handleDelete}
                    />
                  ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Updated TripCard for modern look
const TripCard = ({
  trip,
  getTripStatus,
  calculateDuration,
  navigate,
  handleDelete,
}) => {
  const status = getTripStatus(trip.startDate, trip.endDate);
  const duration = calculateDuration(trip.startDate, trip.endDate);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      {/* Cover Photo */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {trip.coverPhoto ? (
          <img
            src={trip.coverPhoto}
            alt={trip.tripName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<div class="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-200"><Globe size={48} /></div>';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-200">
            <Globe size={48} />
          </div>
        )}

        {/* Status Badge overlay */}
        {status.key !== "previous" && (
          <div className="absolute top-6 left-6">
            <div
              className={`px-4 py-2 border backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${status.color}`}
            >
              {status.icon}
              {status.label}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors mb-4 line-clamp-1">
          {trip.tripName}
        </h3>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Calendar size={16} />
            </div>
            <span className="text-sm font-bold uppercase tracking-tight">
              {new Date(trip.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -
              {new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Clock size={16} />
            </div>
            <span className="text-sm font-bold uppercase tracking-tight">
              {duration} {duration === 1 ? "Day" : "Days"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <div className="p-2 bg-gray-50 rounded-lg">
              <MapPin size={16} />
            </div>
            <span className="text-sm font-bold uppercase tracking-tight">
              {trip.destinations?.length || 0} Destination
              {trip.destinations?.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/trip/${trip._id}`)}
          className="mt-auto w-full py-4 bg-gray-900 group-hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-gray-200 group-hover:shadow-red-200"
        >
          View Itinerary
          <ChevronRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
