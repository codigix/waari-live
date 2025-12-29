const userService = require("../services/userService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const listUsers = async (req, res, next) => {
  try {
    const page = toPositiveInt(req.query.page, 1);
    const perPage = toPositiveInt(req.query.perPage, 10);
    const result = await userService.listUsers({ page, perPage });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    await userService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    if (!userId || typeof status === "undefined") {
      return res.status(400).json({ message: "userId and status are required" });
    }
    await userService.updateUserStatus({ userId, status });
    res.json({ message: "User status updated" });
  } catch (error) {
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.userName || !payload.email || !payload.roleId) {
      return res
        .status(400)
        .json({ message: "userName, email, and roleId are required" });
    }

    const user = await userService.createUser(payload);
    res.status(201).json({ message: "User created successfully", userId: user.userId });
  } catch (error) {
    next(error);
  }
};

const viewUser = async (req, res, next) => {
  try {
    const rawUserId =
      typeof req.query.userId !== "undefined"
        ? req.query.userId
        : req.query.params?.userId;
    const userId = toPositiveInt(rawUserId, null);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await userService.updateUser(payload);
    res.json({ message: "User updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  deleteUser,
  updateUserStatus,
  addUser,
  viewUser,
  updateUser,
};
