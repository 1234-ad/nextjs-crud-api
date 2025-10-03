# API Documentation

## Base URL
All API endpoints are prefixed with `/api`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Responses
All error responses follow this format:
```json
{
  "statusCode": 400,
  "timestamp": "2023-10-03T12:00:00.000Z",
  "path": "/api/users",
  "method": "POST",
  "message": ["Validation error messages"]
}
```

## Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```
- **Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2023-10-03T12:00:00.000Z",
    "updatedAt": "2023-10-03T12:00:00.000Z"
  },
  "access_token": "jwt_token_here"
}
```

#### Login User
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2023-10-03T12:00:00.000Z",
    "updatedAt": "2023-10-03T12:00:00.000Z"
  },
  "access_token": "jwt_token_here"
}
```

#### Get Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-10-03T12:00:00.000Z",
  "updatedAt": "2023-10-03T12:00:00.000Z"
}
```

### Users

#### Get All Users
- **GET** `/api/users`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2023-10-03T12:00:00.000Z",
    "updatedAt": "2023-10-03T12:00:00.000Z"
  }
]
```

#### Get User by ID
- **GET** `/api/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-10-03T12:00:00.000Z",
  "updatedAt": "2023-10-03T12:00:00.000Z"
}
```

#### Update User
- **PATCH** `/api/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name"
}
```
- **Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "createdAt": "2023-10-03T12:00:00.000Z",
  "updatedAt": "2023-10-03T12:00:00.000Z"
}
```

#### Delete User
- **DELETE** `/api/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `204 No Content`

### Posts

#### Get All Posts
- **GET** `/api/posts`
- **Response:**
```json
[
  {
    "id": 1,
    "title": "Post Title",
    "content": "Post content here...",
    "authorId": 1,
    "author": {
      "id": 1,
      "username": "username",
      "firstName": "John",
      "lastName": "Doe"
    },
    "createdAt": "2023-10-03T12:00:00.000Z",
    "updatedAt": "2023-10-03T12:00:00.000Z"
  }
]
```

#### Get Post by ID
- **GET** `/api/posts/:id`
- **Response:**
```json
{
  "id": 1,
  "title": "Post Title",
  "content": "Post content here...",
  "authorId": 1,
  "author": {
    "id": 1,
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  },
  "createdAt": "2023-10-03T12:00:00.000Z",
  "updatedAt": "2023-10-03T12:00:00.000Z"
}
```

#### Create Post
- **POST** `/api/posts`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Post Title",
  "content": "Post content here..."
}
```
- **Response:**
```json
{
  "id": 1,
  "title": "Post Title",
  "content": "Post content here...",
  "authorId": 1,
  "createdAt": "2023-10-03T12:00:00.000Z",
  "updatedAt": "2023-10-03T12:00:00.000Z"
}
```

#### Update Post
- **PATCH** `/api/posts/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```
- **Response:**
```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "authorId": 1,
  "author": {
    "id": 1,
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  },
  "createdAt": "2023-10-03T12:00:00.000Z",
  "updatedAt": "2023-10-03T12:00:00.000Z"
}
```

#### Delete Post
- **DELETE** `/api/posts/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `204 No Content`

## Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error