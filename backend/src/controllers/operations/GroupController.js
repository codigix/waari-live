const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const CommonController = require('./CommonController');
const db = require('../database');

class GroupController {
    // Confirmed group listing
    static async confirmedGroupTourList(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [3]);
            if (!tokenData) {
                return res.status(408).json({ message: 'Invalid Token' });
            }

            let confirmedList = db('enquirygrouptours')
                .where('enquirygrouptours.enquiryProcess', 2)
                .join('grouptours', 'enquirygrouptours.groupTourId', 'grouptours.groupTourId')
                .select('grouptours.*', 'enquirygrouptours.*')
                .orderBy('enquirygrouptours.enquiryGroupId', 'desc');

            // Apply search filters
            if (req.query.tourName) {
                confirmedList.where('tourName', 'like', `%${req.query.tourName}%`);
            }
            if (req.query.tourCode) {
                confirmedList.where('tourCode', 'like', `%${req.query.tourCode}%`);
            }
            if (req.query.tourType) {
                confirmedList.where('tourType', 'like', `%${req.query.tourType}%`);
            }
            if (req.query.startDate) {
                confirmedList.where('startDate', 'like', `%${req.query.startDate}%`);
            }
            if (req.query.endDate) {
                confirmedList.where('endDate', 'like', `%${req.query.endDate}%`);
            }

            // Pagination
            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [confirmGroupTour, total] = await Promise.all([
                confirmedList.limit(perPage).offset(offset),
                confirmedList.count('* as total').first()
            ]);

            if (confirmGroupTour.length === 0) {
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

            const confirmGroupTourArray = [];

            for (const value of confirmGroupTour) {
                // Calculate duration
                const startDate = new Date(value.startDate);
                const endDate = new Date(value.endDate);
                const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

                // Get total guests for this tour
                const enquiryGroupTour = await db('enquirygrouptours')
                    .where('enquiryProcess', 2)
                    .where('groupTourId', value.groupTourId)
                    .select(db.raw('SUM(adults + child) as totalGuests'))
                    .first();

                const totalGuests = parseInt(enquiryGroupTour.totalGuests) || 0;
                const availableSeats = value.totalSeats - totalGuests;
                const bookedSeats = totalGuests;

                confirmGroupTourArray.push({
                    enquiryGroupId: value.enquiryGroupId,
                    tourName: value.tourName,
                    tourCode: value.tourCode,
                    tourTypeId: value.tourTypeId,
                    startDate: value.startDate,
                    endDate: value.endDate,
                    duration: duration,
                    totalSeats: value.totalSeats,
                    seatsBooked: bookedSeats,
                    seatsAval: availableSeats
                });
            }

            const lastPage = Math.ceil(total.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: confirmGroupTourArray,
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

    // Guest details confirmed group tours
    static async guestConfirmGroupTour(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [3]);
            if (!tokenData) {
                return res.status(408).json({ message: 'Invalid Token' });
            }

            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [guestDetails, total] = await Promise.all([
                db('enquirygrouptours')
                    .join('grouptourdiscountdetails', 'enquirygrouptours.enquiryGroupId', 'grouptourdiscountdetails.enquiryGroupId')
                    .where('enquirygrouptours.enquiryProcess', 2)
                    .select('enquirygrouptours.*', 'grouptourdiscountdetails.*')
                    .limit(perPage)
                    .offset(offset),
                
                db('enquirygrouptours')
                    .join('grouptourdiscountdetails', 'enquirygrouptours.enquiryGroupId', 'grouptourdiscountdetails.enquiryGroupId')
                    .where('enquirygrouptours.enquiryProcess', 2)
                    .count('* as total')
                    .first()
            ]);

            if (guestDetails.length === 0) {
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

            const guestDetailsArray = guestDetails.map(value => ({
                firstName: value.firstName,
                contact: value.contact,
                tourPrice: value.tourPrice,
                additionalDis: value.additionalDis,
                discountPrice: value.discountPrice,
                gst: value.gst,
                tcs: value.tcs,
                grandTotal: value.grandTotal
            }));

            const lastPage = Math.ceil(total.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: guestDetailsArray,
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

    // Guest list by group ID
    static async guestListByGroupId(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [3]);
            if (!tokenData) {
                return res.status(408).json({ message: 'Invalid Token' });
            }

            let confirmGroupTour = db('enquirygrouptours')
                .join('grouptours', 'enquirygrouptours.groupTourId', 'grouptours.groupTourId')
                .join('grouptourguestdetails', 'enquirygrouptours.enquiryGroupId', 'grouptourguestdetails.enquiryGroupId')
                .where('enquirygrouptours.enquiryProcess', 2)
                .where('enquirygrouptours.groupTourId', req.body.groupTourId)
                .select(
                    'grouptours.tourName',
                    'grouptours.startDate',
                    'grouptours.endDate',
                    'enquirygrouptours.enquiryGroupId',
                    'enquirygrouptours.firstName',
                    'grouptourguestdetails.*'
                )
                .orderBy('enquirygrouptours.enquiryGroupId', 'desc');

            // Apply search filter
            if (req.query.search) {
                const search = `%${req.query.search}%`;
                confirmGroupTour.where(function(q) {
                    q.where('tourName', 'like', search)
                     .orWhere('firstName', 'like', search);
                });
            }

            const confirmGroupTourDetails = await confirmGroupTour;

            if (confirmGroupTourDetails.length === 0) {
                return res.status(200).json({ data: [] });
            }

            const confirmGroupTourArray = [];

            for (const value of confirmGroupTourDetails) {
                // Get room price and type
                const [roomPrices, roomShareType] = await Promise.all([
                    db('grouptourpricediscount')
                        .where('groupTourId', req.body.groupTourId)
                        .where('roomShareId', value.roomShareId)
                        .select('offerPrice')
                        .first(),
                    
                    db('dropdownroomsharing')
                        .where('roomShareId', value.roomShareId)
                        .select('roomShareName')
                        .first()
                ]);

                confirmGroupTourArray.push({
                    enquiryGroupId: value.enquiryGroupId,
                    firstName: value.familyHeadName || value.firstName,
                    guestId: value.guestId,
                    contact: value.contact,
                    gender: value.gender,
                    roomShareType: roomShareType ? roomShareType.roomShareName : '',
                    roomSharePrice: roomPrices ? roomPrices.offerPrice : 0,
                    passportNo: value.passportNo || '',
                    adharNo: value.adharNo || '',
                    panNo: value.panNo || '',
                    adharImage: value.adharCard || '',
                    passportImage: value.passport || '',
                    panImage: value.pan || ''
                });
            }

            return res.status(200).json({ data: confirmGroupTourArray });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Today follow list
    static async todayFollowList(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [3]);
            if (!tokenData) {
                return res.status(408).json({ message: 'Invalid Token' });
            }

            const today = new Date().toISOString().split('T')[0];

            let groupTourInquiry = db('enquirygrouptours')
                .join('grouptours', 'enquirygrouptours.groupTourId', 'grouptours.groupTourId')
                .where('enquirygrouptours.enquiryProcess', 1)
                .whereRaw('DATE(enquirygrouptours.nextFollowUp) = ?', [today])
                .select('enquirygrouptours.*', 'grouptours.tourName', 'grouptours.startDate', 'grouptours.endDate')
                .orderBy('enquirygrouptours.enquiryGroupId', 'desc');

            // Apply date filters
            if (req.query.startDate && req.query.endDate) {
                const startDate = new Date(req.query.startDate);
                const endDate = new Date(req.query.endDate);
                endDate.setHours(23, 59, 59, 999);

                groupTourInquiry.where('startDate', '>=', startDate)
                               .where('endDate', '<=', endDate);
            } else if (req.query.startDate) {
                const startDate = new Date(req.query.startDate);
                groupTourInquiry.where('startDate', '>=', startDate);
            } else if (req.query.endDate) {
                const endDate = new Date(req.query.endDate);
                endDate.setHours(23, 59, 59, 999);
                groupTourInquiry.where('endDate', '<=', endDate);
            }

            // Apply search filters
            if (req.query.search) {
                const search = `%${req.query.search}%`;
                groupTourInquiry.where(function(q) {
                    q.where('firstName', 'like', search)
                     .orWhere('tourName', 'like', search);
                });
            }

            // Pagination
            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [groupTourInquiries, total] = await Promise.all([
                groupTourInquiry.limit(perPage).offset(offset),
                groupTourInquiry.count('* as total').first()
            ]);

            if (groupTourInquiries.length === 0) {
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

            const groupTour_array = groupTourInquiries.map(value => {
                const formatDate = (date) => {
                    if (!date) return '';
                    const d = new Date(date);
                    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear().toString().slice(-2)}`;
                };

                return {
                    enquiryGroupId: value.enquiryGroupId,
                    enquiryDate: formatDate(value.created_at),
                    firstName: value.firstName,
                    contact: value.contact,
                    tourName: value.tourName,
                    startDate: formatDate(value.startDate),
                    endDate: formatDate(value.endDate),
                    paxNo: value.adults + value.child,
                    lastFollowUp: formatDate(value.created_at),
                    nextFollowUp: formatDate(value.nextFollowUp)
                };
            });

            const lastPage = Math.ceil(total.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: groupTour_array,
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

    // Upcoming group tour list
    static async upcomingListGt(req, res) {
        try {
            // Check token
            const tokenData = await CommonController.checkToken(req.headers.token, [3]);
            if (!tokenData) {
                return res.status(408).json({ message: 'Invalid Token' });
            }

            const today = new Date().toISOString().split('T')[0];

            const perPage = req.query.perPage || 10;
            const page = req.query.page || 1;
            const offset = (page - 1) * perPage;

            const [groupTour, total] = await Promise.all([
                db('enquirygrouptours')
                    .join('grouptours', 'enquirygrouptours.groupTourId', 'grouptours.groupTourId')
                    .where('enquirygrouptours.enquiryProcess', 1)
                    .whereRaw('DATE(enquirygrouptours.nextFollowUp) > ?', [today])
                    .select('enquirygrouptours.*', 'grouptours.tourName', 'grouptours.startDate', 'grouptours.endDate')
                    .orderBy('enquirygrouptours.enquiryGroupId', 'desc')
                    .limit(perPage)
                    .offset(offset),
                
                db('enquirygrouptours')
                    .join('grouptours', 'enquirygrouptours.groupTourId', 'grouptours.groupTourId')
                    .where('enquirygrouptours.enquiryProcess', 1)
                    .whereRaw('DATE(enquirygrouptours.nextFollowUp) > ?', [today])
                    .count('* as total')
                    .first()
            ]);

            if (groupTour.length === 0) {
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

            const groupTour_array = groupTour.map(value => {
                const formatDate = (date) => {
                    if (!date) return '';
                    const d = new Date(date);
                    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear().toString().slice(-2)}`;
                };

                return {
                    enquiryGroupId: value.enquiryGroupId,
                    enquiryDate: formatDate(value.created_at),
                    firstName: value.firstName,
                    contact: value.contact,
                    tourName: value.tourName,
                    startDate: formatDate(value.startDate),
                    endDate: formatDate(value.endDate),
                    paxNo: value.adults + value.child,
                    lastFollowUp: formatDate(value.created_at),
                    nextFollowUp: formatDate(value.nextFollowUp)
                };
            });

            const lastPage = Math.ceil(total.total / perPage);
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

            return res.status(200).json({
                data: groupTour_array,
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
}

// Validation middleware
const validateGroupId = [
    body('groupTourId').isInt({ min: 1 })
];

// Routes
router.get('/confirmed-group-tour-list', GroupController.confirmedGroupTourList);
router.get('/guest-confirm-group-tour', GroupController.guestConfirmGroupTour);
router.post('/guest-list-by-group-id', validateGroupId, GroupController.guestListByGroupId);
router.get('/today-follow-list', GroupController.todayFollowList);
router.get('/upcoming-list-gt', GroupController.upcomingListGt);

module.exports = router;