require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URI
// For local development, you can use MongoDB Compass or install MongoDB locally
// For cloud MongoDB, you would use your MongoDB Atlas URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Database name
const dbName = 'dsa_logbook';

let client;
let db;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

async function initializeCollections() {
  try {
    const database = await connectToDatabase();
    
    // Create sessions collection if it doesn't exist
    const sessionsCollection = database.collection('sessions');
    // Create problems collection if it doesn't exist
    const problemsCollection = database.collection('problems');
    
    // Create indexes for better query performance
    await sessionsCollection.createIndex({ id: 1 });
    await problemsCollection.createIndex({ id: 1 });
    await problemsCollection.createIndex({ sessionId: 1 });
    
    console.log('Collections and indexes initialized');
    return { sessionsCollection, problemsCollection };
  } catch (error) {
    console.error('Error initializing collections:', error);
    throw error;
  }
}

// Helper function to convert MongoDB documents to the format expected by the client
function formatSession(session) {
  if (!session) return null;
  
  // Convert timestamp (number) to Date object
  return {
    ...session,
    timestamp: new Date(session.timestamp),
  };
}

// Helper function to convert MongoDB documents to the format expected by the client
function formatProblem(problem) {
  if (!problem) return null;
  
  // Convert boolean values
  return {
    ...problem,
    solved: Boolean(problem.solved),
    upsolved: problem.upsolved !== undefined ? Boolean(problem.upsolved) : undefined,
  };
}

function closeConnection() {
  if (client) {
    client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  connectToDatabase,
  initializeCollections,
  closeConnection,
  ObjectId,
  formatSession,
  formatProblem
};