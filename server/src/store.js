import mongoose from 'mongoose';
import { Room } from './models/Room.js';
import { Booking } from './models/Booking.js';
import { sampleRooms } from './sampleRooms.js';

const models = { rooms: Room, bookings: Booking };

export async function initStore() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required. Set it in server/.env.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  // Import the bundled demo inventory once, only when the database is empty.
  if (await Room.countDocuments() === 0) {
    await Room.insertMany(sampleRooms.map(({ id, ...room }) => ({ _id: id, ...room })));
  }
}

export async function readCollection(name) {
  const Model = models[name];
  if (!Model) throw new Error(`Unknown collection: ${name}`);
  return (await Model.find().lean()).map(({ _id, ...item }) => ({ ...item, id: _id, _id }));
}

export async function writeCollection(name, items) {
  const Model = models[name];
  if (!Model) throw new Error(`Unknown collection: ${name}`);
  const ids = items.map(item => String(item._id ?? item.id));
  await Model.deleteMany(ids.length ? { _id: { $nin: ids } } : {});
  await Promise.all(items.map(item => {
    const { id, ...data } = item;
    const _id = String(data._id ?? id);
    delete data._id;
    return Model.replaceOne({ _id }, { ...data, _id }, { upsert: true, runValidators: true });
  }));
}
