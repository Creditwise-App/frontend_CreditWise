const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creditwise';

console.log('Testing MongoDB connection...');
console.log('Using URI:', MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//****:****@')); // Hide credentials

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB');
  return mongoose.connection.db.admin().listDatabases();
})
.then((dbs) => {
  console.log('Available databases:', dbs.databases.map(db => db.name));
  console.log('✅ Database connection test completed successfully');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});