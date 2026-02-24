# Todo List App

## Overview
A full-stack todo list application for creating, editing, completing, and deleting tasks.

## Architecture
- **Backend**: Python, FastAPI, Uvicorn (port 8000)
- **Frontend**: React, Vite (port 5000, proxies /api to backend)
- **Database**: PostgreSQL via SQLAlchemy ORM

## Project Structure
```
backend/
  __init__.py
  main.py        - FastAPI app, CRUD endpoints
  models.py      - SQLAlchemy Todo model
  schemas.py     - Pydantic request/response schemas
  database.py    - DB engine and session setup
frontend/
  src/
    App.jsx      - Main React component
    App.css      - Styles
  vite.config.js - Vite config with proxy to backend
```

## API Endpoints
- GET /api/todos - List all todos
- POST /api/todos - Create a todo
- PUT /api/todos/:id - Update a todo
- DELETE /api/todos/:id - Delete a todo

## Running
The workflow starts both backend (uvicorn on port 8000) and frontend (vite on port 5000).
