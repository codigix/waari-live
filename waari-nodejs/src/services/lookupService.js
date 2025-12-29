const pool = require("../../database/pool");

const fetchRows = async (query) => {
  const [rows] = await pool.query(query);
  return rows;
};

const getRoles = async () =>
  fetchRows("SELECT roleId, roleName FROM roles ORDER BY roleName ASC");

const getPositions = async () =>
  fetchRows(
    "SELECT positionId, positionName FROM positions ORDER BY positionName ASC"
  );

const getDepartments = async () =>
  fetchRows(
    "SELECT departmentId, departmentName FROM departments ORDER BY departmentName ASC"
  );

const getSectors = async () =>
  fetchRows("SELECT sectorId, sectorName FROM sectors ORDER BY sectorName ASC");

const getEstablishmentTypes = async () =>
  fetchRows(
    "SELECT establishmentTypeId, establishmentTypeName FROM establishment_types ORDER BY establishmentTypeName ASC"
  );

module.exports = {
  getRoles,
  getPositions,
  getDepartments,
  getSectors,
  getEstablishmentTypes,
};
