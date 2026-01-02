const http = require("http");
const bcrypt = require("bcrypt");
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

const ensureSuperAdminRole = async () => {
  const [rows] = await pool.query(
    "SELECT roleId FROM roles WHERE roleName = ? LIMIT 1",
    ["Super Admin"]
  );
  if (rows.length) {
    return rows[0].roleId;
  }
  const [result] = await pool.query(
    "INSERT INTO roles (roleName, description) VALUES (?, ?)",
    ["Super Admin", "Default administrator role"]
  );
  return result.insertId;
};

const ensureDefaultAdminUser = async () => {
  if (!config.admin.email || !config.admin.password) {
    return;
  }
  const roleId = await ensureSuperAdminRole();
  const [[existing]] = await pool.query(
    "SELECT userId, password FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1",
    [config.admin.email]
  );
  if (existing) {
    if (!existing.password || !existing.password.startsWith("$2")) {
      const hashed = await bcrypt.hash(config.admin.password, 10);
      await pool.query("UPDATE users SET password = ? WHERE userId = ?", [hashed, existing.userId]);
    }
    return;
  }
  const hashedPassword = await bcrypt.hash(config.admin.password, 10);
  await pool.query(
    `INSERT INTO users (
      firstName,
      lastName,
      userName,
      email,
      password,
      contact,
      roleId,
      status
    ) VALUES (?,?,?,?,?,?,?,1)`,
    [
      "Codigix",
      "Superadmin",
      "Codigix Superadmin",
      config.admin.email,
      hashedPassword,
      "+9100000000",
      roleId,
    ]
  );
};

const bootstrap = async () => {
  await checkDatabaseConnection();
  await ensureDefaultAdminUser();
  await loadTourFixtures();
  server.listen(port, () => {
    console.log(`Waari backend running on port ${port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Startup failed", error);
  process.exit(1);
});
