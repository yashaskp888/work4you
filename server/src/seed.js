import './config/env.js';
import { connectDB } from './config/db.js';
import { getMongoUri } from './config/env.js';
import { seedDatabase } from './services/seedDatabase.js';

async function seed() {
  const mongoUri = getMongoUri();
  if (!mongoUri) process.exit(1);

  await connectDB(mongoUri);
  await seedDatabase();
  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
