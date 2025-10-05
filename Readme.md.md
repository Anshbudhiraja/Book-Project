# Fullstack Book Management & Review Application

This project is a fullstack application with a **React.js frontend** and a **Node.js + Express.js backend** for managing books and reviews. Users can sign up, log in, add books, and review books.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [API Endpoints](#api-endpoints)  
- [Frontend](#frontend)  
- [Backend](#backend)  
- [License](#license)

---

## Features

- User authentication (sign up & login) with JWT
- Add, edit, delete books (only by the creator)
- Add, edit, delete reviews (only by the reviewer)
- View all books and reviews
- Pagination support for books
- Average rating calculation for books

---

## Tech Stack

- **Frontend:** React.js, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt
- **Environment Management:** dotenv

---

## Getting Started

### Backend Setup

1. Clone the repository and navigate to the backend folder:

```bash
git clone <repo-url>
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend folder with:

```env
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
```

4. Run the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend folder with your backend API URL:

```env
REACT_APP_API_URL=http://localhost:5000
```

4. Run the frontend:

```bash
npm start
```

The frontend will run on `http://localhost:3000`.

---

## Backend API Endpoints

### Authentication

- `POST /auth/createUser` - Sign up a new user
- `POST /auth/loginUser` - Login user
- `GET /auth/getUser` - Get authenticated user details (requires JWT)

### Books

- `POST /books/add` - Add new book (requires JWT)
- `GET /books` - Get logged-in user books (paginated)
- `GET /books/getAllBooks` - Get all books
- `GET /books/getBook/:bookId` - Get book details with reviews
- `PUT /books/update/:id` - Update book (only creator, requires JWT)
- `DELETE /books/delete/:id` - Delete book (only creator, requires JWT)

### Reviews

- `POST /reviews/addReview/:bookId` - Add a review to a book
- `PUT /reviews/updateReview/:reviewId` - Update review (only reviewer)
- `DELETE /reviews/deleteReview/:reviewId` - Delete review (only reviewer)
- `GET /reviews/:bookId` - Get all reviews for a book

---

## Frontend

- Pages for login, signup, dashboard, book list, book details, and adding reviews.
- Uses Axios to call backend APIs.
- JWT stored in localStorage for authentication.

---

## Backend

- Node.js + Express.js server
- MongoDB database with Mongoose models for Users, Books, and Reviews
- Middleware for JWT authentication
- Proper validation and error handling

---