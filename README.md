# Trello Clone

A full-stack Trello-like application built with React (Vite) for the frontend and Node.js (Express) for the backend. This project allows users to register, log in, and manage boards, lists, and cards in a Kanban-style interface.

## Features

### Frontend (React + Vite)

- User authentication (login & registration)
- Protected routes for authenticated users
- Kanban board UI: create, view, and manage cards
- Card details view
- Error boundary for robust error handling
- Context API for global auth state
- Responsive design

### Backend (Node.js + Express)

- RESTful API for boards, lists, and cards
- User registration and login endpoints
- Data validation and error handling

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Getting Started

### 1. Clone the repository

```powershell
git clone <repo-url>
cd trello
```

### 2. Install dependencies

#### Frontend

```powershell
cd trello_frontend
npm install
```

#### Backend

```powershell
cd ../trello-backend
npm install
```

### 3. Configure environment variables

- Frontend: Edit `trello_frontend/.env.local` as needed (e.g., API base URL)
- Backend: Create a `.env` file in `trello-backend` for secrets (if required)

### 4. Run the applications

#### Backend

```powershell
cd trello-backend
node index.js
```

#### Frontend

Open a new terminal:

```powershell
cd trello_frontend
npm run dev
```

### 5. Access the app

- Frontend: http://localhost:5173 (default Vite port)
- Backend: http://localhost:3000 (default Express port)

## Project Structure

```
trello_frontend/
  src/
    auth/           # Login & Registration components
    components/     # UI components (Board, Card, Header, etc.)
    context/        # Auth context
    layout/         # Root layout
    Routes/         # App routes
  public/           # Static assets
  ...
trello-backend/
  index.js          # Express server
  ...
```

## Deployment

- Both frontend and backend include `vercel.json` for Vercel deployment.

## License

MIT
