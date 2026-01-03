const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const userService = require("../services/userService");

const toPositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const isBcryptHash = (value) => typeof value === "string" && value.startsWith("$2");

const verifyPassword = async (input, stored) => {
  if (!stored) {
    return false;
  }
  if (isBcryptHash(stored)) {
    return bcrypt.compare(String(input), stored);
  }
  return String(input) === String(stored);
};

const formatAuthUser = (user) => ({
  userId: user.userId,
  userName: user.userName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  email: user.email,
  roleId: user.roleId,
  roleName: user.roleName || "",
  contact: user.contact || "",
  status: user.status ? 1 : 0,
});

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.status) {
      return res.status(403).json({ message: "User disabled" });
    }
    const payload = {
      userId: user.userId,
      roleId: user.roleId,
      email: user.email,
    };
    const token = jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiresIn,
    });
    res.json({ message: "Login successful", token, user: formatAuthUser(user) });
  } catch (error) {
    next(error);
  }
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

const getUserProfile = async (req, res, next) => {
  try {
    const userId = toPositiveInt(req.query.userId ?? req.params?.userId ?? req.body?.userId, null);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user, message: "User profile fetched successfully" });
  } catch (error) {
    next(error);
  }
};

const editUserProfile = async (req, res, next) => {
  try {
    const payload = req.body || {};
    const userId = toPositiveInt(payload.userId, null);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const existing = await userService.getUserById(userId);
    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = await userService.updateUser({
      userId,
      userName: payload.userName ?? existing.userName,
      email: payload.email ?? existing.email,
      contact: payload.phone ?? payload.contact ?? existing.contact,
      address: payload.address ?? existing.address,
      establishmentName: payload.establishmentName ?? existing.establishmentName,
      establishmentTypeId: payload.establishmentTypeId ?? existing.establishmentTypeId,
      adharNo: payload.adharNo ?? existing.adharNo,
      adharCard: payload.adharCard ?? existing.adharCard,
      panNo: payload.panNo ?? existing.panNo,
      pan: payload.pan ?? existing.pan,
      city: payload.city ?? existing.city,
      pincode: payload.pincode ?? existing.pincode,
      state: payload.state ?? existing.state,
      alternatePhone: payload.alternatePhone ?? existing.alternatePhone,
      shopAct: payload.shopAct ?? existing.shopAct,
      accName: payload.accName ?? existing.accName,
      accNo: payload.accNo ?? existing.accNo,
      bankName: payload.bankName ?? existing.bankName,
      branch: payload.branch ?? existing.branch,
      ifsc: payload.ifsc ?? existing.ifsc,
      cheque: payload.cheque ?? existing.cheque,
      logo: payload.logo ?? existing.logo,
    });
    res.json({ message: "User profile updated successfully", data: user });
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
  loginUser,
  listUsers,
  deleteUser,
  updateUserStatus,
  addUser,
  viewUser,
  getUserProfile,
  editUserProfile,
  updateUser,
};
