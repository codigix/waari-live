const path = require("path");
const { uploadsDir } = require("../../config/storage");

const normalizeUploadPath = (filePath) =>
  path
    .relative(uploadsDir, filePath)
    .split(path.sep)
    .join("/");

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const relativeFilePath = normalizeUploadPath(req.file.path);
    const publicPath = `/uploads/${relativeFilePath}`;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}${publicPath}`;

    res.json({ image_url: imageUrl, file_path: publicPath });
  } catch (error) {
    next(error);
  }
};

const uploadPackageDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }
    const relativeFilePath = normalizeUploadPath(req.file.path);
    const publicPath = `/uploads/${relativeFilePath}`;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const pdfUrl = `${baseUrl}${publicPath}`;
    res.json({ pdf: publicPath, pdf_url: pdfUrl, file_path: publicPath });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  uploadPackageDocument,
};
