const { Router } = require("express");
const uploadMiddleware = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");

const router = Router();

router.post(
  "/image-upload",
  uploadMiddleware.single("image"),
  uploadController.uploadDocument
);

router.post(
  "/user/image-upload",
  uploadMiddleware.single("image"),
  uploadController.uploadDocument
);

module.exports = router;
