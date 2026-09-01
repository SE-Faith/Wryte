import authServices from "../services/authService.js";
import logger from "../utils/logger.js";

export const register = async (req, res) => {
    try {
        const user = await authServices.register(req.body);
        res.status(201).json({ success: true, user });
    } catch (error) {
        logger.error({ err: error, body: req.body }, "Error in authController.register");
        res.status(500).json({ success: false, error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await authServices.login(req.body);
        res.status(200).json({ success: true, result });
    } catch (error) {
        logger.error({ err: error, email: req.body?.email }, "Error in authController.login");
        res.status(500).json({ success: false, error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        const result = await authServices.changePassword(userId, currentPassword, newPassword);
        res.status(200).json({ success: true, result });
    } catch (error) {
        logger.error({ err: error, userId: req.body?.userId }, "Error in authController.changePassword");
        res.status(500).json({ success: false, error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await authServices.forgotPassword(email);
        res.status(200).json({ success: true, message: "Reset code sent to email", result });
    } catch (error) {
        logger.error({ err: error, email: req.body?.email }, "Error in authController.forgotPassword");
        res.status(500).json({ success: false, error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authServices.resetPassword(token, newPassword);
        res.status(200).json({ success: true, message: "Password reset successfully", result });
    } catch (error) {
        logger.error({ err: error }, "Error in authController.resetPassword");
        res.status(500).json({ success: false, error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const result = await authServices.verifyEmail(email, code);
        res.status(200).json({ success: true, message: "Email verified successfully", result });
    } catch (error) {
        logger.error({ err: error, email: req.body?.email }, "Error in authController.verifyEmail");
        res.status(500).json({ success: false, error: error.message });
    }
};

