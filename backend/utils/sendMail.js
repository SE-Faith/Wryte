import transporter from "../config/mail.js";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Wryte" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};