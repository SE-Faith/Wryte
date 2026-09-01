import resend from "../config/mail.js";
import logger from "./logger.js";
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
            logger.error({ error: response.error, to, subject }, "Resend API Email Delivery Failed");
        } else {
            logger.info({ to, subject, emailId: response.data?.id }, "Email sent successfully via Resend");
        }
        return response;
    } catch (error) {
        logger.error({ err: error, to, subject }, "Error sending email via Resend SDK");
    }
};