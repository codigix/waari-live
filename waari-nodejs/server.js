const http = require("http");
const app = require("./src/app");
const config = require("./config");
const pool = require("./db");
const { loadTourFixtures } = require("./src/data/toursDataLoader");

const port = config.app.port;
const server = http.createServer(app);

const checkDatabaseConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query("SELECT 1");
    console.log(
      `Database connection successful to ${config.database.host}:${config.database.port}`
    );
  } finally {
    if (connection) connection.release();
  }
};

const bootstrap = async () => {
  await checkDatabaseConnection();
  await loadTourFixtures();
  server.listen(port, () => {
    console.log(`Waari backend running on port ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Startup failed", error);
  process.exit(1);
});
