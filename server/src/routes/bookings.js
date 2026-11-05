import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { randomUUID } from 'node:crypto';
import { readCollection, writeCollection } from '../store.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = Router();
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  next();
};

function parseDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

router.post('/', [
  body('guestName').trim().notEmpty().withMessage('Enter your name'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('phone').trim().notEmpty().withMessage('Enter your phone number'),
  body('guests').isInt({ min: 1 }).withMessage('Guest count must be at least one')
], validate, async (req, res) => {
  const { guestName, email, phone, room: roomId, checkIn, checkOut, guests } = req.body;
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!roomId || !start || !end || start < today || start >= end) {
    return res.status(400).json({ message: 'Choose valid future stay dates' });
  }

  const [rooms, bookings] = await Promise.all([
    readCollection('rooms'),
    readCollection('bookings')
  ]);
  const room = rooms.find(item => item.id === roomId && item.active);
  if (!room || Number(guests) > room.capacity) {
    return res.status(400).json({ message: 'Room is unavailable for that party size' });
  }

  const conflict = bookings.some(booking => booking.room === roomId && booking.status !== 'cancelled'
    && new Date(booking.checkIn) < end && new Date(booking.checkOut) > start);
  if (conflict) {
    return res.status(409).json({ message: 'This room was just booked for those dates. Please choose another.' });
  }

  const nights = Math.round((end - start) / 86400000);
  const id = randomUUID();
  const booking = {
    id,
    _id: id,
    guestName,
    email: email.toLowerCase(),
    phone,
    room: roomId,
    checkIn: start.toISOString(),
    checkOut: end.toISOString(),
    guests: Number(guests),
    total: nights * room.pricePerNight,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  await writeCollection('bookings', bookings);
  res.status(201).json({ message: 'Reservation request received', booking });
});

router.get('/', adminOnly, async (req, res) => {
  const [bookings, rooms] = await Promise.all([
    readCollection('bookings'),
    readCollection('rooms')
  ]);
  res.json(bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(booking => ({ ...booking, room: rooms.find(item => item.id === booking.room) || null })));
});

router.patch('/:id/status', adminOnly, async (req, res) => {
  if (!['pending', 'confirmed', 'cancelled'].includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid booking status' });
  }
  const bookings = await readCollection('bookings');
  const index = bookings.findIndex(booking => booking.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: 'Booking not found' });
  bookings[index].status = req.body.status;
  await writeCollection('bookings', bookings);
  const rooms = await readCollection('rooms');
  res.json({ ...bookings[index], room: rooms.find(item => item.id === bookings[index].room) || null });
});

router.delete('/:id', adminOnly, async (req, res) => {
  const bookings = await readCollection('bookings');
  const remaining = bookings.filter(booking => booking.id !== req.params.id);
  if (remaining.length === bookings.length) return res.status(404).json({ message: 'Booking not found' });
  await writeCollection('bookings', remaining);
  res.json({ message: 'Booking deleted' });
});

export default router;
