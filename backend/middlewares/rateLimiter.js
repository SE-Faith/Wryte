// config/rateLimiter.js
import rateLimit from "express-rate-limit";

// Global limiter: applies to general traffic
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // limit each IP to 2000 requests per 15 minutes
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true, // Return rate limit info in standard headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
});

// Strict limiter: applies to security-sensitive routes like register and login
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 authentication requests per 15 minutes
    message: {
        success: false,
        message: "Too many login/registration attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});