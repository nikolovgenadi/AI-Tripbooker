const express = require('express');
const {
  createBooking,
  getMyBookings,
  updateBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// all booking routes require authentication!!
router.use(authenticateToken);

//  /api/bookings (create new booking)
router.post('/', createBooking);

//  /api/bookings/my (get users bookings)
router.get('/my', getMyBookings);

//  /api/bookings/:id (update booking)
router.put('/:id', updateBooking);

//  /api/bookings/:id (delete booking)
router.delete('/:id', cancelBooking);

module.exports = router;
