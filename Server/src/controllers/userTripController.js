const UserTrip = require('../models/UserTrip');

// Get all trips for a user
const getUserTrips = async (req, res) => {
    try {
        const { userId } = req.params;

        const trips = await UserTrip.find({ userId })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json({
            success: true,
            trips,
            count: trips.length
        });
    } catch (error) {
        console.error('Get user trips error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trips'
        });
    }
};

// Get single trip by ID
const getTripById = async (req, res) => {
    try {
        const { id } = req.params;

        const trip = await UserTrip.findById(id).select('-__v');

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            trip
        });
    } catch (error) {
        console.error('Get trip by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching trip'
        });
    }
};

// Create a new user trip
const createUserTrip = async (req, res) => {
    try {
        const { tripName, description, startDate, endDate, coverPhoto, userId } = req.body;

        // Validate required fields
        if (!tripName || !description || !startDate || !endDate || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        const trip = new UserTrip({
            tripName,
            description,
            startDate,
            endDate,
            coverPhoto: coverPhoto || '',
            userId,
            destinations: []
        });

        await trip.save();

        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            trip
        });
    } catch (error) {
        console.error('Create user trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating trip'
        });
    }
};

// Update a user trip
const updateUserTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate dates if provided
        if (updates.startDate && updates.endDate) {
            if (new Date(updates.startDate) >= new Date(updates.endDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }

        const trip = await UserTrip.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip updated successfully',
            trip
        });
    } catch (error) {
        console.error('Update user trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating trip'
        });
    }
};

// Delete a user trip
const deleteUserTrip = async (req, res) => {
    try {
        const { id } = req.params;

        const trip = await UserTrip.findByIdAndDelete(id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        res.json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        console.error('Delete user trip error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting trip'
        });
    }
};

// Add destination to trip
const addDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, activities, notes } = req.body;

        const trip = await UserTrip.findById(id);

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found'
            });
        }

        trip.destinations.push({ name, activities: activities || [], notes: notes || '' });
        await trip.save();

        res.json({
            success: true,
            message: 'Destination added successfully',
            trip
        });
    } catch (error) {
        console.error('Add destination error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding destination'
        });
    }
};

module.exports = {
    getUserTrips,
    getTripById,
    createUserTrip,
    updateUserTrip,
    deleteUserTrip,
    addDestination
};
