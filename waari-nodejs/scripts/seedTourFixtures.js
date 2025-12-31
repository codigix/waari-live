const fs = require("fs");
const path = require("path");
const pool = require("../database/pool");

const resolveSeedPath = () => path.resolve(__dirname, "tourFixtures.seed.json");

const readSeedFile = () => {
  const seedPath = resolveSeedPath();
  if (!fs.existsSync(seedPath)) {
    console.error(`Seed file not found at ${seedPath}`);
    return {};
  }
  try {
    const content = fs.readFileSync(seedPath, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== "object") {
      console.error("Seed file must export a JSON object of fixtureKey: value pairs");
      return {};
    }
    return parsed;
  } catch (error) {
    console.error("Unable to read tourFixtures.seed.json", error);
    return {};
  }
};

const getFixtureEntries = () => Object.entries(readSeedFile()).filter(([key]) => Boolean(key));

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tour_fixtures (
      fixtureKey VARCHAR(100) NOT NULL PRIMARY KEY,
      fixtureValue JSON NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

const insertFixture = async (key, value) => {
  const payload = JSON.stringify(value ?? null);
  await pool.query(
    `INSERT INTO tour_fixtures (fixtureKey, fixtureValue)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE fixtureValue = VALUES(fixtureValue)`
    ,
    [key, payload]
  );
};

(async () => {
  try {
    console.log("Seeding tour fixtures...");
    await ensureTable();
    const entries = getFixtureEntries();
    if (!entries.length) {
      console.log("No fixtures found to seed.");
      process.exit(0);
    }
    for (const [key, value] of entries) {
      await insertFixture(key, value);
    }
    console.log(`Seeded ${entries.length} tour fixtures.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed tour fixtures", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
