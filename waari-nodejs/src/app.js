const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { uploadsDir } = require("../config/storage");

const app = express();

app.set("etag", false);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
