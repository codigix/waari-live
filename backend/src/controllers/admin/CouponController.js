const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const pool = require('../../../db'); // MySQL connection pool
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

// Helper: Verify Token with Role Access
const verifyToken = (allowedRoleIds) => {
    return (req, res, next) => {
        const token = req.headers['token'];
        if (!token) return res.status(401).json({ message: 'Token required' });

        jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid or expired token' });
            if (!allowedRoleIds.includes(decoded.roleId)) {
                return res.status(403).json({ message: 'Unauthorized access' });
            }
            req.user = decoded;
            next();
        });
    };
};

// --------------------------
// 1. Add Coupon
// --------------------------
router.post('/add-coupon', verifyToken([82]), async (req, res) => {
    const schema = Joi.object({
        couponName: Joi.string().required().max(255),
        fromDate: Joi.date().iso().required(),
        toDate: Joi.date().iso().required(),
        status: Joi.number().valid(0, 1).required(),
        discountType: Joi.number().valid(1, 2).required(), // 1: fixed, 2: percentage
        discountValue: Joi.number().positive().required(),
        maxDiscount: Joi.when('discountType', {
            is: 2,
            then: Joi.number().positive().required(),
            otherwise: Joi.optional()
        }),
        isType: Joi.number().valid(1, 2).required() // 1: all users, 2: new users
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(e => e.message) });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Check if coupon name already exists
        const [existing] = await connection.query(
            'SELECT * FROM coupons WHERE couponName = ?',
            [req.body.couponName]
        );
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Coupon name already exists' });
        }

        await connection.query(
            `INSERT INTO coupons 
            (couponName, fromDate, toDate, status, discountType, discountValue, maxDiscount, isType, couponType) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.body.couponName,
                req.body.fromDate,
                req.body.toDate,
                req.body.status,
                req.body.discountType,
                req.body.discountValue,
                req.body.maxDiscount || null,
                req.body.isType,
                1 // normal coupon
            ]
        );

        return res.status(200).json({ message: 'Coupon added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error occurred' });
    } finally {
        if (connection) connection.release();
    }
});

// --------------------------
// 2. List Coupons (with Pagination)
// --------------------------
router.post('/coupons-list', verifyToken([83]), async (req, res) => {
    const perPage = parseInt(req.body.perPage) || 10;
    const page = parseInt(req.body.page) || 1;
    const offset = (page - 1) * perPage;

    let connection;
    try {
        connection = await pool.getConnection();

        // Count total rows
        const [totalResult] = await connection.query(
            'SELECT COUNT(*) AS total FROM coupons WHERE couponType = 1'
        );
        const total = totalResult[0].total;

        // Fetch paginated data
        const [rows] = await connection.query(
            `SELECT * FROM coupons 
             WHERE couponType = 1 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [perPage, offset]
        );

        const couponsListArray = rows.map(row => ({
            couponId: row.couponId,
            couponName: row.couponName,
            fromDate: row.fromDate,
            toDate: row.toDate,
            status: row.status,
            statusDescription: '1-active, 0-inactive',
            discountType: row.discountType,
            discountTypeDescription: '1-fixed amount, 2-percentage',
            discountValue: row.discountValue,
            maxDiscount: row.maxDiscount,
            isType: row.isType,
            isTypeDescription: '1-all users, 2-new users'
        }));

        return res.status(200).json({
            data: couponsListArray,
            total,
            currentPage: page,
            perPage,
            lastPage: Math.ceil(total / perPage),
            nextPageUrl: total > page * perPage ? `/api/coupon/coupons-list?page=${page + 1}&perPage=${perPage}` : null,
            previousPageUrl: page > 1 ? `/api/coupon/coupons-list?page=${page - 1}&perPage=${perPage}` : null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch coupons' });
    } finally {
        if (connection) connection.release();
    }
});

// --------------------------
// 3. Edit Coupon Info
// --------------------------
router.post('/edit-coupon', verifyToken([85]), async (req, res) => {
    const schema = Joi.object({
        couponId: Joi.number().integer().required(),
        couponName: Joi.string().required().max(255),
        fromDate: Joi.date().iso().required(),
        toDate: Joi.date().iso().required(),
        status: Joi.number().valid(0, 1).required(),
        discountType: Joi.number().valid(1, 2).required(),
        discountValue: Joi.number().positive().required(),
        maxDiscount: Joi.when('discountType', {
            is: 2,
            then: Joi.number().positive().required(),
            otherwise: Joi.optional()
        }),
        isType: Joi.number().valid(1, 2).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(e => e.message) });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const [check] = await connection.query('SELECT * FROM coupons WHERE couponId = ?', [req.body.couponId]);
        if (check.length === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        await connection.query(
            `UPDATE coupons SET 
                couponName = ?, fromDate = ?, toDate = ?, status = ?, 
                discountType = ?, discountValue = ?, maxDiscount = ?, isType = ?
             WHERE couponId = ?`,
            [
                req.body.couponName,
                req.body.fromDate,
                req.body.toDate,
                req.body.status,
                req.body.discountType,
                req.body.discountValue,
                req.body.maxDiscount || null,
                req.body.isType,
                req.body.couponId
            ]
        );

        return res.status(200).json({ message: 'Coupon Data Updated Successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Update failed' });
    } finally {
        if (connection) connection.release();
    }
});

// --------------------------
// 4. Update Coupon Status
// --------------------------
router.post('/update-status', verifyToken([88]), async (req, res) => {
    const schema = Joi.object({
        couponId: Joi.number().integer().required(),
        status: Joi.number().valid(0, 1).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(e => e.message) });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(
            'UPDATE coupons SET status = ? WHERE couponId = ?',
            [req.body.status, req.body.couponId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        return res.status(200).json({ message: 'Coupon status Updated Successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Update failed' });
    } finally {
        if (connection) connection.release();
    }
});

// --------------------------
// 5. Get Single Coupon Data
// --------------------------
router.post('/coupon-data', async (req, res) => {
    const schema = Joi.object({
        couponId: Joi.number().integer().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(e => e.message) });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM coupons WHERE couponId = ?',
            [req.body.couponId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        return res.status(200).json({ data: rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
});

// --------------------------
// 6. Active Coupon List (for Guest)
// --------------------------
router.post('/active-coupon-list', async (req, res) => {
    const schema = Joi.object({
        guestId: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(e => e.message) });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Check if guest exists
        const [guest] = await connection.query('SELECT * FROM users WHERE guestId = ?', [req.body.guestId]);

        let coupons = [];

        if (guest.length > 0) {
            // Get used coupon IDs
            const [usedRows] = await connection.query(
                'SELECT couponId FROM couponusages WHERE guestId = ?',
                [req.body.guestId]
            );
            const usedCouponIds = usedRows.map(r => r.couponId);

            const placeholders = usedCouponIds.length > 0 ? usedCouponIds.map(() => '?').join(',') : 'NULL';
            const query = `
                SELECT * FROM coupons 
                WHERE isType = 1 AND status = 1 
                AND couponId NOT IN (${placeholders})
                AND DATE(fromDate) <= ?
                AND DATE(toDate) >= ?
            `;
            const params = [...usedCouponIds, today, today];

            const [rows] = await connection.query(query, params);
            coupons = rows;
        } else {
            const [rows] = await connection.query(
                `SELECT * FROM coupons 
                 WHERE status = 1 
                 AND DATE(fromDate) <= ? 
                 AND DATE(toDate) >= ?`,
                [today, today]
            );
            coupons = rows;
        }

        return res.status(200).json({ data: coupons });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch active coupons' });
    } finally {
        if (connection) connection.release();
    }
});

// --------------------------
// 7. Coupon Users List - Group Tour
// --------------------------
router.post('/users-list-group-tour', /* verifyToken([86]), */ async (req, res) => {
    const schema = Joi.object({
        couponId: Joi.number().integer().required(),
        perPage: Joi.number().default(10),
        page: Joi.number().default(1)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(e => e.message) });
    }

    const { couponId, perPage, page } = req.body;
    const offset = (page - 1) * perPage;

    let connection;
    try {
        connection = await pool.getConnection();

        // Count total
        const [totalResult] = await connection.query(
            `SELECT COUNT(*) AS total FROM couponusages cu
             JOIN coupons c ON cu.couponId = c.couponId
             JOIN enquirygrouptours egt ON cu.enquiryId = egt.enquiryGroupId
             JOIN users u ON cu.guestId = u.guestId
             JOIN grouptours gt ON egt.groupTourId = gt.groupTourId
             WHERE cu.isType = 1 AND cu.couponId = ?`,
            [couponId]
        );
        const total = totalResult[0].total;

        // Fetch data
        const [rows] = await connection.query(
            `SELECT 
                cu.*, c.couponName, egt.*, u.firstName, u.contact, u.guestId, gt.tourName, gt.startDate, gt.endDate, gt.destinationId
             FROM couponusages cu
             JOIN coupons c ON cu.couponId = c.couponId
             JOIN enquirygrouptours egt ON cu.enquiryId = egt.enquiryGroupId
             JOIN users u ON cu.guestId = u.guestId
             JOIN grouptours gt ON egt.groupTourId = gt.groupTourId
             WHERE cu.isType = 1 AND cu.couponId = ?
             LIMIT ? OFFSET ?`,
            [couponId, perPage, offset]
        );

        const result = rows.map(row => ({
            couponId: row.couponId,
            couponName: row.couponName,
            tourName: row.tourName,
            startDate: row.startDate,
            endDate: row.endDate,
            destinationId: row.destinationId == 1 ? 'Domestic' : 'International',
            userName: row.firstName,
            guestId: row.guestId,
            contact: row.contact,
            discountValue: row.discountValue,
            usageDate: new Date(row.created_at).toISOString().split('T')[0]
        }));

        return res.status(200).json({
            data: result,
            total,
            currentPage: page,
            perPage,
            lastPage: Math.ceil(total / perPage),
            nextPageUrl: total > page * perPage ? `/api/coupon/users-list-group-tour?page=${page + 1}&perPage=${perPage}` : null,
            previousPageUrl: page > 1 ? `/api/coupon/users-list-group-tour?page=${page - 1}&perPage=${perPage}` : null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch group tour users' });
    } finally {
        if (connection) connection.release();
    }
});

// --------------------------
// 8. Coupon Users List - Custom Tour
// --------------------------
router.post('/users-list-custom-tour', /* verifyToken([87]), */ async (req, res) => {
    const schema = Joi.object({
        couponId: Joi.number().integer().required(),
        perPage: Joi.number().default(10),
        page: Joi.number().default(1)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details.map(e => e.message) });
    }

    const { couponId, perPage, page } = req.body;
    const offset = (page - 1) * perPage;

    let connection;
    try {
        connection = await pool.getConnection();

        const [totalResult] = await connection.query(
            `SELECT COUNT(*) AS total FROM couponusages cu
             JOIN coupons c ON cu.couponId = c.couponId
             JOIN users u ON cu.guestId = u.guestId
             JOIN enquirycustomtours ect ON cu.enquiryId = ect.enquiryCustomId
             WHERE cu.isType = 2 AND cu.couponId = ?`,
            [couponId]
        );
        const total = totalResult[0].total;

        const [rows] = await connection.query(
            `SELECT 
                cu.*, c.couponName, u.userName, u.guestId, u.contact, ect.groupName, ect.startDate, ect.endDate, ect.destinationId
             FROM couponusages cu
             JOIN coupons c ON cu.couponId = c.couponId
             JOIN users u ON cu.guestId = u.guestId
             JOIN enquirycustomtours ect ON cu.enquiryId = ect.enquiryCustomId
             WHERE cu.isType = 2 AND cu.couponId = ?
             LIMIT ? OFFSET ?`,
            [couponId, perPage, offset]
        );

        const result = rows.map(row => ({
            couponId: row.couponId,
            couponName: row.couponName,
            tourName: row.groupName,
            startDate: row.startDate,
            endDate: row.endDate,
            destinationId: row.destinationId == 1 ? 'Domestic' : 'International',
            userName: row.userName,
            guestId: row.guestId,
            contact: row.contact,
            discountValue: row.discountValue,
            usageDate: new Date(row.created_at).toISOString().split('T')[0]
        }));

        return res.status(200).json({
            data: result,
            total,
            currentPage: page,
            perPage,
            lastPage: Math.ceil(total / perPage),
            nextPageUrl: total > page * perPage ? `/api/coupon/users-list-custom-tour?page=${page + 1}&perPage=${perPage}` : null,
            previousPageUrl: page > 1 ? `/api/coupon/users-list-custom-tour?page=${page - 1}&perPage=${perPage}` : null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to fetch custom tour users' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;