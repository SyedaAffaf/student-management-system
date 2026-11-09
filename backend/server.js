require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

async function start() {
  let uri = process.env.MONGO_URI;

  // Free option: start a MongoDB inside the project (no install needed)
  if (process.env.USE_MEMORY_DB === 'true') {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const fs = require('fs');
    fs.mkdirSync('./data', { recursive: true });
    const mem = await MongoMemoryServer.create({
      instance: { dbPath: './data', storageEngine: 'wiredTiger' },
    });
    uri = mem.getUri('student_system');
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on port ' + (process.env.PORT || 5000))
    );
  } catch (e) {
    console.error('DB connection failed:', e.message);
  }
}

start();
