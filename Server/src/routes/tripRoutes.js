const express = require('express');
const router = express.Router();
const {
    getAllTrips,
    getRecommendedTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    toggleTripStatus
} = require('../controllers/tripController');

// Public routes
router.get('/trips', getAllTrips);
router.get('/trips/recommended', getRecommendedTrips);

// Admin routes (add authentication middleware later)
router.post('/trips', createTrip);
router.put('/trips/:id', updateTrip);
router.delete('/trips/:id', deleteTrip);
router.patch('/trips/:id/toggle', toggleTripStatus);

module.exports = router;
