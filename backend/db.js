// db.js
const mysql = require("mysql2/promise");  // 👈 use promise wrapper

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Backend",
  database: process.env.DB_NAME || "new_waari",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test connection at startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = pool;
