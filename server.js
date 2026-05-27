// create server
import http from "http";
import app from "./app.js";
import "./config/cron.js";

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
