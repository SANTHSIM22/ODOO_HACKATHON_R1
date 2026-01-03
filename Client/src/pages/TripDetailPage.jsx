import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function TripDetailPage() {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [user, setUser] = useState(null);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list"); // list or calendar
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
  const [newActivity, setNewActivity] = useState({});
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

    console.log("Updating section:", updatedDestinations[index]); // Debug log

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
      console.log("Update response:", data); // Debug log

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

    if (currentActivityTotal + newActivityBudget > destinationBudget) {
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
        setNewActivity({ ...newActivity, [index]: "" });
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading trip details...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-600 mb-4">Trip not found</div>
          <button
            onClick={() => navigate("/my-trips")}
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/my-trips")}
                className="text-slate-600 hover:text-slate-800"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {trip.tripName}
                </h1>
                <p className="text-xs text-slate-500">
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "calendar" : "list")
                }
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-semibold"
              >
                {viewMode === "list" ? "📅 Calendar" : "📋 List"} View
              </button>
              <button
                onClick={() => navigate(`/trip/${tripId}/itinerary`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-semibold text-sm shadow-lg shadow-indigo-500/30"
              >
                View Itinerary
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Build Itinerary
          </h2>
          <p className="text-slate-600 mb-4">{trip.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Duration</div>
              <div className="text-lg font-bold text-slate-800">
                {Math.ceil(
                  (new Date(trip.endDate) - new Date(trip.startDate)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Destinations</div>
              <div className="text-lg font-bold text-slate-800">
                {trip.destinations?.length || 0}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Activities</div>
              <div className="text-lg font-bold text-slate-800">
                {trip.destinations?.reduce(
                  (sum, dest) => sum + (dest.activities?.length || 0),
                  0
                ) || 0}
              </div>
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
                  className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
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
                          className="text-xl font-bold text-slate-800 w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <h3 className="text-xl font-bold text-slate-800">
                          Section {index + 1}: {destination.name}
                        </h3>
                      )}
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
                          className="text-sm text-slate-600 mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows="2"
                        />
                      ) : (
                        <p className="text-sm text-slate-600 mt-1">
                          {destination.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdateSection(index)}
                            className="text-green-600 hover:text-green-700 text-sm font-semibold px-3 py-1 border border-green-600 rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingSection(null);
                              setSectionEdits({});
                            }}
                            className="text-slate-600 hover:text-slate-700 text-sm font-semibold px-3 py-1 border border-slate-300 rounded-lg"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingSection(index)}
                            className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold px-3 py-1 border border-indigo-600 rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSection(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold px-3 py-1 border border-red-600 rounded-lg"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">
                          {destination.startDate
                            ? new Date(
                                destination.startDate
                              ).toLocaleDateString()
                            : "Not set"}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">
                          {destination.endDate
                            ? new Date(destination.endDate).toLocaleDateString()
                            : "Not set"}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-700">
                          {destination.budget || "$0"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm font-semibold text-slate-700 mb-3">
                      Activities ({destination.activities?.length || 0})
                    </div>
                    {destination.activities &&
                    destination.activities.length > 0 ? (
                      <ul className="space-y-2 mb-3">
                        {destination.activities.map((activity, actIndex) => (
                          <li
                            key={actIndex}
                            className="flex items-center justify-between text-sm bg-white rounded px-3 py-2 border border-slate-200"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-slate-700">
                                •{" "}
                                {typeof activity === "string"
                                  ? activity
                                  : activity.name}
                              </div>
                              {typeof activity === "object" && (
                                <div className="text-xs text-slate-500 mt-1 flex gap-3">
                                  <span>🕐 {activity.time}</span>
                                  <span>💰 ${activity.budget || "0"}</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteActivity(index, actIndex)
                              }
                              className="text-red-500 hover:text-red-700 text-xs font-semibold ml-2"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 mb-3">
                        No activities added yet
                      </p>
                    )}

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        onClick={() => handleAddActivity(index)}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
                      >
                        Add Activity
                      </button>
                      {destination.budget && (
                        <div className="text-xs text-slate-500">
                          Available budget: $
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
              );
            })}

          {/* Add Section Button */}
          {!showAddSection ? (
            <button
              onClick={() => setShowAddSection(true)}
              className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition font-semibold"
            >
              + Add another Section
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-300 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                New Section
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Section Name *
                  </label>
                  <input
                    type="text"
                    value={newSection.name}
                    onChange={(e) =>
                      setNewSection({ ...newSection, name: e.target.value })
                    }
                    placeholder="e.g., Paris, Tokyo, Beach Resort"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Start Date *
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      End Date *
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={newSection.budget}
                    onChange={(e) =>
                      setNewSection({ ...newSection, budget: e.target.value })
                    }
                    placeholder="e.g., $1000"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                    placeholder="This can be anything like travel section, hotel or any other activity"
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddSection}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
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
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-semibold"
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
