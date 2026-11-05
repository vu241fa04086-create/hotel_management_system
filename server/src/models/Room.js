import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  pricePerNight: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  amenities: { type: [String], default: [] },
  active: { type: Boolean, default: true }
}, { versionKey: false, timestamps: true });

export const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
