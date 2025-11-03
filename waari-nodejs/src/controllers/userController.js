// const pool = require("../../db");

// // ✅ Get User Profile (query param, not path param)
// exports.userProfile = async (req, res) => {
//   const { userId } = req.query;

//   if (!userId) {
//     return res.status(400).json({ message: "userId is required" });
//   }

//   try {
//     const [userRows] = await pool.query(
//       "SELECT * FROM users WHERE userId = ?",
//       [userId]
//     );

//     if (userRows.length === 0) {
//       return res.status(408).json({ message: "Invalid User" });
//     }

//     const user = userRows[0];

//     const [detailsRows] = await pool.query(
//       "SELECT * FROM userdetails WHERE userId = ?",
//       [userId]
//     );

//     const details = detailsRows.length > 0 ? detailsRows[0] : null;

//     const myObj = {
//       userName: user.userName,
//       email: user.email,
//       contact: user.contact,
//       address: user.address,
//       adharCard: user.adharCard,
//       adharNo: user.adharNo,
//       pan: user.pan,
//       panNo: user.panNo,
//       status: user.status,
//       roleId: user.roleId,
//       establishmentName: user.establishmentName,
//       establishmentTypeId: user.establishmentTypeId,
//       city: details ? details.city : "",
//       pincode: details ? details.pincode : "",
//       state: details ? details.state : "",
//       alternatePhone: details ? details.alternatePhone : "",
//       shopAct: details ? details.shopAct : "",
//       accName: details ? details.accName : "",
//       accNo: details ? details.accNo : "",
//       bankName: details ? details.bankName : "",
//       branch: details ? details.branch : "",
//       ifsc: details ? details.ifsc : "",
//       cheque: details ? details.cheque : "",
//       logo: details ? details.logo : "",
//     };

//     return res.status(200).json({ data: myObj });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

// exports.editUserProfile = async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     return res.status(400).json({ message: "userId is required" });
//   }

//   // ✅ Uploaded files (if provided)
//   const adharCard = req.files?.adharCard
//     ? req.files.adharCard[0].filename
//     : null;
//   const pan = req.files?.pan ? req.files.pan[0].filename : null;
//   const cheque = req.files?.cheque ? req.files.cheque[0].filename : null;
//   const shopAct = req.files?.shopAct ? req.files.shopAct[0].filename : null;
//   const logo = req.files?.logo ? req.files.logo[0].filename : null;

//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();

//     // ✅ Update users table
//     await conn.query(
//       `UPDATE users
//        SET userName=?, contact=?, address=?, establishmentName=?, establishmentTypeId=?, adharCard=?, adharNo=?, pan=?, panNo=?
//        WHERE userId=?`,
//       [
//         req.body.userName,
//         req.body.phone,
//         req.body.address,
//         req.body.establishmentName,
//         req.body.establishmentTypeId,
//         adharCard || req.body.adharCard, // use new file if uploaded, else old value
//         req.body.adharNo,
//         pan || req.body.pan,
//         req.body.panNo,
//         userId,
//       ]
//     );

//     const [existing] = await conn.query(
//       "SELECT * FROM userdetails WHERE userId=?",
//       [userId]
//     );

//     if (existing.length > 0) {
//       await conn.query(
//         `UPDATE userdetails
//          SET city=?, pincode=?, state=?, alternatePhone=?, shopAct=?, accName=?, accNo=?, bankName=?, branch=?, ifsc=?, cheque=?, logo=?
//          WHERE userId=?`,
//         [
//           req.body.city,
//           req.body.pincode,
//           req.body.state,
//           req.body.alternatePhone,
//           shopAct || existing[0].shopAct,
//           req.body.accName,
//           req.body.accNo,
//           req.body.bankName,
//           req.body.branch,
//           req.body.ifsc,
//           cheque || existing[0].cheque,
//           logo || existing[0].logo,
//           userId,
//         ]
//       );
//     } else {
//       await conn.query(
//         `INSERT INTO userdetails
//          (userId, city, pincode, state, alternatePhone, shopAct, accName, accNo, bankName, branch, ifsc, cheque, logo)
//          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//         [
//           userId,
//           req.body.city,
//           req.body.pincode,
//           req.body.state,
//           req.body.alternatePhone,
//           shopAct,
//           req.body.accName,
//           req.body.accNo,
//           req.body.bankName,
//           req.body.branch,
//           req.body.ifsc,
//           cheque,
//           logo,
//         ]
//       );
//     }

//     await conn.commit();
//     return res.status(200).json({ message: "Profile Updated Successfully" });
//   } catch (err) {
//     await conn.rollback();
//     console.error(err);
//     return res.status(500).json({ message: err.message });
//   } finally {
//     conn.release();
//   }
// };

const db = require("../../db");
const { body, validationResult } = require("express-validator");

// user profile controller
exports.userProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE userId = ?", [
      userId,
    ]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Invalid User" });
    }

    const salesData = users[0];

    // fetch userdetails
    const [userdetails] = await db.query(
      "SELECT * FROM userdetails WHERE userId = ?",
      [salesData.userId]
    );
    const salesInfo = userdetails.length > 0 ? userdetails[0] : null;

    // response object
    const myObj = {
      userName: salesData.userName,
      email: salesData.email,
      contact: salesData.contact,
      address: salesData.address,
      adharCard: salesData.adharCard,
      adharNo: salesData.adharNo,
      pan: salesData.pan,
      panNo: salesData.panNo,
      status: salesData.status,
      roleId: salesData.roleId,
      establishmentName: salesData.establishmentName,
      establishmentTypeId: salesData.establishmentTypeId,
      cities: salesInfo ? JSON.parse(salesInfo.cities || "[]") : [],
      accName: salesInfo?.accName || "",
      pincode: salesInfo?.pincode || "",
      stateId: salesInfo?.stateId || "",
      alternatePhone: salesInfo?.alternatePhone || "",
      shopAct: salesInfo?.shopAct || "",
      accNo: salesInfo?.accNo || "",
      bankName: salesInfo?.bankName || "",
      branch: salesInfo?.branch || "",
      ifsc: salesInfo?.ifsc || "",
      cheque: salesInfo?.cheque || "",
      logo: salesInfo?.logo || "",
    };

    return res.status(200).json({ data: myObj });
  } catch (error) {
    console.error("Error in userProfile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// edit user profile controller
exports.editUserProfile = async (req, res) => {
  console.log("Request Body:", req.body);
  // 1. Validate request
  await Promise.all([
    body("userId").notEmpty().withMessage("userId is required").run(req),
    body("phone")
      .optional()
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone must be 10 digits")
      .run(req),
    body("pincode")
      .optional()
      .isLength({ min: 6, max: 6 })
      .withMessage("Pincode must be 6 digits")
      .run(req),
    body("bankName").optional().isString().run(req),
    body("ifsc")
      .optional()
      .matches(/^[A-Za-z0-9]{11}$/)
      .withMessage("Invalid IFSC code")
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map((e) => e.msg) });
  }

  const {
    userId,
    userName,
    phone,
    address,
    establishmentName,
    establishmentTypeId,
    adharCard,
    adharNo,
    pan,
    panNo,
    city,
    pincode,
    state,
    alternatePhone,
    shopAct,
    accName,
    accNo,
    bankName,
    branch,
    ifsc,
    cheque,
    logo,
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Update users table
    await conn.query(
      `UPDATE users 
       SET userName=?, contact=?, address=?, establishmentName=?, establishmentTypeId=?, 
           adharCard=?, adharNo=?, pan=?, panNo=? 
       WHERE userId=?`,
      [
        userName,
        phone,
        address,
        establishmentName,
        establishmentTypeId,
        adharCard,
        adharNo,
        pan,
        panNo,
        userId,
      ]
    );

    // Check if userdetails exists
    const [rows] = await conn.query(
      "SELECT * FROM userdetails WHERE userId=?",
      [userId]
    );

    if (rows.length > 0) {
      // Update existing
      await conn.query(
        `UPDATE userdetails 
         SET city=?, pincode=?, state=?, alternatePhone=?, shopAct=?, 
             accName=?, accNo=?, bankName=?, branch=?, ifsc=?, cheque=?, logo=? 
         WHERE userId=?`,
        [
          city,
          pincode,
          state,
          alternatePhone,
          shopAct,
          accName,
          accNo,
          bankName,
          branch,
          ifsc,
          cheque,
          logo,
          userId,
        ]
      );
    } else {
      // Insert new
      const clientCodeValue = "CODIGIXADMIN";
      //   await conn.query(
      //     `INSERT INTO userdetails
      //      (userId, city, pincode, state, alternatePhone, shopAct, accName, accNo, bankName, branch, ifsc, cheque, logo , clientcode)
      //      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      //     [userId, city, pincode, state, alternatePhone, shopAct, accName, accNo, bankName, branch, ifsc, cheque, logo , clientCodeValue]
      //   );
      await conn.query(
        `INSERT INTO userdetails 
   (userId, city, pincode, state, alternatePhone, shopAct, accName, accNo, bankName, branch, ifsc, cheque, logo, clientcode) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          city,
          pincode,
          state,
          alternatePhone,
          shopAct,
          accName,
          accNo,
          bankName,
          branch,
          ifsc,
          cheque,
          logo,
          clientCodeValue,
        ]
      );
    }

    await conn.commit();
    res.status(200).json({ message: "Information Updated Successfully" });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
