const express = require("express");
const router = express.Router();
const db = require("../../db");
const CommonController = require("../controllers/CommonController");

router.get("/", async (req, res) => {
  try {
    const tokenData = await CommonController.checkToken(req.headers["token"], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    let query = "SELECT * FROM cities";
    const params = [];
    const conditions = [];

    if (req.query.stateId) {
      conditions.push("stateId = ?");
      params.push(req.query.stateId);
    }
    if (req.query.countryId) {
      conditions.push("countryId = ?");
      params.push(req.query.countryId);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    db.execute(query, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const cityArray = results.map((value) => ({
        cityId: value.citiesId,
        citiesId: value.citiesId,
        stateId: value.stateId,
        citiesName: value.citiesName,
        image: value.image || "",
        description: value.description || "",
      }));

      res.json({ data: cityArray });
    });
  } catch (error) {
    console.error("Error in cityList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
