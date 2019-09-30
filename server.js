// server.js
const next = require("next");
const routes = require("./routes");
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = routes.getRequestHandler(app);
require("dotenv").config();
console.log(process.env.NODE_ENV);
// Without express
const PORT = process.env.PORT || 3000;
const { createServer } = require("http");
app.prepare().then(() => {
  createServer(handler).listen(PORT);
});
