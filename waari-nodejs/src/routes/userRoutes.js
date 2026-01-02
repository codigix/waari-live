const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();

router.post("/user-login", userController.loginUser);
router.post("/login", userController.loginUser);
router.get("/lists-user", userController.listUsers);
router.get("/delete-user", userController.deleteUser);
router.get("/view-users-data", userController.viewUser);
router.get("/user/user-profile", userController.getUserProfile);
router.post("/update-user-status", userController.updateUserStatus);
router.post("/add-user", userController.addUser);
router.post("/update-users-data", userController.updateUser);
router.post("/user/edit-user-profile", userController.editUserProfile);

module.exports = router;
