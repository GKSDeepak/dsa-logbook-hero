# DSA Logbook Hero

A personal DSA practice tracker application with authentication and MongoDB backend.

## Features

- Track coding practice sessions (contests and individual problems)
- Record problem-solving progress with tags and notes
- Visualize progress with statistics and completion tracking
- Secure login for personal use

## Deployment Instructions

### Prerequisites

1. Node.js and npm installed
2. MongoDB database (local or cloud)
3. GitHub account

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   USERNAME=your_username
   PASSWORD=your_password
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Deployment to GitHub Pages

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Configuration

1. Update the `base` path in `vite.config.ts` to match your GitHub repository name:
   ```javascript
   base: "/your-repo-name/",
   ```

2. Make sure your GitHub repository settings have GitHub Pages enabled with the `gh-pages` branch.

## Development

### Running the Backend

```bash
cd server
npm start
```

### Running the Frontend

```bash
npm run dev
```

## Environment Variables

### Backend (.env in server directory)
- `MONGODB_URI`: MongoDB connection string
- `USERNAME`: Admin username for login
- `PASSWORD`: Admin password for login

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create a new session
- `PUT /api/sessions/:id` - Update a session
- `DELETE /api/sessions/:id` - Delete a session
- `PUT /api/sessions/:sessionId/problems/:problemId` - Update a problem
- `POST /api/sessions/:sessionId/problems` - Add a problem to a session
- `DELETE /api/sessions/:sessionId/problems/:problemId` - Delete a problem from a session