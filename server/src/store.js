import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { Room } from './models/Room.js';
import { Booking } from './models/Booking.js';

const models = { rooms: Room, bookings: Booking };
const localFiles = {
  rooms: new URL('../data/rooms.json', import.meta.url),
  bookings: new URL('../data/bookings.json', import.meta.url)
};

async function readLocalCollection(name) {
  try {
    return JSON.parse(await readFile(localFiles[name], 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export async function initStore() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required. Set it in server/.env.');
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DATABASE || 'harborlight',
    serverSelectionTimeoutMS: 15000
  });

  // Import local data only when its corresponding Atlas collection is empty.
  for (const name of Object.keys(models)) {
    const Model = models[name];
    if (await Model.countDocuments() === 0) {
      const localItems = await readLocalCollection(name);
      if (localItems.length) {
        await Model.insertMany(localItems.map(item => {
          const { id, ...data } = item;
          return { ...data, _id: String(data._id ?? id) };
        }));
      }
    }
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
