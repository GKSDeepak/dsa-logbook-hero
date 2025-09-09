const { initializeCollections, ObjectId, formatSession, formatProblem } = require('./database');

class DataAccess {
  constructor() {
    this.sessionsCollection = null;
    this.problemsCollection = null;
  }

  async initialize() {
    const { sessionsCollection, problemsCollection } = await initializeCollections();
    this.sessionsCollection = sessionsCollection;
    this.problemsCollection = problemsCollection;
  }

  // Sessions operations
  async getAllSessions() {
    try {
      const sessions = await this.sessionsCollection.find({}).toArray();
      // Get problems for each session
      const sessionsWithProblems = await Promise.all(
        sessions.map(async (session) => {
          const problems = await this.problemsCollection
            .find({ sessionId: session.id })
            .toArray();
          return {
            ...formatSession(session),
            problems: problems.map(formatProblem),
          };
        })
      );
      return sessionsWithProblems;
    } catch (error) {
      console.error('Error getting all sessions:', error);
      throw error;
    }
  }

  async createSession(sessionData) {
    try {
      // Handle timestamp - it might be a number or a Date object
      let timestampValue;
      if (typeof sessionData.timestamp === 'number') {
        timestampValue = sessionData.timestamp;
      } else if (sessionData.timestamp instanceof Date) {
        timestampValue = sessionData.timestamp.getTime();
      } else {
        // If it's neither, try to parse it as a number or default to current time
        timestampValue = Number(sessionData.timestamp) || Date.now();
      }
      
      const sessionToInsert = {
        ...sessionData,
        timestamp: timestampValue,
      };
      
      const result = await this.sessionsCollection.insertOne(sessionToInsert);
      
      // Insert problems if provided
      if (sessionData.problems && sessionData.problems.length > 0) {
        const problemsToInsert = sessionData.problems.map(problem => ({
          ...problem,
          solved: problem.solved ? 1 : 0,
          upsolved: problem.upsolved !== undefined ? (problem.upsolved ? 1 : 0) : undefined,
          sessionId: sessionData.id
        }));
        
        await this.problemsCollection.insertMany(problemsToInsert);
      }
      
      return { id: sessionData.id, message: 'Session added successfully' };
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(sessionId, updates) {
    try {
      // Handle timestamp in updates if present
      const updatesToApply = { ...updates };
      if (updatesToApply.timestamp !== undefined) {
        if (typeof updatesToApply.timestamp === 'number') {
          // Already a number, keep as is
        } else if (updatesToApply.timestamp instanceof Date) {
          updatesToApply.timestamp = updatesToApply.timestamp.getTime();
        } else {
          // Try to parse as number or default to current time
          updatesToApply.timestamp = Number(updatesToApply.timestamp) || Date.now();
        }
      }
      
      const result = await this.sessionsCollection.updateOne(
        { id: sessionId },
        { $set: updatesToApply }
      );
      
      return { message: 'Session updated successfully' };
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async deleteSession(sessionId) {
    try {
      // Delete session
      const sessionResult = await this.sessionsCollection.deleteOne({ id: sessionId });
      
      // Also delete associated problems
      await this.problemsCollection.deleteMany({ sessionId: sessionId });
      
      return { message: 'Session deleted successfully' };
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // Problems operations
  async updateProblem(sessionId, problemId, updates) {
    try {
      // Convert boolean values for storage
      const updatesToApply = { ...updates };
      if (updatesToApply.solved !== undefined) {
        updatesToApply.solved = updatesToApply.solved ? 1 : 0;
      }
      if (updatesToApply.upsolved !== undefined) {
        updatesToApply.upsolved = updatesToApply.upsolved ? 1 : 0;
      }
      
      const result = await this.problemsCollection.updateOne(
        { id: problemId, sessionId: sessionId },
        { $set: updatesToApply }
      );
      
      return { message: 'Problem updated successfully' };
    } catch (error) {
      console.error('Error updating problem:', error);
      throw error;
    }
  }

  async createProblem(sessionId, problemData) {
    try {
      const problemToInsert = {
        ...problemData,
        solved: problemData.solved ? 1 : 0,
        upsolved: problemData.upsolved !== undefined ? (problemData.upsolved ? 1 : 0) : undefined,
        sessionId: sessionId
      };
      
      const result = await this.problemsCollection.insertOne(problemToInsert);
      
      return { id: problemData.id, message: 'Problem added successfully' };
    } catch (error) {
      console.error('Error creating problem:', error);
      throw error;
    }
  }

  async deleteProblem(sessionId, problemId) {
    try {
      const result = await this.problemsCollection.deleteOne({
        id: problemId,
        sessionId: sessionId
      });
      
      return { message: 'Problem deleted successfully' };
    } catch (error) {
      console.error('Error deleting problem:', error);
      throw error;
    }
  }
}

module.exports = DataAccess;