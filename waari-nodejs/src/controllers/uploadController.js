const path = require("path");
const { uploadsDir } = require("../../config/storage");

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const relativeFilePath = path
      .relative(uploadsDir, req.file.path)
      .split(path.sep)
      .join("/");

    const publicPath = `/uploads/${relativeFilePath}`;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}${publicPath}`;

    res.json({ image_url: imageUrl, file_path: publicPath });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
};
