// const express = require("express");
// const router = express.Router();
// const pool = require('../../db');
// // MySQL connection
// require("dotenv").config();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("📩 Incoming login request:", email, password);

//     // 1. Find user by email
//     const [userResults] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

//     if (userResults.length === 0) {
//       console.warn("⚠️ No user found for email:", email);
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const user = userResults[0];
//     console.log("✅ User found:", user.email);

//     // 2. Verify password
//     const isValid = bcrypt.compareSync(password, user.password);
//     if (!isValid) {
//       console.warn("⚠️ Invalid password for:", email);
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // 3. Generate JWT
//     const token = jwt.sign(
//       { email: user.email, roleId: user.roleId },
//       process.env.JWT_SECRET || "default_secret",
//       { expiresIn: "1h" }
//     );

//     // 4. Fetch permissions
//     const [permResults] = await pool.query("SELECT listId FROM permissions WHERE roleId = ?", [user.roleId]);
//     const permissions = permResults.map(p => p.listId);

//     console.log("✅ Permissions fetched:", permissions);

//     // 5. Send response
//     res.json({
//       message: "Login successful",
//       token,
//       permissions,
//       roleId: user.roleId,
//       userId: user.userId,
//     });

//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../../db");
const bcrypt = require("bcryptjs");

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user in DB
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    // 2. Validate password
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Get token from DB (not generating new)
    if (!user.token) {
      return res
        .status(500)
        .json({ error: "No token found in database for this user" });
    }

    // 4. Get permissions
    const [permRows] = await pool.query(
      "SELECT listId FROM permissions WHERE roleId = ?",
      [user.roleId]
    );
    const permissions = permRows.map((row) => row.listId);

    // 5. Respond with existing DB token
    res.json({
      message: "Login successful",
      token: user.token, // only from DB
      roleId: user.roleId,
      userId: user.userId,
      permissions,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
