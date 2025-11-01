const express = require("express");
const { processQuery } = require("../controllers/aiController");

const router = express.Router();

router.post("/assistant", processQuery);

module.exports = router;
