# NestJS CRUD API with PostgreSQL

A complete NestJS application with PostgreSQL database, JWT authentication, and comprehensive CRUD operations.

## Features

- 🚀 **NestJS Framework** - Modern Node.js framework for building efficient APIs
- 🐘 **PostgreSQL Database** - Robust relational database with TypeORM
- 🔐 **JWT Authentication** - Secure authentication and authorization
- ✅ **Input Validation** - Class-validator for request validation
- 🧪 **Unit Tests** - Comprehensive test coverage
- 📝 **API Documentation** - Well-documented endpoints
- 🔒 **Error Handling** - Centralized error management

## Requirements

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nestjs-crud-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your PostgreSQL database in the `.env` file:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=crud_api_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

5. Create the database:
```bash
createdb crud_api_db
```

6. Run migrations:
```bash
npm run migration:run
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires authentication)

### Users (CRUD)
- `GET /users` - Get all users (requires authentication)
- `GET /users/:id` - Get user by ID (requires authentication)
- `PUT /users/:id` - Update user (requires authentication)
- `DELETE /users/:id` - Delete user (requires authentication)

### Posts (Example Entity)
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post (requires authentication)
- `PUT /posts/:id` - Update post (requires authentication)
- `DELETE /posts/:id` - Delete post (requires authentication)

## Testing

### Run all tests
```bash
npm test
```

### Run tests with coverage
```bash
npm run test:cov
```

### Run e2e tests
```bash
npm run test:e2e
```

## Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # Users module
├── posts/             # Posts module (example entity)
├── config/            # Configuration files
├── common/            # Shared utilities and decorators
├── database/          # Database configuration
└── main.ts           # Application entry point
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `username` (Unique)
- `password` (Hashed)
- `firstName`
- `lastName`
- `createdAt`
- `updatedAt`

### Posts Table
- `id` (Primary Key)
- `title`
- `content`
- `authorId` (Foreign Key to Users)
- `createdAt`
- `updatedAt`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | Database username | - |
| `DATABASE_PASSWORD` | Database password | - |
| `DATABASE_NAME` | Database name | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Application port | `3000` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.