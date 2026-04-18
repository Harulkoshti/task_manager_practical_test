# Task Manager Application

This is a full-stack Task Manager application built as a practical test. It uses React for the frontend and Node.js with Express for the backend. The application manages tasks completely in-memory, without relying on an external database, and includes an efficient custom caching mechanism on the server.

## Features

- **Frontend (React + Vite)**:
  - State management powered by Redux Toolkit.
  - Responsive user interface.
  - Create new tasks, update their status (pending/completed), and delete tasks.
  - Filter tasks by their current status.
  - Fast development server with Vite.

- **Backend (Node.js + Express)**:
  - RESTful API endpoints for full CRUD operations.
  - In-memory array storage for tasks.
  - Custom in-memory caching middleware to optimize `GET /tasks` performance (60 seconds TTL).
  - Cache invalidation on data mutation (`POST`, `PUT`, `DELETE`).
  - Cross-Origin Resource Sharing (CORS) enabled.

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Node.js Express backend API

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Getting Started

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
```

Start the backend server:

```bash
node index.js
```
The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

## API Endpoints

The backend API runs at `http://localhost:5000` and provides the following endpoints:

- `GET /tasks` - Retrieve all tasks (uses a 60-second in-memory cache)
- `POST /tasks` - Create a new task. Requires JSON body: `{ "name": "Task name" }`
- `PUT /tasks/:id` - Toggle the status of a specific task (pending <-> completed)
- `DELETE /tasks/:id` - Delete a specific task

## Tech Stack

- **Frontend**: React 18, React DOM, Redux Toolkit, React-Redux, Vite
- **Backend**: Node.js, Express 5, CORS