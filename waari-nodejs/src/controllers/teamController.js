const teamService = require("../services/teamService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const listLeadSales = async (req, res, next) => {
  try {
    const data = await teamService.listLeadSales();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listSalesTeamLeadListing = (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1) || 1;
    const perPage = toPositiveInt(req.query.perPage, 10) || 10;
    const result = teamService.listSalesTeamLeadListing({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const listSalesTeamLeadMembers = (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1) || 1;
    const perPage = toPositiveInt(req.query.perPage, 10) || 10;
    const result = teamService.listSalesTeamLeadMembers({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listLeadSales,
  listSalesTeamLeadListing,
  listSalesTeamLeadMembers,
};
