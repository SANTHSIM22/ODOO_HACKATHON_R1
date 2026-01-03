const express = require('express');
const router = express.Router();
const {
    getUserTrips,
    createUserTrip,
    updateUserTrip,
    deleteUserTrip,
    addDestination
} = require('../controllers/userTripController');

// User trip routes
router.get('/user-trips/:userId', getUserTrips);
router.post('/user-trips', createUserTrip);
router.put('/user-trips/:id', updateUserTrip);
router.delete('/user-trips/:id', deleteUserTrip);
router.post('/user-trips/:id/destinations', addDestination);

module.exports = router;
