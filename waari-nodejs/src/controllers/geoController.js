const geoService = require("../services/geoService");

const listContinents = async (req, res, next) => {
  try {
    const data = await geoService.listContinents();
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listCountries = async (req, res, next) => {
  try {
    const page = geoService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = geoService.toPositiveInt(req.query.perPage, 10) || 10;
    const result = await geoService.listCountries({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const listStates = async (req, res, next) => {
  try {
    const page = geoService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = geoService.toPositiveInt(req.query.perPage, 10) || 10;
    const result = await geoService.listStates({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const listStatesDropdown = async (req, res, next) => {
  try {
    const countryId = geoService.toPositiveInt(req.query.countryId, null);
    const data = await geoService.listStatesDropdown({ countryId });
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listCities = async (req, res, next) => {
  try {
    const page = geoService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = geoService.toPositiveInt(req.query.perPage, 10) || 10;
    const result = await geoService.listCities({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const listCitiesDropdown = async (req, res, next) => {
  try {
    const countryId = geoService.toPositiveInt(req.query.countryId, null);
    const stateId = geoService.toPositiveInt(req.query.stateId, null);
    const departureOnly = (req.query.departureOnly || "").toString().toLowerCase();
    const data = await geoService.listCitiesDropdown({
      countryId,
      stateId,
      departureOnly: departureOnly === "true" || departureOnly === "1",
    });
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

const listSectors = async (req, res, next) => {
  try {
    const page = geoService.toPositiveInt(req.query.page, 1) || 1;
    const perPage = geoService.toPositiveInt(req.query.perPage, 10) || 10;
    const result = await geoService.listSectors({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const listCountriesByContinent = async (req, res, next) => {
  try {
    const continentId = geoService.toPositiveInt(req.query.continentId, null);
    if (!continentId) {
      return res.status(400).json({ message: "continentId is required" });
    }
    const message = await geoService.listCountriesByContinent(continentId);
    res.json({ message });
  } catch (error) {
    next(error);
  }
};

const listStatesByCountry = async (req, res, next) => {
  try {
    const continentId = geoService.toPositiveInt(req.query.continentId, null);
    const countryId = geoService.toPositiveInt(req.query.countryId, null);
    if (!continentId || !countryId) {
      return res.status(400).json({ message: "continentId and countryId are required" });
    }
    const message = await geoService.listStatesByCountry({ continentId, countryId });
    res.json({ message });
  } catch (error) {
    next(error);
  }
};

const addCountry = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateCountryPayload(payload, { requireId: false });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    const countryId = await geoService.addCountry(payload);
    res.status(201).json({ message: "Country added successfully", countryId });
  } catch (error) {
    next(error);
  }
};

const editCountry = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateCountryPayload(payload, { requireLocation: false });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    await geoService.editCountry(payload);
    res.json({ message: "Country updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteCountry = async (req, res, next) => {
  try {
    const countryId = geoService.toPositiveInt(req.query.countryId, null);
    if (!countryId) {
      return res.status(400).json({ message: "countryId is required" });
    }
    await geoService.deleteCountry(countryId);
    res.json({ message: "Country deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addState = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateStatePayload(payload, { requireId: false });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    const stateId = await geoService.addState(payload);
    res.status(201).json({ message: "State added successfully", stateId });
  } catch (error) {
    next(error);
  }
};

const editState = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateStatePayload(payload, { requireLocation: false });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    await geoService.editState(payload);
    res.json({ message: "State updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteState = async (req, res, next) => {
  try {
    const stateId = geoService.toPositiveInt(req.query.stateId, null);
    if (!stateId) {
      return res.status(400).json({ message: "stateId is required" });
    }
    await geoService.deleteState(stateId);
    res.json({ message: "State deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addSector = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateSectorPayload(payload, { requireId: false });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    const sectorId = await geoService.addSector(payload);
    res.status(201).json({ message: "Sector added successfully", sectorId });
  } catch (error) {
    next(error);
  }
};

const editSector = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateSectorPayload(payload);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    await geoService.editSector(payload);
    res.json({ message: "Sector updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteSector = async (req, res, next) => {
  try {
    const sectorId = geoService.toPositiveInt(req.query.sectorId, null);
    if (!sectorId) {
      return res.status(400).json({ message: "sectorId is required" });
    }
    await geoService.deleteSector(sectorId);
    res.json({ message: "Sector deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const editCity = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateCityPayload(payload, { requireLocation: false });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    await geoService.editCity(payload);
    res.json({ message: "City updated successfully" });
  } catch (error) {
    next(error);
  }
};

const addCity = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const validation = geoService.validateCityPayload(payload, { requireId: false });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    const cityId = await geoService.addCity(payload);
    res.status(201).json({ message: "City added successfully", cityId });
  } catch (error) {
    next(error);
  }
};

const deleteCity = async (req, res, next) => {
  try {
    const cityId = geoService.toPositiveInt(req.query.citiesId, null);
    if (!cityId) {
      return res.status(400).json({ message: "citiesId is required" });
    }
    await geoService.deleteCity(cityId);
    res.json({ message: "City deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContinents,
  listCountries,
  listStates,
  listStatesDropdown,
  listCities,
  listCitiesDropdown,
  listSectors,
  listCountriesByContinent,
  listStatesByCountry,
  addCountry,
  editCountry,
  deleteCountry,
  addState,
  editState,
  deleteState,
  addSector,
  editSector,
  deleteSector,
  editCity,
  addCity,
  deleteCity,
};
