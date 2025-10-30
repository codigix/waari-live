# 🔧 WAARI PDF SYSTEM - COMPLETE FIX GUIDE

## 📌 OVERVIEW

The PDF system has multiple issues:

1. ✅ Cron jobs use ES6 imports but app uses CommonJS
2. ✅ No proper PDF routes registered
3. ✅ Inconsistent database field names
4. ✅ Missing error handling

---

## ✅ STEP 1: CREATE PDF ROUTES FILE

**File:** `D:\Waari\waari-nodejs\src\routes\pdfRoutes.js`

```javascript
const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");
const { checkToken } = require("../controllers/CommonController");

// Generate Predeparture PDF
router.post("/generate-predeparture-pdf", async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers["token"], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.generatePredeparturePdf(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get PDF Status
router.get("/pdf-status/:groupTourId", async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers["token"], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.getPdfStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download PDF
router.get("/download-pdf/:groupTourId/:type", async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers["token"], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.downloadPdf(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View PDF (get URL)
router.get("/view-pdf/:groupTourId/:type", async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers["token"], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.viewPdf(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## ✅ STEP 2: FIX PDF CONTROLLER

**File:** `D:\Waari\waari-nodejs\src\controllers\pdfController.js`

Replace ALL content with this:

```javascript
const path = require("path");
const fs = require("fs");
const db = require("../../db");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const generatePredeparturePdf = async (req, res) => {
  try {
    const { groupTourId } = req.body;

    if (!groupTourId) {
      return res.status(400).json({ error: "groupTourId is required" });
    }

    const [tourData] = await db.query(
      "SELECT * FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tourData || tourData.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const tour = tourData[0];

    const [citiesData] = await db.query(
      "SELECT c.citiesName FROM grouptourscity gtc JOIN cities c ON gtc.citiesId = c.citiesId WHERE gtc.groupTourId = ?",
      [groupTourId]
    );

    const [countryData] = await db.query(
      "SELECT countryName FROM countries WHERE countryId = ?",
      [tour.countryId]
    );

    const [itinerary] = await db.query(
      "SELECT * FROM grouptourdetailitinerary WHERE groupTourId = ?",
      [groupTourId]
    );

    const templatePath = path.join(
      __dirname,
      "../../src/views/predeparture.ejs"
    );
    const html = await ejs.renderFile(templatePath, {
      tour,
      cities: citiesData,
      countryName:
        countryData && countryData.length ? countryData[0].countryName : "",
      itinerary,
    });

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfDir = path.join(__dirname, "../../public/pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const fileName = "predeparture_" + groupTourId + "_" + Date.now() + ".pdf";
    const filePath = path.join(pdfDir, fileName);

    await page.pdf({ path: filePath, format: "A4" });
    await browser.close();

    const fileBuffer = fs.readFileSync(filePath);
    const uploadPath = "predeparture/" + fileName;

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(uploadPath, fileBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl("predeparture/" + fileName);

    const predepartureUrl = publicUrlData.publicUrl;

    await db.query(
      "UPDATE grouptours SET predepartureUrl = ? WHERE groupTourId = ?",
      [predepartureUrl, groupTourId]
    );

    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: "Predeparture PDF generated successfully",
      url: predepartureUrl,
    });
  } catch (error) {
    console.error("Error generating predeparture PDF:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const downloadPdf = async (req, res) => {
  try {
    const { groupTourId, type } = req.params;

    const [tour] = await db.query(
      "SELECT predepartureUrl, printUrl, pdfUrl FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tour || tour.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const pdfUrl = tour[0][type + "Url"];

    if (!pdfUrl) {
      return res.status(404).json({ error: "PDF not available for this tour" });
    }

    if (pdfUrl.includes("supabase")) {
      return res.redirect(pdfUrl);
    }

    const filePath = path.join(__dirname, "../../public", pdfUrl);
    if (fs.existsSync(filePath)) {
      return res.download(filePath);
    }

    res.status(404).json({ error: "PDF file not found" });
  } catch (error) {
    console.error("Error downloading PDF:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const viewPdf = async (req, res) => {
  try {
    const { groupTourId, type } = req.params;

    const [tour] = await db.query(
      "SELECT predepartureUrl, printUrl, pdfUrl FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tour || tour.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const pdfUrl = tour[0][type + "Url"];

    if (!pdfUrl) {
      return res.status(404).json({ error: "PDF not available" });
    }

    res.json({
      success: true,
      url: pdfUrl,
    });
  } catch (error) {
    console.error("Error viewing PDF:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getPdfStatus = async (req, res) => {
  try {
    const { groupTourId } = req.params;

    const [tour] = await db.query(
      "SELECT groupTourId, tourName, pdfUrl, predepartureUrl, printUrl FROM grouptours WHERE groupTourId = ?",
      [groupTourId]
    );

    if (!tour || tour.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

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
    console.error("Error getting PDF status:", error.message);
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

## ✅ STEP 3: UPDATE SERVER.JS

In `D:\Waari\waari-nodejs\server.js`, find this line:

```javascript
const enqueriesRoutes = require("./src/routes/EnqueriesRoutes");
app.use("/api", enqueriesRoutes);
```

**ADD AFTER IT:**

```javascript
// PDF Routes
const pdfRoutes = require("./src/routes/pdfRoutes");
app.use("/api", pdfRoutes);
```

---

## ✅ STEP 4: UPDATE FRONTEND COMPONENTS

In your React components that display PDFs, use these functions:

### **Function 1: Get PDF Status**

```javascript
const getPdfStatus = async (groupTourId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/pdf-status/${groupTourId}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error getting PDF status:", error);
  }
};
```

### **Function 2: Download PDF**

```javascript
const downloadPdf = (groupTourId, type = "predeparture") => {
  const token = localStorage.getItem("token");
  window.location.href = `http://localhost:3000/api/download-pdf/${groupTourId}/${type}?token=${token}`;
};
```

### **Function 3: View PDF**

```javascript
const viewPdf = async (groupTourId, type = "predeparture") => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/view-pdf/${groupTourId}/${type}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    window.open(response.data.url, "_blank");
  } catch (error) {
    console.error("Error viewing PDF:", error);
  }
};
```

### **Function 4: Generate PDF**

```javascript
const generatePdf = async (groupTourId) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/generate-predeparture-pdf",
      { groupTourId },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    toast.success("PDF generated successfully");
    return response.data.url;
  } catch (error) {
    toast.error("Failed to generate PDF: " + error.message);
  }
};
```

---

## ✅ STEP 5: REQUIRED DEPENDENCIES

Make sure these are in your `package.json`:

```json
{
  "puppeteer": "^24.16.1",
  "ejs": "^3.1.10",
  "pdf-creator-node": "^1.5.0",
  "handlebars": "^4.7.7"
}
```

Run: `npm install`

---

## ✅ STEP 6: SUPABASE SETUP

1. Login to Supabase Console
2. Create bucket named: `pdfs`
3. Make it PUBLIC
4. Add CORS policy if needed

---

## ✅ CHECKLIST

- [ ] Created `pdfRoutes.js`
- [ ] Fixed `pdfController.js`
- [ ] Updated `server.js`
- [ ] Updated frontend components
- [ ] Installed dependencies
- [ ] Configured Supabase bucket
- [ ] Tested PDF generation
- [ ] Tested PDF download
- [ ] Tested PDF view

---

## 🚀 TEST COMMANDS

```bash
# Test PDF status
curl -X GET http://localhost:3000/api/pdf-status/1 \
  -H "token: your_token_here"

# Test generate PDF
curl -X POST http://localhost:3000/api/generate-predeparture-pdf \
  -H "Content-Type: application/json" \
  -H "token: your_token_here" \
  -d '{"groupTourId": 1}'

# Test download PDF
curl -X GET http://localhost:3000/api/download-pdf/1/predeparture \
  -H "token: your_token_here" \
  -o tour.pdf
```

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: Puppeteer fails to launch

**Solution:**

```bash
npm install --save-optional @vscode/sqlite3
```

### Issue: PDF file not found

**Solution:** Make sure `/public/pdfs` directory exists or create it:

```bash
mkdir -p D:\Waari\waari-nodejs\public\pdfs
```

### Issue: Supabase upload fails

**Solution:**

- Verify API key and URL
- Check bucket permissions
- Ensure service role key is set in .env

### Issue: No token validation

**Solution:** Check that token is passed in headers (see Step 4 examples)

---

## 📞 NEXT STEPS

1. ✅ Copy all code from this guide into the backend files
2. ✅ Restart Node server: `npm start`
3. ✅ Test with the curl commands above
4. ✅ Then we implement Hugging Face AI integration
