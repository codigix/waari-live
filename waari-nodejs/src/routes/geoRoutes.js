const { Router } = require("express");
const geoController = require("../controllers/geoController");

const router = Router();

router.get("/dropdown-continents", geoController.listContinents);
router.get("/all-country-list", geoController.listCountries);
router.get("/all-state-list", geoController.listStates);
router.get("/state-list", geoController.listStatesDropdown);
router.get("/all-city-list", geoController.listCities);
router.get("/city-list", geoController.listCitiesDropdown);
router.get("/sectors-list", geoController.listSectors);
router.get("/continent-country-list", geoController.listCountriesByContinent);
router.get("/continent-country-state-list", geoController.listStatesByCountry);
router.post("/add-country", geoController.addCountry);
router.post("/edit-country", geoController.editCountry);
router.get("/delete-country", geoController.deleteCountry);
router.post("/add-state", geoController.addState);
router.post("/edit-state", geoController.editState);
router.get("/delete-state", geoController.deleteState);
router.post("/add-sectors", geoController.addSector);
router.post("/update-sectors", geoController.editSector);
router.get("/delete-sector", geoController.deleteSector);
router.post("/add-city", geoController.addCity);
router.post("/edit-city", geoController.editCity);
router.get("/delete-city", geoController.deleteCity);

module.exports = router;
