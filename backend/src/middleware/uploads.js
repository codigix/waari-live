// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Configure storage (where and how to save files)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
    // directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
