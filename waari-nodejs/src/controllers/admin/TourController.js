// billController.js
const db = require("../../../db");
const CommonController = require("../CommonController");

exports.cityList = async (req, res) => {
  try {
    const tokenData = await CommonController.checkToken(req.headers["token"], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    let query = 'SELECT * FROM cities';
    const params = [];

    if (req.query.stateId) {
      query += ' WHERE stateId = ?';
      params.push(req.query.stateId);
    } else if (req.query.countryId) {
      query += ' WHERE countryId = ?';
      params.push(req.query.countryId);
    }

    db.execute(query, params, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const cityArray = results.map((value) => ({
        cityId: value.citiesId,
        citiesId: value.citiesId,
        stateId: value.stateId,
        citiesName: value.citiesName,
        image: value.image || '',
        description: value.description || '',
      }));

      res.json({ data: cityArray });
    });
  } catch (error) {
    console.error('Error in cityList:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
