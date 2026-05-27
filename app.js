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

// load environment variables
dotenv.config();

const app = express();

import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import tagRoute from "./routes/tagRoute.js";
import postRoute from "./routes/postRoute.js";

// Enable CORS for frontend compatibility (e.g. Next.js on port 3000)
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));

// middleware to parse JSON bodies
app.use(express.json());

// middleware for URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// load OpenAPI specification
let openapiSpecification;
try {
    openapiSpecification = YAML.load(path.join(__dirname, "config", "openapi.yaml"));
} catch (error) {
    console.error(`Failed to load OpenAPI yaml spec: ${error.message}`);
}

// Serve Swagger UI documentation
if (openapiSpecification) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
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

// Global 404 (Not Found) Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export default app;