import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    if (error.message.includes('ECONNREFUSED') && error.message.includes('27017')) {
      console.error(
        '   Tip: The app tried localhost — check that MONGODB_URI is set in server/.env'
      );
    }
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('   Tip: Wrong username or password in MONGODB_URI');
    }
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error(
        '   Tip: In Atlas → Network Access, add your IP or allow 0.0.0.0/0 for development'
      );
    }

    process.exit(1);
  }
}
