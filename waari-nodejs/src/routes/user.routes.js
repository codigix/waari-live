const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/uploads");

// ✅ User profile APIs
router.get("/user-profile", userController.userProfile);
router.post("/edit-user-profile", userController.editUserProfile);

// ✅ File upload API (multer only here)
router.post("/image-upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ image_url: fileUrl });
});

module.exports = router;
