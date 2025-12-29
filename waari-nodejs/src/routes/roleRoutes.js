const { Router } = require("express");
const roleController = require("../controllers/roleController");

const router = Router();

router.get("/list-roles", roleController.listRoles);
router.get("/get-cats", roleController.getPermissionCategories);
router.get("/get-lists", roleController.getPermissionLists);
router.get("/test-permission/:roleId", roleController.getRolePermissions);

module.exports = router;
