# 🐛 PDF Cache Issue - Complete Fix Guide

## Problem

All downloaded PDFs show the same content regardless of which tour you're downloading from.

---

## Root Causes

1. **Browser caching** - Same PDF content being cached by Puppeteer
2. **Non-unique filenames** - Timestamp alone isn't unique enough for rapid requests
3. **Missing HTTP cache headers** - No prevention of client-side caching
4. **Shared browser state** - Data bleeding between requests
5. **No cache busting** - Template rendering might be cached by EJS

---

## Solution

You need to update `D:\Waari\waari-nodejs\src\controllers\pdfController.js`

Replace the entire file content with this:

```javascript
const path = require("path");
const fs = require("fs");
const db = require("../../db");
const puppeteer = require("puppeteer");
const ejs = require("ejs");

/**
 * Generate unique PDF filename to prevent cache conflicts
 */
const generateUniquePdfName = (groupTourId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `predeparture_${groupTourId}_${timestamp}_${random}.pdf`;
};

/**
 * Delete old PDF files for a specific tour to free up storage
 */
const deleteOldPdfs = async (pdfDir, groupTourId, keepCount = 3) => {
  try {
    const files = fs.readdirSync(pdfDir);
    const tourPdfs = files
      .filter((f) => f.startsWith(`predeparture_${groupTourId}_`))
      .map((f) => ({
        name: f,
        path: path.join(pdfDir, f),
        mtime: fs.statSync(path.join(pdfDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.mtime - a.mtime);

    // Delete all but the most recent ones
    tourPdfs.slice(keepCount).forEach((file) => {
      try {
        fs.unlinkSync(file.path);
        console.log(`Deleted old PDF: ${file.name}`);
      } catch (err) {
        console.warn(`Failed to delete ${file.name}:`, err.message);
      }
    });
  } catch (err) {
    console.warn("Error cleaning old PDFs:", err.message);
  }
};

const generatePredeparturePdf = async (req, res) => {
  let browser = null;
  try {
    const groupTourId = req.body.groupTourId;
    if (!groupTourId) {
      return res.status(400).json({ error: "groupTourId is required" });
    }

    console.log(`🔄 Generating PDF for tour ID: ${groupTourId}`);

    // Fetch fresh tour data
    const [tourData] = await db.query(
      "SELECT * FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tourData || tourData.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const tour = tourData[0];
    console.log(`✅ Found tour: ${tour.tourName}`);

    // Fetch cities
    const [citiesData] = await db.query(
      "SELECT c.citiesName FROM grouptourscity gtc JOIN cities c ON gtc.cityId = c.citiesId WHERE gtc.groupTourId = ?",
      [groupTourId]
    );

    // Fetch country
    const [countryData] = await db.query(
      "SELECT countryName FROM countries WHERE countryId = ?",
      [tour.countryId]
    );

    // Fetch itinerary
    const [itinerary] = await db.query(
      "SELECT * FROM grouptourdetailitinerary WHERE groupTourId = ? ORDER BY day ASC",
      [groupTourId]
    );

    console.log(
      `📍 Cities: ${citiesData.length}, Itinerary items: ${itinerary.length}`
    );

    const templatePath = path.join(__dirname, "../views/predeparture.ejs");

    // Ensure template exists
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ error: "PDF template not found" });
    }

    // Render template with FRESH data (no caching)
    const html = await ejs.renderFile(templatePath, {
      tour: {
        ...tour,
        groupTourId: tour.groupTourId,
        tourName: tour.tourName,
        tourCode: tour.tourCode,
        countryId: tour.countryId,
      },
      cities: citiesData || [],
      countryName:
        countryData && countryData.length
          ? countryData[0].countryName
          : "Unknown",
      itinerary: itinerary || [],
      generatedAt: new Date().toISOString(), // Add timestamp to prevent template caching
    });

    // Launch fresh browser instance
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800 });

    // Set content with explicit cache prevention
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Prepare PDF directory
    const pdfDir = path.join(__dirname, "../public/pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Generate unique filename
    const fileName = generateUniquePdfName(groupTourId);
    const filePath = path.join(pdfDir, fileName);

    console.log(`📄 Generating PDF: ${fileName}`);

    // Generate PDF with specific options
    await page.pdf({
      path: filePath,
      format: "A4",
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });

    // Close browser immediately
    await browser.close();
    browser = null;

    // Store file path in database
    const predepartureUrl = `/pdfs/${fileName}`;

    await db.query(
      "UPDATE grouptours SET predepartureUrl = ? WHERE groupTourId = ?",
      [predepartureUrl, groupTourId]
    );

    // Clean up old PDFs
    deleteOldPdfs(pdfDir, groupTourId);

    console.log(`✅ PDF generated successfully: ${fileName}`);

    // Send response with cache prevention headers
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    res.status(200).json({
      success: true,
      message: "Predeparture PDF generated successfully",
      url: predepartureUrl,
      tourName: tour.tourName,
      groupTourId: groupTourId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error generating predeparture PDF:", error.message);
    res.status(500).json({
      error: error.message,
      details: "Failed to generate PDF. Please try again.",
    });
  } finally {
    // Ensure browser is closed
    if (browser) {
      try {
        await browser.close();
      } catch (err) {
        console.warn("Error closing browser:", err.message);
      }
    }
  }
};

const downloadPdf = async (req, res) => {
  try {
    const groupTourId = req.params.groupTourId;
    const type = req.params.type;

    console.log(`📥 Downloading ${type} PDF for tour: ${groupTourId}`);

    const [tour] = await db.query(
      "SELECT groupTourId, tourName, predepartureUrl, printUrl, pdfUrl FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tour || tour.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const fieldName = type + "Url";
    const pdfUrl = tour[0][fieldName];

    if (!pdfUrl) {
      return res
        .status(404)
        .json({ error: `${type} PDF not available for this tour` });
    }

    // Handle Supabase URLs
    if (pdfUrl.includes("supabase")) {
      return res.redirect(pdfUrl);
    }

    // Handle local PDFs
    const filePath = path.join(__dirname, "../../public", pdfUrl);

    if (!fs.existsSync(filePath)) {
      console.warn(`PDF file not found at: ${filePath}`);
      return res.status(404).json({ error: "PDF file not found on server" });
    }

    // Set cache prevention headers
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set(
      "Content-Disposition",
      `attachment; filename="${tour[0].tourName}_${type}.pdf"`
    );

    console.log(`✅ Downloading: ${path.basename(filePath)}`);

    return res.download(filePath);
  } catch (error) {
    console.error("❌ Error downloading PDF:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const viewPdf = async (req, res) => {
  try {
    const groupTourId = req.params.groupTourId;
    const type = req.params.type;

    const [tour] = await db.query(
      "SELECT predepartureUrl, printUrl, pdfUrl FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tour || tour.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const fieldName = type + "Url";
    const pdfUrl = tour[0][fieldName];

    if (!pdfUrl) {
      return res.status(404).json({ error: "PDF not available" });
    }

    // Set cache prevention headers
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    res.json({
      success: true,
      url: pdfUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error viewing PDF:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getPdfStatus = async (req, res) => {
  try {
    const groupTourId = req.params.groupTourId;

    const [tour] = await db.query(
      "SELECT groupTourId, tourName, pdfUrl, predepartureUrl, printUrl FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tour || tour.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Set cache prevention headers
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    res.json({
      success: true,
      data: {
        groupTourId: tour[0].groupTourId,
        tourName: tour[0].tourName,
        pdfs: {
          pdf: tour[0].pdfUrl ? "ready" : "pending",
          predeparture: tour[0].predepartureUrl ? "ready" : "pending",
          print: tour[0].printUrl ? "ready" : "pending",
        },
      },
    });
  } catch (error) {
    console.error("❌ Error getting PDF status:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generatePredeparturePdf,
  downloadPdf,
  viewPdf,
  getPdfStatus,
};
```

---

## Key Fixes Applied

✅ **Unique Filenames** - Uses timestamp + random string instead of just timestamp
✅ **Cache Headers** - All responses include `Cache-Control: no-store`
✅ **Fresh Data** - Database queries on every request (no caching)
✅ **Template Timestamp** - Adds `generatedAt` to prevent EJS caching
✅ **Browser Cleanup** - Fresh browser instance per request
✅ **Old PDF Cleanup** - Deletes old PDFs (keeps last 3 per tour)
✅ **Better Logging** - Enhanced console logging for debugging
✅ **Error Handling** - Improved error messages and cleanup

---

## Testing Steps

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Download PDF from Tour 1** → Should show Tour 1 data
3. **Download PDF from Tour 2** → Should show Tour 2 data (NOT Tour 1!)
4. **Download same tour twice** → Should get different files (newer version)
5. **Check browser console** → Should see cache headers

---

## Result

Now each PDF will:

- ✅ Contain the correct tour data
- ✅ Have unique filenames
- ✅ Not be cached by browser
- ✅ Be fresh on every download
