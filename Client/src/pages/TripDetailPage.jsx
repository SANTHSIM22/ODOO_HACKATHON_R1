import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function TripDetailPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [showAddSection, setShowAddSection] = useState(false);

  const [newSection, setNewSection] = useState({
    name: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  const [editingSection, setEditingSection] = useState(null);
  const [sectionEdits, setSectionEdits] = useState({});
  const [newActivityData, setNewActivityData] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchTripDetails();
  }, [tripId, navigate]);

  const fetchTripDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/user-trips/trip/${tripId}`);
      const data = await response.json();
      if (data.success) {
        setTrip(data.trip);
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSection.name || !newSection.startDate || !newSection.endDate) {
      alert("Please fill in section name and date range");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/user-trips/${tripId}/destinations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newSection.name,
            notes: newSection.description,
            startDate: newSection.startDate,
            endDate: newSection.endDate,
            budget: newSection.budget,
            activities: [],
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setTrip(data.trip);
        setShowAddSection(false);
        setNewSection({
          name: "",
          startDate: "",
          endDate: "",
          budget: "",
          description: "",
        });
        alert("Section added successfully!");
      }
    } catch (error) {
      console.error("Error adding section:", error);
      alert("Error adding section");
    }
  };

  const handleDeleteSection = async (index) => {
    if (!confirm("Delete this section?")) return;

    const updatedDestinations = trip.destinations.filter((_, i) => i !== index);

    try {
      const response = await fetch(`${API_URL}/user-trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinations: updatedDestinations,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTrip(data.trip);
        alert("Section deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Error deleting section");
    }
  };

  const handleUpdateSection = async (index) => {
    const edits = sectionEdits[index];
    if (!edits) {
      alert("No changes to save");
      return;
    }

    const updatedDestinations = [...trip.destinations];
    updatedDestinations[index] = {
      ...updatedDestinations[index],
      ...edits,
    };

    try {
      const response = await fetch(`${API_URL}/user-trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinations: updatedDestinations,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTrip(data.trip);
        setEditingSection(null);
        setSectionEdits({});
        alert("Section updated successfully!");
      } else {
        alert(data.message || "Failed to update section");
      }
    } catch (error) {
      console.error("Error updating section:", error);
      alert("Error updating section: " + error.message);
    }
  };

  const handleSectionFieldChange = (index, field, value) => {
    setSectionEdits({
      ...sectionEdits,
      [index]: {
        ...(sectionEdits[index] || {}),
        [field]: value,
      },
    });
  };

  const handleAddActivity = async (index) => {
    const activityData = newActivityData[index];
    if (!activityData?.name?.trim() || !activityData?.time?.trim()) {
      alert("Please enter activity name and time");
      return;
    }

    const destination = trip.destinations[index];
    const destinationBudget =
      parseFloat(destination.budget?.replace(/[^0-9.-]+/g, "")) || 0;
    const currentActivityTotal = (destination.activities || []).reduce(
      (sum, act) => {
        return sum + (parseFloat(act.budget?.replace(/[^0-9.-]+/g, "")) || 0);
      },
      0
    );
    const newActivityBudget =
      parseFloat(activityData.budget?.replace(/[^0-9.-]+/g, "")) || 0;

    // Only validate budget if destination has a budget set (greater than 0)
    if (
      destinationBudget > 0 &&
      currentActivityTotal + newActivityBudget > destinationBudget
    ) {
      alert(
        `Activity budget exceeds destination budget!\nDestination budget: $${destinationBudget}\nCurrent activities: $${currentActivityTotal.toFixed(
          2
        )}\nAvailable: $${(destinationBudget - currentActivityTotal).toFixed(
          2
        )}`
      );
      return;
    }

    const updatedDestinations = [...trip.destinations];
    updatedDestinations[index] = {
      ...updatedDestinations[index],
      activities: [
        ...(updatedDestinations[index].activities || []),
        {
          name: activityData.name,
          day: activityData.day ? parseInt(activityData.day) : undefined,
          time: activityData.time,
          budget: activityData.budget || "0",
        },
      ],
    };

    try {
      const response = await fetch(`${API_URL}/user-trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinations: updatedDestinations,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTrip(data.trip);
        setNewActivityData({
          ...newActivityData,
          [index]: { name: "", time: "", budget: "" },
        });
        alert("Activity added successfully!");
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      alert("Error adding activity");
    }
  };

  const handleDeleteActivity = async (destIndex, actIndex) => {
    if (!confirm("Delete this activity?")) return;

    const updatedDestinations = [...trip.destinations];
    updatedDestinations[destIndex] = {
      ...updatedDestinations[destIndex],
      activities: updatedDestinations[destIndex].activities.filter(
        (_, i) => i !== actIndex
      ),
    };

    try {
      const response = await fetch(`${API_URL}/user-trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destinations: updatedDestinations,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTrip(data.trip);
        alert("Activity deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Error deleting activity");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading trip details...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4 text-lg">Trip not found</div>
          <button
            onClick={() => navigate("/my-trips")}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            ← Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/my-trips")}
                className="text-gray-600 hover:text-black font-semibold transition"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {trip.tripName}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
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
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/trip/${tripId}/itinerary`)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md"
              >
                View Itinerary
              </button>
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "calendar" : "list")
                }
                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold shadow-sm"
              >
                {viewMode === "list" ? "Calendar View" : "List View"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Trip Overview
          </h2>
          <p className="text-gray-700 mb-6 text-base leading-relaxed">
            {trip.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 shadow-sm hover:shadow-md transition">
              <p className="text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
                Duration
              </p>
              <p className="text-4xl font-bold text-red-600">
                {Math.ceil(
                  (new Date(trip.endDate) - new Date(trip.startDate)) /
                    (1000 * 60 * 60 * 24)
                )}
              </p>
              <p className="text-gray-600 text-sm mt-1">days</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 shadow-sm hover:shadow-md transition">
              <p className="text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
                Destinations
              </p>
              <p className="text-4xl font-bold text-red-600">
                {trip.destinations?.length || 0}
              </p>
              <p className="text-gray-600 text-sm mt-1">sections</p>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200 shadow-sm hover:shadow-md transition">
              <p className="text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
                Activities
              </p>
              <p className="text-4xl font-bold text-red-600">
                {trip.destinations?.reduce(
                  (sum, dest) => sum + (dest.activities?.length || 0),
                  0
                ) || 0}
              </p>
              <p className="text-gray-600 text-sm mt-1">planned</p>
            </div>
          </div>
        </div>

        {/* Sections/Destinations */}
        <div className="space-y-6">
          {trip.destinations &&
            trip.destinations.map((destination, index) => {
              const isEditing = editingSection === index;
              const edits = sectionEdits[index] || {};

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border-2 border-gray-200 p-8 hover:shadow-lg transition"
                >
                  {/* Section Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={
                              edits.name !== undefined
                                ? edits.name
                                : destination.name
                            }
                            onChange={(e) =>
                              handleSectionFieldChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="text-2xl font-bold text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                          />
                        ) : (
                          <h3 className="text-2xl font-bold text-black">
                            {destination.name}
                          </h3>
                        )}
                      </div>
                      {isEditing ? (
                        <textarea
                          value={
                            edits.notes !== undefined
                              ? edits.notes
                              : destination.notes || ""
                          }
                          onChange={(e) =>
                            handleSectionFieldChange(
                              index,
                              "notes",
                              e.target.value
                            )
                          }
                          className="text-sm text-gray-600 mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                          rows="2"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 mt-2">
                          {destination.notes || "No description"}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdateSection(index)}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingSection(null);
                              setSectionEdits({});
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingSection(index)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSection(index)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Section Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white border-b-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Start Date
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={
                            edits.startDate !== undefined
                              ? edits.startDate
                              : destination.startDate
                              ? new Date(destination.startDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleSectionFieldChange(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-gray-900 font-medium">
                          {destination.startDate ? (
                            new Date(destination.startDate).toLocaleDateString()
                          ) : (
                            <span className="text-gray-500 italic">
                              Click Edit to set date
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        End Date
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={
                            edits.endDate !== undefined
                              ? edits.endDate
                              : destination.endDate
                              ? new Date(destination.endDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleSectionFieldChange(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-gray-900 font-medium">
                          {destination.endDate ? (
                            new Date(destination.endDate).toLocaleDateString()
                          ) : (
                            <span className="text-gray-500 italic">
                              Click Edit to set date
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Budget
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={
                            edits.budget !== undefined
                              ? edits.budget
                              : destination.budget || ""
                          }
                          onChange={(e) =>
                            handleSectionFieldChange(
                              index,
                              "budget",
                              e.target.value
                            )
                          }
                          placeholder="$0"
                          className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-gray-900 font-medium">
                          {destination.budget &&
                          destination.budget !== "$0" &&
                          destination.budget !== "0" ? (
                            destination.budget
                          ) : (
                            <span className="text-gray-500 italic">
                              No budget set
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Activities Section */}
                  <div className="p-6 bg-white">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                      Activities ({destination.activities?.length || 0})
                    </h4>

                    {destination.activities &&
                    destination.activities.length > 0 ? (
                      <div className="space-y-3 mb-6">
                        {destination.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="flex items-start justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200 hover:border-red-300 transition-all"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {typeof activity === "string"
                                  ? activity
                                  : activity.name}
                              </p>
                              {typeof activity === "object" && (
                                <div className="flex gap-6 mt-2 text-sm text-gray-700">
                                  {activity.day && (
                                    <span>
                                      <span className="font-medium uppercase tracking-wide">
                                        Day:
                                      </span>{" "}
                                      {activity.day}
                                    </span>
                                  )}
                                  <span>
                                    <span className="font-medium uppercase tracking-wide">
                                      Time:
                                    </span>{" "}
                                    {activity.time}
                                  </span>
                                  <span>
                                    <span className="font-medium uppercase tracking-wide">
                                      Budget:
                                    </span>{" "}
                                    ${activity.budget || "0"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteActivity(index, actIndex)
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-100 font-bold text-xl w-8 h-8 rounded-lg ml-4 flex-shrink-0 flex items-center justify-center transition-all"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mb-6 italic bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        No activities added yet
                      </p>
                    )}

                    {/* Add Activity Form */}
                    <div className="bg-red-50 rounded-lg p-5 border-2 border-red-200">
                      <p className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                        Add New Activity
                      </p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <input
                            type="text"
                            value={newActivityData[index]?.name || ""}
                            onChange={(e) =>
                              setNewActivityData({
                                ...newActivityData,
                                [index]: {
                                  ...(newActivityData[index] || {}),
                                  name: e.target.value,
                                },
                              })
                            }
                            placeholder="Activity name"
                            className="px-4 py-2 text-sm border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                          />
                          <input
                            type="number"
                            value={newActivityData[index]?.day || ""}
                            onChange={(e) =>
                              setNewActivityData({
                                ...newActivityData,
                                [index]: {
                                  ...(newActivityData[index] || {}),
                                  day: e.target.value,
                                },
                              })
                            }
                            placeholder="Day #"
                            min="1"
                            className="px-4 py-2 text-sm border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                          />
                          <input
                            type="time"
                            value={newActivityData[index]?.time || ""}
                            onChange={(e) =>
                              setNewActivityData({
                                ...newActivityData,
                                [index]: {
                                  ...(newActivityData[index] || {}),
                                  time: e.target.value,
                                },
                              })
                            }
                            className="px-4 py-2 text-sm border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                          />
                          <input
                            type="text"
                            value={newActivityData[index]?.budget || ""}
                            onChange={(e) =>
                              setNewActivityData({
                                ...newActivityData,
                                [index]: {
                                  ...(newActivityData[index] || {}),
                                  budget: e.target.value,
                                },
                              })
                            }
                            placeholder="Budget ($)"
                            className="px-4 py-2 text-sm border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                          />
                        </div>
                        <button
                          onClick={() => handleAddActivity(index)}
                          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-semibold uppercase tracking-wide shadow-md hover:shadow-lg"
                        >
                          Add Activity
                        </button>
                        {destination.budget &&
                          parseFloat(
                            destination.budget?.replace(/[^0-9.-]+/g, "")
                          ) > 0 && (
                            <div className="text-xs text-gray-700 bg-white border border-red-200 rounded-lg px-3 py-2">
                              <span className="font-semibold uppercase tracking-wide">
                                Available budget:
                              </span>{" "}
                              $
                              {(
                                (parseFloat(
                                  destination.budget?.replace(/[^0-9.-]+/g, "")
                                ) || 0) -
                                (destination.activities || []).reduce(
                                  (sum, act) =>
                                    sum +
                                    (parseFloat(
                                      (typeof act === "object"
                                        ? act.budget
                                        : "0"
                                      )?.replace(/[^0-9.-]+/g, "")
                                    ) || 0),
                                  0
                                )
                              ).toFixed(2)}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Add Section Button */}
          {!showAddSection ? (
            <button
              onClick={() => setShowAddSection(true)}
              className="w-full py-6 border-2 border-dashed border-red-300 rounded-2xl text-gray-600 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all font-semibold text-lg uppercase tracking-wide"
            >
              + Add Another Section
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-red-300 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                New Section
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Section Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSection.name}
                    onChange={(e) =>
                      setNewSection({ ...newSection, name: e.target.value })
                    }
                    placeholder="e.g., Paris, Tokyo, Beach Resort"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Start Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={newSection.startDate}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          startDate: e.target.value,
                        })
                      }
                      min={
                        trip.startDate
                          ? new Date(trip.startDate).toISOString().split("T")[0]
                          : ""
                      }
                      max={
                        trip.endDate
                          ? new Date(trip.endDate).toISOString().split("T")[0]
                          : ""
                      }
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      End Date <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={newSection.endDate}
                      onChange={(e) =>
                        setNewSection({
                          ...newSection,
                          endDate: e.target.value,
                        })
                      }
                      min={
                        newSection.startDate ||
                        (trip.startDate
                          ? new Date(trip.startDate).toISOString().split("T")[0]
                          : "")
                      }
                      max={
                        trip.endDate
                          ? new Date(trip.endDate).toISOString().split("T")[0]
                          : ""
                      }
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={newSection.budget}
                    onChange={(e) =>
                      setNewSection({ ...newSection, budget: e.target.value })
                    }
                    placeholder="e.g., $1000"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={newSection.description}
                    onChange={(e) =>
                      setNewSection({
                        ...newSection,
                        description: e.target.value,
                      })
                    }
                    placeholder="Add notes about this section..."
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none bg-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddSection}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-all font-semibold uppercase tracking-wide shadow-md hover:shadow-lg"
                  >
                    Add Section
                  </button>
                  <button
                    onClick={() => {
                      setShowAddSection(false);
                      setNewSection({
                        name: "",
                        startDate: "",
                        endDate: "",
                        budget: "",
                        description: "",
                      });
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold uppercase tracking-wide"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TripDetailPage;
