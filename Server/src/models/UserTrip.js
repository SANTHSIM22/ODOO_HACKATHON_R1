const mongoose = require("mongoose");

const userTripSchema = new mongoose.Schema(
  {
    tripName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    coverPhoto: {
      type: String,
      default: "",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    destinations: [
      {
        name: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        budget: {
          type: String,
          default: "",
        },
        activities: [
          {
            name: {
              type: String,
              required: true,
            },
            time: {
              type: String,
              required: true,
            },
            budget: {
              type: String,
              default: "0",
            },
          },
        ],
        notes: {
          type: String,
          default: "",
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "upcoming", "ongoing", "completed"],
      default: "planning",
    },
  },
  {
    timestamps: true,
  }
);

const UserTrip = mongoose.model("UserTrip", userTripSchema);

module.exports = UserTrip;
