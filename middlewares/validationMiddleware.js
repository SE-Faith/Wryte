import { body, validationResult } from "express-validator";

/**
 * Validation runner middleware to intercept and format validation errors
 */
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Registration Validation Rules
 */
export const validateRegister = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 50 }).withMessage("Name cannot exceed 50 characters"),
    
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(),
    
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    
    body("role")
        .optional()
        .isIn(["user", "admin"]).withMessage("Role must be either 'user' or 'admin'"),
        
    runValidation
];

/**
 * Login Validation Rules
 */
export const validateLogin = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(),
    
    body("password")
        .notEmpty().withMessage("Password is required"),
        
    runValidation
];

/**
 * Post Creation/Update Validation Rules
 */
export const validatePost = [
    body("title")
        .trim()
        .notEmpty().withMessage("Post title is required")
        .isLength({ max: 150 }).withMessage("Title cannot exceed 150 characters"),
    
    body("content")
        .trim()
        .notEmpty().withMessage("Post content is required"),
    
    body("category")
        .trim()
        .notEmpty().withMessage("Category is required")
        .isMongoId().withMessage("Invalid category ID format"),
        
    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array of tag IDs"),
        
    runValidation
];
