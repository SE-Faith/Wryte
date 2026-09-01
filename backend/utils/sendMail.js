import resend from "../config/mail.js";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (to, subject, text) => {
    try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        const response = await resend.emails.send({
            from: `Wryte <${fromEmail}>`,
            to: Array.isArray(to) ? to : [to],
            subject,
            text
        });

        if (response.error) {
            console.error("Resend API Error:", response.error);
        } else {
            console.log(`Email sent successfully via Resend to ${to} (ID: ${response.data?.id || "sent"})`);
        }
        return response;
    } catch (error) {
        console.error("Error sending email via Resend:", error);
    }
};