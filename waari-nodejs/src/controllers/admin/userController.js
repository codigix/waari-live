const db = require("../../../db");
const { body, validationResult } = require("express-validator");

// user profile controller
exports.userProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE userId = ?", [userId]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Invalid User" });
    }

    const salesData = users[0];

    // fetch userdetails
    const [userdetails] = await db.query("SELECT * FROM userdetails WHERE userId = ?", [salesData.userId]);
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
      logo: salesInfo?.logo || ""
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
    body("phone").optional().isLength({ min: 10, max: 10 }).withMessage("Phone must be 10 digits").run(req),
    body("pincode").optional().isLength({ min: 6, max: 6 }).withMessage("Pincode must be 6 digits").run(req),
    body("bankName").optional().isString().run(req),
    body("ifsc").optional().matches(/^[A-Za-z0-9]{11}$/).withMessage("Invalid IFSC code").run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg) });
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
    const [rows] = await conn.query("SELECT * FROM userdetails WHERE userId=?", [userId]);

    if (rows.length > 0) {
      // Update existing
      await conn.query(
        `UPDATE userdetails 
         SET city=?, pincode=?, state=?, alternatePhone=?, shopAct=?, 
             accName=?, accNo=?, bankName=?, branch=?, ifsc=?, cheque=?, logo=? 
         WHERE userId=?`,
        [city, pincode, state, alternatePhone, shopAct, accName, accNo, bankName, branch, ifsc, cheque, logo, userId]
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
  [userId, city, pincode, state, alternatePhone, shopAct, accName, accNo, bankName, branch, ifsc, cheque, logo, clientCodeValue]
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

