import crypto from "crypto";

/**
 * CSRF Double Submit Cookie Middleware
 */

// Generate a new CSRF token and set it in a signed httpOnly cookie, returning it in the body.
export const generateCsrf = (req, res) => {
    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Set cookie options
    const cookieOptions = {
        httpOnly: true, // Mitigate XSS attacks by keeping cookie inaccessible to client-side JS
        secure: process.env.NODE_ENV === "production", // Enforce HTTPS in production
        sameSite: "lax", // Prevent cookies from being sent on cross-site requests
        signed: true // Sign the cookie to prevent tampering
    };

    // Store in signed cookies
    res.cookie("csrfToken", token, cookieOptions);

    // Return the token in JSON payload so the client can store and send it in custom headers
    return res.status(200).json({ csrfToken: token });
};

// Validate CSRF token for state-changing requests
export const verifyCsrf = (req, res, next) => {
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    
    // Bypass safe methods
    if (safeMethods.includes(req.method)) {
        return next();
    }

    // Extract CSRF token from the custom header
    const clientToken = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"];

    // Extract CSRF token from the signed cookie
    const cookieToken = req.signedCookies ? req.signedCookies["csrfToken"] : null;

    // Validate tokens exist and match
    if (!clientToken || !cookieToken || clientToken !== cookieToken) {
        return res.status(403).json({
            success: false,
            message: "Forbidden - Invalid or missing CSRF token."
        });
    }

    next();
};
