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

const listAllUsersDropdown = (req, res, next) => {
  try {
    const response = teamService.listAllUsersDropdown();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listSalesUnderTeamLead = (req, res, next) => {
  try {
    const response = teamService.listSalesUnderTeamLead();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const viewLeadData = (req, res, next) => {
  try {
    const response = teamService.viewLeadData(req.query.id || req.params.id);
    if (!response.data) {
      const status = response.message && response.message.includes("not found") ? 404 : 400;
      return res.status(status).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const addTeamLead = (req, res, next) => {
  try {
    const response = teamService.addTeamLead(req.body || {});
    if (!response.data) {
      return res.status(400).json(response);
    }
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const updateTeamLead = (req, res, next) => {
  try {
    const payload = { ...(req.body || {}) };
    if (typeof payload.id === "undefined" && typeof req.query.id !== "undefined") {
      payload.id = req.query.id;
    }
    const response = teamService.updateTeamLead(payload);
    if (!response.data) {
      const status = response.message && response.message.includes("not found") ? 404 : 400;
      return res.status(status).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listGroupSalesEnquiries = (req, res, next) => {
  try {
    const response = teamService.listGroupSalesEnquiries({
      userId: req.query.userId,
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const listCustomSalesEnquiries = (req, res, next) => {
  try {
    const response = teamService.listCustomSalesEnquiries({
      userId: req.query.userId,
      page: req.query.page,
      perPage: req.query.perPage,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const assignGroupEnquiry = (req, res, next) => {
  try {
    const response = teamService.assignGroupEnquiry(req.body || {});
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const assignCustomEnquiry = (req, res, next) => {
  try {
    const response = teamService.assignCustomEnquiry(req.body || {});
    if (!response.success) {
      return res.status(400).json(response);
    }
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getSalesStageTwoWorkflow = (req, res, next) => {
  try {
    const response = teamService.getSalesStageTwoWorkflow();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listLeadSales,
  listSalesTeamLeadListing,
  listSalesTeamLeadMembers,
  listAllUsersDropdown,
  listSalesUnderTeamLead,
  viewLeadData,
  addTeamLead,
  updateTeamLead,
  listGroupSalesEnquiries,
  listCustomSalesEnquiries,
  assignGroupEnquiry,
  assignCustomEnquiry,
  getSalesStageTwoWorkflow,
};
