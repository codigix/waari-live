const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const db = require("../../../db");
const pool = require("../../../db");
const { validationResult } = require("express-validator");
const path = require("path");
// MySQL connection pool
const CommonController = require("../CommonController");
const dotenv = require("dotenv");
dotenv.config();

// Helper: Verify Token with Role Access
const verifyToken = (allowedRoleIds) => {
  return (req, res, next) => {
    const token = req.headers["token"];
    if (!token) return res.status(401).json({ message: "Token required" });

    jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret",
      (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Invalid or expired token" });
        if (!allowedRoleIds.includes(decoded.roleId)) {
          return res.status(403).json({ message: "Unauthorized access" });
        }
        req.user = decoded;
        next();
      }
    );
  };
};

// --------------------------
// 1. Admin Login
// --------------------------
exports.adminLogin = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((e) => e.message) });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email]
    );

    const admin = rows[0];
    if (!admin) {
      return res.status(422).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!isPasswordValid) {
      return res.status(422).json({ message: "Invalid password" });
    }

    // Generate token & OTP
    const token = Math.floor(100000 + Math.random() * 900000) + "" + Date.now();
    const otp = 123456; // In production, send via email/SMS

    await connection.query(
      "UPDATE users SET token = ?, otp = ? WHERE userId = ?",
      [token, otp, admin.userId]
    );

    return res.status(200).json({
      message: "Sales logged in successfully",
      token,
      roleId: admin.roleId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

// --------------------------
// 2. Add Office Details
// --------------------------
exports.addOfficeDetails = [
  verifyToken([334]),
  async (req, res) => {
    const schema = Joi.object({
      cityName: Joi.string().max(255).required(),
      address: Joi.string().max(255).required(),
      officeTiming: Joi.string().max(255).required(),
      contactNo: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
      email: Joi.string().email().max(255).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.query(
        `INSERT INTO officedetails (cityName, address, officeTiming, contactNo, email) VALUES (?, ?, ?, ?, ?)`,
        [
          req.body.cityName,
          req.body.address,
          req.body.officeTiming,
          req.body.contactNo,
          req.body.email,
        ]
      );
      return res.status(200).json({ message: "Office added successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to add office details" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 3. Delete Office Details
// --------------------------
exports.deleteOfficeDetails = [
  verifyToken([336]),
  async (req, res) => {
    const schema = Joi.object({
      officedetailId: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        "DELETE FROM officedetails WHERE officedetailId = ?",
        [req.body.officedetailId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Office Details Not Found" });
      }

      return res
        .status(200)
        .json({ message: "Office Details Deleted Successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 4. Edit Office Details (Get)
// --------------------------
exports.editOfficeDetails = [
  verifyToken([338]),
  async (req, res) => {
    const schema = Joi.object({
      officedetailId: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM officedetails WHERE officedetailId = ?",
        [req.body.officedetailId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Office Details Not Found" });
      }

      return res.status(200).json({ data: rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 5. Update Office Details
// --------------------------
exports.updateOfficeDetails = [
  verifyToken([337]),
  async (req, res) => {
    const schema = Joi.object({
      officedetailId: Joi.number().integer().required(),
      cityName: Joi.string().max(255).required(),
      address: Joi.string().max(255).required(),
      officeTiming: Joi.string().max(255).required(),
      contactNo: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
      email: Joi.string().email().max(255).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        `UPDATE officedetails SET cityName = ?, address = ?, officeTiming = ?, contactNo = ?, email = ? WHERE officedetailId = ?`,
        [
          req.body.cityName,
          req.body.address,
          req.body.officeTiming,
          req.body.contactNo,
          req.body.email,
          req.body.officedetailId,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Office not found" });
      }

      return res.status(200).json({ message: "Office updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Update failed" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 6. Admin Dashboard
// --------------------------
exports.adminDashboard = [
  verifyToken([1]),
  async (req, res) => {
    let connection;
    try {
      connection = await pool.getConnection();

      const [groupToursCount] = await connection.query(
        "SELECT COUNT(*) AS count FROM grouptours"
      );
      const [salesCount] = await connection.query(
        "SELECT COUNT(*) AS count FROM users WHERE roleId = 2"
      );
      const [guestCount] = await connection.query(
        "SELECT COUNT(*) AS count FROM users WHERE roleId = 5"
      );

      return res.status(200).json({
        groupToursCount: groupToursCount[0].count,
        salesCount: salesCount[0].count,
        guestNumber: guestCount[0].count,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Failed to fetch dashboard data" });
    } finally {
      if (connection) connection.release();
    }
  },
];

exports.continentCountryList = async (req, res) => {
  let connection;
  try {
    const { continentId } = req.query;

    // ✅ Validation
    if (!continentId) {
      return res.status(400).json({ message: ["continentId is required"] });
    }

    connection = await pool.getConnection();

    // ✅ Fetch countries joined with continents
    const [countries] = await connection.query(
      `SELECT c.countryId, c.continentId, c.countryName, c.image, c.description,
              co.continentName
       FROM countries c
       JOIN continents co ON c.continentId = co.continentId
       WHERE c.continentId = ?`,
      [continentId]
    );

    // Map results into desired format
    const countriesArray = countries.map((value) => ({
      countryId: value.countryId,
      continentId: value.continentId,
      countryName: value.countryName,
      continentName: value.continentName,
      image: value.image,
      description: value.description,
    }));

    return res.status(200).json({ message: countriesArray });
  } catch (err) {
    console.error("Error in continentCountryList:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};
// Required imports

// =================== Add City Controller ===================
exports.addCity = async (req, res) => {
  let connection;
  try {
    const {
      continentId,
      countryId,
      stateId,
      citiesName,
      description,
      image: bodyImage,
    } = req.body;

    // Accept uploaded file or image URL
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : bodyImage || null;

    // Validation
    if (!continentId || !countryId || !citiesName || !image || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    connection = await pool.getConnection();

    // Check continent-country match
    const [check] = await connection.query(
      "SELECT * FROM countries WHERE continentId = ? AND countryId = ?",
      [continentId, countryId]
    );
    if (check.length === 0) {
      return res.status(404).json({ message: "Continent-country not matched" });
    }

    // Check if city already exists
    const [existingCity] = await connection.query(
      "SELECT * FROM cities WHERE continentId = ? AND countryId = ? AND citiesName = ?",
      [continentId, countryId, citiesName]
    );
    if (existingCity.length > 0) {
      return res.status(409).json({ message: "City already exists" });
    }

    // ✅ Default clientcode
    const clientcode = "C001";

    // Insert city
    await connection.query(
      `INSERT INTO cities
       (continentId, countryId, stateId, citiesName, image, description, clientcode, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        continentId,
        countryId,
        stateId || null,
        citiesName,
        image,
        description,
        clientcode,
      ]
    );

    return res.status(200).json({ message: "City added successfully", image });
  } catch (err) {
    console.error("Error in addCity:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};

// --------------------------
// Add State
// --------------------------
exports.addState = async (req, res) => {
  let connection;
  try {
    const {
      continentId,
      countryId,
      stateName,
      description,
      image: bodyImage,
    } = req.body;

    // Accept uploaded file or image URL
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : bodyImage || null;

    // Validation
    if (!continentId || !countryId || !stateName || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    connection = await pool.getConnection();

    // Check if country exists for continent
    const [checkCountry] = await connection.query(
      "SELECT * FROM countries WHERE continentId = ? AND countryId = ?",
      [continentId, countryId]
    );
    if (checkCountry.length === 0) {
      return res
        .status(404)
        .json({ message: "Continent and Country do not match" });
    }

    const clientcode = "C001";

    await connection.query(
      `INSERT INTO states
       (continentId, countryId, stateName, image, description, clientcode, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [continentId, countryId, stateName, image, description, clientcode]
    );

    return res.status(200).json({ message: "State added successfully", image });
  } catch (err) {
    console.error("Error in addState:", err);
    return res
      .status(500)
      .json({ message: "Failed to add state", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};
// controllers/stateController.js

exports.getContinentCountryStateList = async (req, res) => {
  let connection;

  try {
    const { continentId, countryId } = req.query;

    // ✅ Validate required query params
    if (!continentId || !countryId) {
      return res
        .status(400)
        .json({ message: "continentId and countryId are required" });
    }

    connection = await pool.getConnection();

    // ✅ Query states
    const [states] = await connection.query(
      "SELECT stateId, stateName, countryId, continentId FROM states WHERE continentId = ? AND countryId = ?",
      [continentId, countryId]
    );

    if (states.length === 0) {
      return res.status(200).json({ message: [] });
    }

    // ✅ Map results
    const countriesArray = states.map((state) => ({
      stateId: state.stateId,
      stateName: state.stateName,
      countryId: state.countryId,
      continentId: state.continentId,
    }));

    return res.status(200).json({ message: countriesArray });
  } catch (err) {
    console.error("Error fetching states:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch states", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};

// --------------------------
// 7. Add Country
// --------------------------
// controllers/countryController.js

exports.addCountry = async (req, res) => {
  let connection;
  try {
    const { continentId, countryName, description, image } = req.body;

    // ✅ Basic validation
    if (!continentId || !countryName || !image || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    connection = await pool.getConnection();

    // ✅ Check if country already exists in this continent
    const [check] = await connection.query(
      "SELECT * FROM countries WHERE continentId = ? AND countryName = ?",
      [continentId, countryName]
    );

    if (check.length > 0) {
      return res
        .status(409)
        .json({ message: "Country already exists in this continent" });
    }

    // ✅ Default clientcode like in your supplier payments route
    const clientcode = "C001";

    // ✅ Insert new country
    await connection.query(
      `INSERT INTO countries 
      (continentId, countryName, image, description, clientcode, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [continentId, countryName, image, description, clientcode]
    );

    return res.status(200).json({ message: "Country added successfully" });
  } catch (err) {
    console.error("Error in addCountry:", err);
    return res
      .status(500)
      .json({ message: "Failed to add country", error: err.message });
  } finally {
    if (connection) connection.release();
  }
};

// --------------------------
// 8. Add Sectors
// --------------------------
exports.addSectors = [
  verifyToken([73]),
  async (req, res) => {
    const schema = Joi.object({
      sectorName: Joi.string().max(255).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      const [check] = await connection.query(
        "SELECT * FROM sectors WHERE sectorName = ?",
        [req.body.sectorName]
      );
      if (check.length > 0) {
        return res.status(409).json({ message: "Sector already exists" });
      }

      await connection.query("INSERT INTO sectors (sectorName) VALUES (?)", [
        req.body.sectorName,
      ]);
      return res.status(200).json({ message: "Sectors added successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to add sector" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 9. Add Tour Type
// --------------------------
exports.addTourType = [
  verifyToken([1]),
  async (req, res) => {
    const schema = Joi.object({
      tourTypeName: Joi.string().max(255).required(),
      tourTypeImage: Joi.string().max(255).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.query(
        "INSERT INTO tourtype (tourTypeName, tourTypeImage) VALUES (?, ?)",
        [req.body.tourTypeName, req.body.tourTypeImage]
      );
      return res.status(200).json({ message: "Tour Type added successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to add tour type" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 10. Get Edit Tour Type
// --------------------------
exports.getEditTourType = [
  verifyToken([1]),
  async (req, res) => {
    const schema = Joi.object({
      tourTypeId: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      const [rows] = await connection.query(
        "SELECT * FROM tourtype WHERE tourTypeId = ?",
        [req.body.tourTypeId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: "Tour type not found" });
      }
      return res.status(200).json({ data: rows[0] });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 11. Edit Tour Type
// --------------------------
exports.editTourType = [
  verifyToken([1]),
  async (req, res) => {
    const schema = Joi.object({
      tourTypeId: Joi.number().integer().required(),
      tourTypeName: Joi.string().max(255).required(),
      tourTypeImage: Joi.string().max(255).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query(
        "UPDATE tourtype SET tourTypeName = ?, tourTypeImage = ? WHERE tourTypeId = ?",
        [req.body.tourTypeName, req.body.tourTypeImage, req.body.tourTypeId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tour type not found" });
      }

      return res
        .status(200)
        .json({ message: "Tour Type Updated Successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Update failed" });
    } finally {
      if (connection) connection.release();
    }
  },
];

// --------------------------
// 12. Delete Tour Type
// --------------------------
exports.deleteTourType = [
  verifyToken([1]),
  async (req, res) => {
    const schema = Joi.object({
      tourTypeId: Joi.number().integer().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    let connection;
    try {
      connection = await pool.getConnection();

      const [checkGroup] = await connection.query(
        "SELECT * FROM grouptours WHERE tourTypeId = ?",
        [req.body.tourTypeId]
      );
      if (checkGroup.length > 0) {
        return res
          .status(409)
          .json({ message: "This tour type is used in group tours" });
      }

      const [result] = await connection.query(
        "DELETE FROM tourtype WHERE tourTypeId = ?",
        [req.body.tourTypeId]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tour type not found" });
      }

      return res
        .status(200)
        .json({ message: "Tour Type deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Delete failed" });
    } finally {
      if (connection) connection.release();
    }
  },
];

exports.planEnqUsersListGt = async (req, res) => {
  try {
    const token = req.headers["token"];
    const tokenData = await CommonController.checkToken(token, [303]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * perPage;

    // ✅ Count total
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM planenqusers 
       INNER JOIN grouptours ON planenqusers.groupTourId = grouptours.groupTourId
       LEFT JOIN dropdownenquiryreference ON planenqusers.hearAbout = dropdownenquiryreference.enquiryReferId
       WHERE planenqusers.planningType = 1`
    );
    const total = countResult[0].total;

    // ✅ Fetch paginated results
    const [planusers] = await db.query(
      `SELECT planenqusers.*, grouptours.tourName, dropdownenquiryreference.enquiryReferName
       FROM planenqusers
       INNER JOIN grouptours ON planenqusers.groupTourId = grouptours.groupTourId
       LEFT JOIN dropdownenquiryreference ON planenqusers.hearAbout = dropdownenquiryreference.enquiryReferId
       WHERE planenqusers.planningType = 1
       ORDER BY planenqusers.startDate ASC
       LIMIT ? OFFSET ?`,
      [perPage, offset]
    );

    const contactusers_array = planusers.map((value) => ({
      id: value.id,
      firstName: value.firstName,
      contactNo: value.contactNo,
      tourName: value.tourName,
      noOfTravelPeople: value.noOfTravelPeople,
      hearAbout: value.hearAbout,
      enquiryReferName: value.enquiryReferName,
      comments: value.comments,
    }));

    const lastPage = Math.ceil(total / perPage);
    const nextPageUrl =
      page < lastPage
        ? `/plan-enq-users-list-gt?page=${page + 1}&perPage=${perPage}`
        : null;
    const previousPageUrl =
      page > 1
        ? `/plan-enq-users-list-gt?page=${page - 1}&perPage=${perPage}`
        : null;

    return res.status(200).json({
      data: contactusers_array,
      total,
      currentPage: page,
      perPage,
      nextPageUrl,
      previousPageUrl,
      lastPage,
    });
  } catch (error) {
    console.error("Error fetching plan enquiry users:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.planEnqUsersListCt = async (req, res) => {
  try {
    // ✅ Token check
    const token = req.headers["token"];
    const tokenData = await CommonController.checkToken(token, [305]);
    if (tokenData.error) return res.status(401).json(tokenData);

    // ✅ Pagination
    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * perPage;

    // ✅ Count total
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total
       FROM planenqusers
       LEFT JOIN dropdownenquiryreference 
       ON planenqusers.hearAbout = dropdownenquiryreference.enquiryReferId
       WHERE planenqusers.planningType = 2`
    );
    const total = countResult[0].total;

    // ✅ Fetch paginated results
    const [planusers] = await db.query(
      `SELECT planenqusers.*, dropdownenquiryreference.enquiryReferName
       FROM planenqusers
       LEFT JOIN dropdownenquiryreference 
       ON planenqusers.hearAbout = dropdownenquiryreference.enquiryReferId
       WHERE planenqusers.planningType = 2
       ORDER BY planenqusers.startDate ASC
       LIMIT ? OFFSET ?`,
      [perPage, offset]
    );

    // ✅ Transform data
    const contactusers_array = planusers.map((value) => ({
      id: value.id,
      firstName: value.firstName,
      contactNo: value.contactNo,
      groupName: value.groupName,
      noOfTravelPeople: value.noOfTravelPeople,
      hearAbout: value.hearAbout,
      enquiryReferName: value.enquiryReferName,
      comments: value.comments,
      startDate: value.startDate,
      endDate: value.endDate,
      pricePerPersonMin: value.pricePerPersonMin,
      pricePerPersonMax: value.pricePerPersonMax,
    }));

    // ✅ Pagination meta
    const lastPage = Math.ceil(total / perPage);
    const nextPageUrl =
      page < lastPage
        ? `/plan-enq-users-list-ct?page=${page + 1}&perPage=${perPage}`
        : null;
    const previousPageUrl =
      page > 1
        ? `/plan-enq-users-list-ct?page=${page - 1}&perPage=${perPage}`
        : null;

    return res.status(200).json({
      data: contactusers_array,
      total,
      currentPage: page,
      perPage,
      nextPageUrl,
      previousPageUrl,
      lastPage,
    });
  } catch (error) {
    console.error("Error fetching plan enquiry users (CT):", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getAssignToUsersList = async (req, res) => {
  try {
    const token = req.headers["token"];
    const tokenData = await CommonController.checkToken(token, [302, 304]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * perPage;

    // ✅ Count total users
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE roleId != 1`
    );
    const total = countRows[0].total; // must use [0].total

    // ✅ Fetch paginated users
    const [users] = await db.query(
      `SELECT u.userId, u.userName, r.roleName
       FROM users u
       JOIN roles r ON u.roleId = r.roleId
       WHERE u.roleId != 1
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [perPage, offset]
    );

    // ✅ Transform
    const users_array = users.map((value) => ({
      userId: value.userId,
      userName: value.userName,
      roleName: value.roleName,
    }));

    // ✅ Pagination meta
    const lastPage = Math.ceil(total / perPage);
    const nextPageUrl =
      page < lastPage
        ? `/get-assign-to-users-list?page=${page + 1}&perPage=${perPage}`
        : null;
    const previousPageUrl =
      page > 1
        ? `/get-assign-to-users-list?page=${page - 1}&perPage=${perPage}`
        : null;

    return res.status(200).json({
      data: users_array,
      total,
      currentPage: page,
      perPage,
      nextPageUrl,
      previousPageUrl,
      lastPage,
    });
  } catch (error) {
    console.error("❌ Error fetching assign-to users list:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.viewPlanEnqUsersDataGt = async (req, res) => {
  try {
    const { planEnqId } = req.query; // Laravel used $request->planEnqId

    // ✅ Validation
    if (!planEnqId) {
      return res.status(400).json({ message: ["planEnqId is required"] });
    }

    // ✅ Token check
    const token = req.headers["token"];
    const tokenData = await CommonController.checkToken(token, [302]);
    if (tokenData.error) return res.status(401).json(tokenData);

    // ✅ Fetch data
    const [rows] = await db.query(
      "SELECT * FROM planenqusers WHERE id = ? AND planningType = 1 LIMIT 1",
      [planEnqId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "plan enquiry not found" });
    }

    return res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error("❌ Error in viewPlanEnqUsersDataGt:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
