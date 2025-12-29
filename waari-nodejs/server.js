const http = require("http");
const app = require("./src/app");
const config = require("./config");

const port = config.app.port;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Waari backend running on port ${port}`);
});
