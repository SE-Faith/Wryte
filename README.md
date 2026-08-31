# Wryte

A full-stack, production-ready blogging platform with real-time notifications, content management, and hardened API security.

## What & Why

I built Wryte to solve the problem of clunky, over-engineered content platforms by providing a minimal, fast, and secure workspace for authors and readers. It is a modern full-stack web application featuring an Express REST API backend and a Next.js App Router frontend with real-time Socket.IO interactivity. I created this project to demonstrate production-grade Node.js architecture, robust client-side state management, and multi-layered web security patterns without relying on monolithic full-stack frameworks.

## Live Demo

- Deployment: [LIVE_DEMO_URL — add once deployed]
- Video Walkthrough: [DEMO_VIDEO_URL — add a 60-90s Loom walkthrough link here]

## Key Features

### Auth & Accounts
- User registration and JWT-based authentication
- Role-based access control (`user` vs `admin`)
- OTP email verification and self-service password recovery
- User profile management with avatar customization and reading history tracking

### Content Management
- Create, edit, draft, publish, and schedule articles
- Categorization and automated tag resolution upon post creation
- Article view counters, bookmarking, and liking capabilities
- HTML rich text rendering and formatted story previews

### Real-Time & Interactivity
- Nested comment threads with parent-child reply support
- Real-Time push notifications powered by Socket.IO rooms (`socket.join(userId)`)
- Floating toast notification alerts for user interactions

### Security
- Double-submit cookie CSRF protection for state-changing requests
- Tiered IP rate limiting on global routes and authentication endpoints
- Sanitization against NoSQL injection and XSS payload attacks
- HTTP header protection and password hashing with salt rounds

## Architecture & Key Decisions

Wryte separates the backend API (Node.js/Express) from the frontend client (Next.js 15 App Router). This decoupling enforces a clean REST interface, enabling future native mobile or third-party client integrations while letting Next.js manage frontend rendering, SWR client-side data fetching, and optimistic UI transitions.

Authentication uses stateless JSON Web Tokens (JWT) sent via `Authorization: Bearer` headers. Sensitive user credentials are explicitly omitted from query responses (`password` field excluded), and authorization middlewares enforce strict role checking (`admin` vs `user`) on post modifications, user bans, and dashboard metrics. For real-time updates, Socket.IO clients join dedicated rooms identified by the user's ObjectId, allowing targeted server-side events without expensive database polling loops.

To safeguard state-changing HTTP methods (`POST`, `PUT`, `DELETE`, `PATCH`) initiated by browser sessions without Bearer headers, a double-submit cookie CSRF strategy is enforced. Signed cookies parsed via `cookie-parser` are matched against `x-csrf-token` request headers, securing non-API requests while allowing stateless API consumers to operate unimpeded.

## Security

Security is enforced at the middleware layer on every incoming request:

- **Authentication Enforcement**: `verifyToken` & `verifyAdmin` custom middlewares verify JWT signatures using `jsonwebtoken` (`^9.0.3`).
- **CSRF Protection**: `cookie-parser` (`^1.4.7`) signed cookies paired with double-submit validation via `/api/csrf-token`.
- **Rate Limiting**: `express-rate-limit` (`^8.5.2`) applies `globalLimiter` (2000 requests per 15 min) and `authLimiter` (100 requests per 15 min) to mitigate brute-force and denial-of-service attacks.
- **Input Sanitization**: `express-mongo-sanitize` (`^2.2.0`) strips `$` and `.` operators to prevent NoSQL query injection; `xss-clean` (`^0.1.4`) sanitizes raw user inputs to prevent Cross-Site Scripting; `helmet` (`^8.2.0`) hardens HTTP security headers.
- **Password Security**: `bcrypt` (`^6.0.0`) hashes passwords with a cost factor of 10 prior to storage.

## Tech Stack

### Backend
- **Framework**: Express (`^5.2.1`) on Node.js
- **Database & ORM**: MongoDB with Mongoose (`^9.6.2`)
- **Authentication**: `jsonwebtoken` (`^9.0.3`), `bcrypt` (`^6.0.0`)
- **Real-Time Communication**: `socket.io` (`^4.8.3`)
- **Security & Utilities**: `helmet` (`^8.2.0`), `express-rate-limit` (`^8.5.2`), `express-mongo-sanitize` (`^2.2.0`), `xss-clean` (`^0.1.4`), `cookie-parser` (`^1.4.7`)
- **Email & Automation**: `nodemailer` (`^8.0.9`), `node-cron` (`^4.2.1`)
- **Documentation**: `swagger-ui-express` (`^5.0.1`), `yamljs` (`^0.3.0`)
- **Environment & Tooling**: `dotenv` (`^17.4.2`), `nodemon` (`^3.1.14`)

### Frontend
- **Framework**: Next.js (`15.1.0`) with App Router, React (`^19.0.0`), React DOM (`^19.0.0`)
- **Styling**: Tailwind CSS (`^4`), `@tailwindcss/postcss` (`^4`)
- **State & Data Fetching**: Zustand (`^5.0.13`), SWR (`^2.4.1`), Axios (`^1.16.1`)
- **Real-Time & Icons**: `socket.io-client` (`^4.8.3`), `lucide-react` (`^1.16.0`)

## Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- MongoDB instance running locally (`mongodb://localhost:27017`) or via MongoDB Atlas

### Clone & Install

```bash
# Clone repository
git clone https://github.com/your-username/wryte.git
cd wryte

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Configuration

1. Copy `.env.example` to `.env` in the `backend` directory:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Copy `.env.example` to `.env.local` in the `frontend` directory:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```

### Seed Admin Account

To generate the initial administrative user in your MongoDB database:

```bash
cd backend
node scripts/createAdmin.js
```

### Running Development Servers

Start the backend server (runs on `http://localhost:4000`):
```bash
cd backend
npm run dev
```

In a separate terminal, start the frontend server (runs on `http://localhost:3000`):
```bash
cd frontend
npm run dev
```

### Running Tests

[Test suite in progress]

## API Documentation

Swagger UI API documentation is generated directly from `backend/config/openapi.yaml` and is served live at:
`http://localhost:4000/api-docs`

## Known Limitations & Roadmap

- **Caching Layer**: Redis caching is planned for high-traffic post feed queries and view counters.
- **Async Job Queues**: Transitioning email delivery (OTP verification and notifications) from synchronous Nodemailer transport to a Redis-backed queue (e.g. BullMQ).
- **Automated Testing**: Expanding test coverage with Jest and Supertest integration suites.

---

## License

ISC License

## Author

Created by Faith Omolafe — connect on [LinkedIn](www.linkedin.com/in/faith-omolafe-2b47b8392).
