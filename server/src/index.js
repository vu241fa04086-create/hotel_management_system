import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import roomRoutes from './routes/rooms.js';
import bookingRoutes from './routes/bookings.js';
import authRoutes from './routes/auth.js';
import {initStore} from './store.js';
const app=express();
const allowedOrigins = new Set([
  ...(process.env.CLIENT_ORIGIN || '').split(',').map(origin => origin.trim()).filter(Boolean),
  'https://hotel-management-system-1-ve2i.onrender.com',
]);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json({limit:'1mb'}));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:250,standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({status:'ok',storage:'mongodb',database:'connected'}));
app.use('/api/auth',authRoutes);
app.use('/api/rooms',roomRoutes);
app.use('/api/bookings',bookingRoutes);
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:'Server error. Please try again.'})});
const port=process.env.PORT||5000;
initStore().then(()=>app.listen(port,()=>console.log(`Harborlight API connected to MongoDB and listening on ${port}`))).catch(err=>{console.error('Could not connect to MongoDB:',err.message);process.exit(1)});
