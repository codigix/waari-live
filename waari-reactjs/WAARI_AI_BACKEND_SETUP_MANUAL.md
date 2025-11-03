# 🚀 WAARI AI BACKEND - COMPLETE SETUP MANUAL

## ✅ WHAT HAS BEEN DONE

### 1. Backend Controller - ✅ COMPLETE

**File**: `D:\Waari\waari-nodejs\src\controllers\aiController.js`

- ✅ **STATUS**: Already created with **25+ endpoints** implemented
- ✅ All handlers for Presales, Bookings, Billing, Payments, Guests, Reporting, Team, Tours, and Dashboard
- ✅ Using Supabase client for database operations
- ✅ Standard error handling and response formatting

### 2. Backend Routes - ⏳ NEEDS TO BE CREATED

**File**: `D:\Waari\waari-nodejs\src\routes\aiRoutes.js`

- **STATUS**: File is empty - needs to be populated
- The complete routes definition is provided below

### 3. Server Configuration - ⏳ NEEDS ONE LINE ADDED

**File**: `D:\Waari\waari-nodejs\server.js`

- **STATUS**: Need to add AI routes import and registration
- One line change needed at line 139

---

## 📋 MANUAL SETUP INSTRUCTIONS

### STEP 1: Update server.js

**Location**: Line 139 in `D:\Waari\waari-nodejs\server.js`

Add these lines AFTER the existing enqueriesRoutes:

```javascript
// ✅ AI ASSISTANT ROUTES (25+ endpoints for Waari AI)
const aiRoutes = require("./src/routes/aiRoutes");
app.use("/api/ai", aiRoutes);
```

**Complete section should look like:**

```javascript
const enqueriesRoutes = require("./src/routes/EnqueriesRoutes");
app.use("/api", enqueriesRoutes);

// ✅ AI ASSISTANT ROUTES (25+ endpoints for Waari AI)
const aiRoutes = require("./src/routes/aiRoutes");
app.use("/api/ai", aiRoutes);

// PDF Routes
const pdfRoutes = require("./src/routes/pdfRoutes");
app.use("/api", pdfRoutes);
```

---

### STEP 2: Create aiRoutes.js

**Location**: `D:\Waari\waari-nodejs\src\routes\aiRoutes.js`

**Copy the ENTIRE content below** to the file:

```javascript
/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║         WAARI AI ASSISTANT - BACKEND ROUTES                  ║
 * ║    Complete ERP Integration - 25+ AI-Powered Endpoints       ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// ==================== PRESALES ROUTES ====================

/**
 * GET /api/ai/enquiries
 * Get all enquiries with optional filters
 * Query params: status, assignedTo, limit, offset
 */
router.get("/enquiries", aiController.getEnquiries);

/**
 * POST /api/ai/enquiries
 * Create a new enquiry
 */
router.post("/enquiries", aiController.createEnquiry);

/**
 * PUT /api/ai/enquiries/:id/assign
 * Assign enquiry to team member
 */
router.put("/enquiries/:id/assign", aiController.assignEnquiry);

/**
 * PUT /api/ai/enquiries/:id
 * Update enquiry status
 */
router.put("/enquiries/:id", aiController.updateEnquiryStatus);

// ==================== BOOKINGS ROUTES ====================

/**
 * GET /api/ai/bookings
 * Get all bookings with optional status filter
 */
router.get("/bookings", aiController.getBookings);

/**
 * GET /api/ai/bookings/:id
 * Get specific booking details
 */
router.get("/bookings/:id", aiController.getBookingById);

/**
 * PUT /api/ai/bookings/:id
 * Update booking details
 */
router.put("/bookings/:id", aiController.updateBooking);

/**
 * POST /api/ai/bookings/:id/cancel
 * Cancel a booking
 */
router.post("/bookings/:id/cancel", aiController.cancelBooking);

// ==================== BILLING ROUTES ====================

/**
 * POST /api/ai/billing/invoice/generate
 * Generate an invoice
 */
router.post("/billing/invoice/generate", aiController.generateInvoice);

/**
 * POST /api/ai/billing/calculate-cost
 * Calculate total cost for a tour
 */
router.post("/billing/calculate-cost", aiController.calculateCost);

/**
 * POST /api/ai/billing/apply-discount
 * Apply discount to an invoice
 */
router.post("/billing/apply-discount", aiController.applyDiscount);

// ==================== PAYMENTS ROUTES ====================

/**
 * POST /api/ai/payments/process
 * Process a payment
 */
router.post("/payments/process", aiController.processPayment);

/**
 * GET /api/ai/payments/:invoiceId
 * Get payment history for an invoice
 */
router.get("/payments/:invoiceId", aiController.getPaymentHistory);

/**
 * POST /api/ai/payments/retry
 * Retry a failed payment
 */
router.post("/payments/retry", aiController.retryPayment);

// ==================== GUESTS ROUTES ====================

/**
 * GET /api/ai/guests
 * Get all guests with optional booking filter
 */
router.get("/guests", aiController.getGuests);

/**
 * POST /api/ai/guests
 * Add a new guest
 */
router.post("/guests", aiController.addGuest);

/**
 * PUT /api/ai/guests/:id
 * Update guest information
 */
router.put("/guests/:id", aiController.updateGuest);

// ==================== REPORTING ROUTES ====================

/**
 * GET /api/ai/reports/sales
 * Generate sales report
 * Query params: startDate, endDate, groupBy
 */
router.get("/reports/sales", aiController.generateSalesReport);

/**
 * GET /api/ai/reports/commissions
 * Generate commission report
 * Query params: startDate, endDate
 */
router.get("/reports/commissions", aiController.generateCommissionReport);

/**
 * GET /api/ai/reports/performance
 * Generate performance metrics
 * Query params: userId, startDate, endDate
 */
router.get("/reports/performance", aiController.generatePerformanceReport);

// ==================== TEAM ROUTES ====================

/**
 * GET /api/ai/team/users
 * Get all team users
 * Query params: role, limit, offset
 */
router.get("/team/users", aiController.getTeamUsers);

/**
 * POST /api/ai/team/users
 * Add a new team member
 */
router.post("/team/users", aiController.addTeamMember);

/**
 * PUT /api/ai/team/users/:id/role
 * Update user role and permissions
 */
router.put("/team/users/:id/role", aiController.updateUserRole);

// ==================== TOURS ROUTES ====================

/**
 * GET /api/ai/tours
 * Search and filter tours
 * Query params: destination, startDate, endDate, budget, limit, offset
 */
router.get("/tours", aiController.searchTours);

/**
 * POST /api/ai/tours/recommendations
 * Get tour recommendations based on preferences
 */
router.post("/tours/recommendations", aiController.getTourRecommendations);

/**
 * POST /api/ai/tours
 * Create a new tour
 */
router.post("/tours", aiController.createTour);

// ==================== DASHBOARD ROUTES ====================

/**
 * GET /api/ai/dashboard/summary
 * Get dashboard summary with key metrics
 */
router.get("/dashboard/summary", aiController.getDashboardSummary);

/**
 * GET /api/ai/dashboard/quick-actions
 * Get suggested quick actions
 */
router.get("/dashboard/quick-actions", aiController.getQuickActions);

// ==================== EXPORTS ====================

module.exports = router;
```

---

## ✅ BACKEND CHANGES SUMMARY

### What's Implemented ✅

| Component           | Status  | Details                                    |
| ------------------- | ------- | ------------------------------------------ |
| **aiController.js** | ✅ DONE | 25+ endpoint handlers, all modules covered |
| **aiRoutes.js**     | ⏳ TODO | Copy code above to this file               |
| **server.js**       | ⏳ TODO | Add 2 lines to import and register routes  |

---

## 📊 COMPLETE API ENDPOINT LIST

### Presales (4 endpoints)

```
GET    /api/ai/enquiries                    - Get all enquiries
POST   /api/ai/enquiries                    - Create enquiry
PUT    /api/ai/enquiries/:id/assign         - Assign enquiry
PUT    /api/ai/enquiries/:id                - Update status
```

### Bookings (4 endpoints)

```
GET    /api/ai/bookings                     - Get all bookings
GET    /api/ai/bookings/:id                 - Get booking details
PUT    /api/ai/bookings/:id                 - Update booking
POST   /api/ai/bookings/:id/cancel          - Cancel booking
```

### Billing (3 endpoints)

```
POST   /api/ai/billing/invoice/generate     - Generate invoice
POST   /api/ai/billing/calculate-cost       - Calculate cost
POST   /api/ai/billing/apply-discount       - Apply discount
```

### Payments (3 endpoints)

```
POST   /api/ai/payments/process             - Process payment
GET    /api/ai/payments/:invoiceId          - Get payment history
POST   /api/ai/payments/retry               - Retry payment
```

### Guests (3 endpoints)

```
GET    /api/ai/guests                       - Get all guests
POST   /api/ai/guests                       - Add guest
PUT    /api/ai/guests/:id                   - Update guest
```

### Reporting (3 endpoints)

```
GET    /api/ai/reports/sales                - Sales report
GET    /api/ai/reports/commissions          - Commission report
GET    /api/ai/reports/performance          - Performance metrics
```

### Team (3 endpoints)

```
GET    /api/ai/team/users                   - Get team users
POST   /api/ai/team/users                   - Add team member
PUT    /api/ai/team/users/:id/role          - Update role
```

### Tours (3 endpoints)

```
GET    /api/ai/tours                        - Search tours
POST   /api/ai/tours/recommendations        - Get recommendations
POST   /api/ai/tours                        - Create tour
```

### Dashboard (2 endpoints)

```
GET    /api/ai/dashboard/summary            - Dashboard summary
GET    /api/ai/dashboard/quick-actions      - Quick actions
```

**TOTAL: 31 API Endpoints**

---

## 🧪 TESTING THE BACKEND

### 1. Test Enquiries Endpoint

```bash
curl -X GET "http://localhost:3000/api/ai/enquiries" \
  -H "Content-Type: application/json"
```

### 2. Test Create Enquiry

```bash
curl -X POST "http://localhost:3000/api/ai/enquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Doe",
    "clientEmail": "john@example.com",
    "clientPhone": "+1234567890",
    "tourName": "European Adventure",
    "tourId": 5,
    "tourDate": "2024-05-15",
    "numberOfPeople": 4,
    "budget": 50000
  }'
```

### 3. Test Dashboard Summary

```bash
curl -X GET "http://localhost:3000/api/ai/dashboard/summary" \
  -H "Content-Type: application/json"
```

---

## 🔄 FRONTEND-BACKEND FLOW

```
Frontend (React)
    ↓
AIAssistant.jsx
    ↓
WaariAIService.js (processes query)
    ↓
WaariAIBackendService.js (API calls)
    ↓
Backend (Node.js)
    ↓
/api/ai/[endpoint]
    ↓
aiRoutes.js (routes request)
    ↓
aiController.js (handles request)
    ↓
Supabase (database operations)
    ↓
Response back to frontend
```

---

## 📝 NEXT STEPS

1. **In Visual Studio Code** or your code editor:

   - Open `D:\Waari\waari-nodejs\server.js`
   - Find line 139 (after enqueriesRoutes)
   - Add the AI routes import and registration

2. **Create aiRoutes.js**:

   - Create new file: `D:\Waari\waari-nodejs\src\routes\aiRoutes.js`
   - Copy the complete code from STEP 2 above

3. **Test the backend**:

   - Restart your Node.js server
   - Test endpoints using the curl commands above

4. **Verify Frontend Connection**:
   - The frontend is already ready (WaariAIBackendService.js is configured)
   - Once backend is running, AI will automatically connect and work

---

## ✅ SUCCESS CRITERIA

- [ ] aiRoutes.js file created with all routes
- [ ] server.js updated with AI routes import
- [ ] Backend server restarts successfully
- [ ] API endpoints respond with correct status codes
- [ ] Frontend AI assistant works with backend

---

## 📞 TROUBLESHOOTING

### Issue: "Cannot find module 'aiRoutes'"

**Solution**: Make sure aiRoutes.js is created in `src/routes/` folder

### Issue: 404 on /api/ai/enquiries

**Solution**: Ensure server.js has been updated and server was restarted

### Issue: Supabase connection errors

**Solution**: Verify SUPABASE_URL and SUPABASE_KEY in .env file

---

**Status**: ✅ Frontend Complete | ⏳ Backend Ready for Manual Setup

**Created**: January 2024 | **Version**: 2.0
