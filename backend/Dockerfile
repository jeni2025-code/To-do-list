# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies if needed (for potential database drivers)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
# This file was copied from the root to the backend directory previously
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the /app/backend directory
# This maintains the package structure so "import backend.xxx" works
COPY . /app/backend/

# Set environment variables
# PYTHONPATH ensures the 'backend' folder is treated as a package
ENV PYTHONPATH=/app
# Default DATABASE_URL for SQLite, can be overridden by docker-compose or environment
ENV DATABASE_URL=sqlite:///./sql_app.db

# Expose port 8000 for the FastAPI application
EXPOSE 8000

# Run uvicorn
# We run from /app so that 'backend' is the top-level package
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
