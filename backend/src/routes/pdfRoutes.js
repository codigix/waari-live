const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { checkToken } = require('../controllers/CommonController');

// Generate Predeparture PDF
router.post('/generate-predeparture-pdf', async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers['token'], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.generatePredeparturePdf(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get PDF Status
router.get('/pdf-status/:groupTourId', async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers['token'], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.getPdfStatus(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download PDF
router.get('/download-pdf/:groupTourId/:type', async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers['token'], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.downloadPdf(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View PDF (get URL)
router.get('/view-pdf/:groupTourId/:type', async (req, res) => {
  try {
    const tokenData = await checkToken(req.headers['token'], [32]);
    if (tokenData.error) {
      return res.status(401).json(tokenData);
    }
    await pdfController.viewPdf(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
