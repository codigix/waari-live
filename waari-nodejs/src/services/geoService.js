const pool = require("../../database/pool");

let ensureGeoTablesPromise;

const ensureGeoTables = () => {
  if (!ensureGeoTablesPromise) {
    ensureGeoTablesPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS continents (
          continentId INT AUTO_INCREMENT PRIMARY KEY,
          continentName VARCHAR(150) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uq_continent_name (continentName)
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS countries (
          countryId INT AUTO_INCREMENT PRIMARY KEY,
          continentId INT NOT NULL,
          countryName VARCHAR(150) NOT NULL,
          imageUrl VARCHAR(255),
          description TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (continentId) REFERENCES continents(continentId) ON DELETE CASCADE,
          UNIQUE KEY uq_country_name (continentId, countryName)
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS states (
          stateId INT AUTO_INCREMENT PRIMARY KEY,
          continentId INT NOT NULL,
          countryId INT NOT NULL,
          stateName VARCHAR(150) NOT NULL,
          imageUrl VARCHAR(255),
          description TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (continentId) REFERENCES continents(continentId) ON DELETE CASCADE,
          FOREIGN KEY (countryId) REFERENCES countries(countryId) ON DELETE CASCADE,
          UNIQUE KEY uq_state_name (countryId, stateName)
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS cities (
          cityId INT AUTO_INCREMENT PRIMARY KEY,
          continentId INT NOT NULL,
          countryId INT NOT NULL,
          stateId INT NOT NULL,
          cityName VARCHAR(150) NOT NULL,
          isDeparturePoint TINYINT(1) NOT NULL DEFAULT 0,
          imageUrl VARCHAR(255),
          description TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (continentId) REFERENCES continents(continentId) ON DELETE CASCADE,
          FOREIGN KEY (countryId) REFERENCES countries(countryId) ON DELETE CASCADE,
          FOREIGN KEY (stateId) REFERENCES states(stateId) ON DELETE CASCADE,
          UNIQUE KEY uq_city_name (stateId, cityName)
        )
      `);
      try {
        await pool.query(`
          ALTER TABLE cities
          ADD COLUMN isDeparturePoint TINYINT(1) NOT NULL DEFAULT 0
        `);
      } catch (error) {
        if (error.code !== "ER_DUP_FIELDNAME") {
          throw error;
        }
      }
      await pool.query(`
        CREATE TABLE IF NOT EXISTS sectors (
          sectorId INT AUTO_INCREMENT PRIMARY KEY,
          sectorName VARCHAR(120) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await pool.query(`
        INSERT INTO continents (continentId, continentName) VALUES
          (1, 'Asia'),
          (2, 'Europe'),
          (3, 'North America'),
          (4, 'South America'),
          (5, 'Africa'),
          (6, 'Oceania')
        ON DUPLICATE KEY UPDATE continentName = VALUES(continentName)
      `);
      await pool.query(`
        INSERT INTO countries (countryId, continentId, countryName, imageUrl, description) VALUES
          (1, 1, 'India', NULL, 'Key domestic market'),
          (2, 1, 'Japan', NULL, 'Outbound premium market'),
          (3, 2, 'France', NULL, 'Popular European destination'),
          (4, 3, 'United States', NULL, 'Growing corporate market'),
          (5, 5, 'South Africa', NULL, 'Adventure travel hub')
        ON DUPLICATE KEY UPDATE
          continentId = VALUES(continentId),
          countryName = VALUES(countryName),
          imageUrl = VALUES(imageUrl),
          description = VALUES(description)
      `);
      await pool.query(`
        INSERT INTO states (stateId, continentId, countryId, stateName, imageUrl, description) VALUES
          (1, 1, 1, 'Maharashtra', NULL, 'Western India state'),
          (2, 1, 1, 'Goa', NULL, 'Beach destination'),
          (3, 3, 4, 'California', NULL, 'West coast state'),
          (4, 2, 3, 'Île-de-France', NULL, 'Paris region'),
          (5, 1, 1, 'Gujarat', NULL, 'Vibrant west India state'),
          (6, 1, 1, 'Delhi', NULL, 'Capital territory'),
          (7, 1, 1, 'Rajasthan', NULL, 'Desert state')
        ON DUPLICATE KEY UPDATE
          stateName = VALUES(stateName),
          imageUrl = VALUES(imageUrl),
          description = VALUES(description)
      `);
      await pool.query(`
        INSERT INTO cities (cityId, continentId, countryId, stateId, cityName, isDeparturePoint, imageUrl, description) VALUES
          (1, 1, 1, 1, 'Mumbai', 1, NULL, 'Financial capital'),
          (2, 1, 1, 2, 'Panaji', 1, NULL, 'Coastal city'),
          (3, 3, 4, 3, 'Los Angeles', 0, NULL, 'Entertainment hub'),
          (4, 2, 3, 4, 'Paris', 0, NULL, 'Capital city'),
          (5, 1, 1, 5, 'Ahmedabad', 1, NULL, 'Western commercial hub'),
          (6, 1, 1, 6, 'New Delhi', 1, NULL, 'Capital city'),
          (7, 1, 1, 7, 'Jaipur', 1, NULL, 'Pink City gateway')
        ON DUPLICATE KEY UPDATE
          cityName = VALUES(cityName),
          isDeparturePoint = VALUES(isDeparturePoint),
          imageUrl = VALUES(imageUrl),
          description = VALUES(description)
      `);
    })();
  }
  return ensureGeoTablesPromise;
};

const toPositiveInt = (value, fallback = null) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const paginateQuery = async ({ query, countQuery, params = [], page, perPage }) => {
  await ensureGeoTables();
  const limit = perPage;
  const offset = (page - 1) * perPage;

  const [rows] = await pool.query(`${query} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const [[countRow]] = await pool.query(countQuery, params);
  const total = countRow.total || 0;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  return {
    data: rows,
    total,
    page,
    perPage,
    lastPage,
  };
};

const listContinents = async () => {
  await ensureGeoTables();
  const [rows] = await pool.query(
    `SELECT continentId, continentName
       FROM continents
      ORDER BY continentName ASC`
  );

  return rows;
};

const listCountries = async ({ page, perPage }) =>
  paginateQuery({
    query: `SELECT c.countryId, c.countryName, c.imageUrl, c.description,
                   c.continentId, co.continentName
              FROM countries c
              JOIN continents co ON co.continentId = c.continentId
             ORDER BY c.countryId DESC`,
    countQuery: `SELECT COUNT(1) AS total FROM countries c`,
    params: [],
    page,
    perPage,
  });

const listStates = async ({ page, perPage }) =>
  paginateQuery({
    query: `SELECT s.stateId, s.stateName, s.imageUrl, s.description,
                   s.continentId, co.continentName,
                   s.countryId, c.countryName
              FROM states s
              JOIN continents co ON co.continentId = s.continentId
              JOIN countries c ON c.countryId = s.countryId
             ORDER BY s.stateId DESC`,
    countQuery: `SELECT COUNT(1) AS total FROM states s`,
    params: [],
    page,
    perPage,
  });

const listStatesDropdown = async ({ countryId } = {}) => {
  await ensureGeoTables();
  const filters = [];
  const params = [];
  if (countryId) {
    filters.push("countryId = ?");
    params.push(countryId);
  }
  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT stateId, stateName, countryId, continentId
       FROM states
       ${whereClause}
       ORDER BY stateName ASC`,
    params
  );
  return rows;
};

const listCities = async ({ page, perPage }) =>
  paginateQuery({
    query: `SELECT ci.cityId AS citiesId, ci.cityName AS citiesName, ci.imageUrl, ci.description,
                   ci.continentId, co.continentName,
                   ci.countryId, c.countryName,
                   ci.stateId, s.stateName
              FROM cities ci
              JOIN continents co ON co.continentId = ci.continentId
              JOIN countries c ON c.countryId = ci.countryId
              JOIN states s ON s.stateId = ci.stateId
             ORDER BY ci.cityId DESC`,
    countQuery: `SELECT COUNT(1) AS total FROM cities ci`,
    params: [],
    page,
    perPage,
  });

const listCitiesDropdown = async ({ countryId, stateId, departureOnly } = {}) => {
  await ensureGeoTables();
  const filters = [];
  const params = [];
  if (countryId) {
    filters.push("countryId = ?");
    params.push(countryId);
  }
  if (stateId) {
    filters.push("stateId = ?");
    params.push(stateId);
  }
  if (departureOnly) {
    filters.push("isDeparturePoint = 1");
  }
  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const [rows] = await pool.query(
    `SELECT cityId AS citiesId, cityName AS citiesName, stateId, countryId, continentId, isDeparturePoint
       FROM cities
       ${whereClause}
       ORDER BY cityName ASC`,
    params
  );
  return rows;
};

const listSectors = async ({ page, perPage }) =>
  paginateQuery({
    query: `SELECT sectorId, sectorName
              FROM sectors
             ORDER BY sectorId DESC`,
    countQuery: `SELECT COUNT(1) AS total FROM sectors`,
    params: [],
    page,
    perPage,
  });

const listCountriesByContinent = async (continentId) => {
  await ensureGeoTables();
  const [rows] = await pool.query(
    `SELECT countryId, countryName
       FROM countries
      WHERE continentId = ?
      ORDER BY countryName ASC`,
    [continentId]
  );
  return rows;
};

const listStatesByCountry = async ({ continentId, countryId }) => {
  await ensureGeoTables();
  const [rows] = await pool.query(
    `SELECT stateId, stateName
       FROM states
      WHERE continentId = ? AND countryId = ?
      ORDER BY stateName ASC`,
    [continentId, countryId]
  );
  return rows;
};

const getCountryName = (payload = {}) => (payload.countryName || payload.country || "").trim();
const getCountryImage = (payload = {}) => payload.image || payload.imageUrl || "";
const getStateName = (payload = {}) => (payload.stateName || payload.state || "").trim();
const getStateImage = (payload = {}) => payload.image || payload.imageUrl || "";
const getCityName = (payload = {}) => (payload.citiesName || payload.cityName || "").trim();
const getCityImage = (payload = {}) => payload.image || payload.imageUrl || "";
const getCityDescription = (payload = {}) =>
  typeof payload.description === "string" ? payload.description.trim() : "";
const getSectorName = (payload = {}) => (payload.sectorName || payload.sector || "").trim();
const hasValue = (value) => typeof value !== "undefined" && value !== null;

const validateCountryPayload = (
  payload = {},
  { requireId = true, requireLocation = true } = {}
) => {
  if (requireId && !toPositiveInt(payload.countryId, null)) {
    return { ok: false, message: "countryId is required" };
  }

  const continentValue = hasValue(payload.continentId) ? payload.continentId : payload.continent;
  const continentId = toPositiveInt(continentValue, null);

  if (requireLocation) {
    if (!continentId) {
      return { ok: false, message: "continentId is required" };
    }
  } else if (hasValue(continentValue) && !continentId) {
    return { ok: false, message: "continentId is invalid" };
  }

  if (!getCountryName(payload)) {
    return { ok: false, message: "countryName is required" };
  }

  if (!getCountryImage(payload)) {
    return { ok: false, message: "image is required" };
  }

  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  if (!description) {
    return { ok: false, message: "description is required" };
  }

  return { ok: true };
};

const addCountry = async (payload) => {
  await ensureGeoTables();
  const continentId = toPositiveInt(payload.continentId || payload.continent, null);
  const countryName = getCountryName(payload);
  const imageUrl = getCountryImage(payload);
  const description = payload.description;

  const [result] = await pool.query(
    `INSERT INTO countries (
        continentId,
        countryName,
        imageUrl,
        description
      ) VALUES (?,?,?,?)`,
    [continentId, countryName, imageUrl, description]
  );

  return result.insertId;
};

const editCountry = async (payload) => {
  await ensureGeoTables();
  const countryId = toPositiveInt(payload.countryId, null);
  if (!countryId) {
    throw new Error("countryId is required");
  }

  const fields = [];
  const values = [];

  const continentValue = hasValue(payload.continentId) ? payload.continentId : payload.continent;
  if (hasValue(continentValue)) {
    fields.push("continentId = ?");
    values.push(toPositiveInt(continentValue, null));
  }

  const countryName = getCountryName(payload);
  if (countryName) {
    fields.push("countryName = ?");
    values.push(countryName);
  }

  if (hasValue(payload.image) || hasValue(payload.imageUrl)) {
    fields.push("imageUrl = ?");
    values.push(getCountryImage(payload));
  }

  if (hasValue(payload.description)) {
    fields.push("description = ?");
    values.push(payload.description);
  }

  if (!fields.length) {
    return;
  }

  fields.push("updatedAt = CURRENT_TIMESTAMP");
  values.push(countryId);

  await pool.query(
    `UPDATE countries
        SET ${fields.join(", ")}
      WHERE countryId = ?`,
    values
  );
};

const deleteCountry = async (countryId) => {
  await ensureGeoTables();
  await pool.query(`DELETE FROM countries WHERE countryId = ?`, [countryId]);
};

const validateStatePayload = (
  payload = {},
  { requireId = true, requireLocation = true } = {}
) => {
  if (requireId && !toPositiveInt(payload.stateId, null)) {
    return { ok: false, message: "stateId is required" };
  }

  const continentValue = hasValue(payload.continentId) ? payload.continentId : payload.continent;
  const countryValue = hasValue(payload.countryId) ? payload.countryId : payload.country;
  const continentId = toPositiveInt(continentValue, null);
  const countryId = toPositiveInt(countryValue, null);

  if (requireLocation) {
    if (!continentId) {
      return { ok: false, message: "continentId is required" };
    }
    if (!countryId) {
      return { ok: false, message: "countryId is required" };
    }
  } else {
    if (hasValue(continentValue) && !continentId) {
      return { ok: false, message: "continentId is invalid" };
    }
    if (hasValue(countryValue) && !countryId) {
      return { ok: false, message: "countryId is invalid" };
    }
  }

  if (!getStateName(payload)) {
    return { ok: false, message: "stateName is required" };
  }

  if (!getStateImage(payload)) {
    return { ok: false, message: "image is required" };
  }

  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  if (!description) {
    return { ok: false, message: "description is required" };
  }

  return { ok: true };
};

const addState = async (payload) => {
  await ensureGeoTables();
  const continentId = toPositiveInt(payload.continentId || payload.continent, null);
  const countryId = toPositiveInt(payload.countryId || payload.country, null);
  const stateName = getStateName(payload);
  const imageUrl = getStateImage(payload);
  const description = payload.description;

  const [result] = await pool.query(
    `INSERT INTO states (
        continentId,
        countryId,
        stateName,
        imageUrl,
        description
      ) VALUES (?,?,?,?,?)`,
    [continentId, countryId, stateName, imageUrl, description]
  );

  return result.insertId;
};

const editState = async (payload) => {
  await ensureGeoTables();
  const stateId = toPositiveInt(payload.stateId, null);
  if (!stateId) {
    throw new Error("stateId is required");
  }

  const fields = [];
  const values = [];

  const stateName = getStateName(payload);
  if (stateName) {
    fields.push("stateName = ?");
    values.push(stateName);
  }

  const continentValue = hasValue(payload.continentId) ? payload.continentId : payload.continent;
  if (hasValue(continentValue)) {
    fields.push("continentId = ?");
    values.push(toPositiveInt(continentValue, null));
  }

  const countryValue = hasValue(payload.countryId) ? payload.countryId : payload.country;
  if (hasValue(countryValue)) {
    fields.push("countryId = ?");
    values.push(toPositiveInt(countryValue, null));
  }

  if (hasValue(payload.image) || hasValue(payload.imageUrl)) {
    fields.push("imageUrl = ?");
    values.push(getStateImage(payload));
  }

  if (hasValue(payload.description)) {
    fields.push("description = ?");
    values.push(payload.description);
  }

  if (!fields.length) {
    return;
  }

  fields.push("updatedAt = CURRENT_TIMESTAMP");
  values.push(stateId);

  await pool.query(
    `UPDATE states
        SET ${fields.join(", ")}
      WHERE stateId = ?`,
    values
  );
};

const deleteState = async (stateId) => {
  await ensureGeoTables();
  await pool.query(`DELETE FROM states WHERE stateId = ?`, [stateId]);
};

const validateSectorPayload = (payload = {}, { requireId = true } = {}) => {
  if (requireId && !toPositiveInt(payload.sectorId, null)) {
    return { ok: false, message: "sectorId is required" };
  }

  if (!getSectorName(payload)) {
    return { ok: false, message: "sectorName is required" };
  }

  return { ok: true };
};

const addSector = async (payload) => {
  await ensureGeoTables();
  const sectorName = getSectorName(payload);
  const [result] = await pool.query(
    `INSERT INTO sectors (sectorName) VALUES (?)`,
    [sectorName]
  );
  return result.insertId;
};

const editSector = async (payload) => {
  await ensureGeoTables();
  const sectorId = toPositiveInt(payload.sectorId, null);
  if (!sectorId) {
    throw new Error("sectorId is required");
  }

  const sectorName = getSectorName(payload);
  if (!sectorName) {
    return;
  }

  await pool.query(
    `UPDATE sectors
        SET sectorName = ?, createdAt = createdAt
      WHERE sectorId = ?`,
    [sectorName, sectorId]
  );
};

const deleteSector = async (sectorId) => {
  await ensureGeoTables();
  await pool.query(`DELETE FROM sectors WHERE sectorId = ?`, [sectorId]);
};

const validateCityPayload = (
  payload = {},
  { requireId = true, requireLocation = true } = {}
) => {
  const cityId = toPositiveInt(payload.citiesId || payload.cityId || payload.id, null);
  if (requireId && !cityId) {
    return { ok: false, message: "citiesId is required" };
  }

  const continentValue = hasValue(payload.continentId) ? payload.continentId : payload.continent;
  const countryValue = hasValue(payload.countryId) ? payload.countryId : payload.country;
  const stateValue = hasValue(payload.stateId) ? payload.stateId : payload.state;

  const continentId = toPositiveInt(continentValue, null);
  const countryId = toPositiveInt(countryValue, null);
  const stateId = toPositiveInt(stateValue, null);

  if (requireLocation) {
    if (!continentId) {
      return { ok: false, message: "continentId is required" };
    }
    if (!countryId) {
      return { ok: false, message: "countryId is required" };
    }
    if (!stateId) {
      return { ok: false, message: "stateId is required" };
    }
  } else {
    if (hasValue(continentValue) && !continentId) {
      return { ok: false, message: "continentId is invalid" };
    }
    if (hasValue(countryValue) && !countryId) {
      return { ok: false, message: "countryId is invalid" };
    }
    if (hasValue(stateValue) && !stateId) {
      return { ok: false, message: "stateId is invalid" };
    }
  }

  const cityName = getCityName(payload);
  if (!cityName) {
    return { ok: false, message: "citiesName is required" };
  }

  if (!getCityImage(payload)) {
    return { ok: false, message: "image is required" };
  }

  if (!getCityDescription(payload)) {
    return { ok: false, message: "description is required" };
  }

  return { ok: true };
};

const editCity = async (payload) => {
  await ensureGeoTables();
  const cityId = toPositiveInt(payload.citiesId || payload.cityId || payload.id, null);
  if (!cityId) {
    throw new Error("citiesId is required");
  }

  const fields = [];
  const values = [];

  const continentValue = hasValue(payload.continentId) ? payload.continentId : payload.continent;
  if (hasValue(continentValue)) {
    fields.push("continentId = ?");
    values.push(toPositiveInt(continentValue, null));
  }

  const countryValue = hasValue(payload.countryId) ? payload.countryId : payload.country;
  if (hasValue(countryValue)) {
    fields.push("countryId = ?");
    values.push(toPositiveInt(countryValue, null));
  }

  const stateValue = hasValue(payload.stateId) ? payload.stateId : payload.state;
  if (hasValue(stateValue)) {
    fields.push("stateId = ?");
    values.push(toPositiveInt(stateValue, null));
  }

  if (hasValue(payload.isDeparturePoint)) {
    fields.push("isDeparturePoint = ?");
    values.push(payload.isDeparturePoint ? 1 : 0);
  }

  const cityName = getCityName(payload);
  if (cityName) {
    fields.push("cityName = ?");
    values.push(cityName);
  }

  if (getCityImage(payload)) {
    fields.push("imageUrl = ?");
    values.push(getCityImage(payload));
  }

  const description = getCityDescription(payload);
  if (description) {
    fields.push("description = ?");
    values.push(description);
  }

  if (!fields.length) {
    return;
  }

  fields.push("updatedAt = CURRENT_TIMESTAMP");
  values.push(cityId);

  await pool.query(
    `UPDATE cities
        SET ${fields.join(", ")}
      WHERE cityId = ?`,
    values
  );
};

const addCity = async (payload) => {
  await ensureGeoTables();
  const continentId = toPositiveInt(payload.continentId || payload.continent, null);
  const countryId = toPositiveInt(payload.countryId || payload.country, null);
  const stateId = toPositiveInt(payload.stateId || payload.state, null);
  const cityName = getCityName(payload);
  const imageUrl = getCityImage(payload);
  const description = getCityDescription(payload);
  const isDeparturePoint = payload.isDeparturePoint ? 1 : 0;

  const [result] = await pool.query(
    `INSERT INTO cities (
        continentId,
        countryId,
        stateId,
        cityName,
        isDeparturePoint,
        imageUrl,
        description
      ) VALUES (?,?,?,?,?,?,?)`,
    [continentId, countryId, stateId, cityName, isDeparturePoint, imageUrl, description]
  );

  return result.insertId;
};

const deleteCity = async (cityId) => {
  await ensureGeoTables();
  await pool.query(`DELETE FROM cities WHERE cityId = ?`, [cityId]);
};

module.exports = {
  toPositiveInt,
  listContinents,
  listCountries,
  listStates,
  listStatesDropdown,
  listCities,
  listCitiesDropdown,
  listSectors,
  listCountriesByContinent,
  listStatesByCountry,
  validateCountryPayload,
  addCountry,
  editCountry,
  deleteCountry,
  validateStatePayload,
  addState,
  editState,
  deleteState,
  validateSectorPayload,
  addSector,
  editSector,
  deleteSector,
  validateCityPayload,
  editCity,
  addCity,
  deleteCity,
};
