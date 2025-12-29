const lookupService = require("../services/lookupService");

const respond = (res, data) => res.json({ data });

const getRoles = async (req, res, next) => {
  try {
    const data = await lookupService.getRoles();
    respond(res, data);
  } catch (error) {
    next(error);
  }
};

const getPositions = async (req, res, next) => {
  try {
    const data = await lookupService.getPositions();
    respond(res, data);
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    const data = await lookupService.getDepartments();
    respond(res, data);
  } catch (error) {
    next(error);
  }
};

const getSectors = async (req, res, next) => {
  try {
    const data = await lookupService.getSectors();
    respond(res, data);
  } catch (error) {
    next(error);
  }
};

const getEstablishmentTypes = async (req, res, next) => {
  try {
    const data = await lookupService.getEstablishmentTypes();
    respond(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
  getPositions,
  getDepartments,
  getSectors,
  getEstablishmentTypes,
};
