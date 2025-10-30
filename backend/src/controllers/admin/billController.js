const db = require("../../../db");
const CommonController = require("../CommonController");
const moment = require("moment");
const mysql = require("mysql2/promise");
// total billing
exports.totalBilling = async (req, res) => {
  try {
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      8,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const [groupRows] = await db.query(
      "SELECT COUNT(*) as count FROM grouptourpaymentdetails"
    );
    const [customRows] = await db.query(
      "SELECT COUNT(*) as count FROM customtourpaymentdetails"
    );

    const totalBilling = (groupRows[0].count || 0) + (customRows[0].count || 0);

    return res.status(200).json({ totalBilling });
  } catch (err) {
    console.error("totalBilling error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// total bill approved
exports.totalBillApproved = async (req, res) => {
  try {
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      9,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const [groupRows] = await db.query(
      "SELECT COUNT(*) as count FROM grouptourpaymentdetails WHERE status = 1"
    );
    const [customRows] = await db.query(
      "SELECT COUNT(*) as count FROM customtourpaymentdetails WHERE status = 1"
    );

    const totalBillApproved =
      (groupRows[0].count || 0) + (customRows[0].count || 0);

    return res.status(200).json({ totalBillApproved });
  } catch (err) {
    console.error("totalBillApproved error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

// total bill pending
exports.totalBillPending = async (req, res) => {
  try {
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      10,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const [groupRows] = await db.query(
      "SELECT COUNT(*) as count FROM grouptourpaymentdetails WHERE status = 0"
    );
    const [customRows] = await db.query(
      "SELECT COUNT(*) as count FROM customtourpaymentdetails WHERE status = 0"
    );

    const totalBillPending =
      (groupRows[0].count || 0) + (customRows[0].count || 0);

    return res.status(200).json({ totalBillPending });
  } catch (err) {
    console.error("totalBillPending error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};
// exports.profitCt = async (req, res) => {
//   try {
//     // Token check
//     const tokenData = await CommonController.checkToken(req.headers["token"], [23]);
//     if (tokenData.error) {
//       return res.status(401).json(tokenData);
//     }

//     // Total profit
//     const [sumRows] = await db.query(
//       "SELECT SUM(discountPrice) AS totalDiscountPrice, SUM(purchasePrice) AS totalPurchasePrice FROM customtourdiscountdetails"
//     );

//     let totalDiscountPrice = sumRows[0].totalDiscountPrice || 0;
//     let totalPurchasePrice = sumRows[0].totalPurchasePrice || 0;

//     let profit = totalDiscountPrice - totalPurchasePrice;
//     let profitPer = totalDiscountPrice !== 0 ? (profit / totalDiscountPrice) * 100 : 0;

//     // Month, Quarter, Year filter
//     const currentMonth = moment().month() + 1;
//     const startQuarter = moment().startOf("quarter").format("YYYY-MM-DD");
//     const endQuarter = moment().endOf("quarter").format("YYYY-MM-DD");
//     const currentYear = moment().year();

//     const [dataRows] = await db.query(
//       `SELECT
//           SUM(discountPrice) AS totalDiscountPrice,
//           SUM(purchasePrice) AS totalPurchasePrice
//        FROM customtourdiscountdetails
//        WHERE MONTH(created_at) = ?
//           OR (created_at BETWEEN ? AND ?)
//           OR YEAR(created_at) = ?`,
//       [currentMonth, startQuarter, endQuarter, currentYear]
//     );

//     let profitMonth = 0,
//       profitPerMonth = 0,
//       profitQuarter = 0,
//       profitPerQuarter = 0,
//       profitYear = 0,
//       profitPerYear = 0;

//     if (dataRows[0] && dataRows[0].totalDiscountPrice && dataRows[0].totalPurchasePrice) {
//       const dPrice = dataRows[0].totalDiscountPrice;
//       const pPrice = dataRows[0].totalPurchasePrice;

//       profitMonth = dPrice - pPrice;
//       profitPerMonth = pPrice !== 0 ? (profitMonth / dPrice) * 100 : 0;

//       profitQuarter = dPrice - pPrice;
//       profitPerQuarter = pPrice !== 0 ? (profitQuarter / dPrice) * 100 : 0;

//       profitYear = dPrice - pPrice;
//       profitPerYear = pPrice !== 0 ? (profitYear / dPrice) * 100 : 0;
//     }

//     return res.status(200).json({
//       profitPer: parseFloat(profitPer.toFixed(2)),
//       profitPerMonth: Math.round(profitPerMonth),
//       profitPerQuarter: Math.round(profitPerQuarter),
//       profitPerYear: Math.round(profitPerYear),
//     });
//   } catch (err) {
//     console.error("Error in profitCt:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
exports.profitCt = async (req, res) => {
  try {
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      23,
    ]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    // Total profit
    const [sumRows] = await db.query(
      "SELECT SUM(discountPrice) AS totalDiscountPrice, SUM(purchasePrice) AS totalPurchasePrice FROM customtourdiscountdetails"
    );

    let totalDiscountPrice = sumRows[0].totalDiscountPrice || 0;
    let totalPurchasePrice = sumRows[0].totalPurchasePrice || 0;

    let profit = totalDiscountPrice - totalPurchasePrice;
    let profitPer =
      totalDiscountPrice !== 0 ? (profit / totalDiscountPrice) * 100 : 0;

    // Month, Quarter, Year filter
    const currentMonth = moment().month() + 1;
    const startQuarter = moment().startOf("quarter").format("YYYY-MM-DD");
    const endQuarter = moment().endOf("quarter").format("YYYY-MM-DD");
    const currentYear = moment().year();

    const [dataRows] = await db.query(
      `SELECT 
          SUM(discountPrice) AS totalDiscountPrice, 
          SUM(purchasePrice) AS totalPurchasePrice
       FROM customtourdiscountdetails
       WHERE MONTH(created_at) = ? 
          OR (created_at BETWEEN ? AND ?) 
          OR YEAR(created_at) = ?`,
      [currentMonth, startQuarter, endQuarter, currentYear]
    );

    let profitMonth = 0,
      profitPerMonth = 0,
      profitQuarter = 0,
      profitPerQuarter = 0,
      profitYear = 0,
      profitPerYear = 0;

    if (
      dataRows[0] &&
      dataRows[0].totalDiscountPrice &&
      dataRows[0].totalPurchasePrice
    ) {
      const dPrice = dataRows[0].totalDiscountPrice;
      const pPrice = dataRows[0].totalPurchasePrice;

      profitMonth = dPrice - pPrice;
      profitPerMonth = pPrice !== 0 ? (profitMonth / dPrice) * 100 : 0;

      profitQuarter = dPrice - pPrice;
      profitPerQuarter = pPrice !== 0 ? (profitQuarter / dPrice) * 100 : 0;

      profitYear = dPrice - pPrice;
      profitPerYear = pPrice !== 0 ? (profitYear / dPrice) * 100 : 0;
    }

    return res.status(200).json({
      profitPer: parseFloat(profitPer.toFixed(2)),
      profitPerMonth: Math.round(profitPerMonth),
      profitPerQuarter: Math.round(profitPerQuarter),
      profitPerYear: Math.round(profitPerYear),
    });
  } catch (err) {
    console.error("Error in profitCt:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.bookingSalesAmountGraphCt = async (req, res) => {
  try {
    // Token check
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      22,
    ]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    // all months (0–12 like PHP code)
    const allMonths = Array.from({ length: 13 }, (_, i) => i);

    // Fetch targets
    const [targetRows] = await db.query(
      `SELECT target, monthId 
       FROM salestarget 
       WHERE tourType = 2 AND yearId = ?`,
      [moment().year()]
    );

    // map targets into array
    let targetArray = {};
    targetRows.forEach((row) => {
      targetArray[row.monthId] = row.target;
    });

    // fill missing months with 0
    targetArray = Object.assign(
      Object.fromEntries(allMonths.map((m) => [m, 0])),
      targetArray
    );

    // Fetch achieved totals by month
    const [achieveRows] = await db.query(
      `SELECT 
          SUM(ctd.discountPrice) AS totalGrandTotal, 
          MONTH(ctd.created_at) AS month
       FROM customtourdiscountdetails ctd
       JOIN enquirycustomtours ect 
          ON ctd.enquiryCustomId = ect.enquiryCustomId
       WHERE YEAR(ctd.created_at) = ?
       GROUP BY MONTH(ctd.created_at)`,
      [moment().year()]
    );

    let ctAchieveArray = {};
    achieveRows.forEach((row) => {
      ctAchieveArray[row.month] = row.totalGrandTotal;
    });

    // fill missing months with 0
    ctAchieveArray = Object.assign(
      Object.fromEntries(allMonths.map((m) => [m, 0])),
      ctAchieveArray
    );

    // keep only values in order
    ctAchieveArray = Object.values(ctAchieveArray);

    return res.status(200).json({
      targetArray,
      ctAchieveArray,
    });
  } catch (err) {
    console.error("Error in bookingSalesAmountGraphCt:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.listSalesProfit = async (req, res) => {
  try {
    // Token check
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      24,
    ]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    // Pagination
    let perPage = req.query.perPage ? parseInt(req.query.perPage) : 5;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let offset = (page - 1) * perPage;

    // Query with joins
    const [rows] = await db.query(
      `SELECT 
          ect.groupName,
          cted.firstName,
          cted.lastName,
          ect.adults,
          ect.startDate,
          ect.endDate,
          ctd.purchasePrice,
          ctd.discountPrice,
          dd.destinationName
       FROM customtourenquirydetails cted
       JOIN customtourdiscountdetails ctd 
          ON cted.enquiryDetailCustomId = ctd.enquiryDetailCustomId
       JOIN enquirycustomtours ect 
          ON cted.enquiryCustomId = ect.enquiryCustomId
       JOIN dropdowndestination dd 
          ON ect.destinationId = dd.destinationId
       WHERE ect.enquiryProcess = 2
         AND MONTH(ctd.created_at) = ?
         AND YEAR(ctd.created_at) = ?
       LIMIT ? OFFSET ?`,
      [moment().month() + 1, moment().year(), perPage, offset]
    );

    // Count total for pagination
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM customtourenquirydetails cted
       JOIN customtourdiscountdetails ctd 
          ON cted.enquiryDetailCustomId = ctd.enquiryDetailCustomId
       JOIN enquirycustomtours ect 
          ON cted.enquiryCustomId = ect.enquiryCustomId
       WHERE ect.enquiryProcess = 2
         AND MONTH(ctd.created_at) = ?
         AND YEAR(ctd.created_at) = ?`,
      [moment().month() + 1, moment().year()]
    );
    const total = countRows[0].total;

    // Transform rows like PHP did
    const enquiryDataArray = rows.map((row) => {
      const profit = row.discountPrice - row.purchasePrice;
      const profitPer =
        row.purchasePrice !== 0 ? (profit / row.purchasePrice) * 100 : 0;

      return {
        groupName: row.groupName,
        guestName: row.firstName + " " + row.lastName,
        destination: row.destinationName,
        pax: row.adults,
        startDate: row.startDate,
        endDate: row.endDate,
        purchasePrice: row.purchasePrice,
        sale: row.discountPrice,
        profit,
        profitPer,
      };
    });

    // Pagination helpers
    const lastPage = Math.ceil(total / perPage);
    const nextPageUrl =
      page < lastPage
        ? `${req.baseUrl}${req.path}?page=${page + 1}&perPage=${perPage}`
        : null;
    const previousPageUrl =
      page > 1
        ? `${req.baseUrl}${req.path}?page=${page - 1}&perPage=${perPage}`
        : null;

    return res.status(200).json({
      data: enquiryDataArray,
      total,
      currentPage: page,
      perPage,
      nextPageUrl,
      previousPageUrl,
      lastPage,
    });
  } catch (err) {
    console.error("Error in listSalesProfit:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.noOfGuests = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      7,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    // query: count users where roleId != 1
    const [rows] = await db.query(
      "SELECT COUNT(*) AS guestCount FROM users WHERE roleId != 1"
    );

    return res.status(200).json({
      guestCount: rows[0].guestCount,
    });
  } catch (err) {
    console.error("Error fetching guest count:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// group tour count
exports.groupTourCount = async (req, res) => {
  try {
    // check token (role 4 required)
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      4,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    // count group tours
    const [rows] = await db.query(
      "SELECT COUNT(*) AS groupTourCount FROM grouptours"
    );

    res.status(200).json({
      groupTourCount: rows[0].groupTourCount,
    });
  } catch (error) {
    console.error("Error in groupTourCount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// top sales partner
exports.topSalesPartner = async (req, res) => {
  try {
    // check token (role 20 required)
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      20,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const query = `
      SELECT 
        users.userId,
        users.userName,

        COUNT(DISTINCT CASE WHEN enquirygrouptours.enquiryProcess = 2 THEN enquirygrouptours.enquiryId END) +
        COUNT(DISTINCT CASE WHEN enquirycustomtours.enquiryProcess = 2 THEN enquirycustomtours.enquiryId END) AS total_count_overall,

        COUNT(DISTINCT CASE WHEN enquirygrouptours.enquiryProcess = 2 THEN enquirygrouptours.enquiryId END) AS total_count_gt,

        COUNT(DISTINCT CASE WHEN enquirygrouptours.enquiryProcess = 2 
                             AND enquirygrouptours.groupTourId IS NOT NULL 
                             AND grouptours.destinationId = 1 
                        THEN enquirygrouptours.enquiryId END) AS domesticCountGt,

        COUNT(DISTINCT CASE WHEN enquirygrouptours.enquiryProcess = 2 
                             AND enquirygrouptours.groupTourId IS NOT NULL 
                             AND grouptours.destinationId = 2 
                        THEN enquirygrouptours.enquiryId END) AS internationalCountGt,

        COUNT(DISTINCT CASE WHEN enquirycustomtours.enquiryProcess = 2 THEN enquirycustomtours.enquiryId END) AS total_count_ct,

        COUNT(DISTINCT CASE WHEN enquirycustomtours.enquiryProcess = 2 
                             AND enquirycustomtours.destinationId = 1 
                        THEN enquirycustomtours.enquiryId END) AS domesticCountCt,

        COUNT(DISTINCT CASE WHEN enquirycustomtours.enquiryProcess = 2 
                             AND enquirycustomtours.destinationId = 2 
                        THEN enquirycustomtours.enquiryId END) AS internationalCountCt,

        COUNT(DISTINCT CASE WHEN enquirygrouptours.enquiryProcess = 2 
                             AND DATE(enquirygrouptours.created_at) = CURDATE() 
                        THEN enquirygrouptours.enquiryId END) +
        COUNT(DISTINCT CASE WHEN enquirycustomtours.enquiryProcess = 2 
                             AND DATE(enquirycustomtours.created_at) = CURDATE() 
                        THEN enquirycustomtours.enquiryId END) AS todaysBooking

      FROM users
      LEFT JOIN enquirygrouptours 
        ON users.userId = enquirygrouptours.createdBy 
       AND enquirygrouptours.enquiryProcess = 2
      LEFT JOIN enquirycustomtours 
        ON users.userId = enquirycustomtours.createdBy 
       AND enquirycustomtours.enquiryProcess = 2
      LEFT JOIN grouptours 
        ON enquirygrouptours.groupTourId = grouptours.groupTourId
      WHERE users.roleId = 2
      GROUP BY users.userId, users.userName
      ORDER BY total_count_overall DESC
      LIMIT 6;
    `;

    const [rows] = await db.query(query);

    res.status(200).json({
      topSales: rows,
    });
  } catch (error) {
    console.error("Error in topSalesPartner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// enquiry list custom tour
exports.enquiryListCt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      19,
    ]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    // prepare SQL query
    const sql = `
      SELECT 
        (SELECT COUNT(*) 
         FROM enquirycustomtours 
         WHERE createdBy = ? 
           AND YEAR(created_at) = YEAR(NOW()) 
           AND MONTH(created_at) = MONTH(NOW()) - 1) AS previousMonthTotal,
        COUNT(*) AS currentMonthTotal,
        SUM(CASE WHEN enquiryProcess = 1 THEN 1 ELSE 0 END) AS ongoing,
        SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) AS confirmed,
        SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) AS lost,
        (SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) / COUNT(*) * 100) AS conversionRate
      FROM enquirycustomtours
      WHERE createdBy = ?
        AND MONTH(created_at) = MONTH(NOW())
        AND YEAR(created_at) = YEAR(NOW());
    `;

    // run query
    const [rows] = await db.query(sql, [tokenData.userId, tokenData.userId]);

    return res.status(200).json({
      enquiriesCt: rows,
    });
  } catch (err) {
    console.error("Error in enquiryListCt:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// enquiry graph CT
exports.enquiryGraphCt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      17,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const userId = tokenData.userId;

    // MySQL query for graph data
    const [rows] = await db.query(
      `
      SELECT 
        MONTH(created_at) AS month,
        COUNT(*) AS totalEnquiries,
        SUM(CASE WHEN enquiryProcess = 1 THEN 1 ELSE 0 END) AS ongoing,
        SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) AS confirmed,
        SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) AS lost
      FROM enquirycustomtours
      WHERE createdBy = ?
        AND YEAR(created_at) = YEAR(NOW())
      GROUP BY MONTH(created_at)
      ORDER BY MONTH(created_at)
      `,
      [userId]
    );

    return res.status(200).json({ graphData: rows });
  } catch (err) {
    console.error("Error in enquiryGraphCt:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// target CT
exports.targetCt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      15,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const userId = tokenData.userId;
    const year = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-based
    const quarter = Math.floor((currentMonth - 1) / 3) + 1;
    const quarterStart = (quarter - 1) * 3 + 1;
    const quarterEnd = quarter * 3;

    // ---------- TARGETS ----------
    const [targetRows] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN monthId = ? THEN target ELSE 0 END) AS monthlyTarget,
        SUM(CASE WHEN monthId BETWEEN ? AND ? THEN target ELSE 0 END) AS quarterlyTarget,
        SUM(target) AS yearlyTarget
      FROM salestarget
      WHERE userId = ? AND yearId = ? AND tourType = 2
      `,
      [currentMonth, quarterStart, quarterEnd, userId, year]
    );

    const targetsCt = targetRows[0] || {
      monthlyTarget: 0,
      quarterlyTarget: 0,
      yearlyTarget: 0,
    };

    // ---------- ACHIEVED ----------
    const [achievedRows] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN MONTH(ctd.created_at) = ? THEN ctd.grandTotal ELSE 0 END) AS monthlyAchieved,
        SUM(CASE WHEN MONTH(ctd.created_at) BETWEEN ? AND ? THEN ctd.grandTotal ELSE 0 END) AS quarterlyAchieved,
        SUM(ctd.grandTotal) AS yearlyAchieved
      FROM customtourdiscountdetails ctd
      JOIN enquirycustomtours ect ON ctd.enquiryCustomId = ect.enquiryCustomId
      WHERE ctd.createdBy = ? AND YEAR(ctd.created_at) = ?
      `,
      [currentMonth, quarterStart, quarterEnd, userId, year]
    );

    const achievedTargetsCt = achievedRows[0] || {
      monthlyAchieved: 0,
      quarterlyAchieved: 0,
      yearlyAchieved: 0,
    };

    // ---------- RESPONSE ----------
    return res.status(200).json({
      monthlyTarget: targetsCt.monthlyTarget || 0,
      quarterlyTarget: targetsCt.quarterlyTarget || 0,
      yearlyTarget: targetsCt.yearlyTarget || 0,
      achieveMonthlyTargetCt: Number(
        achievedTargetsCt.monthlyAchieved || 0
      ).toFixed(2),
      achieveQuarterTargetCt: Number(
        achievedTargetsCt.quarterlyAchieved || 0
      ).toFixed(2),
      achieveYearTargetCt: Number(
        achievedTargetsCt.yearlyAchieved || 0
      ).toFixed(2),
      remainingMonthlyTargetCt: Number(
        (targetsCt.monthlyTarget || 0) -
          (achievedTargetsCt.monthlyAchieved || 0)
      ).toFixed(2),
      remainingQuarterTargetCt: Number(
        (targetsCt.quarterlyTarget || 0) -
          (achievedTargetsCt.quarterlyAchieved || 0)
      ).toFixed(2),
      remainingYearTargetCt: Number(
        (targetsCt.yearlyTarget || 0) - (achievedTargetsCt.yearlyAchieved || 0)
      ).toFixed(2),
    });
  } catch (err) {
    console.error("Error in targetCt:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// monthly target graph CT
exports.monthlyTargetGraphCt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      13,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const userId = tokenData.userId;
    const year = new Date().getFullYear();

    // ----- TARGETS -----
    const [ctTargetRows] = await db.query(
      `
      SELECT target, monthId
      FROM salestarget
      WHERE userId = ? AND yearId = ? AND tourType = 2
      `,
      [userId, year]
    );

    // prepare array with all months initialized to 0
    const allMonths = Array.from({ length: 13 }, (_, i) => i); // 0-12
    let ctTargetArray = {};
    allMonths.forEach((m) => (ctTargetArray[m] = 0));

    ctTargetRows.forEach((item) => {
      ctTargetArray[item.monthId] = item.target;
    });

    // convert to values array
    ctTargetArray = Object.values(ctTargetArray);

    // ----- ACHIEVED -----
    const [ctAchievedRows] = await db.query(
      `
      SELECT 
        SUM(ctd.grandTotal) AS totalGrandTotal,
        MONTH(ctd.created_at) AS month
      FROM customtourdiscountdetails ctd
      JOIN enquirycustomtours ect ON ctd.enquiryCustomId = ect.enquiryCustomId
      WHERE YEAR(ctd.created_at) = ? AND ctd.createdBy = ?
      GROUP BY MONTH(ctd.created_at)
      `,
      [year, userId]
    );

    let ctAchieveArray = {};
    allMonths.forEach((m) => (ctAchieveArray[m] = 0));

    ctAchievedRows.forEach((item) => {
      ctAchieveArray[item.month] = item.totalGrandTotal;
    });

    ctAchieveArray = Object.values(ctAchieveArray);

    // ----- RESPONSE -----
    return res.status(200).json({
      ctTargetArray,
      ctAchieveArray,
    });
  } catch (err) {
    console.error("Error in monthlyTargetGraphCt:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// enquiry list gt
exports.enquiryListGt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      18,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const userId = tokenData.userId;

    // Query for previous month total, current month, ongoing, confirmed, lost, conversion rate
    const [rows] = await db.query(
      `
      SELECT 
        (
          SELECT COUNT(*) 
          FROM enquirygrouptours 
          WHERE createdBy = ? 
          AND YEAR(created_at) = YEAR(NOW()) 
          AND MONTH(created_at) = MONTH(NOW()) - 1
        ) AS previousMonthTotal,
        COUNT(*) AS currentMonthTotal,
        SUM(CASE WHEN enquiryProcess = 1 THEN 1 ELSE 0 END) AS ongoing,
        SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) AS confirmed,
        SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) AS lost,
        (SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) / COUNT(*) * 100) AS conversionRate
      FROM enquirygrouptours
      WHERE createdBy = ?
      AND MONTH(created_at) = MONTH(NOW())
      AND YEAR(created_at) = YEAR(NOW())
      `,
      [userId, userId]
    );

    res.status(200).json({
      enquiriesGT: rows,
    });
  } catch (error) {
    console.error("Error in enquiryListGt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// enquiry graph gt
exports.enquiryGraphGt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      16,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const userId = tokenData.userId;
    const currentYear = new Date().getFullYear();

    // query for monthly enquiries
    const [rows] = await db.query(
      `
      SELECT 
        MONTH(created_at) as month,
        COUNT(*) as totalEnquiries,
        SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) as confirmedEnquiries,
        SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) as lostEnquiries
      FROM enquirygrouptours
      WHERE createdBy = ?
      AND YEAR(created_at) = ?
      GROUP BY MONTH(created_at)
      `,
      [userId, currentYear]
    );

    // prepare arrays for all 12 months
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    let totalEnquiries = {};
    let confirmedEnquiries = {};
    let lostEnquiries = {};

    rows.forEach((item) => {
      totalEnquiries[item.month] = item.totalEnquiries;
      confirmedEnquiries[item.month] = item.confirmedEnquiries;
      lostEnquiries[item.month] = item.lostEnquiries;
    });

    // fill missing months with 0
    const totalEnquiriesGt = allMonths.map((m) => totalEnquiries[m] || 0);
    const confirmedEnquiriesGt = allMonths.map(
      (m) => confirmedEnquiries[m] || 0
    );
    const lostEnquiriesGt = allMonths.map((m) => lostEnquiries[m] || 0);

    res.status(200).json({
      totalEnquiriesGt,
      confirmedEnquiriesGt,
      lostEnquiriesGt,
    });
  } catch (error) {
    console.error("Error in enquiryGraphGt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// target GT
exports.targetGt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      14,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const userId = tokenData.userId;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // calculate quarter months
    const quarter = Math.floor((currentMonth - 1) / 3) + 1;
    const quarterStartMonth = (quarter - 1) * 3 + 1;
    const quarterEndMonth = quarter * 3;

    // query sales targets
    const [targetRows] = await db.query(
      `
      SELECT 
        SUM(CASE WHEN monthId = ? THEN target ELSE 0 END) AS monthlyTarget,
        SUM(CASE WHEN monthId BETWEEN ? AND ? THEN target ELSE 0 END) AS quarterlyTarget,
        SUM(target) AS yearlyTarget
      FROM salestarget
      WHERE userId = ?
      AND yearId = ?
      AND tourType = 1
      `,
      [currentMonth, quarterStartMonth, quarterEndMonth, userId, currentYear]
    );

    const targets = targetRows[0] || {
      monthlyTarget: 0,
      quarterlyTarget: 0,
      yearlyTarget: 0,
    };

    // query achieved targets
    const [achievedRows] = await db.query(
      `
      SELECT 
        COUNT(CASE WHEN MONTH(grouptours.startDate) = ? THEN 1 ELSE NULL END) AS achieveMonthlyTargetGt,
        COUNT(CASE WHEN MONTH(grouptours.startDate) BETWEEN ? AND ? THEN 1 ELSE NULL END) AS achieveQuarterTargetGt,
        COUNT(CASE WHEN YEAR(grouptours.startDate) = ? THEN 1 ELSE NULL END) AS achieveYearTargetGt
      FROM enquirygrouptours
      INNER JOIN grouptours ON enquirygrouptours.groupTourId = grouptours.groupTourId
      WHERE enquirygrouptours.enquiryProcess = 2
      AND YEAR(grouptours.startDate) = ?
      AND enquirygrouptours.createdBy = ?
      `,
      [
        currentMonth,
        quarterStartMonth,
        quarterEndMonth,
        currentYear,
        currentYear,
        userId,
      ]
    );

    const achieved = achievedRows[0] || {
      achieveMonthlyTargetGt: 0,
      achieveQuarterTargetGt: 0,
      achieveYearTargetGt: 0,
    };

    res.status(200).json({
      monthlyTarget: targets.monthlyTarget,
      quarterlyTarget: targets.quarterlyTarget,
      yearlyTarget: targets.yearlyTarget,
      achieveMonthlyTargetGt: achieved.achieveMonthlyTargetGt,
      achieveQuarterTargetGt: achieved.achieveQuarterTargetGt,
      achieveYearTargetGt: achieved.achieveYearTargetGt,
      remainingMonthlyTargetGt:
        targets.monthlyTarget - achieved.achieveMonthlyTargetGt,
      remainingQuarterTargetGt:
        targets.quarterlyTarget - achieved.achieveQuarterTargetGt,
      remainingYearTargetGt:
        targets.yearlyTarget - achieved.achieveYearTargetGt,
    });
  } catch (error) {
    console.error("Error in targetGt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// welcome booking
exports.welcomeBooking = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      2,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    // first query: enquirygrouptours
    const [groupRows] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM enquirygrouptours 
       WHERE createdBy = ? 
         AND enquiryReferId != 8 
         AND enquiryProcess = 2`,
      [tokenData.userId]
    );

    // second query: enquirycustomtours
    const [customRows] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM enquirycustomtours 
       WHERE createdBy = ? 
         AND enquiryReferId != 8 
         AND enquiryProcess = 2`,
      [tokenData.userId]
    );

    const welcomeBooking = groupRows[0].count + customRows[0].count;

    return res.status(200).json({ welcomeBooking });
  } catch (err) {
    console.error("Error in welcomeBooking:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
// 🎂 Birthday / Anniversary List
// =========================
exports.birthdayLists = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      11,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const offset = (page - 1) * perPage;

    // query with pagination
    const [rows] = await db.query(
      `SELECT firstName, lastName, dob, contact, marriageDate 
       FROM users 
       WHERE createdBy = ?
         AND (
           (MONTH(dob) = MONTH(NOW()) AND DAY(dob) = DAY(NOW())) 
           OR (MONTH(marriageDate) = MONTH(NOW()) AND DAY(marriageDate) = DAY(NOW()))
         )
       LIMIT ? OFFSET ?`,
      [tokenData.userId, perPage, offset]
    );

    // total count for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM users 
       WHERE createdBy = ?
         AND (
           (MONTH(dob) = MONTH(NOW()) AND DAY(dob) = DAY(NOW())) 
           OR (MONTH(marriageDate) = MONTH(NOW()) AND DAY(marriageDate) = DAY(NOW()))
         )`,
      [tokenData.userId]
    );

    const total = countResult[0].total;

    // format response
    const guestsWithDOBArray = rows.map((row) => ({
      familyHeadName: `${row.firstName} ${row.lastName}`,
      dob: row.dob,
      contact: row.contact,
      marriageDate: row.marriageDate,
    }));

    return res.status(200).json({
      guestsWithDOB: guestsWithDOBArray,
      total,
      currentPage: page,
      perPage,
      nextPageUrl:
        total > page * perPage
          ? `/birthdayLists?page=${page + 1}&perPage=${perPage}`
          : null,
      previousPageUrl:
        page > 1 ? `/birthdayLists?page=${page - 1}&perPage=${perPage}` : null,
      lastPage: Math.ceil(total / perPage),
    });
  } catch (err) {
    console.error("Error in birthdayLists:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// =========================
// 📊 Monthly Target Graph GT
// =========================
exports.monthlyTargetGraphGt = async (req, res) => {
  try {
    // check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      12,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const currentYear = new Date().getFullYear();
    const allMonths = Array.from({ length: 13 }, (_, i) => i); // 0–12

    // targets
    const [gtTargetGraph] = await db.query(
      `SELECT target, monthId 
       FROM salestarget 
       WHERE userId = ? 
         AND tourType = 1 
         AND yearId = ?`,
      [tokenData.userId, currentYear]
    );

    let gtGraphArray = {};
    gtTargetGraph.forEach((item) => {
      gtGraphArray[item.monthId] = item.target;
    });
    gtGraphArray = Object.assign(
      Object.fromEntries(allMonths.map((m) => [m, 0])),
      gtGraphArray
    );
    // no array_values in JS, use Object.values()
    gtGraphArray = Object.values(gtGraphArray);

    // achieved targets
    const [gtAchievedGraph] = await db.query(
      `SELECT MONTH(g.startDate) as month, COUNT(e.enquiryGroupId) as achievedTarget
       FROM enquirygrouptours e
       JOIN grouptours g ON e.groupTourId = g.groupTourId
       WHERE e.enquiryProcess = 2
         AND e.createdBy = ?
         AND YEAR(g.startDate) = ?
       GROUP BY MONTH(g.startDate)
       ORDER BY month`,
      [tokenData.userId, currentYear]
    );

    let gtAchieveArray = {};
    gtAchievedGraph.forEach((item) => {
      gtAchieveArray[item.month] = item.achievedTarget;
    });
    gtAchieveArray = Object.assign(
      Object.fromEntries(allMonths.map((m) => [m, 0])),
      gtAchieveArray
    );
    gtAchieveArray = Object.values(gtAchieveArray);

    return res.status(200).json({
      gtGraphArray,
      gtAchieveArray,
    });
  } catch (err) {
    console.error("Error in monthlyTargetGraphGt:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// guestsListGroupTour
exports.guestsListGroupTour = async (req, res) => {
  try {
    // validate input
    const { enquiryGroupId, familyHeadGtId } = req.body;

    if (!enquiryGroupId || isNaN(enquiryGroupId)) {
      return res
        .status(400)
        .json({ message: "enquiryGroupId is required and must be numeric" });
    }
    if (!familyHeadGtId || isNaN(familyHeadGtId)) {
      return res
        .status(400)
        .json({ message: "familyHeadGtId is required and must be numeric" });
    }

    // check token
    const tokenData = await checkToken(req.headers["token"], [17]);
    if (tokenData.error) return res.status(401).json(tokenData);

    // get guest details
    const [guestsDetails] = await db.query(
      `SELECT groupGuestDetailId, preFixId, firstName, lastName, isCancel, guestId 
       FROM grouptourguestdetails 
       WHERE enquiryGroupId = ? AND familyHeadGtId = ?`,
      [enquiryGroupId, familyHeadGtId]
    );

    let guestsDetailsArray = [];

    if (guestsDetails.length > 0) {
      guestsDetailsArray = guestsDetails.map((value) => {
        return {
          groupGuestDetailId: value.groupGuestDetailId,
          preFixId: value.preFixId,
          firstName: value.firstName,
          lastName: value.lastName,
          isCancel: value.isCancel,
          isCancelDescription: "1-cancel, 0-confirm(not cancel)",
          guestId: value.guestId,
        };
      });
    }

    return res.status(200).json({ data: guestsDetailsArray });
  } catch (error) {
    console.error("Error in guestsListGroupTour:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// loyaltyBooking
exports.loyaltyBooking = async (req, res) => {
  try {
    // Check token
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      1,
    ]);
    if (tokenData.error) return res.status(401).json(tokenData);

    // Query for group tours
    const [groupRows] = await db.query(
      "SELECT COUNT(*) as count FROM enquirygrouptours WHERE enquiryReferId = ? AND createdBy = ? AND enquiryProcess = ?",
      [8, tokenData.userId, 2]
    );

    // Query for custom tours
    const [customRows] = await db.query(
      "SELECT COUNT(*) as count FROM enquirycustomtours WHERE enquiryReferId = ? AND createdBy = ? AND enquiryProcess = ?",
      [8, tokenData.userId, 2]
    );

    // Total count
    const loyaltyBooking = groupRows[0].count + customRows[0].count;

    res.json({ loyaltyBooking });
  } catch (error) {
    console.error("Error in loyaltyBooking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//

// enquiryFollowCustomTourList
// exports.enquiryFollowCustomTourList = async (req, res) => {
//   try {
//     // Check token
//     const tokenData = await CommonController.checkToken(req.headers["token"], [32]);
//     if (tokenData.error) return res.status(401).json(tokenData);

//     let query = `
//       SELECT
//         enquirycustomtours.*, dropdowndestination.destinationName
//       FROM
//         enquirycustomtours
//       JOIN
//         dropdowndestination ON enquirycustomtours.destinationId = dropdowndestination.destinationId
//       WHERE
//         enquirycustomtours.enquiryProcess = 1
//         AND DATE(enquirycustomtours.nextFollowUp) = CURDATE()
//         AND TIME(enquirycustomtours.nextFollowUpTime) > CURTIME()
//         AND enquirycustomtours.createdBy = ?
//       ORDER BY
//         enquirycustomtours.nextFollowUpTime ASC
//     `;

//     const params = [tokenData.userId];

//     // Handle optional filters for date range
//     if (req.body.startDate && req.body.endDate) {
//       const startDate = moment(req.body.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
//       const endDate = moment(req.body.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
//       query += " AND enquirycustomtours.startDate >= ? AND enquirycustomtours.endDate <= ?";
//       params.push(startDate, endDate);
//     } else if (req.body.startDate) {
//       const startDate = moment(req.body.startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
//       query += " AND enquirycustomtours.startDate >= ?";
//       params.push(startDate);
//     } else if (req.body.endDate) {
//       const endDate = moment(req.body.endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
//       query += " AND enquirycustomtours.endDate <= ?";
//       params.push(endDate);
//     }

//     if (req.body.tourName) {
//       query += " AND enquirycustomtours.groupName LIKE ?";
//       params.push(`%${req.body.tourName}%`);
//     }

//     if (req.body.search) {
//       query += " AND CONCAT(enquirycustomtours.firstName, ' ', enquirycustomtours.lastName) LIKE ?";
//       params.push(`%${req.body.search}%`);
//     }

//     // Pagination logic
//     const perPage = req.body.perPage || 10;
//     const offset = (req.body.page || 1) - 1 * perPage;

//     query += ` LIMIT ?, ?`;
//     params.push(offset, perPage);

//     const [rows] = await db.query(query, params);
//     const totalQuery = `
//       SELECT COUNT(*) as total
//       FROM enquirycustomtours
//       WHERE enquirycustomtours.enquiryProcess = 1
//         AND DATE(enquirycustomtours.nextFollowUp) = CURDATE()
//         AND TIME(enquirycustomtours.nextFollowUpTime) > CURTIME()
//         AND enquirycustomtours.createdBy = ?
//     `;

//     const [totalResult] = await db.query(totalQuery, [tokenData.userId]);

//     // Format the results
//     const enquiryCustomArray = rows.map(value => ({
//       enquiryCustomId: value.enquiryCustomId,
//       uniqueEnqueryId: value.enquiryId.toString().padStart(4, '0'),
//       enqDate: moment(value.created_at).format('DD-MM-YYYY'),
//       groupName: value.groupName,
//       contactName: `${value.firstName} ${value.lastName}`,
//       startDate: moment(value.startDate).format('DD-MM-YYYY'),
//       endDate: moment(value.endDate).format('DD-MM-YYYY'),
//       contact: value.contact,
//       destinationName: value.destinationName,
//       pax: value.adults + value.child,
//       lastFollowUp: moment(value.created_at).format('DD-MM-YYYY'),
//       nextFollowUp: moment(value.nextFollowUp).format('DD-MM-YYYY'),
//       nextFollowUpTime: value.nextFollowUpTime,
//       userName: tokenData.userName,
//     }));

//     res.json({
//       data: enquiryCustomArray,
//       total: totalResult[0].total,
//       currentPage: req.body.page || 1,
//       perPage,
//       nextPageUrl: `/enquiryFollowCustomTourList?page=${(req.body.page || 1) + 1}&perPage=${perPage}`,
//       previousPageUrl: `/enquiryFollowCustomTourList?page=${(req.body.page || 1) - 1}&perPage=${perPage}`,
//       lastPage: Math.ceil(totalResult[0].total / perPage),
//     });

//   } catch (error) {
//     console.error("Error in enquiryFollowCustomTourList:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.referralRate = async (req, res) => {
  try {
    // Check token validity
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      3,
    ]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    // Count total bookings
    const totalBookingsQuery = `
      SELECT COUNT(*) AS totalBookings
      FROM enquirygrouptours
      WHERE enquiryProcess = 2 AND createdBy = ?
      UNION ALL
      SELECT COUNT(*) AS totalBookings
      FROM enquirycustomtours
      WHERE enquiryProcess = 2 AND createdBy = ?
    `;

    // Use db.query directly (not db.promise() since db doesn't support promise())
    const [totalBookingsRows] = await db.query(totalBookingsQuery, [
      tokenData.userId,
      tokenData.userId,
    ]);

    // Calculate total bookings count
    const totalBookings = totalBookingsRows.reduce(
      (sum, row) => sum + row.totalBookings,
      0
    );

    // Calculate referral rate
    if (totalBookings !== 0) {
      const referralQuery = `
        SELECT COUNT(*) AS totalReferral
        FROM enquirygrouptours
        WHERE enquiryReferId = 9 AND createdBy = ? AND enquiryProcess = 2
        UNION ALL
        SELECT COUNT(*) AS totalReferral
        FROM enquirycustomtours
        WHERE enquiryReferId = 9 AND createdBy = ? AND enquiryProcess = 2
      `;

      const [referralRows] = await db.query(referralQuery, [
        tokenData.userId,
        tokenData.userId,
      ]);

      const totalReferral = referralRows.reduce(
        (sum, row) => sum + row.totalReferral,
        0
      );

      // Calculate referral rate
      const referralRate = (totalReferral / totalBookings) * 100;
      return res.json({
        referralRate: parseFloat(referralRate.toFixed(2)),
      });
    } else {
      return res.json({
        referralRate: 0,
      });
    }
  } catch (error) {
    console.error("Error in referralRate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Assuming this is part of the code for moreBookingCount

exports.moreBookingCount = async (req, res) => {
  try {
    // Check token validity
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      21,
    ]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }

    // Get the user's booking count
    let [myBookingCountRows] = await db.query(
      "SELECT COUNT(*) AS myBookingCount FROM enquirygrouptours WHERE createdBy = ? AND enquiryProcess = 2",
      [tokenData.userId]
    );
    let myBookingCount = myBookingCountRows[0].myBookingCount; // Change const to let

    // Get the sales count grouped by user
    let [salesData] = await db.query(
      "SELECT createdBy, COUNT(*) AS salesCount FROM enquirygrouptours WHERE enquiryProcess = 2 GROUP BY createdBy"
    );

    let difference = null; // Change const to let
    let bookingsNeededFor10thRank = null; // Change const to let
    let bookingsNeededFor5thRank = null; // Change const to let

    if (salesData.length > 0) {
      // Find current rank
      let salesCountArray = salesData.map((row) => row.salesCount); // Change const to let
      let currentRank = salesCountArray.indexOf(myBookingCount); // Change const to let

      if (currentRank !== -1) {
        if (currentRank > 0) {
          difference = salesData[currentRank - 1].salesCount - myBookingCount;
        }
      } else {
        // If current rank not found, find the next higher rank
        const maxSalesCount = Math.max(...salesCountArray);
        const nextHigherRank = salesData.find(
          (row) => row.salesCount === maxSalesCount
        );
        difference = nextHigherRank ? nextHigherRank.salesCount + 1 : 0; // One more booking needed to surpass the next rank
      }

      // Sort sales data by salesCount descending
      salesData.sort((a, b) => b.salesCount - a.salesCount);

      // Calculate bookings needed for 10th rank
      if (salesData.length >= 10) {
        const rank10thSalesCount = salesData[9].salesCount;
        bookingsNeededFor10thRank = Math.max(
          0,
          rank10thSalesCount - myBookingCount
        );
      } else {
        bookingsNeededFor10thRank = null;
      }

      // Calculate bookings needed for 5th rank
      if (salesData.length >= 5) {
        const rank5thSalesCount = salesData[4].salesCount;
        bookingsNeededFor5thRank = Math.max(
          0,
          rank5thSalesCount - myBookingCount
        );
      } else {
        bookingsNeededFor5thRank = null;
      }
    } else {
      salesData = [];
    }

    // Return the response
    return res.status(200).json({
      nextRankCount: difference,
      currentBookingCount: myBookingCount,
      topTenRankCount: bookingsNeededFor10thRank,
      topFiveRankCount: bookingsNeededFor5thRank,
    });
  } catch (error) {
    console.error("Error in moreBookingCount:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



////////////////////////////////////////////////////////////////////////////
// Enquiry Follow-up Custom Tour List
exports.enquiryFollowCustomTourList = async (req, res) => {
  try {
    // ✅ Token check
    const tokenData = await CommonController.checkToken(req.headers.token, [32]);
    if (tokenData.error) return res.status(401).json(tokenData);

    const today = moment().format("YYYY-MM-DD");
    const nowTime = moment().format("HH:mm:ss");

    let { startDate, endDate, tourName, search, perPage = 10, page = 1 } = req.query;
    perPage = parseInt(perPage);
    page = parseInt(page);

    // ✅ Base query
    let sql = `
      SELECT enquirycustomtours.*, dropdowndestination.destinationName
      FROM enquirycustomtours
      JOIN dropdowndestination ON enquirycustomtours.destinationId = dropdowndestination.destinationId
      WHERE enquirycustomtours.enquiryProcess = 1
      AND enquirycustomtours.nextFollowUp = ?
      AND enquirycustomtours.nextFollowUpTime > ?
      AND enquirycustomtours.createdBy = ?
    `;

    const params = [today, nowTime, tokenData.userId];

    // ✅ Date filters
    if (startDate && endDate) {
      sql += " AND startDate >= ? AND endDate <= ?";
      params.push(moment(startDate).startOf("day").format("YYYY-MM-DD"));
      params.push(moment(endDate).endOf("day").format("YYYY-MM-DD"));
    }
    if (startDate && !endDate) {
      sql += " AND startDate >= ?";
      params.push(moment(startDate).startOf("day").format("YYYY-MM-DD"));
    }
    if (endDate && !startDate) {
      sql += " AND endDate <= ?";
      params.push(moment(endDate).endOf("day").format("YYYY-MM-DD"));
    }

    // ✅ Tour name filter
    if (tourName) {
      sql += " AND groupName LIKE ?";
      params.push(`%${tourName}%`);
    }

    // ✅ Search filter
    if (search) {
      sql += " AND CONCAT(enquirycustomtours.firstName, ' ', enquirycustomtours.lastName) LIKE ?";
      params.push(`%${search}%`);
    }

    // ✅ Sorting
    sql += " ORDER BY enquirycustomtours.nextFollowUpTime ASC";

    // ✅ Pagination
    const countSql = `SELECT COUNT(*) as total FROM (${sql}) as countTable`;
    const [countRows] = await db.query(countSql, params);
    const total = countRows.total;

    sql += " LIMIT ? OFFSET ?";
    params.push(perPage, (page - 1) * perPage);

    const [rows] = await db.query(sql, params);

    // ✅ Format response
    const data = rows.map((value) => ({
      enquiryCustomId: value.enquiryCustomId,
      uniqueEnqueryId: value.enquiryId.toString().padStart(4, "0"),
      enqDate: moment(value.created_at).format("DD-MM-YYYY"),
      groupName: value.groupName,
      contactName: `${value.firstName} ${value.lastName}`,
      startDate: moment(value.startDate).format("DD-MM-YYYY"),
      endDate: moment(value.endDate).format("DD-MM-YYYY"),
      contact: value.contact,
      destinationName: value.destinationName,
      pax: value.adults + value.child,
      lastFollowUp: moment(value.created_at).format("DD-MM-YYYY"),
      nextFollowUp: moment(value.nextFollowUp).format("DD-MM-YYYY"),
      nextFollowUpTime: value.nextFollowUpTime,
      userName: tokenData.userName,
    }));

    res.status(200).json({
      data,
      total,
      currentPage: page,
      perPage,
      lastPage: Math.ceil(total / perPage),
      nextPageUrl:
        page * perPage < total
          ? `/enquiry-follow-custom?page=${page + 1}&perPage=${perPage}`
          : null,
      previousPageUrl:
        page > 1
          ? `/enquiry-follow-custom?page=${page - 1}&perPage=${perPage}`
          : null,
    });
  } catch (error) {
    console.error("Error fetching enquiry follow-up tours:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
