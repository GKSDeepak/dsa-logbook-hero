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

2. Build and deploy the project:
   ```bash
   npm run deploy
   ```

### Configuration

1. Make sure your GitHub repository name matches the base path in the `.env.production` file:
   ```env
   VITE_BASE_PATH=/your-repo-name/
   ```

2. For the deployed version to work, you need to:
   - Deploy your backend to a cloud service (like Render, Heroku, or Vercel)
   - Update `VITE_API_BASE_URL` in `.env.production` with your backend URL
   - Example: `VITE_API_BASE_URL=https://your-backend-url.com`

3. Make sure your GitHub repository settings have GitHub Pages enabled with the `gh-pages` branch.

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

### Frontend
- `.env.development`: Base path for development (`VITE_BASE_PATH=/`) and API URL (`VITE_API_BASE_URL=http://localhost:3001`)
- `.env.production`: Base path for production (`VITE_BASE_PATH=/your-repo-name/`) and API URL (`VITE_API_BASE_URL=https://your-backend-url.com`)

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create a new session
- `PUT /api/sessions/:id` - Update a session
- `DELETE /api/sessions/:id` - Delete a session
- `PUT /api/sessions/:sessionId/problems/:problemId` - Update a problem
- `POST /api/sessions/:sessionId/problems` - Add a problem to a session
- `DELETE /api/sessions/:sessionId/problems/:problemId` - Delete a problem from a session

## Troubleshooting

### GitHub Pages Shows Blank Page

1. Make sure you're using `HashRouter` instead of `BrowserRouter` in your React app
2. Verify that the `VITE_BASE_PATH` in `.env.production` matches your GitHub repository name
3. Check that GitHub Pages is enabled in your repository settings
4. Make sure the `gh-pages` branch has been created and contains the built files

### Login Issues

1. Verify that the backend server is running and accessible from the internet (not just localhost)
2. Check that the MongoDB connection string is correct
3. Verify that the username and password in the server's `.env` file are correct
4. Ensure `VITE_API_BASE_URL` in `.env.production` points to your deployed backend URL
5. Check browser console for CORS errors, which may require updating the backend CORS configuration