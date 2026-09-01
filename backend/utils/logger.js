import pino from "pino";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
    level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
    base: {
        env: process.env.NODE_ENV,
        service: "wryte-backend"
    },
    transport: isProduction
        ? undefined
        : {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
                ignore: "pid,hostname,service,env"
            }
        }
});

export default logger;
