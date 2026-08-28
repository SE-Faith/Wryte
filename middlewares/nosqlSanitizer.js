/**
 * Express 5 Compatible NoSQL Injection Protection Middleware
 * Recursively removes keys starting with "$" from req.body, req.query, and req.params in-place.
 */

const hasOwnProperty = Object.prototype.hasOwnProperty;

const cleanNoSql = (obj) => {
    if (obj && typeof obj === "object") {
        for (const key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                // If key starts with '$' (standard MongoDB operator prefix), delete it
                if (key.startsWith("$")) {
                    delete obj[key];
                } else {
                    // Recursively clean nested objects
                    cleanNoSql(obj[key]);
                }
            }
        }
    }
    return obj;
};

export const nosqlSanitizer = (req, res, next) => {
    if (req.body) {
        cleanNoSql(req.body);
    }
    if (req.params) {
        cleanNoSql(req.params);
    }
    if (req.query) {
        // Mutate the query object in-place.
        // Express 5.x defines req.query as a getter-only property, so re-assigning req.query fails.
        // Mutating its properties in-place works perfectly and safely.
        cleanNoSql(req.query);
    }
    next();
};
