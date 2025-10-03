# Quick Start Guide

## Installation Commands

Copy and run these commands in your terminal:

### 1. Install Dependencies
```bash
cd nestjs-crud-api
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

### 3. Configure Database
Edit the `.env` file with your PostgreSQL credentials:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=crud_api_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Create Database
```bash
# Connect to PostgreSQL and create database
createdb crud_api_db

# Or using psql
psql -U postgres -c "CREATE DATABASE crud_api_db;"
```

### 5. Start Development Server
```bash
npm run start:dev
```

## Test API Endpoints

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (use token from login response)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post."
  }'
```

### Get All Posts
```bash
curl -X GET http://localhost:3000/api/posts
```

## Run Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker Setup (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

The API will be available at `http://localhost:3000/api`