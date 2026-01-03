const pool = require("../../db");
const toursData = require("./tourDataStore");

const isPlainObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const applyFixtureValue = (key, value) => {
  if (Array.isArray(value)) {
    if (!Array.isArray(toursData[key])) {
      toursData[key] = [];
    }
    toursData[key].splice(0, toursData[key].length, ...value);
    return;
  }
  if (isPlainObject(value)) {
    if (!isPlainObject(toursData[key])) {
      toursData[key] = {};
    }
    const target = toursData[key];
    Object.keys(target).forEach((prop) => delete target[prop]);
    Object.assign(target, value);
    return;
  }
  toursData[key] = value;
};

const parseFixture = (value) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn("Unable to parse fixture JSON", error);
      return undefined;
    }
  }
  return value;
};

const serializeFixture = (value) => JSON.stringify(value ?? null);

const loadTourFixtures = async () => {
  const [rows] = await pool.query("SELECT fixtureKey, fixtureValue FROM tour_fixtures");
  rows.forEach(({ fixtureKey, fixtureValue }) => {
    const parsed = parseFixture(fixtureValue);
    if (parsed !== undefined) {
      applyFixtureValue(fixtureKey, parsed);
    }
  });
  console.log(`Loaded ${rows.length} tour fixtures from database.`);
};

const persistTourFixture = async (fixtureKey, value) => {
  if (!fixtureKey) {
    return;
  }
  const payload = value !== undefined ? value : toursData[fixtureKey];
  if (payload === undefined) {
    return;
  }
  await pool.query(
    `INSERT INTO tour_fixtures (fixtureKey, fixtureValue) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE fixtureValue = VALUES(fixtureValue)`,
    [fixtureKey, serializeFixture(payload)]
  );
};

const persistTourFixtures = async (fixtureKeys) => {
  if (Array.isArray(fixtureKeys) && fixtureKeys.length) {
    for (const key of fixtureKeys) {
      await persistTourFixture(key);
    }
    return;
  }
  const entries = Object.keys(toursData);
  for (const key of entries) {
    await persistTourFixture(key);
  }
};

module.exports = {
  loadTourFixtures,
  persistTourFixture,
  persistTourFixtures,
};
