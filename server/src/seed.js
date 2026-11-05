import 'dotenv/config';
import { initStore, writeCollection } from './store.js';
import { sampleRooms } from './sampleRooms.js';

await initStore();
await writeCollection('rooms', sampleRooms);
await writeCollection('bookings', []);
console.log(`Reset MongoDB with ${sampleRooms.length} sample rooms and no bookings.`);
process.exit(0);
