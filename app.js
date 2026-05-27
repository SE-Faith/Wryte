const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const connectDB = require("./config/database");

// load environment variables
dotenv.config();

const app = express();

const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const categoryRoute = require("./routes/categoryRoute");
const tagRoute = require("./routes/tagRoute");
const postRoute = require("./routes/postRoute");

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

module.exports = app;