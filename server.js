// create server
const http = require("http");
const app = require("./app");
const cron = require("./config/cron");

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
