const express = require('express');
const cors = require('cors');
const DataAccess = require('./dataAccess');
const { connectToDatabase } = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize MongoDB connection and data access
const dataAccess = new DataAccess();

// Initialize database connection
connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB successfully');
    return dataAccess.initialize();
  })
  .then(() => {
    console.log('Data access layer initialized');
  })
  .catch((error) => {
    console.error('Error initializing database:', error);
    process.exit(1);
  });

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('POST /api/auth/login request received. Body:', req.body);
  try {
    const { username, password } = req.body;
    
    // Check credentials against environment variables
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
      console.log('Authentication successful for user:', username);
      res.json({ success: true, message: 'Authentication successful' });
    } else {
      console.log('Authentication failed for user:', username);
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
});

// API Routes

// Get all sessions with their problems
app.get('/api/sessions', async (req, res) => {
  console.log('GET /api/sessions request received.');
  try {
    const sessions = await dataAccess.getAllSessions();
    console.log('Fetched sessions:', sessions.length, 'sessions.');
    res.json(sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  } catch (error) {
    console.error('Error fetching sessions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add a new session
app.post('/api/sessions', async (req, res) => {
  console.log('POST /api/sessions request received. Body:', req.body);
  try {
    const sessionData = req.body;
    const result = await dataAccess.createSession(sessionData);
    console.log('Session added successfully:', result.id);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update a session
app.put('/api/sessions/:id', async (req, res) => {
  console.log('PUT /api/sessions/:id request received. Params:', req.params, 'Body:', req.body);
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await dataAccess.updateSession(id, updates);
    console.log('Session updated successfully:', id);
    res.json(result);
  } catch (error) {
    console.error('Error updating session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a session
app.delete('/api/sessions/:id', async (req, res) => {
  console.log('DELETE /api/sessions/:id request received. Params:', req.params);
  try {
    const { id } = req.params;
    const result = await dataAccess.deleteSession(id);
    console.log('Session deleted successfully:', id);
    res.json(result);
  } catch (error) {
    console.error('Error deleting session:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update a problem within a session
app.put('/api/sessions/:sessionId/problems/:problemId', async (req, res) => {
  console.log('PUT /api/sessions/:sessionId/problems/:problemId request received. Params:', req.params, 'Body:', req.body);
  try {
    const { sessionId, problemId } = req.params;
    const updates = req.body;
    const result = await dataAccess.updateProblem(sessionId, problemId, updates);
    console.log('Problem updated successfully:', problemId);
    res.json(result);
  } catch (error) {
    console.error('Error updating problem:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Add a problem to a session
app.post('/api/sessions/:sessionId/problems', async (req, res) => {
  console.log('POST /api/sessions/:sessionId/problems request received. Params:', req.params, 'Body:', req.body);
  try {
    const { sessionId } = req.params;
    const problemData = req.body;
    const result = await dataAccess.createProblem(sessionId, problemData);
    console.log('Problem added successfully:', result.id);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding problem:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete a problem from a session
app.delete('/api/sessions/:sessionId/problems/:problemId', async (req, res) => {
  console.log('DELETE /api/sessions/:sessionId/problems/:problemId request received. Params:', req.params);
  try {
    const { sessionId, problemId } = req.params;
    const result = await dataAccess.deleteProblem(sessionId, problemId);
    console.log('Problem deleted successfully:', problemId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting problem:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
