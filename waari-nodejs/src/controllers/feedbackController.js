const feedbackService = require("../services/feedbackService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const listFeedbacks = (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1) || 1;
    const perPage = toPositiveInt(req.query.perPage, 10) || 10;
    const result = feedbackService.listFeedbacks({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listFeedbacks,
};
