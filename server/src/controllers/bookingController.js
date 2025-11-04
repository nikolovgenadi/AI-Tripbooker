const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// create a new booking
const createBooking = async (req, res) => {
  try {
    const { packageId, packageTitle, packagePrice, duration, travelDate } =
      req.body;
    const userId = req.user.id;

    // check required fields
    if (!packageId || !packageTitle || !packagePrice || !duration) {
      return res.status(400).json({
        error: 'need package id, title, price and duration',
      });
    }

    // create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        packageId,
        packageTitle,
        packagePrice,
        duration,
        totalPrice: packagePrice,
        travelDate: travelDate ? new Date(travelDate) : null,
        status: 'confirmed',
      },
    });

    res.status(201).json({
      message: 'booking created',
      booking,
    });
  } catch (error) {
    console.error('couldnt create booking:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
};

// get users bookings
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      message: 'bookings retrieved',
      bookings,
    });
  } catch (error) {
    console.error('bookings error:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
};

// update booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { travelDate, status } = req.body;

    // check if booking exists and matches user id
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        error: 'booking not found or user is mismatch',
      });
    }

    // update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        ...(travelDate && { travelDate: new Date(travelDate) }),
        ...(status && { status }),
      },
    });

    res.json({
      message: 'booking updated',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('update booking error:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
};

// cancel/delete a booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // check if booking exists and matches user id
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        error: 'booking not found or not yours',
      });
    }

    // delete booking
    await prisma.booking.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: 'booking cancelled',
    });
  } catch (error) {
    console.error('cancel booking error:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBooking,
  cancelBooking,
};
