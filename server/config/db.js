const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
require('dotenv').config();

// MySQL connection pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'college_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// MongoDB connection function
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_db';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully.');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
  }
};

module.exports = {
  mysqlPool,
  connectMongoDB
};
