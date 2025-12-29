const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.get("/lists-user", userController.listUsers);
router.get("/delete-user", userController.deleteUser);
router.get("/view-users-data", userController.viewUser);
router.post("/update-user-status", userController.updateUserStatus);
router.post("/add-user", userController.addUser);
router.post("/update-users-data", userController.updateUser);

module.exports = router;
