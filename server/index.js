const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./dsa_logbook.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      contestLink TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      name TEXT NOT NULL,
      link TEXT,
      solved INTEGER NOT NULL,
      upsolved INTEGER,
      tag TEXT NOT NULL,
      review TEXT,
      notes TEXT,
      FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE
    )`);
  }
});

// API Routes

// Get all sessions with their problems
app.get('/api/sessions', (req, res) => {
  console.log('GET /api/sessions request received.');
  db.all('SELECT * FROM sessions', [], (err, sessions) => {
    if (err) {
      console.error('Error fetching sessions:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Fetched sessions:', sessions.length, 'sessions.');
    const sessionsWithProblems = [];
    let completedQueries = 0;

    if (sessions.length === 0) {
      console.log('No sessions found. Returning empty array.');
      res.json([]);
      return;
    }

    sessions.forEach((session, index) => {
      db.all('SELECT * FROM problems WHERE sessionId = ?', [session.id], (err, problems) => {
        if (err) {
          console.error(`Error fetching problems for session ${session.id}:`, err.message);
          res.status(500).json({ error: err.message });
          return;
        }
        console.log(`Fetched ${problems.length} problems for session ${session.id}.`);
        sessionsWithProblems[index] = { ...session, problems: problems.map(p => ({ ...p, solved: Boolean(p.solved), upsolved: Boolean(p.upsolved) })) };
        completedQueries++;
        if (completedQueries === sessions.length) {
          console.log('All sessions and problems fetched. Sending response.');
          res.json(sessionsWithProblems.sort((a, b) => b.timestamp - a.timestamp));
        }
      });
    });
  });
});

// Add a new session
app.post('/api/sessions', (req, res) => {
  console.log('POST /api/sessions request received. Body:', req.body);
  const { id, type, timestamp, contestLink, problems } = req.body;
  db.run('INSERT INTO sessions (id, type, timestamp, contestLink) VALUES (?, ?, ?, ?)',
    [id, type, timestamp, contestLink],
    function (err) {
      if (err) {
        console.error('Error inserting session:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log('Session inserted. Last ID:', this.lastID, 'Changes:', this.changes);
      problems.forEach(problem => {
        db.run('INSERT INTO problems (id, sessionId, name, link, solved, upsolved, tag, review, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [problem.id, id, problem.name, problem.link, problem.solved ? 1 : 0, problem.upsolved ? 1 : 0, problem.tag, problem.review, problem.notes],
          function (err) {
            if (err) {
              console.error('Error inserting problem:', err.message);
            } else {
              console.log('Problem inserted. Last ID:', this.lastID, 'Changes:', this.changes);
            }
          }
        );
      });
      res.status(201).json({ id, message: 'Session added successfully' });
    }
  );
});

// Update a session
app.put('/api/sessions/:id', (req, res) => {
  console.log('PUT /api/sessions/:id request received. Params:', req.params, 'Body:', req.body);
  const { id } = req.params;
  const updates = req.body;
  const fields = [];
  const values = [];

  for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      let value = updates[key];
      if (key === 'timestamp') {
        value = value; // timestamp is already a number
      }
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    console.warn('No fields to update for session.');
    res.status(400).json({ message: 'No fields to update' });
    return;
  }

  const query = `UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);
  console.log('Executing session update query:', query, 'with values:', values);

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error updating session:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Session updated. Changes:', this.changes);
    res.json({ message: 'Session updated successfully' });
  });
});

// Delete a session
app.delete('/api/sessions/:id', (req, res) => {
  console.log('DELETE /api/sessions/:id request received. Params:', req.params);
  const { id } = req.params;
  db.run('DELETE FROM sessions WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting session:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Session deleted. Changes:', this.changes);
    res.json({ message: 'Session deleted successfully' });
  });
});

// Update a problem within a session
app.put('/api/sessions/:sessionId/problems/:problemId', (req, res) => {
  console.log('PUT /api/sessions/:sessionId/problems/:problemId request received. Params:', req.params, 'Body:', req.body);
  const { sessionId, problemId } = req.params;
  const updates = req.body;
  const fields = [];
  const values = [];

  for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      let value = updates[key];
      if (key === 'solved' || key === 'upsolved') {
        value = value ? 1 : 0;
      }
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    console.warn('No fields to update for problem.');
    res.status(400).json({ message: 'No fields to update' });
    return;
  }

  const query = `UPDATE problems SET ${fields.join(', ')} WHERE id = ? AND sessionId = ?`;
  values.push(problemId, sessionId);
  console.log('Executing problem update query:', query, 'with values:', values);

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error updating problem:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Problem updated. Changes:', this.changes);
    res.json({ message: 'Problem updated successfully' });
  });
});

// Add a problem to a session
app.post('/api/sessions/:sessionId/problems', (req, res) => {
  console.log('POST /api/sessions/:sessionId/problems request received. Params:', req.params, 'Body:', req.body);
  const { sessionId } = req.params;
  const { id, name, link, solved, upsolved, tag, review, notes } = req.body;
  db.run('INSERT INTO problems (id, sessionId, name, link, solved, upsolved, tag, review, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, sessionId, name, link, solved ? 1 : 0, upsolved ? 1 : 0, tag, review, notes],
    function (err) {
      if (err) {
        console.error('Error inserting problem:', err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      console.log('Problem inserted. Last ID:', this.lastID, 'Changes:', this.changes);
      res.status(201).json({ id, message: 'Problem added successfully' });
    }
  );
});

// Delete a problem from a session
app.delete('/api/sessions/:sessionId/problems/:problemId', (req, res) => {
  console.log('DELETE /api/sessions/:sessionId/problems/:problemId request received. Params:', req.params);
  const { sessionId, problemId } = req.params;
  db.run('DELETE FROM problems WHERE id = ? AND sessionId = ?', [problemId, sessionId], function (err) {
    if (err) {
      console.error('Error deleting problem:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Problem deleted. Changes:', this.changes);
    res.json({ message: 'Problem deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
