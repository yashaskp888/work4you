import './config/env.js';
import mongoose from 'mongoose';
import { getMongoUri } from './config/env.js';

const uri = getMongoUri();
if (!uri) process.exit(1);

console.log('Connecting to MongoDB Atlas...');

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log('✅ Connected successfully to:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed:', err.message);
    if (err.message.includes('bad auth')) {
      console.error('\n→ Fix: Atlas → Database Access → edit user → reset password');
      console.error('→ Update MONGODB_URI in server/.env with the new password');
    }
    if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.error('\n→ Fix: Atlas → Network Access → Add IP Address → Allow from anywhere (dev)');
    }
    process.exit(1);
  });
