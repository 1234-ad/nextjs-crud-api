# Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **PostgreSQL** (v12 or higher)
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Verify installation: `psql --version`

3. **npm or yarn**
   - npm comes with Node.js
   - For yarn: `npm install -g yarn`

## Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd nestjs-crud-api

# Install dependencies
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE crud_api_db;

# Create user (optional)
CREATE USER crud_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE crud_api_db TO crud_user;

# Exit psql
\q
```

#### Option B: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name postgres-crud \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=crud_api_db \
  -p 5432:5432 \
  -d postgres:13

# Verify container is running
docker ps
```

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

Required environment variables:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=crud_api_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### 4. Database Migration

The application uses TypeORM with `synchronize: true` in development, so tables will be created automatically.

For production, you should use migrations:

```bash
# Generate migration
npm run migration:generate -- src/migrations/InitialMigration

# Run migrations
npm run migration:run
```

### 5. Start the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### 6. Verify Installation

The application should be running on `http://localhost:3000`

Test with curl:
```bash
# Health check (if you add a health endpoint)
curl http://localhost:3000/api

# Register a test user
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

## Development Workflow

### 1. Code Formatting and Linting
```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### 2. Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run e2e tests
npm run test:e2e
```

### 3. Database Operations
```bash
# Generate new migration
npm run migration:generate -- src/migrations/YourMigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:3000 | xargs kill`

3. **Module Not Found Errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **JWT Secret Error**
   - Ensure JWT_SECRET is set in `.env`
   - Use a strong, random secret key

### Useful Commands

```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list | grep postgresql  # macOS
net start postgresql-x64-13  # Windows

# Connect to database
psql -h localhost -U postgres -d crud_api_db

# View application logs
npm run start:dev | bunyan  # If using bunyan logger

# Check Node.js and npm versions
node --version
npm --version
```

### Docker Setup (Alternative)

If you prefer using Docker for the entire setup:

```bash
# Create docker-compose.yml (see project files)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

## Production Deployment

### Environment Preparation
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Set proper database credentials
4. Configure CORS appropriately
5. Set up SSL/TLS

### Build and Deploy
```bash
# Build application
npm run build

# Start with PM2 (recommended)
npm install -g pm2
pm2 start ecosystem.config.js

# Or use Docker
docker build -t nestjs-crud-api .
docker run -p 3000:3000 nestjs-crud-api
```