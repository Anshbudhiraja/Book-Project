# Book Management & Review Backend API

This is a RESTful API built with **Node.js**, **Express.js**, and **MongoDB**, providing functionalities for user authentication, book management, and reviews. The backend includes JWT-based authentication, and secure password handling.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [API Endpoints](#api-endpoints)  
  - [Authentication](#authentication)  
  - [Books](#books)  
  - [Reviews](#reviews)  
- [Middleware](#middleware)  
- [Error Handling](#error-handling)  
- [Pagination](#pagination)  
- [Notes](#notes)  

---

## Features

- User registration and login with **JWT authentication**
- Secure password hashing with **bcrypt**
- Validation for email, password, and username
- Prevents usage of disposable/temporary email addresses
- Create, read, update, delete (CRUD) operations for books
- Add, update, delete, and fetch reviews for books
- Pagination support for books listing
- Authorization ensures only book creators can update/delete their books
- Average rating calculation for each book

---

## Tech Stack

- **Node.js** - Backend runtime  
- **Express.js** - Web framework  
- **MongoDB** - Database  
- **Mongoose** - ODM for MongoDB  
- **bcrypt** - Password hashing  
- **jsonwebtoken (JWT)** - Authentication tokens  
- **dotenv** - Environment variable management  

---

## Getting Started

1. **Clone the repository**  
```bash
git clone <repo-url>
cd <repo-folder>
```

2. **Install dependencies**  
```bash
npm install
```

3. **Create a `.env` file** in the root directory:
```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
```

4. **Run the server**  
```bash
npm start
```

The server should start on the port specified in `.env` (default: 5000).

---

## Environment Variables

- `MONGO_URI` – MongoDB connection URI  
- `JWT_SECRET` – Secret key for JWT signing and verification  
- `PORT` – Port for the backend server  

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description                     | Protected |
|--------|-----------------|---------------------------------|-----------|
| POST   | /auth/createUser | Register a new user             | No        |
| POST   | /auth/loginUser  | Login a user                    | No        |
| GET    | /auth/getUser    | Get authenticated user details  | Yes       |

---

### Books

| Method | Endpoint                | Description                                   | Protected |
|--------|------------------------|-----------------------------------------------|-----------|
| POST   | /books/add             | Add a new book                                | Yes       |
| GET    | /books/                | Get books added by logged-in user (paginated)| Yes       |
| GET    | /books/getAllBooks     | Get all books (paginated)                     | No        |
| GET    | /books/getBook/:bookId | Get details of a book including avg rating   | Yes       |
| PUT    | /books/update/:id      | Update a book (only owner)                    | Yes       |
| DELETE | /books/delete/:id      | Delete a book (only owner)                    | Yes       |

---

### Reviews

| Method | Endpoint                  | Description                         | Protected |
|--------|---------------------------|-------------------------------------|-----------|
| POST   | /reviews/addReview/:bookId | Add a review for a book             | Yes       |
| PUT    | /reviews/updateReview/:reviewId | Update a review (only owner)     | Yes       |
| DELETE | /reviews/deleteReview/:reviewId | Delete a review (only owner)     | Yes       |
| GET    | /reviews/:bookId          | Get all reviews for a book           | Yes       |

---

## Middleware

- **userMiddleware**:  
  - Verifies JWT token in the `Authorization` header  
  - Checks token validity and user existence  
  - Attaches the user object to `req.user`  

Example usage in routes:
```javascript
const { userMiddleware } = require("../middlewares/user.middleware");

router.post("/books/add", userMiddleware, addBook);
```

---

## Error Handling

- All endpoints return appropriate **HTTP status codes**:
  - `400` – Bad Request / Validation error  
  - `401` – Unauthorized / Invalid token  
  - `403` – Forbidden / Unauthorized access  
  - `404` – Resource not found  
  - `500` – Internal Server Error  

---

## Pagination

- Books listing supports pagination using query parameters:
  - `page` – page number (default: 1)
  - Limit per page is set to 5
- Example:
```
GET /books/?page=2
```
Response includes:
```json
{
  "page": 2,
  "totalPages": 4,
  "totalBooks": 18,
  "data": [...]
}
```

---

## Notes

- Only book creators can update or delete their books.  
- Users can only update or delete their own reviews.  
- Reviews include a numeric rating from `1` to `5`.  
- Average rating is calculated dynamically when fetching a single book.  
- Email validation prevents disposable/temporary email usage.  
