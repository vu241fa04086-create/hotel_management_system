import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  _id: { type: String },
  guestName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  room: { type: String, required: true, index: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false, timestamps: false });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
