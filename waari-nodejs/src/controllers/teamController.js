const teamService = require("../services/teamService");

const listLeadSales = async (req, res, next) => {
  try {
    const data = await teamService.listLeadSales();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listLeadSales,
};
