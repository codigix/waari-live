const express = require("express");
const router = express.Router();
const pool = require("../../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");
const CommonController = require("../controllers/CommonController");

// ---------------- MULTER CONFIG ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ----------------- ADD / UPDATE TOUR -----------------
router.post(
  "/add-tour-details",
  upload.fields([
    { name: "bgImage", maxCount: 1 },
    { name: "websiteBanner", maxCount: 1 },
  ]),
  [
    body("tourName").notEmpty(),
    body("tourCode").notEmpty(),
    body("tourTypeId").isNumeric(),
    body("destinationId").isNumeric(),
    body("departureTypeId").isNumeric(),
    body("countryId").isNumeric(),
    body("totalSeats").isNumeric(),
    body("vehicleId").isNumeric(),
    body("mealPlanId").isNumeric(),
    body("kitchenId").isNumeric(),
    body("mealTypeId").isNumeric(),
    body("tourManager").notEmpty(),
    body("managerNo").isLength({ min: 10, max: 10 }),
    body("startDate").notEmpty(),
    body("endDate").notEmpty(),
    body("night").isNumeric(),
    body("days").isNumeric(),
    body("cityId").custom((value) => Array.isArray(JSON.parse(value))),
    body("shopping").notEmpty(),
    body("weather").notEmpty(),
    body("websiteDescription").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const connection = await pool.getConnection();
    try {
      // 🔐 Token validation
      const tokenData = await CommonController.checkToken(
        req.headers["token"],
        [73]
      );
      const clientcode = "CODIGIXADMIN"; // ✅ Hardcoded for dev or fixed client

      await connection.beginTransaction();

      const {
        tourName,
        tourCode,
        tourTypeId,
        destinationId,
        departureTypeId,
        countryId,
        stateId,
        startDate,
        endDate,
        night,
        days,
        totalSeats,
        vehicleId,
        mealPlanId,
        kitchenId,
        mealTypeId,
        tourManager,
        managerNo,
        uniqueExperience,
        shopping,
        weather,
        websiteDescription,
        cityId,
      } = req.body;
      console.log("Request Body:", req.body);
      const bgImage = req.files["bgImage"]
        ? req.files["bgImage"][0].filename
        : null;
      const websiteBanner = req.files["websiteBanner"]
        ? req.files["websiteBanner"][0].filename
        : null;

      // 🧠 Insert tour with clientcode
      const [result] = await connection.query(
        `INSERT INTO grouptours (
    tourName, tourCode, tourTypeId, destinationId, departureTypeId, 
    countryId, stateId, startDate, endDate, night, days, totalSeats, 
    vehicleId, mealPlanId, kitchenId, mealTypeId, tourManager, managerNo, 
    uniqueExperience, shopping, weather, bgImage, websiteBanner, websiteDescription, clientcode
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tourName,
          tourCode,
          tourTypeId,
          destinationId,
          departureTypeId,
          countryId,
          stateId || null,
          startDate,
          endDate,
          night,
          days,
          totalSeats,
          vehicleId,
          mealPlanId,
          kitchenId,
          mealTypeId,
          tourManager,
          managerNo,
          uniqueExperience || null,
          shopping,
          weather,
          bgImage,
          websiteBanner,
          websiteDescription,
          clientcode, // ✅ Injected manually
        ]
      );

      const newGroupTourId = result.insertId;

      // 🏙️ Insert cities
      const cities = JSON.parse(cityId);
      const cityValues = cities.map((city) => [newGroupTourId, city,clientcode]);
      await connection.query(
        `INSERT INTO grouptourscity (groupTourId, cityId,clientcode) VALUES ?`,
        [cityValues]
      );

      await connection.commit();
      res.status(200).json({
        message: "Group tour details added successfully",
        groupTourId: newGroupTourId,
      });
    } catch (err) {
      await connection.rollback();
      console.error("❌ Error in add-tour-details:", err);
      res.status(400).json({ message: err.message });
    } finally {
      connection.release();
    }
  }
);

// ----------------- VIEW DETAILS GROUP TOUR -----------------
router.get("/view-details-group-tour", async (req, res) => {
  const groupTourId = req.query.groupTourId;

  if (!groupTourId) {
    return res.status(400).json({ message: "groupTourId is required" });
  }

  const connection = await pool.getConnection();

  try {
    // Check if tour exists
    const [exists] = await connection.query(
      "SELECT 1 FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );
    if (exists.length === 0) {
      return res
        .status(404)
        .json({ message: "Group tour details do not exist" });
    }

    // Main tour details
    const [detailGroupTour] = await connection.query(
      `SELECT g.*, c.countryName, s.stateName, tt.tourTypeName,
              dd.destinationName, ddt.departureName,
              dv.vehicleName, dmp.mealPlanName, dk.kitchenName, dmt.mealTypeName
       FROM grouptours g
       JOIN tourtype tt ON g.tourTypeId = tt.tourTypeId
       LEFT JOIN countries c ON g.countryId = c.countryId
       LEFT JOIN states s ON g.stateId = s.stateId
       JOIN dropdowndestination dd ON g.destinationId = dd.destinationId
       JOIN dropdowndeparturetype ddt ON g.departureTypeId = ddt.departureTypeId
       JOIN dropdownvehicle dv ON g.vehicleId = dv.vehicleId
       JOIN dropdownmealplan dmp ON g.mealPlanId = dmp.mealPlanId
       JOIN dropdownkitchen dk ON g.kitchenId = dk.kitchenId
       JOIN dropdownmealtype dmt ON g.mealTypeId = dmt.mealTypeId
       WHERE g.groupTourId = ?`,
      [groupTourId]
    );

    let seatsAvailable = 0;
    let pdfUrl = null;
    let predepartureUrl = null;
    let printUrl = null;

    if (detailGroupTour.length > 0) {
      const tour = detailGroupTour[0];
      const [booked] = await connection.query(
        `SELECT COUNT(*) AS bookedSeats 
         FROM grouptourguestdetails 
         WHERE groupTourId = ? AND isCancel = 0`,
        [groupTourId]
      );
      seatsAvailable = tour.totalSeats - booked[0].bookedSeats;

      pdfUrl = tour.pdfUrl
        ? `${req.protocol}://${req.get("host")}${tour.pdfUrl}`
        : null;
      predepartureUrl = tour.predepartureUrl
        ? `${req.protocol}://${req.get("host")}${tour.predepartureUrl}`
        : null;
      printUrl = tour.printUrl
        ? `${req.protocol}://${req.get("host")}${tour.printUrl}`
        : "";
    }

    // Skeleton Itinerary
    const [skeletonItinerary] = await connection.query(
      `SELECT date, destination, overnightAt, hotelName, hotelAddress
       FROM grouptourskeletonitinerary WHERE groupTourId = ?`,
      [groupTourId]
    );

    // Cities
    const [city] = await connection.query(
      `SELECT c.citiesId, c.citiesName
       FROM grouptourscity gc
       JOIN cities c ON gc.cityId = c.citiesId
       WHERE gc.groupTourId = ?`,
      [groupTourId]
    );

    // Tour Price
    const [tourPrice] = await connection.query(
      `SELECT pd.roomShareId, rs.roomShareName, pd.tourPrice, pd.offerPrice, pd.commissionPrice
       FROM grouptourpricediscount pd
       JOIN dropdownroomsharing rs ON pd.roomShareId = rs.roomShareId
       WHERE pd.groupTourId = ?`,
      [groupTourId]
    );

    // Detailed Itinerary
    const [detailedItinerary] = await connection.query(
      `SELECT * FROM grouptourdetailitinerary WHERE groupTourId = ?`,
      [groupTourId]
    );
    detailedItinerary.forEach((item) => {
      item.mealTypeId = JSON.parse(item.mealTypeId || "[]");
    });

    const [detailedItineraryMealType] = await connection.query(
      `SELECT mealTypeId FROM grouptourdetailitinerary WHERE groupTourId = ?`,
      [groupTourId]
    );
    detailedItineraryMealType.forEach((item) => {
      item.mealTypeId = JSON.parse(item.mealTypeId || "[]");
    });

    // Train Details
    const [trainDetails] = await connection.query(
      `SELECT * FROM grouptourtrain WHERE groupTourId = ?`,
      [groupTourId]
    );

    // Flight Details
    const [flightDetails] = await connection.query(
      `SELECT journey, flight, airline, class, \`from\`, fromDate, fromTime, \`to\`, toDate, toTime, weight
       FROM grouptourflight WHERE groupTourId = ?`,
      [groupTourId]
    );

    // D2D, inclusions, exclusions, notes, visaDocuments, images
    const [d2d] = await connection.query(
      `SELECT * FROM grouptourd2dtime WHERE groupTourId = ?`,
      [groupTourId]
    );
    const [inclusions] = await connection.query(
      `SELECT * FROM inclusions WHERE groupTourId = ?`,
      [groupTourId]
    );
    const [exclusions] = await connection.query(
      `SELECT * FROM exclusions WHERE groupTourId = ?`,
      [groupTourId]
    );
    const [notes] = await connection.query(
      `SELECT * FROM grouptourdetails WHERE groupTourId = ?`,
      [groupTourId]
    );
    const [visaDocuments] = await connection.query(
      `SELECT * FROM visadocumentsgt WHERE groupTourId = ?`,
      [groupTourId]
    );
    const [images] = await connection.query(
      `SELECT * FROM grouptouritineraryimages WHERE groupTourId = ?`,
      [groupTourId]
    );

    const grouptouritineraryimages = {};
    images.forEach((img) => {
      if (!grouptouritineraryimages[img.type])
        grouptouritineraryimages[img.type] = [];
      grouptouritineraryimages[img.type].push(img);
    });

    res.status(200).json({
      detailGroupTour,
      skeletonItinerary,
      detailedItinerary,
      detailedItineraryMealType,
      tourPrice,
      trainDetails,
      flightDetails,
      dtod: d2d || null,
      city,
      visaDocuments,
      inclusions,
      exclusions,
      notes,
      grouptouritineraryimages,
      seatsAvailable,
      pdfUrl,
      predepartureUrl,
      printUrl,
    });
  } catch (err) {
    console.error("❌ Error in view-details-group-tour:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    connection.release();
  }
});
// ----------------- EDIT DATA GT -----------------

router.get("/edit-data-gt", async (req, res) => {
  const groupTourId = req.query.groupTourId;

  if (!groupTourId) {
    return res.status(422).json({ message: ["groupTourId is required"] });
  }

  const connection = await pool.getConnection();
  try {
    // Check if tour exists
    const [exists] = await connection.query(
      `SELECT 1 FROM grouptours WHERE groupTourId = ?`,
      [groupTourId]
    );
    if (exists.length === 0) {
      return res
        .status(404)
        .json({ message: "Group tour details do not exist Token" });
    }

    // Main tour details
    const [detailGroupTour] = await connection.query(
      `SELECT g.*, c.countryName, s.stateName, tt.tourTypeName, dd.destinationName, ddt.departureName,
              dv.vehicleName, dmp.mealPlanName, dk.kitchenName, dmt.mealTypeName
       FROM grouptours g
       JOIN tourtype tt ON g.tourTypeId = tt.tourTypeId
       LEFT JOIN countries c ON g.countryId = c.countryId
       LEFT JOIN states s ON g.stateId = s.stateId
       JOIN dropdowndestination dd ON g.destinationId = dd.destinationId
       JOIN dropdowndeparturetype ddt ON g.departureTypeId = ddt.departureTypeId
       JOIN dropdownvehicle dv ON g.vehicleId = dv.vehicleId
       JOIN dropdownmealplan dmp ON g.mealPlanId = dmp.mealPlanId
       JOIN dropdownkitchen dk ON g.kitchenId = dk.kitchenId
       JOIN dropdownmealtype dmt ON g.mealTypeId = dmt.mealTypeId
       WHERE g.groupTourId = ?`,
      [groupTourId]
    );

    if (detailGroupTour.length === 0) {
      return res.status(404).json({ message: "Group tour not found" });
    }

    const tour = detailGroupTour[0];

    const [booked] = await connection.query(
      `SELECT COUNT(*) AS bookedSeats FROM grouptourguestdetails WHERE groupTourId = ?`,
      [groupTourId]
    );
    const seatsAvailable = tour.totalSeats - booked[0].bookedSeats;

    const [skeletonItineraryData] = await connection.query(
      `SELECT date, destination, overnightAt, hotelName, hotelAddress
       FROM grouptourskeletonitinerary WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [cityId] = await connection.query(
      `SELECT c.citiesId, c.citiesName
       FROM grouptourscity gc
       JOIN cities c ON gc.cityId = c.citiesId
       WHERE gc.groupTourId = ?`,
      [groupTourId]
    );

    const [tourPrice] = await connection.query(
      `SELECT pd.roomShareId, rs.roomShareName, pd.tourPrice, pd.offerPrice, pd.commissionPrice
       FROM grouptourpricediscount pd
       JOIN dropdownroomsharing rs ON pd.roomShareId = rs.roomShareId
       WHERE pd.groupTourId = ?`,
      [groupTourId]
    );

    const [detailedItinerary] = await connection.query(
      `SELECT * FROM grouptourdetailitinerary WHERE groupTourId = ?`,
      [groupTourId]
    );

    for (const item of detailedItinerary) {
      item.mealTypeId = JSON.parse(item.mealTypeId || "[]");

      const [images] = await connection.query(
        `SELECT * FROM grouptouritineraryimages 
         WHERE groupDetailineraryId = ? AND groupTourId = ?`,
        [item.groupDetailineraryId, item.groupTourId]
      );

      const groupedImages = {};
      images.forEach((img) => {
        if (!groupedImages[img.type]) groupedImages[img.type] = [];
        groupedImages[img.type].push(img);
      });

      item.grouptouritineraryimages = groupedImages;
    }

    const [detailedItineraryMealType] = await connection.query(
      `SELECT mealTypeId FROM grouptourdetailitinerary WHERE groupTourId = ?`,
      [groupTourId]
    );
    detailedItineraryMealType.forEach((item) => {
      item.mealTypeId = JSON.parse(item.mealTypeId || "[]");
    });

    const [trainDetails] = await connection.query(
      `SELECT * FROM grouptourtrain WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [flightDetails] = await connection.query(
      `SELECT * FROM grouptourflight WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [d2d] = await connection.query(
      `SELECT * FROM grouptourd2dtime WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [inclusions] = await connection.query(
      `SELECT * FROM inclusions WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [exclusions] = await connection.query(
      `SELECT * FROM exclusions WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [note] = await connection.query(
      `SELECT * FROM grouptourdetails WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [visaDocuments] = await connection.query(
      `SELECT * FROM visadocumentsgt WHERE groupTourId = ?`,
      [groupTourId]
    );

    const [allImages] = await connection.query(
      `SELECT * FROM grouptouritineraryimages WHERE groupTourId = ?`,
      [groupTourId]
    );

    const groupedImages = {};
    allImages.forEach((img) => {
      if (!groupedImages[img.type]) groupedImages[img.type] = [];
      groupedImages[img.type].push(img);
    });

    const myObj = {
      groupTourId: tour.groupTourId,
      tourName: tour.tourName,
      bgImage: tour.bgImage,
      tourManager: tour.tourManager,
      tourCode: tour.tourCode,
      tourTypeId: tour.tourTypeId,
      tourTypeName: tour.tourTypeName,
      countryId: tour.countryId,
      countryName: tour.countryName,
      stateId: tour.stateId,
      stateName: tour.stateName,
      destinationId: tour.destinationId,
      destinationName: tour.destinationName,
      departureTypeId: tour.departureTypeId,
      departureName: tour.departureName,
      vehicleId: tour.vehicleId,
      vehicleName: tour.vehicleName,
      mealPlanId: tour.mealPlanId,
      mealPlanName: tour.mealPlanName,
      kitchenId: tour.kitchenId,
      kitchenName: tour.kitchenName,
      mealTypeId: tour.mealTypeId,
      mealTypeName: tour.mealTypeName,
      totalSeats: tour.totalSeats,
      days: tour.days,
      night: tour.night,
      startDate: tour.startDate,
      endDate: tour.endDate,
      uniqueExperience: tour.uniqueExperience || "",
      websiteBanner: tour.websiteBanner,
      websiteDescription: tour.websiteDescription,
      skeletonItinerary: skeletonItineraryData,
      detailedItinerary,
      detailedItineraryMealType,
      tourPrice,
      trainDetails,
      flightDetails,
      dtod: d2d[0] || null,
      city: cityId,
      visaDocuments: visaDocuments?.visaDocuments || "",
      visaFee: visaDocuments?.visaFee || "",
      visaInstruction: visaDocuments?.visaInstruction || "",
      visaAlerts: visaDocuments?.visaAlerts || "",
      insuranceDetails: visaDocuments?.insuranceDetails || "",
      euroTrainDetails: visaDocuments?.euroTrainDetails || "",
      nriOriForDetails: visaDocuments?.nriOriForDetails || "",
      seatsAvailable,
      note,
      managerNo: tour.managerNo,
      shopping: tour.shopping,
      weather: tour.weather,
      inclusions,
      exclusions,
      grouptouritineraryimages: groupedImages,
    };

    res.status(200).json({ data: myObj });
  } catch (err) {
    console.error("❌ Error in edit-data-gt:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    connection.release();
  }
});

// Helper to format dates for MySQL DATETIME
function formatDateForMySQL(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

router.post("/update-group-tour-list", async (req, res) => {
  const { groupTourId } = req.query;
  if (!groupTourId)
    return res.status(400).json({ message: "groupTourId is required" });

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Check if tour exists
    const [tourRows] = await conn.query(
      "SELECT * FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );
    if (!tourRows.length) {
      await conn.rollback();
      return res.status(404).json({ message: "Group tour not found" });
    }

    // Convert dates
    const startDate = formatDateForMySQL(req.body.startDate);
    const endDate = formatDateForMySQL(req.body.endDate);

    // Update main grouptours table
    await conn.query(
      `UPDATE grouptours
       SET tourTypeId=?, tourName=?, tourCode=?, departureTypeId=?, stateId=?, countryId=?, destinationId=?,
           startDate=?, endDate=?, night=?, days=?, totalSeats=?, vehicleId=?, mealPlanId=?, kitchenId=?,
           mealTypeId=?, tourManager=?, bgImage=?, managerNo=?, shopping=?, weather=?, uniqueExperience=?,
           pdfUrl=?, predepartureUrl=?, printUrl=?, websiteBanner=?, websiteDescription=?
       WHERE groupTourId=?`,
      [
        req.body.tourTypeId,
        req.body.tourName,
        req.body.tourCode,
        req.body.departureTypeId,
        req.body.stateId,
        req.body.countryId,
        req.body.destinationId,
        startDate,
        endDate,
        req.body.night,
        req.body.days,
        req.body.totalSeats,
        req.body.vehicleId,
        req.body.mealPlanId,
        req.body.kitchenId,
        req.body.mealTypeId,
        req.body.tourManager,
        req.body.bgImage,
        req.body.managerNo,
        req.body.shopping,
        req.body.weather,
        req.body.uniqueExperience,
        null, // pdfUrl
        null, // predepartureUrl
        null, // printUrl
        req.body.websiteBanner,
        req.body.websiteDescription,
        groupTourId,
      ]
    );

    // Example: Update related tables (cities)
    await conn.query("DELETE FROM grouptourscity WHERE groupTourId = ?", [
      groupTourId,
    ]);
    if (req.body.cityId && Array.isArray(req.body.cityId)) {
      const cityValues = req.body.cityId.map((cityId) => [groupTourId, cityId]);
      await conn.query(
        "INSERT INTO grouptourscity (groupTourId, cityId) VALUES ?",
        [cityValues]
      );
    }

    // Optional: Update visa documents table if exists
    if (req.body.visaDocuments) {
      await conn.query(
        `UPDATE visadocumentsgt
         SET visaDocuments=?, visaFee=?, visaInstruction=?, visaAlerts=?, insuranceDetails=?, euroTrainDetails=?, nriOriForDetails=?
         WHERE groupTourId=?`,
        [
          req.body.visaDocuments || null,
          req.body.visaFee || null,
          req.body.visaInstruction || null,
          req.body.visaAlerts || null,
          req.body.insuranceDetails || null,
          req.body.euroTrainDetails || null,
          req.body.nriOriForDetails || null,
          groupTourId,
        ]
      );
    }

    // Commit transaction
    await conn.commit();
    return res.status(200).json({
      message: "Group Tour details updated successfully",
      groupTourId,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Update error:", err);
    return res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});

// Add Group Tour

router.post("/add-group-tour", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    // --- VALIDATION ---
    await body("tourName").notEmpty().run(req);
    await body("tourCode").notEmpty().run(req);
    await body("tourTypeId").isNumeric().run(req);
    await body("departureTypeId").isNumeric().run(req);
    await body("destinationId").isNumeric().run(req);
    await body("countryId").isNumeric().run(req);
    await body("startDate").notEmpty().run(req);
    await body("endDate").notEmpty().run(req);
    await body("night").isNumeric().run(req);
    await body("days").isNumeric().run(req);
    await body("totalSeats").isNumeric().run(req);
    await body("vehicleId").isNumeric().run(req);
    await body("mealPlanId").isNumeric().run(req);
    await body("kitchenId").isNumeric().run(req);
    await body("mealTypeId").isNumeric().run(req);
    await body("tourManager").notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    await conn.beginTransaction();

    const startDate = new Date(req.body.startDate).toISOString().split("T")[0];
    const endDate = new Date(req.body.endDate).toISOString().split("T")[0];

    const clientcode = req.body.clientcode || "DEFAULTCODE";

    // --- INSERT GROUP TOUR ---
    const [tourResult] = await conn.query(
      `INSERT INTO grouptours 
        (tourTypeId, tourName, tourCode, departureTypeId, stateId, countryId, destinationId, startDate, endDate, night, days, totalSeats, vehicleId, mealPlanId, kitchenId, mealTypeId, tourManager, bgImage, managerNo, shopping, weather, uniqueExperience, websiteBanner, websiteDescription, clientcode) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.tourTypeId,
        req.body.tourName,
        req.body.tourCode,
        req.body.departureTypeId,
        req.body.stateId || null,
        req.body.countryId,
        req.body.destinationId,
        startDate,
        endDate,
        req.body.night,
        req.body.days,
        req.body.totalSeats,
        req.body.vehicleId,
        req.body.mealPlanId,
        req.body.kitchenId,
        req.body.mealTypeId,
        req.body.tourManager,
        req.body.bgImage || "",
        req.body.managerNo || "",
        req.body.shopping || "",
        req.body.weather || "",
        req.body.uniqueExperience || 0,
        req.body.websiteBanner || "",
        req.body.websiteDescription || "",
        clientcode,
      ]
    );
    const tourId = tourResult.insertId;

    // --- INSERT CITIES ---
    if (!req.body.cityId?.length) {
      await conn.rollback();
      return res.status(400).json({ message: "City array is empty" });
    }
    const citiesData = req.body.cityId.map((cityId) => [tourId, cityId]);
    await conn.query(
      "INSERT INTO grouptourscity (groupTourId, cityId) VALUES ?",
      [citiesData]
    );

    // --- INSERT Skeleton Itinerary ---
    if (req.body.skeletonInteriory?.length) {
      const skeletonData = req.body.skeletonInteriory.map((item) => [
        tourId,
        item.date,
        item.destination || "",
        item.overnightAt || "",
        item.hotelName || "",
        item.hotelAddress || "",
        clientcode,
      ]);
      await conn.query(
        "INSERT INTO grouptourskeletonitinerary (groupTourId, date, destination, overnightAt, hotelName, hotelAddress, clientcode) VALUES ?",
        [skeletonData]
      );
    }

    // --- INSERT Inclusions ---
    if (req.body.inclusions?.length) {
      const inclusionData = req.body.inclusions.map((item) => [
        tourId,
        item.description,
        clientcode,
      ]);
      await conn.query(
        "INSERT INTO inclusions (groupTourId, description, clientcode) VALUES ?",
        [inclusionData]
      );
    }

    // --- INSERT Exclusions ---
    if (req.body.exclusions?.length) {
      const exclusionData = req.body.exclusions.map((item) => [
        tourId,
        item.description,
        clientcode,
      ]);
      await conn.query(
        "INSERT INTO exclusions (groupTourId, description, clientcode) VALUES ?",
        [exclusionData]
      );
    }

    // --- INSERT Notes ---
    if (req.body.note?.length) {
      const noteData = req.body.note.map((item) => [
        tourId,
        item.note,
        clientcode,
      ]);
      await conn.query(
        "INSERT INTO grouptourdetails (groupTourId, note, clientcode) VALUES ?",
        [noteData]
      );
    }

    // --- INSERT Room Prices ---
    if (req.body.roomsharingprice?.length) {
      if (req.body.roomsharingprice.length !== 8) {
        await conn.rollback();
        return res
          .status(400)
          .json({ message: "Number of room sharing prices should be 8" });
      }
      const roomData = req.body.roomsharingprice.map((item) => [
        item.roomShareId,
        tourId,
        item.tourPrice,
        item.offerPrice,
        item.commissionPrice,
        clientcode,
      ]);
      await conn.query(
        "INSERT INTO grouptourpricediscount (roomShareId, groupTourId, tourPrice, offerPrice, commissionPrice, clientcode) VALUES ?",
        [roomData]
      );
    }

    // --- INSERT Detailed Itinerary ---
    if (req.body.detailIntenirary?.length >= req.body.days) {
      const detailData = req.body.detailIntenirary.map((item) => [
        tourId,
        item.date,
        item.title,
        item.description,
        item.distance,
        JSON.stringify(item.mealTypeId),
        item.nightStayAt,
        item.fromCity,
        item.toCity,
        item.approxTravelTime,
        item.bannerImage,
        item.hotelImage,
        clientcode,
      ]);
      await conn.query(
        "INSERT INTO grouptourdetailitinerary (groupTourId, date, title, description, distance, mealTypeId, nightStayAt, fromCity, toCity, approxTravelTime, bannerImage, hotelImage, clientcode) VALUES ?",
        [detailData]
      );
    } else {
      await conn.rollback();
      return res.status(400).json({
        message:
          "Number of detailed itineraries should be at least " + req.body.days,
      });
    }

    // --- INSERT Visa Documents ---
    if (req.body.destinationId == 2 && req.body.visaDocuments) {
      await conn.query(
        `INSERT INTO visadocumentsgt (groupTourId, visaDocuments, visaFee, visaInstruction, visaAlerts, insuranceDetails, euroTrainDetails, nriOriForDetails, clientcode)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tourId,
          req.body.visaDocuments,
          req.body.visaFee,
          req.body.visaInstruction,
          req.body.visaAlerts,
          req.body.insuranceDetails,
          req.body.euroTrainDetails,
          req.body.nriOriForDetails,
          clientcode,
        ]
      );
    }

    await conn.commit();
    res
      .status(200)
      .json({ message: "Group tour details added successfully", tourId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});
// DELETE group-tour listing
router.get("/delete-group-tour-list", async (req, res) => {
  const groupTourId = req.query.groupTourId;

  if (!groupTourId || isNaN(groupTourId)) {
    return res
      .status(400)
      .json({ message: "groupTourId is required and must be numeric" });
  }

  try {
    const tokenData = await CommonController.checkToken(req.headers["token"], [
      78,
    ]);
    if (!tokenData) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const conn = await pool.getConnection();

    try {
      const [existsInEnquiryGroupTours] = await conn.query(
        "SELECT 1 FROM enquirygrouptours WHERE groupTourId = ? LIMIT 1",
        [groupTourId]
      );

      if (existsInEnquiryGroupTours.length > 0) {
        conn.release();
        return res.status(409).json({
          message: "This Group Tour details are added in enquiry table",
        });
      }

      const [grouptours] = await conn.query(
        "SELECT * FROM grouptours WHERE groupTourId = ?",
        [groupTourId]
      );

      if (grouptours.length === 0) {
        conn.release();
        return res.status(404).json({ message: "Group tour record not found" });
      }

      const tour = grouptours[0];

      // Delete child tables
      const tablesToDelete = [
        "grouptourtrain",
        "grouptourflight",
        "grouptourd2dtime",
        "grouptourdetailitinerary",
        "grouptourenquirydetails",
        "grouptourpricediscount",
        "grouptourskeletonitinerary",
        "visadocumentsgt",
        "inclusions",
        "exclusions",
        "homepagejourneytour",
      ];

      for (let table of tablesToDelete) {
        await conn.query(`DELETE FROM ${table} WHERE groupTourId = ?`, [
          groupTourId,
        ]);
      }

      await conn.query("DELETE FROM reviews WHERE type = 1 AND tourCode = ?", [
        tour.tourCode,
      ]);
      await conn.query("DELETE FROM supplierpayments WHERE groupTourId = ?", [
        groupTourId,
      ]);
      await conn.query("DELETE FROM miscellaneousfiles WHERE groupTourId = ?", [
        groupTourId,
      ]);
      await conn.query("DELETE FROM grouptours WHERE groupTourId = ?", [
        groupTourId,
      ]);

      conn.release();
      return res
        .status(200)
        .json({ message: "Group tours deleted successfully" });
    } catch (err) {
      conn.release();
      return res.status(409).json({ message: err.message });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error: " + err.message });
  }
});

// guestsGroupTour API
router.get("/guests-group-tour", async (req, res) => {
  // support both query and body
  const groupTourId = req.query.groupTourId || req.body.groupTourId;

  if (!groupTourId) {
    return res.status(400).json({ message: "groupTourId is required" });
  }

  try {
    // --- TOKEN CHECK (uncomment if required) ---
    // const tokenData = await CommonController.checkToken(req.headers["token"], [1]);
    // if (!tokenData) {
    //   return res.status(408).json({ message: "Invalid Token" });
    // }

    const conn = await pool.getConnection();

    try {
      // Check if group tour exists
      const [groupTour] = await conn.query(
        "SELECT * FROM grouptours WHERE groupTourId = ? LIMIT 1",
        [groupTourId]
      );

      if (groupTour.length === 0) {
        conn.release();
        return res.status(404).json({ message: "Group Tour Not Found" });
      }

      // Fetch guest details
      const [guestDetails] = await conn.query(
        `SELECT g.firstName, g.lastName, g.gender, g.contact, g.address, g.dob, g.adharNo
         FROM grouptourguestdetails g
         JOIN grouptours t ON t.groupTourId = g.groupTourId
         JOIN enquirygrouptours e ON g.enquiryGroupId = e.enquiryGroupId
         WHERE g.groupTourId = ?
         AND g.isCancel = 0
         AND e.enquiryProcess = 2
         ORDER BY g.created_at DESC`,
        [groupTourId]
      );

      let guestArray = [];

      if (guestDetails.length > 0) {
        guestArray = guestDetails.map((row) => ({
          familyHeadName: `${row.firstName || ""} ${row.lastName || ""}`.trim(),
          gender: row.gender,
          contact: row.contact || "",
          address: row.address,
          dob: row.dob,
          adharNo: row.adharNo,
        }));
      }

      conn.release();
      return res.json({ data: guestArray });
    } catch (err) {
      conn.release();
      return res.status(500).json({ message: err.message });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error: " + err.message });
  }
});

// routes/AddTour.js

// POST /api/add-group-tour-info
router.post("/add-group-tour-info", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      groupTourId,
      inclusions = [],
      exclusions = [],
      note = [],
      clientcode, // optional clientcode
    } = req.body;

    const clientCodeValue = clientcode || "DEFAULTCODE"; // default clientcode

    // Basic validation
    if (!groupTourId) {
      return res.status(400).json({ message: "groupTourId is required" });
    }

    // Check if group tour exists
    const [groupTourData] = await conn.query(
      "SELECT * FROM grouptours WHERE groupTourId=?",
      [groupTourId]
    );
    if (groupTourData.length === 0) {
      return res.status(404).json({ message: "Group tour not found" });
    }

    // Table validations
    const requiredTables = [
      {
        table: "grouptourskeletonitinerary",
        msg: "skeleton itinerary details required",
      },
      {
        table: "grouptourpricediscount",
        msg: "pricediscount details required",
      },
      {
        table: "grouptourdetailitinerary",
        msg: "detailitinerary details required",
      },
      {
        table: "grouptouritineraryimages",
        msg: "itineraryimages details required",
      },
      { table: "grouptourtrain", msg: "Train details required" },
      { table: "grouptourd2dtime", msg: "d2dtime details required" },
      { table: "grouptourscity", msg: "city details required" },
    ];

    for (const t of requiredTables) {
      const [rows] = await conn.query(
        `SELECT 1 FROM ${t.table} WHERE groupTourId=? LIMIT 1`,
        [groupTourId]
      );
      if (rows.length === 0) {
        return res.status(400).json({ message: t.msg });
      }
    }

    // Additional for destinationId 2
    if (groupTourData[0].destinationId == 2) {
      const extraTables = [
        { table: "grouptourflight", msg: "flight details required" },
        { table: "visadocumentsgt", msg: "visadocumentsgt details required" },
      ];
      for (const t of extraTables) {
        const [rows] = await conn.query(
          `SELECT 1 FROM ${t.table} WHERE groupTourId=? LIMIT 1`,
          [groupTourId]
        );
        if (rows.length === 0) {
          return res.status(400).json({ message: t.msg });
        }
      }
    }

    // Process Inclusions
    await conn.query("DELETE FROM inclusions WHERE groupTourId=?", [
      groupTourId,
    ]);
    if (inclusions.length === 0)
      return res.status(404).json({ message: "Inclusions array is empty" });

    const inclusionsData = inclusions.map((inc) => [
      groupTourId,
      inc.description || "",
      clientCodeValue, // added clientcode
    ]);
    await conn.query(
      "INSERT INTO inclusions (groupTourId, description, clientcode) VALUES ?",
      [inclusionsData]
    );

    // Process Exclusions
    await conn.query("DELETE FROM exclusions WHERE groupTourId=?", [
      groupTourId,
    ]);
    if (exclusions.length === 0)
      return res.status(404).json({ message: "Exclusions array is empty" });

    const exclusionsData = exclusions.map((exc) => [
      groupTourId,
      exc.description || "",
      clientCodeValue, // added clientcode
    ]);
    await conn.query(
      "INSERT INTO exclusions (groupTourId, description, clientcode) VALUES ?",
      [exclusionsData]
    );

    // Process Notes
    await conn.query("DELETE FROM grouptourdetails WHERE groupTourId=?", [
      groupTourId,
    ]);
    if (note.length === 0)
      return res.status(404).json({ message: "Notes array is empty" });

    const notesData = note.map((n) => [
      groupTourId,
      n.note || "",
      clientCodeValue, // added clientcode
    ]);
    await conn.query(
      "INSERT INTO grouptourdetails (groupTourId, note, clientcode) VALUES ?",
      [notesData]
    );

    // Update groupTourProcess
    await conn.query(
      "UPDATE grouptours SET groupTourProcess=1 WHERE groupTourId=?",
      [groupTourId]
    );

    await conn.commit();
    return res.json({
      message: "Information added successfully for this tour",
    });
  } catch (error) {
    await conn.rollback();
    console.error("Error saving group tour info:", error);
    return res.status(400).json({ message: error.message });
  } finally {
    conn.release();
  }
});

// POST /api/add-skeleton-details

router.post("/add-skeleton-details", async (req, res) => {
  const { groupTourId, skeletonInteriory } = req.body;
  const clientcode = req.body.clientcode || "DEFAULTCODE"; // default clientcode

  if (!groupTourId || !skeletonInteriory || !Array.isArray(skeletonInteriory)) {
    return res.status(400).json({
      message: "groupTourId and skeletonInteriory array are required",
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check if groupTour exists
    const [groupTour] = await conn.query(
      "SELECT * FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!groupTour.length) {
      return res.status(404).json({ message: "Group tour not found" });
    }

    // Delete existing skeleton itinerary for this group tour
    await conn.query(
      "DELETE FROM grouptourskeletonitinerary WHERE groupTourId = ?",
      [groupTourId]
    );

    // Insert new skeleton itinerary
    const insertData = skeletonInteriory.map((item) => [
      groupTourId,
      item.date,
      item.destination,
      item.overnightAt,
      item.hotelName,
      item.hotelAddress,
      clientcode, // use default or provided clientcode
    ]);

    await conn.query(
      `INSERT INTO grouptourskeletonitinerary 
        (groupTourId, date, destination, overnightAt, hotelName, hotelAddress, clientcode) 
        VALUES ?`,
      [insertData]
    );

    await conn.commit();
    res.json({
      message: "Group tour skeleton itinerary data added successfully",
    });
  } catch (err) {
    await conn.rollback();
    console.error("Error saving skeleton details:", err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});
router.post("/add-travel-details", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const {
      groupTourId,
      d2dtime = [],
      traindetails = [],
      flightdetails = [],
      visaDocuments = "",
      visaFee = "",
      visaInstruction = "",
      visaAlerts = "",
      insuranceDetails = "",
      euroTrainDetails = "",
      nriOriForDetails = "",
      clientcode = "DEFAULTCODE",
    } = req.body;

    const [groupTourData] = await conn.query(
      "SELECT * FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );
    if (!groupTourData.length)
      return res.status(404).json({ message: "Group tour not found" });

    // Helper to handle empty strings for DATE/DATETIME
    const safeDate = (value) => (value && value.trim() ? value : null);

    // --- D2D details ---
    if (d2dtime.length > 0) {
      await conn.query("DELETE FROM grouptourd2dtime WHERE groupTourId = ?", [
        groupTourId,
      ]);
      const d2dValues = d2dtime.map((item) => [
        groupTourId,
        item.startCity || null,
        item.pickUpMeet || null,
        safeDate(item.pickUpMeetTime),
        safeDate(item.arriveBefore),
        item.endCity || null,
        item.dropOffPoint || null,
        safeDate(item.dropOffTime),
        safeDate(item.bookAfter),
        clientcode,
      ]);
      await conn.query(
        `INSERT INTO grouptourd2dtime 
        (groupTourId, startCity, pickUpMeet, pickUpMeetTime, arriveBefore, endCity, dropOffPoint, dropOffTime, bookAfter, clientcode)
        VALUES ?`,
        [d2dValues]
      );
    }

    // --- Train details ---
    if (traindetails.length > 0) {
      await conn.query("DELETE FROM grouptourtrain WHERE groupTourId = ?", [
        groupTourId,
      ]);
      const trainValues = traindetails.map((item) => [
        groupTourId,
        item.journey || null,
        parseInt(item.trainNo) || 0,
        item.trainName || null,
        item.from || null,
        safeDate(item.fromDate),
        safeDate(item.fromTime),
        item.to || null,
        safeDate(item.toDate),
        safeDate(item.toTime),
        clientcode,
      ]);
      await conn.query(
        `INSERT INTO grouptourtrain
        (groupTourId, journey, trainNo, trainName, \`from\`, fromDate, fromTime, \`to\`, toDate, toTime, clientcode)
        VALUES ?`,
        [trainValues]
      );
    }

    // --- Flight details (destinationId 2) ---
    if (groupTourData[0].destinationId === 2 && flightdetails.length > 0) {
      await conn.query("DELETE FROM grouptourflight WHERE groupTourId = ?", [
        groupTourId,
      ]);
      const flightValues = flightdetails.map((item) => [
        groupTourId,
        item.journey || null,
        item.flight || null,
        item.airline || null,
        item.class || null,
        item.from || null,
        safeDate(item.fromDate),
        safeDate(item.fromTime),
        item.to || null,
        safeDate(item.toDate),
        safeDate(item.toTime),
        parseInt(item.weight) || 0,
        clientcode,
      ]);
      await conn.query(
        `INSERT INTO grouptourflight
        (groupTourId, journey, flight, airline, class, \`from\`, fromDate, fromTime, \`to\`, toDate, toTime, weight, clientcode)
        VALUES ?`,
        [flightValues]
      );

      // Visa documents
      await conn.query(
        `INSERT INTO visadocumentsgt 
        (groupTourId, visaDocuments, visaFee, visaInstruction, visaAlerts, insuranceDetails, euroTrainDetails, nriOriForDetails, clientcode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          visaDocuments = VALUES(visaDocuments),
          visaFee = VALUES(visaFee),
          visaInstruction = VALUES(visaInstruction),
          visaAlerts = VALUES(visaAlerts),
          insuranceDetails = VALUES(insuranceDetails),
          euroTrainDetails = VALUES(euroTrainDetails),
          nriOriForDetails = VALUES(nriOriForDetails)`,
        [
          groupTourId,
          visaDocuments || null,
          visaFee || null,
          visaInstruction || null,
          visaAlerts || null,
          insuranceDetails || null,
          euroTrainDetails || null,
          nriOriForDetails || null,
          clientcode,
        ]
      );
    }

    res.json({ message: "Travel details added successfully" });
  } catch (error) {
    console.error("Error saving travel details:", error);
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
});

router.post("/add-group-tour-price", async (req, res) => {
  const {
    groupTourId,
    roomsharingprice = [],
    clientcode = "DEFAULTCODE",
  } = req.body;

  if (!groupTourId)
    return res.status(400).json({ message: "groupTourId is required" });
  if (!roomsharingprice.length)
    return res.status(400).json({ message: "roomsharingprice is required" });
  if (roomsharingprice.length !== 8) {
    return res
      .status(400)
      .json({ message: "Number of room sharing prices should be 8" });
  }

  try {
    const conn = await pool.getConnection();

    // Check if group tour exists
    const [groupTourData] = await conn.query(
      "SELECT * FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );
    if (!groupTourData.length) {
      conn.release();
      return res.status(404).json({ message: "Group tour not found" });
    }

    // Prepare values for bulk upsert including clientcode
    const values = roomsharingprice.map((room) => [
      room.roomShareId,
      groupTourId,
      room.tourPrice || 0,
      room.offerPrice || 0,
      room.commissionPrice || 0,
      clientcode,
    ]);

    const sql = `
      INSERT INTO grouptourpricediscount (roomShareId, groupTourId, tourPrice, offerPrice, commissionPrice, clientcode)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        tourPrice = VALUES(tourPrice),
        offerPrice = VALUES(offerPrice),
        commissionPrice = VALUES(commissionPrice),
        clientcode = VALUES(clientcode)
    `;

    await conn.query(sql, [values]);
    conn.release();

    res.json({ message: "Price added successfully for this tour" });
  } catch (err) {
    console.error("Error adding group tour price:", err);
    res.status(400).json({ message: err.message });
  }
});

// POST /api/add-detail-itinerary

// POST /api/add-detail-itinerary
router.post("/add-detail-itinerary", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { groupTourId, detailIntenirary, clientcode } = req.body;
    const clientCodeValue = clientcode || "DEFAULTCODE"; // default

    if (!groupTourId)
      return res.status(400).json({ message: "Group Tour ID is required" });

    // Check group tour exists
    const [groupTourData] = await conn.query(
      "SELECT * FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );
    if (!groupTourData.length)
      return res.status(404).json({ message: "Group tour not found" });

    // Delete old detailed itineraries
    await conn.query(
      "DELETE FROM grouptourdetailitinerary WHERE groupTourId = ?",
      [groupTourId]
    );

    if (
      !detailIntenirary ||
      !Array.isArray(detailIntenirary) ||
      detailIntenirary.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Detail Itinerary array is empty" });
    }

    const detailRows = detailIntenirary.map((item, index) => [
      groupTourId,
      item.date || null,
      item.title || "",
      item.description || "",
      item.distance || "",
      item.mealTypeId ? JSON.stringify(item.mealTypeId) : null,
      item.nightStayAt || "",
      item.fromCity || "",
      item.toCity || "",
      item.approxTravelTime || "",
      item.bannerImage || "",
      item.hotelImage || "",
      clientCodeValue, // default clientcode
    ]);

    const insertQuery = `
      INSERT INTO grouptourdetailitinerary 
      (groupTourId, date, title, description, distance, mealTypeId, nightStayAt, fromCity, toCity, approxTravelTime, bannerImage, hotelImage, clientcode)
      VALUES ?
    `;
    await conn.query(insertQuery, [detailRows]);

    // Delete old itinerary images
    await conn.query(
      "DELETE FROM grouptouritineraryimages WHERE groupTourId = ?",
      [groupTourId]
    );

    // Insert itinerary images if present
    const itineraryImages = [];
    detailIntenirary.forEach((item, idx) => {
      if (
        item.grouptouritineraryimagesList &&
        Array.isArray(item.grouptouritineraryimagesList)
      ) {
        item.grouptouritineraryimagesList.forEach((img) => {
          itineraryImages.push([
            groupTourId,
            idx + 1, // groupDetailineraryId placeholder
            img.itineraryImageName || "",
            img.itineraryImageUrl || "",
            img.type || 0,
            clientCodeValue,
          ]);
        });
      }
    });

    if (itineraryImages.length > 0) {
      const insertImagesQuery = `
        INSERT INTO grouptouritineraryimages 
        (groupTourId, groupDetailineraryId, itineraryImageName, itineraryImageUrl, type, clientcode)
        VALUES ?
      `;
      await conn.query(insertImagesQuery, [itineraryImages]);
    }

    res.json({
      message: "Group tour detailed itineraries data added successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    conn.release();
  }
});

// ---------------- ENQUIRY CUSTOM DETAILS ----------------
router.get("/enquiry-ct", async (req, res) => {
  const { enquiryCustomId } = req.query;

  // --- VALIDATION ---
  if (!enquiryCustomId || isNaN(enquiryCustomId)) {
    return res
      .status(400)
      .json({ message: "enquiryCustomId is required and must be numeric" });
  }

  try {
    const conn = await pool.getConnection();

    // --- TOKEN CHECK (dummy implementation, replace with your logic) ---
    const token = req.headers["token"];
    if (!token) {
      conn.release();
      return res.status(408).json({ message: "Invalid Token" });
    }
    // example: validate with JWT
    // try { jwt.verify(token, process.env.JWT_SECRET); } catch { return res.status(408).json({ message: "Invalid Token" }); }

    // --- FETCH ENQUIRY DETAILS ---
    const [rows] = await conn.query(
      `
      SELECT 
        e.*,
        d.destinationName,
        hc.hotelCatName,
        mp.mealPlanName,
        s.stateName,
        c.countryName,
        er.enquiryReferName,
        COALESCE(p.priorityName, NULL) AS priorityName
      FROM enquirycustomtours e
      JOIN dropdowndestination d ON e.destinationId = d.destinationId
      JOIN dropdownhotelcategory hc ON e.hotelCatId = hc.hotelCatId
      JOIN dropdownmealplan mp ON e.mealPlanId = mp.mealPlanId
      JOIN countries c ON e.countryId = c.countryId
      JOIN dropdownenquiryreference er ON e.enquiryReferId = er.enquiryReferId
      LEFT JOIN dropdownpriority p ON e.priorityId = p.priorityId
      LEFT JOIN states s ON e.stateId = s.stateId
      WHERE e.enquiryCustomId = ?
      `,
      [enquiryCustomId]
    );

    if (!rows.length) {
      conn.release();
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const enqDetails = rows[0];

    // --- FETCH CITIES ---
    let cities = [];
    try {
      const citiesIdArray = JSON.parse(enqDetails.cities);
      if (Array.isArray(citiesIdArray) && citiesIdArray.length > 0) {
        const [cityRows] = await conn.query(
          "SELECT * FROM cities WHERE citiesId IN (?)",
          [citiesIdArray]
        );
        cities = cityRows;
      }
    } catch (err) {
      console.error("Error parsing cities JSON:", err.message);
    }

    conn.release();

    // --- RESPONSE ---
    return res.status(200).json({
      groupName: enqDetails.groupName,
      contactName: `${enqDetails.firstName} ${enqDetails.lastName}`,
      destinationName: enqDetails.destinationName,
      destinationId: enqDetails.destinationId,
      contact: enqDetails.contact,
      nights: enqDetails.nights,
      days: enqDetails.days,
      adults: enqDetails.adults,
      child: enqDetails.child,
      age: enqDetails.age,
      isRework: enqDetails.isRework === 1,
      enquiryReferName: enqDetails.enquiryReferName,
      guestRefId: enqDetails.guestRefId,
      guestId: enqDetails.guestId,
      priorityName: enqDetails.priorityName,
      familyHeadNo: enqDetails.familyHeadNo,
      guestRef: enqDetails.guestRefId,
      countryName: enqDetails.countryName,
      stateName: enqDetails.stateName,
      startDate: enqDetails.startDate,
      endDate: enqDetails.endDate,
      nightsNo: enqDetails.nightsNo,
      hotelCatName: enqDetails.hotelCatName,
      extraBed: enqDetails.extraBed,
      mealPlanName: enqDetails.mealPlanName,
      cities,
      mailId: enqDetails.mailId,
      rooms: enqDetails.rooms,
    });
  } catch (err) {
    console.error("Error fetching enquiry:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /api/package-list?enquiryCustomId=13&perPage=10&page=1
router.get("/package-list", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { enquiryCustomId, perPage, page } = req.query;

    // --- VALIDATION ---
    if (!enquiryCustomId) {
      return res.status(400).json({ message: "enquiryCustomId is required" });
    }

    // --- TOKEN CHECK ---
    const tokenData = await CommonController.checkToken(
      req.headers["token"],
      [150, 167, 243, 252, 264, 365, 366]
    );
    if (!tokenData) {
      return res.status(408).json({ message: "Invalid Token" });
    }

    const limit = perPage ? parseInt(perPage) : 10;
    const currentPage = page ? parseInt(page) : 1;
    const offset = (currentPage - 1) * limit;

    // --- COUNT TOTAL RECORDS ---
    const [totalRows] = await conn.query(
      "SELECT COUNT(*) as total FROM packagescustomtour WHERE enquiryCustomId = ?",
      [enquiryCustomId]
    );
    const total = totalRows[0].total;

    if (total === 0) {
      return res.json({
        data: [],
        total: 0,
        currentPage,
        perPage: limit,
        nextPageUrl: null,
        previousPageUrl: null,
        lastPage: 0,
      });
    }

    // --- FETCH PAGINATED DATA ---
    const [packagesList] = await conn.query(
      "SELECT * FROM packagescustomtour WHERE enquiryCustomId = ? LIMIT ? OFFSET ?",
      [enquiryCustomId, limit, offset]
    );

    // --- MAP DATA ---
    const packageArray = packagesList.map((pkg) => ({
      packageCustomId: pkg.packageCustomId,
      package: pkg.package,
      adult: pkg.adult,
      extraBed: pkg.extraBed,
      childWithout: pkg.childWithout,
      reworkDescription: pkg.reworkDescription,
      isFinal: pkg.isFinal,
      isFinalDescription: "0-reject,1-confirm,2-not confirm yet",
    }));

    // --- PAGINATION CALC ---
    const lastPage = Math.ceil(total / limit);
    const nextPageUrl =
      currentPage < lastPage
        ? `/api/package-list?enquiryCustomId=${enquiryCustomId}&perPage=${limit}&page=${
            currentPage + 1
          }`
        : null;
    const previousPageUrl =
      currentPage > 1
        ? `/api/package-list?enquiryCustomId=${enquiryCustomId}&perPage=${limit}&page=${
            currentPage - 1
          }`
        : null;

    res.json({
      data: packageArray,
      total,
      currentPage,
      perPage: limit,
      nextPageUrl,
      previousPageUrl,
      lastPage,
    });
  } catch (error) {
    console.error("Error fetching package list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    conn.release();
  }
});

module.exports = router;
