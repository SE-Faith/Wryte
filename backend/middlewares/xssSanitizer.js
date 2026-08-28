/**
 * Express 5 Compatible XSS Sanitization Middleware
 * Recursively strips script tags, HTML tags, javascript: URI schemes, and inline events from req.body, req.query, and req.params in-place.
 */

const hasOwnProperty = Object.prototype.hasOwnProperty;

const cleanXss = (obj) => {
    if (obj && typeof obj === "object") {
        for (const key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                if (typeof obj[key] === "string") {
                    // Sanitize string values of dangerous tags and events
                    obj[key] = obj[key]
                        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // Remove <script>...</script> tags
                        .replace(/<[^>]*>?/gm, "") // Remove generic HTML tags
                        .replace(/javascript:/gi, "") // Remove javascript: protocol
                        .replace(/on\w+\s*=/gi, ""); // Remove inline handlers like onload, onerror, onclick, etc.
                } else {
                    // Recursively sanitize nested objects
                    cleanXss(obj[key]);
                }
            }
        }
    }
    return obj;
};

export const xssSanitizer = (req, res, next) => {
    if (req.body) {
        cleanXss(req.body);
    }
    if (req.params) {
        cleanXss(req.params);
    }
    if (req.query) {
        // Mutate the query object in-place.
        // Express 5.x query object is getter-only, so re-assignment fails. Mutating properties in-place is safe and fully compatible.
        cleanXss(req.query);
    }
    next();
};
