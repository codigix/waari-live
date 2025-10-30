const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const CommonController = require('./CommonController');
const db = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'vouchers/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

class CustomizeTourController {
    // Package upload for custom tour
    static async packageCustomTour(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [149, 242, 365, 366]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            const enquiryDetails = await db('enquirycustomtours')
                .where('enquiryCustomId', req.body.enquiryCustomId)
                .first();

            if (!enquiryDetails) {
                return res.status(404).json({ message: 'Enquiry details not found' });
            }

            // Insert data
            const packages = await db('packagescustomtour').insert({
                enquiryCustomId: req.body.enquiryCustomId,
                package: req.body.package,
                adult: req.body.adult,
                extraBed: req.body.extraBed,
                childWithout: req.body.childWithout
            });

            await db('enquirycustomtours')
                .where('enquiryCustomId', req.body.enquiryCustomId)
                .update({ isRework: 0 });

            if (packages) {
                return res.status(200).json({ message: "Packages added successfully" });
            } else {
                return res.status(500).json({ message: "Something went wrong" });
            }

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Package upload
    static async packageUpload(req, res) {
        try {
            if (!req.file) {
                return res.status(422).json({ message: 'PDF file is required' });
            }

            const filename = req.file.filename;
            const pdfUrl = `${req.protocol}://${req.get('host')}/pdf/${filename}`;

            return res.status(200).json({ message: 'Uploaded successfully', pdf: pdfUrl });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Confirmed custom tours
    static async confirmCustomTours(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [32]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            let confirmCustom = db('customtourenquirydetails')
                .join('customtourdiscountdetails', 'customtourenquirydetails.enquiryDetailCustomId', 'customtourdiscountdetails.enquiryDetailCustomId')
                .join('enquirycustomtours', 'customtourenquirydetails.enquiryCustomId', 'enquirycustomtours.enquiryCustomId')
                .where('customtourenquirydetails.status', 1)
                .orderBy('customtourdiscountdetails.created_at', 'desc')
                .select(
                    'enquirycustomtours.*',
                    'customtourdiscountdetails.*',
                    'customtourenquirydetails.enquiryDetailCustomId',
                    'customtourenquirydetails.familyHeadName'
                );

            // Apply filters
            if (req.query.startDate && req.query.endDate) {
                const startDate = new Date(req.query.startDate);
                const endDate = new Date(req.query.endDate);
                endDate.setHours(23, 59, 59, 999);

                confirmCustom.where('startDate', '>=', startDate)
                            .where('endDate', '<=', endDate);
            }

            if (req.query.startDate) {
                const startDate = new Date(req.query.startDate);
                confirmCustom.where('startDate', '>=', startDate);
            }

            if (req.query.endDate) {
                const endDate = new Date(req.query.endDate);
                endDate.setHours(23, 59, 59, 999);
                confirmCustom.where('endDate', '<=', endDate);
            }

            if (req.query.guestName) {
                const search = `%${req.query.guestName}%`;
                confirmCustom.where('billingName', 'like', search);
            }

            // Pagination
            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [confirmCustomTour, total] = await Promise.all([
                confirmCustom.limit(perPage).offset(offset),
                confirmCustom.count('* as total').first()
            ]);

            if (confirmCustomTour.length === 0) {
                return res.status(200).json({
                    data: [],
                    total: 0,
                    currentPage: page,
                    perPage,
                    nextPageUrl: null,
                    previousPageUrl: null,
                    lastPage: 1
                });
            }

            const confirmCustomArray = [];

            for (const value of confirmCustomTour) {
                const paymentData = await db('customtourpaymentdetails')
                    .where('enquiryCustomId', value.enquiryCustomId)
                    .where('enquiryDetailCustomId', value.enquiryDetailCustomId)
                    .orderBy('customPayDetailId', 'desc');

                const totalAdvance = paymentData.reduce((sum, payment) => sum + parseFloat(payment.advancePayment), 0);
                const balance = parseFloat(value.grandTotal) - totalAdvance;

                confirmCustomArray.push({
                    enquiryCustomId: value.enquiryCustomId,
                    uniqueEnqueryId: value.enquiryId.toString().padStart(4, '0'),
                    groupName: value.groupName,
                    billingName: value.billingName,
                    enquiryDetailCustomId: value.enquiryDetailCustomId,
                    contactName: value.familyHeadName,
                    startDate: value.startDate,
                    endDate: value.endDate,
                    contact: value.contact,
                    tourPrice: value.tourPrice,
                    additionalDis: value.additionalDis,
                    discountPrice: value.discountPrice,
                    gst: value.gst,
                    tcs: value.tcs,
                    grandTotal: value.grandTotal,
                    advancePayment: totalAdvance,
                    balance: Math.round(balance),
                    purchasePrice: value.purchasePrice
                });
            }

            const lastPage = Math.ceil(total.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: confirmCustomArray,
                total: parseInt(total.total),
                currentPage: parseInt(page),
                perPage: parseInt(perPage),
                nextPageUrl: page < lastPage ? `${baseUrl}?page=${parseInt(page) + 1}&perPage=${perPage}` : null,
                previousPageUrl: page > 1 ? `${baseUrl}?page=${parseInt(page) - 1}&perPage=${perPage}` : null,
                lastPage
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Today follow up
    static async enquiryCustomOperation(req, res) {
        try {
            const tokenData = await CommonController.checkToken(req.headers.token, [201]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            let enquiryCustomList = db('enquirycustomtours')
                .join('dropdowndestination', 'enquirycustomtours.destinationId', 'dropdowndestination.destinationId')
                .where('enquirycustomtours.enquiryProcess', 1)
                .orderBy('enquirycustomtours.enquiryCustomId', 'desc')
                .select('enquirycustomtours.*', 'dropdowndestination.destinationName');

            // Apply filters
            if (req.query.startDate && req.query.endDate) {
                const startDate = new Date(req.query.startDate);
                const endDate = new Date(req.query.endDate);
                endDate.setHours(23, 59, 59, 999);

                enquiryCustomList.where('startDate', '>=', startDate)
                                .where('endDate', '<=', endDate);
            }

            if (req.query.startDate) {
                const startDate = new Date(req.query.startDate);
                enquiryCustomList.where('startDate', '>=', startDate);
            }

            if (req.query.endDate) {
                const endDate = new Date(req.query.endDate);
                endDate.setHours(23, 59, 59, 999);
                enquiryCustomList.where('endDate', '<=', endDate);
            }

            if (req.query.destinationName) {
                const search = `%${req.query.destinationName}%`;
                enquiryCustomList.where('destinationName', 'like', search);
            }

            if (req.query.guestName) {
                const search = `%${req.query.guestName}%`;
                enquiryCustomList.where('contactName', 'like', search);
            }

            // Pagination
            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [enquiryCustomLists, total] = await Promise.all([
                enquiryCustomList.limit(perPage).offset(offset),
                enquiryCustomList.count('* as total').first()
            ]);

            if (enquiryCustomLists.length === 0) {
                return res.status(200).json({
                    data: [],
                    total: 0,
                    currentPage: page,
                    perPage,
                    nextPageUrl: null,
                    previousPageUrl: null,
                    lastPage: 1
                });
            }

            const enquiryCustomArray = enquiryCustomLists.map(value => ({
                enquiryCustomId: value.enquiryCustomId,
                uniqueEnqueryId: value.enquiryId.toString().padStart(4, '0'),
                enqDate: new Date(value.created_at).toLocaleDateString('en-GB'),
                groupName: value.groupName,
                contactName: value.contactName,
                startDate: new Date(value.startDate).toLocaleDateString('en-GB'),
                endDate: new Date(value.endDate).toLocaleDateString('en-GB'),
                contact: value.contact,
                destinationName: value.destinationName,
                pax: value.adults + value.child,
                lastFollowUp: new Date(value.created_at).toLocaleDateString('en-GB'),
                nextFollowUp: new Date(value.nextFollowUp).toLocaleDateString('en-GB')
            }));

            const lastPage = Math.ceil(total.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: enquiryCustomArray,
                total: parseInt(total.total),
                currentPage: parseInt(page),
                perPage: parseInt(perPage),
                nextPageUrl: page < lastPage ? `${baseUrl}?page=${parseInt(page) + 1}&perPage=${perPage}` : null,
                previousPageUrl: page > 1 ? `${baseUrl}?page=${parseInt(page) - 1}&perPage=${perPage}` : null,
                lastPage
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Upload vouchers operations
    static async uploadVouchers(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [282, 284, 286, 288]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array() });
            }

            const vouchers = req.body.files.map(file => ({
                vouchers: file.vouchers,
                enquiryCustomId: req.body.enquiryCustomId,
                voucherTypeId: req.body.voucherTypeId
            }));

            if (vouchers.length === 0) {
                return res.status(400).json({ message: 'Insertable array is empty' });
            }

            const result = await db('vouchersct').insert(vouchers);

            if (result) {
                return res.status(200).json({ message: 'Vouchers added successfully' });
            } else {
                return res.status(500).json({ message: 'Vouchers not added' });
            }

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Delete voucher
    static async deleteVoucher(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array() });
            }

            const deleteVoucher = await db('vouchersct')
                .where('voucherId', req.body.voucherId)
                .delete();

            if (deleteVoucher) {
                return res.status(200).json({ message: 'Voucher deleted successfully' });
            } else {
                return res.status(500).json({ message: 'Something went wrong' });
            }

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Multiple PDF upload
    static async pdfUpload(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(422).json({ message: 'Files are required' });
            }

            const fileArray = req.files.map(file => {
                const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
                const filePath = path.join('vouchers', filename);
                
                fs.renameSync(file.path, filePath);
                
                return {
                    fileName: filename,
                    filePath: `${req.protocol}://${req.get('host')}/vouchers/${filename}`
                };
            });

            return res.status(200).json({ message: 'Uploaded successfully', data: fileArray });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Delete PDF
    static async deletePdf(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array() });
            }

            const filePath = path.join('vouchers', req.body.fileName);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return res.status(200).json({ message: 'File deleted successfully' });
            } else {
                return res.status(404).json({ message: 'File not found' });
            }

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // View vouchers
    static async viewVouchers(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [283, 285, 287, 289]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: errors.array() });
            }

            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [voucherList, total] = await Promise.all([
                db('vouchersct')
                    .join('dropdownvouchersname', 'vouchersct.voucherTypeId', 'dropdownvouchersname.voucherTypeId')
                    .where('enquiryCustomId', req.body.enquiryCustomId)
                    .limit(perPage)
                    .offset(offset),
                
                db('vouchersct')
                    .where('enquiryCustomId', req.body.enquiryCustomId)
                    .count('* as total')
                    .first()
            ]);

            if (voucherList.length === 0) {
                return res.status(200).json({
                    data: [],
                    total: 0,
                    currentPage: page,
                    perPage,
                    nextPageUrl: null,
                    previousPageUrl: null,
                    lastPage: 1
                });
            }

            const voucherList_array = voucherList.map(value => ({
                voucherName: value.voucherName,
                vouchers: value.vouchers
            }));

            const lastPage = Math.ceil(total.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: voucherList_array,
                total: parseInt(total.total),
                currentPage: parseInt(page),
                perPage: parseInt(perPage),
                nextPageUrl: page < lastPage ? `${baseUrl}?page=${parseInt(page) + 1}&perPage=${perPage}` : null,
                previousPageUrl: page > 1 ? `${baseUrl}?page=${parseInt(page) - 1}&perPage=${perPage}` : null,
                lastPage
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Operation dashboard
    static async operationDashboard(req, res) {
        try {
            const tokenData = await CommonController.checkToken(req.headers.token, [3]);
            if (!tokenData) {
                return res.status(408).json({ message: 'Invalid Token' });
            }

            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            // Loyalty bookings
            const [loyaltyGroup, loyaltyCustom] = await Promise.all([
                db('enquirygrouptours')
                    .where('enquiryReferId', 8)
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first(),
                
                db('enquirycustomtours')
                    .where('enquiryReferId', 8)
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first()
            ]);

            const loyaltyBooking = (loyaltyGroup?.count || 0) + (loyaltyCustom?.count || 0);

            // Welcome bookings
            const [welcomeGroup, welcomeCustom] = await Promise.all([
                db('enquirygrouptours')
                    .where('enquiryReferId', '!=', 8)
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first(),
                
                db('enquirycustomtours')
                    .where('enquiryReferId', '!=', 8)
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first()
            ]);

            const welcomeBooking = (welcomeGroup?.count || 0) + (welcomeCustom?.count || 0);

            // Total bookings
            const [totalGroup, totalCustom] = await Promise.all([
                db('enquirygrouptours')
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first(),
                
                db('enquirycustomtours')
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first()
            ]);

            const totalBookings = (totalGroup?.count || 0) + (totalCustom?.count || 0);

            // Referral bookings
            const [referralGroup, referralCustom] = await Promise.all([
                db('enquirygrouptours')
                    .where('enquiryReferId', 9)
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first(),
                
                db('enquirycustomtours')
                    .where('enquiryReferId', 9)
                    .where('enquiryProcess', 2)
                    .count('* as count')
                    .first()
            ]);

            const referralRate = totalBookings !== 0 ? 
                ((referralGroup?.count || 0) + (referralCustom?.count || 0)) / totalBookings * 100 : 0;

            // Profit calculations
            const [discountTotal, purchaseTotal] = await Promise.all([
                db('customtourdiscountdetails').sum('discountPrice as total').first(),
                db('customtourdiscountdetails').sum('purchasePrice as total').first()
            ]);

            const profit = (discountTotal?.total || 0) - (purchaseTotal?.total || 0);
            const profitPer = purchaseTotal?.total !== 0 ? (profit / (discountTotal?.total || 1)) * 100 : 0;

            // Monthly/Quarterly/Yearly profit
            const monthlyData = await db('customtourdiscountdetails')
                .whereRaw('MONTH(created_at) = ?', [currentMonth])
                .whereRaw('YEAR(created_at) = ?', [currentYear])
                .select(
                    db.raw('SUM(discountPrice) as totalDiscountPrice'),
                    db.raw('SUM(purchasePrice) as totalPurchasePrice')
                )
                .first();

            const profitMonth = (monthlyData?.totalDiscountPrice || 0) - (monthlyData?.totalPurchasePrice || 0);
            const profitPerMonth = monthlyData?.totalPurchasePrice !== 0 ? 
                (profitMonth / (monthlyData?.totalDiscountPrice || 1)) * 100 : 0;

            // Graph data
            const allMonths = Array.from({ length: 13 }, (_, i) => i);
            
            const targetGraph = await db('salestarget')
                .select('target', 'monthId')
                .where('tourType', 2)
                .where('yearId', currentYear);

            const targetArray = allMonths.map(month => {
                const target = targetGraph.find(t => t.monthId === month);
                return target ? target.target : 0;
            });

            const ctAchievedGraph = await db('customtourdiscountdetails')
                .select(
                    db.raw('SUM(discountPrice) as totalGrandTotal'),
                    db.raw('MONTH(created_at) as month')
                )
                .whereRaw('YEAR(created_at) = ?', [currentYear])
                .groupBy(db.raw('MONTH(created_at)'));

            const ctAchieveArray = allMonths.map(month => {
                const achieved = ctAchievedGraph.find(a => a.month === month);
                return achieved ? achieved.totalGrandTotal : 0;
            });

            // Table data
            const perPage = req.query.perPage || 5;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [enquiryData, totalEnquiries] = await Promise.all([
                db('customtourenquirydetails')
                    .join('customtourdiscountdetails', 'customtourenquirydetails.enquiryDetailCustomId', 'customtourdiscountdetails.enquiryDetailCustomId')
                    .join('enquirycustomtours', 'customtourenquirydetails.enquiryCustomId', 'enquirycustomtours.enquiryCustomId')
                    .join('dropdowndestination', 'enquirycustomtours.destinationId', 'dropdowndestination.destinationId')
                    .select(
                        'enquirycustomtours.groupName',
                        'customtourenquirydetails.familyHeadName',
                        'enquirycustomtours.adults',
                        'enquirycustomtours.startDate',
                        'enquirycustomtours.endDate',
                        'customtourdiscountdetails.purchasePrice',
                        'customtourdiscountdetails.discountPrice',
                        'dropdowndestination.destinationName'
                    )
                    .where('enquirycustomtours.enquiryProcess', 2)
                    .whereRaw('MONTH(customtourdiscountdetails.created_at) = ?', [currentMonth])
                    .whereRaw('YEAR(customtourdiscountdetails.created_at) = ?', [currentYear])
                    .limit(perPage)
                    .offset(offset),
                
                db('customtourenquirydetails')
                    .join('customtourdiscountdetails', 'customtourenquirydetails.enquiryDetailCustomId', 'customtourdiscountdetails.enquiryDetailCustomId')
                    .join('enquirycustomtours', 'customtourenquirydetails.enquiryCustomId', 'enquirycustomtours.enquiryCustomId')
                    .where('enquirycustomtours.enquiryProcess', 2)
                    .whereRaw('MONTH(customtourdiscountdetails.created_at) = ?', [currentMonth])
                    .whereRaw('YEAR(customtourdiscountdetails.created_at) = ?', [currentYear])
                    .count('* as total')
                    .first()
            ]);

            const enquiryDataArray = enquiryData.map(value => {
                const profit = value.discountPrice - value.purchasePrice;
                const profitPer = value.purchasePrice !== 0 ? (profit / value.purchasePrice) * 100 : 0;

                return {
                    groupName: value.groupName,
                    guestName: value.familyHeadName,
                    destination: value.destinationName,
                    pax: value.adults,
                    startDate: value.startDate,
                    endDate: value.endDate,
                    purchasePrice: value.purchasePrice,
                    sale: value.discountPrice,
                    profit: profit,
                    profitPer: profitPer
                };
            });

            const lastPage = Math.ceil(totalEnquiries.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: enquiryDataArray,
                total: parseInt(totalEnquiries.total),
                currentPage: parseInt(page),
                perPage: parseInt(perPage),
                nextPageUrl: page < lastPage ? `${baseUrl}?page=${parseInt(page) + 1}&perPage=${perPage}` : null,
                previousPageUrl: page > 1 ? `${baseUrl}?page=${parseInt(page) - 1}&perPage=${perPage}` : null,
                lastPage,
                loyaltyBooking,
                welcomeBooking,
                referralRate: Math.round(referralRate * 100) / 100,
                profitPer: Math.round(profitPer * 100) / 100,
                targetArray,
                ctAchieveArray,
                profitPerMonth: Math.round(profitPerMonth),
                profitPerQuarter: Math.round(profitPerMonth * 3), // Simplified quarter calculation
                profitPerYear: Math.round(profitPer)
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

// Validation middleware
const validatePackageCustomTour = [
    body('package').notEmpty(),
    body('adult').isFloat({ min: 0 }),
    body('extraBed').isFloat({ min: 0 }),
    body('childWithout').isFloat({ min: 0 }),
    body('enquiryCustomId').notEmpty()
];

const validateUploadVouchers = [
    body('enquiryCustomId').notEmpty(),
    body('voucherTypeId').notEmpty()
];

const validateDeleteVoucher = [
    body('voucherId').notEmpty()
];

const validateDeletePdf = [
    body('fileName').notEmpty()
];

const validateViewVouchers = [
    body('enquiryCustomId').notEmpty()
];

// Routes
router.post('/package-custom-tour', validatePackageCustomTour, CustomizeTourController.packageCustomTour);
router.post('/package-upload', upload.single('pdf'), CustomizeTourController.packageUpload);
router.get('/confirm-custom-tours', CustomizeTourController.confirmCustomTours);
router.get('/enquiry-custom-operation', CustomizeTourController.enquiryCustomOperation);
router.post('/upload-vouchers', validateUploadVouchers, CustomizeTourController.uploadVouchers);
router.delete('/delete-voucher', validateDeleteVoucher, CustomizeTourController.deleteVoucher);
router.post('/pdf-upload', upload.array('files', 10), CustomizeTourController.pdfUpload);
router.delete('/delete-pdf', validateDeletePdf, CustomizeTourController.deletePdf);
router.post('/view-vouchers', validateViewVouchers, CustomizeTourController.viewVouchers);
router.get('/operation-dashboard', CustomizeTourController.operationDashboard);

module.exports = router;