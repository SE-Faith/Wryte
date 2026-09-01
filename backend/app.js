import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import connectDB from "./config/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import Security Utilities & Middlewares
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { nosqlSanitizer } from "./middlewares/nosqlSanitizer.js";
import { xssSanitizer } from "./middlewares/xssSanitizer.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { generateCsrf, verifyCsrf } from "./middlewares/csrfMiddleware.js";

import pinoHttp from "pino-http";
import logger from "./utils/logger.js";

// load environment variables
dotenv.config();

const app = express();

// HTTP Request Logger Middleware
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/api/health' } }));

import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import tagRoute from "./routes/tagRoute.js";
import postRoute from "./routes/postRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import likeRoute from "./routes/likeRoute.js";
import commentRoute from "./routes/commentRoute.js";
import bookmarkRoute from "./routes/bookmarkRoute.js";
import adminRoute from "./routes/adminRoute.js";
import newsletterRoute from "./routes/newsletterRoute.js";
import searchRoute from "./routes/searchRoute.js";

// Enable CORS for frontend compatibility (e.g. Next.js on port 3000)
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));

// middleware to parse JSON bodies
app.use(express.json());

// middleware for URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// cookie parser to read and verify signed CSRF cookies
app.use(cookieParser(process.env.JWT_SECRET || "wryte-csrf-secret"));

// Helmet to secure HTTP headers
app.use(helmet());

// Prevent NoSQL query injection attacks by sanitizing request bodies (Express 5 compatible)
app.use(nosqlSanitizer);

// Prevent Cross-Site Scripting (XSS) by sanitizing inputs (Express 5 compatible)
app.use(xssSanitizer);

// Apply global rate limiting
app.use(globalLimiter);

// Endpoint to bootstrap CSRF protection
app.get("/api/csrf-token", generateCsrf);

// Enforce CSRF verification globally for state-changing requests (POST, PUT, DELETE, PATCH)
app.use(verifyCsrf);

// load OpenAPI specification
let openapiSpecification;
try {
    openapiSpecification = YAML.load(path.join(__dirname, "config", "openapi.yaml"));
} catch (error) {
    logger.error({ err: error }, `Failed to load OpenAPI yaml spec: ${error.message}`);
}

// Serve Swagger UI documentation with collapsed category accordions
if (openapiSpecification) {
    const swaggerUiOptions = {
        swaggerOptions: {
            docExpansion: "none", // Collapses all groups into neat category headers by default
            filter: true,         // Enables a search/filter box at the top
            defaultModelsExpandDepth: -1, // Collapses schemas section at the bottom for a clean view
            displayRequestDuration: true
        }
    };
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification, swaggerUiOptions));
}

// connect to database
connectDB();

// Basic API healthcheck endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        database: "connected", // simplified for the check
        timestamp: new Date().toISOString()
    });
});

app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/category", categoryRoute);
app.use("/tag", tagRoute);
app.use("/post", postRoute);
app.use("/notification", notificationRoute);
app.use("/like", likeRoute);
app.use("/comment", commentRoute);
app.use("/bookmark", bookmarkRoute);
app.use("/admin", adminRoute);
app.use("/newsletter", newsletterRoute);
app.use("/search", searchRoute);

// Global 404 (Not Found) Handler
app.use((req, res, next) => {
    logger.warn({ path: req.originalUrl, method: req.method }, `Route not found - ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    logger.error({ err, path: req.originalUrl, method: req.method }, err.message || "Internal Server Error");
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export default app;