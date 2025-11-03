const express = require("express");
const router = express.Router();
const userController = require("../controllers/admin/userController");
const upload = require("../middleware/uploads");
// GET /api/user/user-profile?userId=1
router.get("/user-profile", userController.userProfile);
router.post("/edit-user-profile", userController.editUserProfile);
router.post("/image-upload", upload.single("image"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    image_url: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
