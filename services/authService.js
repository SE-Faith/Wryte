import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

const resetTokens = new Map();
const verificationCodes = new Map();

class AuthServices {
    async register(data) {
        const { name, email, password, role } = data;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Create random 6-digit OTP for email verification
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        verificationCodes.set(email, code);

        try {
            await sendMail(email, "Wryte - Verify Your Email", `Welcome to Wryte! Your email verification OTP is: ${code}`);
        } catch (err) {
            console.log("Email verification code sending failed. Code is:", code);
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return { user, token, verificationCode: code };
    }

    async login(data) {
        const { email, password } = data;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Invalid Email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid Email or password");
        }

        if (!user.isActive) {
            throw new Error("Account is inactive. Please verify your email first.");
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return { user, token };
    }

    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
       
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid current password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();  
        
        return user;
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("No user found with this email");
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        resetTokens.set(email, code);

        try {
            await sendMail(email, "Wryte - Reset Password Code", `Your password reset code is: ${code}`);
        } catch (err) {
            console.log("Email reset code sending failed. Code is:", code);
        }
        return { email, code };
    }

    async resetPassword(token, newPassword) {
        let email = null;
        for (const [e, c] of resetTokens.entries()) {
            if (c === token) {
                email = e;
                break;
            }
        }
        if (!email) {
            throw new Error("Invalid or expired reset code");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        resetTokens.delete(email);
        return user;
    }

    async verifyEmail(email, code) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const storedCode = verificationCodes.get(email);
        if (storedCode && storedCode !== code) {
            throw new Error("Invalid verification code");
        }
        user.isActive = true;
        await user.save();
        verificationCodes.delete(email);
        return user;
    }
}

export default new AuthServices();