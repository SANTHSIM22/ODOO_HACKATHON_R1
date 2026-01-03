const Trip = require("../models/Trip");

// Get all active trips
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching trips",
    });
  }
};

// Get recommended trips
const getRecommendedTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      isActive: true,
      category: "recommended",
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("-__v");

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    console.error("Get recommended trips error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recommended trips",
    });
  }
};

// Create a new trip (Admin only)
const createTrip = async (req, res) => {
  try {
    const {
      destination,
      country,
      continent,
      description,
      startDate,
      endDate,
      budget,
      image,
      imageUrl,
      category,
      activities,
      specialOffer,
      recommendedByTravelers,
    } = req.body;

    // Validate required fields
    if (!destination || !description || !startDate || !endDate || !budget) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const trip = new Trip({
      destination,
      country: country || "",
      continent: continent || "Asia",
      description,
      startDate,
      endDate,
      budget,
      image: image || "🌍",
      imageUrl: imageUrl || "",
      category: category || "recommended",
      activities: activities || [],
      specialOffer: specialOffer || false,
      recommendedByTravelers: recommendedByTravelers || false,
      createdBy: req.user?._id, // If you implement authentication
    });

    await trip.save();

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    console.error("Create trip error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating trip",
    });
  }
};

// Update a trip (Admin only)
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Updating trip with ID:", id);
    console.log("Update payload:", updates);

    // Validate dates if provided
    if (updates.startDate && updates.endDate) {
      if (new Date(updates.startDate) >= new Date(updates.endDate)) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }
    }

    // Ensure all fields including new ones are properly set
    const updateData = {
      ...updates,
      continent: updates.continent || "Asia",
    };

    const trip = await Trip.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: false, // Disable validators to allow updates on old documents
      strict: false, // Allow fields not in schema (though all our fields are in schema)
    });

    console.log("Updated trip:", trip);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      message: "Trip updated successfully",
      trip,
    });
  } catch (error) {
    console.error("Update trip error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating trip",
    });
  }
};

// Delete a trip (Admin only)
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByIdAndDelete(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting trip",
    });
  }
};

// Toggle trip active status
const toggleTripStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    trip.isActive = !trip.isActive;
    await trip.save();

    res.json({
      success: true,
      message: `Trip ${
        trip.isActive ? "activated" : "deactivated"
      } successfully`,
      trip,
    });
  } catch (error) {
    console.error("Toggle trip status error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling trip status",
    });
  }
};

module.exports = {
  getAllTrips,
  getRecommendedTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  toggleTripStatus,
};
