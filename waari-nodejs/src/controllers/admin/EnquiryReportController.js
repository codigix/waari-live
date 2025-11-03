const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const CommonController = require('./CommonController');
const db = require('../database');
const { paginate } = require('../helpers/pagination');

class EnquiryReportController {
    // ATP enquiry report
    static async atpEnqReport(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [274]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            // Get paginated enquiries
            const [monthEnqsData, total] = await Promise.all([
                db('enquiries')
                    .whereRaw('MONTH(startDate) = ?', [req.body.month])
                    .whereRaw('YEAR(startDate) = ?', [req.body.year])
                    .where('createdBy', tokenData.userId)
                    .limit(perPage)
                    .offset(offset),
                
                db('enquiries')
                    .whereRaw('MONTH(startDate) = ?', [req.body.month])
                    .whereRaw('YEAR(startDate) = ?', [req.body.year])
                    .where('createdBy', tokenData.userId)
                    .count('* as total')
            ]);

            if (monthEnqsData.length === 0) {
                return res.status(200).json({
                    data: [],
                    allEnquiries: {},
                    total: 0,
                    currentPage: page,
                    perPage,
                    nextPageUrl: null,
                    previousPageUrl: null,
                    lastPage: 1
                });
            }

            const monthEnqDataArray = [];
            
            for (const value of monthEnqsData) {
                // Check group tours
                const enqGtData = await db('enquirygrouptours')
                    .join('grouptours', 'enquirygrouptours.groupTourId', 'grouptours.groupTourId')
                    .join('dropdownenquiryreference', 'enquirygrouptours.enquiryReferId', 'dropdownenquiryreference.enquiryReferId')
                    .where('enquiryId', value.uniqueId)
                    .first();

                // Check custom tours
                const enqCtData = await db('enquirycustomtours')
                    .join('dropdownenquiryreference', 'enquirycustomtours.enquiryReferId', 'dropdownenquiryreference.enquiryReferId')
                    .join('users', 'users.userId', 'enquirycustomtours.assignTo')
                    .where('enquiryId', value.uniqueId)
                    .select('enquirycustomtours.*', 'users.userName', 'dropdownenquiryreference.enquiryReferName')
                    .first();

                if (enqGtData) {
                    monthEnqDataArray.push({
                        guestName: `${enqGtData.firstName} ${enqGtData.lastName}`,
                        travelType: 'Group',
                        tourName: enqGtData.tourName,
                        travelDate: enqGtData.startDate,
                        duration: enqGtData.days + enqGtData.night,
                        pax: enqGtData.adults + enqGtData.child,
                        enquiryReferName: enqGtData.enquiryReferName,
                        opsConsultant: '',
                        enquiryProcess: enqGtData.enquiryProcess,
                        enquiryProcessDescription: '1-ongoing , 2-Confirmed ,3-Closed',
                        closureReason: enqGtData.closureReason || ''
                    });
                } else if (enqCtData) {
                    monthEnqDataArray.push({
                        guestName: `${enqCtData.firstName} ${enqCtData.lastName}`,
                        travelType: 'Tailor-Made',
                        tourName: enqCtData.groupName,
                        travelDate: enqCtData.startDate,
                        duration: enqCtData.days + enqCtData.nights,
                        pax: enqCtData.adults + enqCtData.child,
                        enquiryReferName: enqCtData.enquiryReferName,
                        opsConsultant: enqCtData.userName,
                        enquiryProcess: enqCtData.enquiryProcess,
                        enquiryProcessDescription: '1-Ongoing ,2-Confirmed, 3-Closed',
                        closureReason: enqCtData.closureReason || ''
                    });
                }
            }

            // Get enquiry counts by tour type
            const tourTypes = [1, 2];
            const enquiryCounts = await db('enquiries')
                .select(
                    'tourType',
                    db.raw('count(*) as total'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 1 THEN 1 ELSE 0 END) as onGoing'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) as confirmed'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) as closed')
                )
                .where('createdBy', tokenData.userId)
                .whereRaw('MONTH(startDate) = ?', [req.body.month])
                .whereRaw('YEAR(startDate) = ?', [req.body.year])
                .whereIn('tourType', tourTypes)
                .groupBy('tourType');

            const allEnquiries = {};
            const totals = {
                total: 0,
                onGoing: 0,
                confirmed: 0,
                closed: 0
            };

            const tourTypeNames = {
                1: 'Group Journey',
                2: 'Tailor-Made Journey'
            };

            for (const enquiryCount of enquiryCounts) {
                const tourTypeId = enquiryCount.tourType;
                const tourTypeName = tourTypeNames[tourTypeId];
                
                allEnquiries[tourTypeName] = {
                    total: parseInt(enquiryCount.total),
                    onGoing: parseInt(enquiryCount.onGoing),
                    confirmed: parseInt(enquiryCount.confirmed),
                    closed: parseInt(enquiryCount.closed),
                    conversionRate: (enquiryCount.confirmed / enquiryCount.total) * 100
                };

                totals.total += parseInt(enquiryCount.total);
                totals.onGoing += parseInt(enquiryCount.onGoing);
                totals.confirmed += parseInt(enquiryCount.confirmed);
                totals.closed += parseInt(enquiryCount.closed);
            }

            totals.conversionRate = totals.total > 0 ? (totals.confirmed / totals.total) * 100 : 0;
            allEnquiries.total = totals;

            const lastPage = Math.ceil(total[0].total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: monthEnqDataArray,
                allEnquiries,
                total: parseInt(total[0].total),
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

    // Current year data fetch
    static async currentYearAtpReport(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [274]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            const currentYear = new Date().getFullYear();

            // Query to fetch counts of enquiries for each month
            const queryResult = await db('enquiries')
                .select(
                    db.raw('MONTH(startDate) as month'),
                    db.raw('count(*) as total'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 1 THEN 1 ELSE 0 END) as onGoing'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) as confirmed'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) as closed')
                )
                .where('createdBy', tokenData.userId)
                .whereRaw('YEAR(startDate) = ?', [currentYear])
                .groupBy(db.raw('MONTH(startDate)'));

            let totalEnquiries = 0;
            let totalOngoing = 0;
            let totalConfirmed = 0;
            let totalClosed = 0;

            const enquiryCounts = {};

            // Populate the enquiryCounts array with counts for each month
            for (const row of queryResult) {
                const month = row.month;

                totalEnquiries += parseInt(row.total);
                totalOngoing += parseInt(row.onGoing);
                totalConfirmed += parseInt(row.confirmed);
                totalClosed += parseInt(row.closed);

                enquiryCounts[month] = {
                    total: parseInt(row.total),
                    onGoing: parseInt(row.onGoing),
                    confirmed: parseInt(row.confirmed),
                    closed: parseInt(row.closed),
                    conversionRate: (row.confirmed / row.total) * 100
                };
            }

            // Fill in missing months with 0 counts
            for (let i = 1; i <= 12; i++) {
                if (!enquiryCounts[i]) {
                    enquiryCounts[i] = {
                        total: 0,
                        onGoing: 0,
                        confirmed: 0,
                        closed: 0,
                        conversionRate: 0
                    };
                }
            }

            // Sort the array by keys (months)
            const sortedEnquiryCounts = {};
            Object.keys(enquiryCounts).sort((a, b) => a - b).forEach(key => {
                sortedEnquiryCounts[key] = enquiryCounts[key];
            });

            // Calculate total conversion rate
            const totalConversionRate = totalEnquiries > 0 ? (totalConfirmed / totalEnquiries) * 100 : 0;

            const totalCountsArray = {
                totalEnquiries,
                totalOngoing,
                totalConfirmed,
                totalClosed,
                totalConversionRate
            };

            return res.status(200).json({ 
                data: sortedEnquiryCounts, 
                totalCountsArray 
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // OPS enquiry report
    static async opsEnqReport(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [31]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [enqList, total] = await Promise.all([
                db('enquirycustomtours')
                    .leftJoin('sectors', 'enquirycustomtours.sectorId', 'sectors.sectorId')
                    .where('assignTo', tokenData.userId)
                    .whereRaw('MONTH(startDate) = ?', [req.body.month])
                    .whereRaw('YEAR(startDate) = ?', [req.body.year])
                    .select('enquirycustomtours.*', 'sectors.sectorName')
                    .limit(perPage)
                    .offset(offset),
                
                db('enquirycustomtours')
                    .leftJoin('sectors', 'enquirycustomtours.sectorId', 'sectors.sectorId')
                    .where('assignTo', tokenData.userId)
                    .whereRaw('MONTH(startDate) = ?', [req.body.month])
                    .whereRaw('YEAR(startDate) = ?', [req.body.year])
                    .count('* as total')
            ]);

            if (enqList.length === 0) {
                return res.status(200).json({
                    data: [],
                    allEnquiries: {},
                    total: 0,
                    currentPage: page,
                    perPage,
                    nextPageUrl: null,
                    previousPageUrl: null,
                    lastPage: 1
                });
            }

            const enqListArray = enqList.map(value => ({
                enquiryDate: new Date(value.created_at).toISOString().split('T')[0],
                guestName: `${value.firstName} ${value.lastName}`,
                travelType: 'Tailor-Made',
                tourName: value.groupName,
                sector: value.sectorName,
                startDate: value.startDate,
                duration: `${value.days + value.nights} Days`,
                pax: value.adults + value.child,
                enquiryProcess: value.enquiryProcess,
                enquiryProcessDescription: '1-Ongoing ,2-Confirmed, 3-Closed',
                closureReason: value.closureReason || ''
            }));

            // Data based on travel type
            const destinationId = [1, 2];
            const enquiryCounts = await db('enquirycustomtours')
                .select(
                    'destinationId',
                    db.raw('count(*) as total'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 1 THEN 1 ELSE 0 END) as onGoing'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) as confirmed'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) as closed')
                )
                .where('assignTo', tokenData.userId)
                .whereRaw('MONTH(startDate) = ?', [req.body.month])
                .whereRaw('YEAR(startDate) = ?', [req.body.year])
                .whereIn('destinationId', destinationId)
                .groupBy('destinationId');

            const allEnquiries = {};
            const totals = {
                total: 0,
                onGoing: 0,
                confirmed: 0,
                closed: 0
            };

            const tourTypeNames = {
                1: 'Domestic',
                2: 'International'
            };

            for (const enquiryCount of enquiryCounts) {
                const destinationTypeId = enquiryCount.destinationId;
                const destinationTypeName = tourTypeNames[destinationTypeId];
                
                allEnquiries[destinationTypeName] = {
                    total: parseInt(enquiryCount.total),
                    onGoing: parseInt(enquiryCount.onGoing),
                    confirmed: parseInt(enquiryCount.confirmed),
                    closed: parseInt(enquiryCount.closed),
                    conversionRate: (enquiryCount.confirmed / enquiryCount.total) * 100
                };

                totals.total += parseInt(enquiryCount.total);
                totals.onGoing += parseInt(enquiryCount.onGoing);
                totals.confirmed += parseInt(enquiryCount.confirmed);
                totals.closed += parseInt(enquiryCount.closed);
            }

            totals.conversionRate = totals.total > 0 ? (totals.confirmed / totals.total) * 100 : 0;
            allEnquiries.total = totals;

            const lastPage = Math.ceil(total[0].total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: enqListArray,
                allEnquiries,
                total: parseInt(total[0].total),
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

    // Current year OPS report
    static async currentYearOpsReport(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [31]);
            if (tokenData.status && tokenData.status !== 200) {
                return res.status(tokenData.status).json(tokenData);
            }

            const currentYear = new Date().getFullYear();

            // Query to fetch counts of enquiries for each month
            const queryResult = await db('enquirycustomtours')
                .select(
                    db.raw('MONTH(startDate) as month'),
                    db.raw('count(*) as total'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 1 THEN 1 ELSE 0 END) as onGoing'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 2 THEN 1 ELSE 0 END) as confirmed'),
                    db.raw('SUM(CASE WHEN enquiryProcess = 3 THEN 1 ELSE 0 END) as closed')
                )
                .where('assignTo', tokenData.userId)
                .whereRaw('YEAR(startDate) = ?', [currentYear])
                .groupBy(db.raw('MONTH(startDate)'));

            let totalEnquiries = 0;
            let totalOngoing = 0;
            let totalConfirmed = 0;
            let totalClosed = 0;

            const enquiryCounts = {};

            // Populate the enquiryCounts array with counts for each month
            for (const row of queryResult) {
                const month = row.month;

                totalEnquiries += parseInt(row.total);
                totalOngoing += parseInt(row.onGoing);
                totalConfirmed += parseInt(row.confirmed);
                totalClosed += parseInt(row.closed);

                enquiryCounts[month] = {
                    total: parseInt(row.total),
                    onGoing: parseInt(row.onGoing),
                    confirmed: parseInt(row.confirmed),
                    closed: parseInt(row.closed),
                    conversionRate: (row.confirmed / row.total) * 100
                };
            }

            // Fill in missing months with 0 counts
            for (let i = 1; i <= 12; i++) {
                if (!enquiryCounts[i]) {
                    enquiryCounts[i] = {
                        total: 0,
                        onGoing: 0,
                        confirmed: 0,
                        closed: 0,
                        conversionRate: 0
                    };
                }
            }

            // Sort the array by keys (months)
            const sortedEnquiryCounts = {};
            Object.keys(enquiryCounts).sort((a, b) => a - b).forEach(key => {
                sortedEnquiryCounts[key] = enquiryCounts[key];
            });

            // Calculate total conversion rate
            const totalConversionRate = totalEnquiries > 0 ? (totalConfirmed / totalEnquiries) * 100 : 0;

            const totalCountsArray = {
                totalEnquiries,
                totalOngoing,
                totalConfirmed,
                totalClosed,
                totalConversionRate
            };

            return res.status(200).json({ 
                data: sortedEnquiryCounts, 
                totalCountsArray 
            });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // OPS Team Lead Enquiry Report (commented out in original)
    // static async opsTeamLeadEnqReport(req, res) {
    //     // Implementation would go here
    // }
}

// Validation middleware
const validateMonthYear = [
    body('month').isInt({ min: 1, max: 12 }),
    body('year').isInt({ min: 2000, max: 2100 })
];

// Routes
router.get('/atp-enq-report', validateMonthYear, EnquiryReportController.atpEnqReport);
router.get('/current-year-atp-report', EnquiryReportController.currentYearAtpReport);
router.get('/ops-enq-report', validateMonthYear, EnquiryReportController.opsEnqReport);
router.get('/current-year-ops-report', EnquiryReportController.currentYearOpsReport);
// router.get('/ops-team-lead-enq-report', validateMonthYear, EnquiryReportController.opsTeamLeadEnqReport);

module.exports = router;