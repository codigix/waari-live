const path = require("path");
const multer = require("multer");
const { uploadsDir, ensureDir } = require("../../config/storage");

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const resolveDocumentDir = (req) => {
  const typeFromBody = req.body && req.body.type ? req.body.type : null;
  const typeFromQuery = req.query && req.query.type ? req.query.type : null;
  const documentType = (typeFromBody || typeFromQuery || "documents")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-") || "documents";

  const targetDir = path.join(uploadsDir, documentType);
  ensureDir(targetDir);
  return targetDir;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const dir = resolveDocumentDir(req);
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${timestamp}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
