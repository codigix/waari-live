const { Router } = require("express");
const feedbackController = require("../controllers/feedbackController");

const router = Router();

router.get("/feedbacks-list", feedbackController.listFeedbacks);

module.exports = router;
