# Wryte

Wryte is a full-stack blogging platform built with a Node.js/Express backend and a Next.js frontend. It supports authentication, post management, category filtering, likes, bookmarks, comments, notifications, and admin moderation.

## Tech stack

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT authentication
- Socket.IO
- Helmet, rate limiting, CSRF protection, Mongo sanitization, XSS filtering
- Nodemailer for OTP and password-reset emails
- Swagger UI via OpenAPI YAML

### Frontend
- Next.js 15 App Router
- React 19
- Tailwind CSS
- Zustand
- SWR
- Axios
- Lucide React icons

## Current app features

- User registration and login
- Email verification and password reset flow
- Profile management and public profile view
- Create, read, update, and delete blog posts
- Search and category filtering on the feed
- Like and bookmark functionality
- Comments and nested post interactions
- Notification system using Socket.IO rooms
- Admin dashboard and moderation endpoints
- CSRF token and secure cookie setup for browser-based requests

## Project structure

```bash
wryte/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── scripts/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── README.md
└── package.json
```

## Prerequisites

- Node.js 18+
- MongoDB instance running locally or in MongoDB Atlas
- A mail provider configuration for OTP and password reset emails

## Backend environment variables

Create a `.env` file inside the backend folder with values like:

```env
PORT=4000
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/wryte
JWT_SECRET=your-super-secret-key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

## Frontend environment variables

Create a `.env.local` file inside the frontend folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run the app

### Backend

```bash
cd backend
npm run dev
```

The API runs on:
- http://localhost:4000
- Swagger docs: http://localhost:4000/api-docs

### Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on:
- http://localhost:3000

## Seed the first admin user

```bash
cd backend
node scripts/createAdmin.js
```

This script creates an admin account using the configured MongoDB instance.

## Core API notes

- Public endpoints are mounted at the root of the backend app without a `/api` prefix, except for `/api/health` and `/api/csrf-token`.
- Authenticated routes use JWT bearer tokens in the `Authorization` header.
- State-changing browser requests also require a CSRF token from `/api/csrf-token`.
- The backend serves Swagger documentation at `/api-docs`.

## Useful routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `GET /post/all`
- `POST /post/create`
- `GET /post/:postId`
- `PUT /post/:postId`
- `DELETE /post/:postId`
- `POST /bookmark/post/:postId`
- `POST /like/like/:postId`
- `POST /comment`
- `GET /category/all`
- `GET /tag`
- `GET /profile/get`
- `GET /profile/followers`
- `GET /profile/following`
- `GET /admin/all`

## Notes

- The project currently focuses on the core blogging workflow and real-time user interactions.
- Automated tests are not yet set up in the backend or frontend and would be the next major improvement.

## License

ISC
