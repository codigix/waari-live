// routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const db = require('../../db');

// Test Permission API
router.get("/test-permission/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // check if user exists
    const [user] = await db.query("SELECT * FROM users WHERE roleId = ?", [id]);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const roleId = user[0].roleId;

    const [permissions] = await db.query(
      "SELECT catId, listId FROM permissions WHERE roleId = ?",
      [roleId]
    );

    // group by catId
    const organizedPermissions = {};
    permissions.forEach((p) => {
      if (!organizedPermissions[p.catId]) {
        organizedPermissions[p.catId] = { catId: p.catId, listId: [p.listId] };
      } else {
        organizedPermissions[p.catId].listId.push(p.listId);
      }
    });

    res.json({ permissions: Object.values(organizedPermissions) });
  } catch (err) {
    console.error("❌ Error in test-permission:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
