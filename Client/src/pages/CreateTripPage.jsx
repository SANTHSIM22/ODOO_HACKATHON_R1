import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    numberOfTravelers: "",
    accommodationType: "",
    coverPhoto: "",
    selectedPackageId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailablePackages();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const packageId = urlParams.get("packageId");

    console.log("URL packageId:", packageId);
    console.log("Available packages:", availablePackages);

    if (packageId && availablePackages.length > 0) {
      const pkg = availablePackages.find((p) => p._id === packageId);
      console.log("Found package:", pkg);
      if (pkg) {
        selectPackage(pkg);
      } else {
        console.log(
          "Package not found, available packages:",
          availablePackages.map((p) => ({ id: p._id, dest: p.destination }))
        );
      }
    }
  }, [availablePackages, location.search]);

  const fetchAvailablePackages = async () => {
    try {
      const response = await fetch(`${API_URL}/trips`);
      const data = await response.json();

      console.log("Fetched data:", data);

      // Handle both response formats - direct array or object with trips property
      const tripsArray = Array.isArray(data)
        ? data
        : data.success
        ? data.trips
        : [];

      setAvailablePackages(tripsArray);
      setFilteredPackages(tripsArray);
      console.log("Set packages:", tripsArray.length, "items");
    } catch (error) {
      console.error("Error fetching packages:", error);
      setAvailablePackages([]);
      setFilteredPackages([]);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);

    console.log("Search query:", query);
    console.log("Available packages for filtering:", availablePackages.length);

    if (query.trim() === "") {
      setFilteredPackages(availablePackages);
    } else {
      const filtered = availablePackages.filter(
        (pkg) =>
          pkg.destination?.toLowerCase().includes(query.toLowerCase()) ||
          pkg.description?.toLowerCase().includes(query.toLowerCase()) ||
          pkg.category?.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Filtered packages:", filtered);
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
      startDate: pkg.startDate.split("T")[0],
      endDate: pkg.endDate.split("T")[0],
      numberOfTravelers: "",
      accommodationType: "",
      coverPhoto: pkg.imageUrl || "",
      selectedPackageId: pkg._id,
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
      numberOfTravelers: "",
      accommodationType: "",
      coverPhoto: "",
      selectedPackageId: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user is logged in
    if (!user || (!user._id && !user.id)) {
      alert("Please log in to create a trip");
      navigate("/login");
      return;
    }

    // Validate required fields
    if (!formData.tripName || !formData.tripName.trim()) {
      alert("Please enter a trip name");
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!formData.startDate) {
      alert("Please select a start date");
      return;
    }

    if (!formData.endDate) {
      alert("Please select an end date");
      return;
    }

    setLoading(true);

    const payload = {
      tripName: formData.tripName.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      coverPhoto: formData.coverPhoto || "",
      userId: user._id || user.id,
      packageId: formData.selectedPackageId || null,
      status: "planning",
    };

    console.log("Submitting trip with payload:", payload);

    try {
      const response = await fetch(`${API_URL}/user-trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        alert("Trip created successfully!");
        navigate("/my-trips");
      } else {
        alert(data.message || "Failed to create trip");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Error creating trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const tripDays =
    formData.startDate && formData.endDate
      ? Math.ceil(
          (new Date(formData.endDate) - new Date(formData.startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-black font-semibold transition"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-black">
              Book Your Travel Package
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">
              Search Destinations
            </h2>
            <p className="text-gray-600">
              Find and select from available travel packages
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => setShowResults(true)}
              placeholder="Search for destinations..."
              className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-base"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">
              →
            </div>

            {/* Search Results Dropdown */}
            {showResults && !selectedPackage && (
              <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-96 overflow-y-auto z-10">
                {filteredPackages.length > 0 ? (
                  <div className="p-2">
                    {filteredPackages.map((pkg) => (
                      <button
                        key={pkg._id}
                        onClick={() => selectPackage(pkg)}
                        className="w-full p-4 hover:bg-gray-50 rounded-lg transition text-left group border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start space-x-4">
                          {pkg.imageUrl ? (
                            <img
                              src={pkg.imageUrl}
                              alt={pkg.destination}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 font-semibold">
                              Img
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-black group-hover:text-red-600 transition">
                              {pkg.destination}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                              {pkg.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="font-semibold">
                                ${pkg.budget}
                              </span>
                              <span>
                                {new Date(pkg.startDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p className="font-semibold mb-1">No destinations found</p>
                    <p className="text-sm">
                      Try searching for different locations
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Package Display */}
          {selectedPackage && (
            <div className="mt-6 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {selectedPackage.imageUrl ? (
                    <img
                      src={selectedPackage.imageUrl}
                      alt={selectedPackage.destination}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 font-semibold">
                      Img
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black">
                      {selectedPackage.destination}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedPackage.description}
                    </p>
                    <div className="flex items-center space-x-6 mt-4 text-sm">
                      <span className="font-semibold text-black">
                        ${selectedPackage.budget.toLocaleString()} per person
                      </span>
                      <span className="text-gray-600">
                        {new Date(
                          selectedPackage.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(selectedPackage.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Selected
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearSelection}
                  className="ml-4 text-gray-400 hover:text-red-600 transition font-bold text-xl"
                  title="Clear selection"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">
                Complete Your Booking
              </h2>
              <p className="text-gray-600">
                Customize your travel dates and preferences
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Package Summary */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start space-x-4">
                  {selectedPackage.imageUrl ? (
                    <img
                      src={selectedPackage.imageUrl}
                      alt={selectedPackage.destination}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 font-semibold">
                      Img
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black">
                      {selectedPackage.destination}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedPackage.description}
                    </p>
                    <p className="text-sm font-semibold text-black mt-2">
                      ${selectedPackage.budget.toLocaleString()} per person
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Name */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Trip Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleInputChange}
                  required
                  placeholder="Give your trip a name (e.g., Summer Europe Adventure)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Trip Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Describe your trip plans, destinations, and activities..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                />
              </div>

              {/* Travel Dates Section */}
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-black text-sm">
                    Select Your Travel Dates
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Choose when you want to travel. The itinerary remains the
                    same with flexible dates.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Start Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      End Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={
                        formData.startDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {tripDays > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <span className="font-semibold text-green-700">
                      Trip Duration: {tripDays} days
                    </span>
                  </div>
                )}
              </div>

              {/* Number of Travelers */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Number of Travelers{" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <select
                  name="numberOfTravelers"
                  value={formData.numberOfTravelers || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select number of travelers</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Traveler" : "Travelers"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Accommodation Type */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Accommodation Preference{" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <select
                  name="accommodationType"
                  value={formData.accommodationType || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select accommodation type</option>
                  <option value="budget">Budget Hotels</option>
                  <option value="standard">Standard Hotels</option>
                  <option value="luxury">Luxury Hotels</option>
                  <option value="resort">Resort</option>
                  <option value="airbnb">Airbnb/Vacation Rental</option>
                </select>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-black mb-4">Booking Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Trip Name:</span>
                    <span className="font-semibold text-black">
                      {formData.tripName}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-semibold text-black">
                      {selectedPackage.destination}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-semibold text-black">
                      ${selectedPackage.budget.toLocaleString()}
                    </span>
                  </div>
                  {tripDays > 0 && (
                    <div className="flex justify-between pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Trip duration:</span>
                      <span className="font-semibold text-black">
                        {tripDays} days
                      </span>
                    </div>
                  )}
                  {formData.numberOfTravelers && (
                    <div className="flex justify-between pb-3 border-b border-gray-200">
                      <span className="text-gray-600">
                        Number of travelers:
                      </span>
                      <span className="font-semibold text-black">
                        {formData.numberOfTravelers}
                      </span>
                    </div>
                  )}
                  {formData.accommodationType && (
                    <div className="flex justify-between pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Accommodation:</span>
                      <span className="font-semibold text-black capitalize">
                        {formData.accommodationType}
                      </span>
                    </div>
                  )}
                  {formData.startDate && formData.endDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your dates:</span>
                      <span className="font-semibold text-black">
                        {new Date(formData.startDate).toLocaleDateString()} -{" "}
                        {new Date(formData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition font-bold text-base shadow-md disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Instructions Section */}
        {!selectedPackage && (
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-4">
              How to Book a Trip
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">
                  1
                </div>
                <div>
                  <p className="font-semibold text-black">
                    Search Destinations
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter your desired destination in the search box
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">
                  2
                </div>
                <div>
                  <p className="font-semibold text-black">Browse Packages</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Select a package that interests you
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">
                  3
                </div>
                <div>
                  <p className="font-semibold text-black">Customize Details</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose dates, travelers, and accommodation
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600">
                  4
                </div>
                <div>
                  <p className="font-semibold text-black">Confirm Booking</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Review and confirm your trip
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CreateTripPage;
