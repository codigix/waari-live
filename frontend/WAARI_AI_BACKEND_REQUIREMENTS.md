# 🚀 Waari AI - Backend API Requirements

This document outlines all backend API endpoints needed to support the complete Waari AI ERP integration.

## Overview

Waari AI is a context-aware assistant that helps users across all ERP modules. The backend needs to provide APIs for:

- Data retrieval for different modules
- Data creation/updates triggered by AI suggestions
- Analytics and metrics
- AI interaction logging

---

## 📋 API Endpoints Required

### 1. **PRESALES MODULE**

Endpoints for enquiry management

#### GET /enquiries

**Purpose**: Fetch all enquiries with filters
**Parameters**:

```json
{
  "page": 1,
  "perPage": 20,
  "status": "pending|assigned|converted|lost",
  "assignedTo": "userId",
  "dateRange": "2024-01-01,2024-12-31",
  "searchText": "customer name or tour"
}
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "ENQ001",
      "customerName": "John Doe",
      "tourInterest": "Goa Beach",
      "budget": "25000-50000",
      "groupSize": 4,
      "status": "pending",
      "createdAt": "2024-01-15",
      "assignedTo": "userId",
      "lastFollowUp": "2024-01-20"
    }
  ],
  "total": 150
}
```

#### POST /enquiries

**Purpose**: Create new enquiry from AI suggestion
**Request Body**:

```json
{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+91-98765-43210",
  "tourInterest": "Kerala Tour",
  "budget": "50000",
  "groupSize": 3,
  "duration": "5-7 days",
  "preferredDates": "2024-03-01,2024-03-08",
  "specialRequirements": "Vegetarian meals, AC accommodation"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "ENQ002",
    "customerName": "Jane Smith",
    "status": "created"
  }
}
```

#### PUT /enquiries/:id/assign

**Purpose**: Assign enquiry to team member
**Request Body**:

```json
{
  "assignedTo": "userId",
  "followUpDate": "2024-02-01",
  "priority": "high|medium|low"
}
```

**Response**: Updated enquiry object

---

### 2. **BOOKINGS MODULE**

Endpoints for booking management

#### GET /bookings

**Purpose**: Fetch bookings with filters
**Parameters**:

```json
{
  "page": 1,
  "perPage": 20,
  "status": "confirmed|processing|completed|cancelled",
  "tourId": "TOUR001",
  "customerName": "search text",
  "dateRange": "2024-01-01,2024-12-31"
}
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "BOOK001",
      "customerId": "CUST001",
      "customerName": "John Doe",
      "tourId": "TOUR001",
      "tourName": "Goa Beach Tour",
      "groupSize": 4,
      "totalCost": 100000,
      "status": "confirmed",
      "travelDate": "2024-03-01",
      "createdAt": "2024-01-15"
    }
  ]
}
```

#### GET /bookings/:id

**Purpose**: Fetch booking details
**Response**:

```json
{
  "success": true,
  "data": {
    "id": "BOOK001",
    "customerId": "CUST001",
    "customerName": "John Doe",
    "tourId": "TOUR001",
    "tourName": "Goa Beach Tour",
    "groupSize": 4,
    "guests": [
      {
        "id": "GUEST001",
        "name": "John Doe",
        "age": 35,
        "relation": "lead",
        "documents": ["passport", "visa"]
      }
    ],
    "accommodation": {
      "hotelName": "Sea View Resort",
      "roomType": "Deluxe",
      "checkIn": "2024-03-01",
      "checkOut": "2024-03-05"
    },
    "transportation": {
      "type": "Air + Coach",
      "departure": "2024-03-01 08:00",
      "return": "2024-03-05 18:00"
    },
    "totalCost": 100000,
    "paid": 50000,
    "pending": 50000,
    "status": "confirmed"
  }
}
```

#### PUT /bookings/:id

**Purpose**: Update booking
**Request Body**:

```json
{
  "accommodation": { "roomType": "Suite" },
  "groupSize": 5,
  "status": "confirmed"
}
```

---

### 3. **GUESTS MODULE**

Endpoints for guest information

#### GET /guests

**Purpose**: Fetch guests with filters
**Parameters**:

```json
{
  "bookingId": "BOOK001",
  "page": 1,
  "perPage": 20,
  "searchText": "guest name"
}
```

#### POST /guests

**Purpose**: Add new guest
**Request Body**:

```json
{
  "bookingId": "BOOK001",
  "name": "Jane Doe",
  "age": 32,
  "phone": "+91-98765-43210",
  "email": "jane@example.com",
  "address": "123 Main St, Mumbai",
  "passportNo": "N1234567",
  "visaStatus": "approved",
  "relation": "companion",
  "specialRequirements": "Vegetarian, Medical needs: None"
}
```

#### PUT /guests/:id

**Purpose**: Update guest information
**Request Body**: Same as POST

#### POST /guests/:id/documents

**Purpose**: Upload guest documents
**Request Body** (multipart/form-data):

```json
{
  "documentType": "passport|visa|id|ticket",
  "file": "binary file"
}
```

---

### 4. **BILLING MODULE**

Endpoints for billing and invoicing

#### POST /billing/invoice/generate

**Purpose**: Generate invoice for booking
**Request Body**:

```json
{
  "bookingId": "BOOK001"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "invoiceId": "INV001",
    "bookingId": "BOOK001",
    "customerName": "John Doe",
    "tours": [
      {
        "name": "Goa Beach Tour",
        "basePrice": 25000,
        "quantity": 4,
        "subtotal": 100000
      }
    ],
    "taxes": 18000,
    "discount": 0,
    "totalAmount": 118000,
    "generatedAt": "2024-01-20"
  }
}
```

#### POST /billing/calculate-cost

**Purpose**: Calculate cost for given tour parameters
**Request Body**:

```json
{
  "tourId": "TOUR001",
  "groupSize": 4,
  "duration": 5,
  "accommodation": "premium",
  "season": "peak|off"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "basePrice": 25000,
    "groupDiscount": 0,
    "accommodation": 5000,
    "transportation": 8000,
    "activities": 2000,
    "meals": 3000,
    "taxes": 18000,
    "totalPerPerson": 61000,
    "totalForGroup": 244000
  }
}
```

#### PUT /billing/invoice/:id/discount

**Purpose**: Apply discount to invoice
**Request Body**:

```json
{
  "discountType": "percentage|fixed",
  "discountValue": 10,
  "reason": "Corporate discount"
}
```

#### GET /billing/invoices

**Purpose**: Get billing list
**Parameters**:

```json
{
  "page": 1,
  "perPage": 20,
  "status": "draft|issued|paid|overdue",
  "dateRange": "2024-01-01,2024-12-31"
}
```

---

### 5. **PAYMENTS MODULE**

Endpoints for payment processing

#### POST /payments/process

**Purpose**: Process payment
**Request Body**:

```json
{
  "invoiceId": "INV001",
  "amount": 118000,
  "paymentMethod": "credit_card|net_banking|upi|cheque",
  "transactionId": "TXN123456",
  "remarks": "First payment"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "paymentId": "PAY001",
    "invoiceId": "INV001",
    "amount": 118000,
    "status": "completed",
    "transactionId": "TXN123456",
    "processedAt": "2024-01-21"
  }
}
```

#### POST /payments/:id/receipt

**Purpose**: Generate receipt
**Request Body**:

```json
{
  "format": "pdf|email"
}
```

#### GET /payments/:id

**Purpose**: Get payment details

#### GET /payments/status/:invoiceId

**Purpose**: Check payment status for invoice

---

### 6. **REPORTING MODULE**

Endpoints for reports and analytics

#### GET /reports/sales

**Purpose**: Get sales report
**Parameters**:

```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "groupBy": "day|week|month|quarter|year",
  "filter": "all|by_tour|by_agent|by_destination"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "totalSales": 5000000,
    "totalBookings": 50,
    "averageBookingValue": 100000,
    "byTour": [
      {
        "tourName": "Goa Tour",
        "sales": 1000000,
        "bookings": 10
      }
    ],
    "byMonth": [
      {
        "month": "Jan",
        "sales": 400000,
        "bookings": 4
      }
    ]
  }
}
```

#### GET /reports/commission

**Purpose**: Get commission report
**Parameters**:

```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "agentId": "AGENT001",
  "status": "pending|processed|paid"
}
```

#### GET /reports/profit

**Purpose**: Get profit analysis
**Parameters**:

```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "groupBy": "tour|destination|month"
}
```

---

### 7. **TEAM MODULE**

Endpoints for team and user management

#### GET /users

**Purpose**: Get all users
**Parameters**:

```json
{
  "page": 1,
  "perPage": 20,
  "role": "admin|manager|agent",
  "status": "active|inactive"
}
```

#### POST /users

**Purpose**: Add new user
**Request Body**:

```json
{
  "name": "New Agent",
  "email": "agent@example.com",
  "phone": "+91-98765-43210",
  "role": "agent",
  "salesOffice": "OFFICE001",
  "permissions": ["view_tours", "create_enquiry", "manage_bookings"]
}
```

#### PUT /users/:id/role

**Purpose**: Update user role and permissions
**Request Body**:

```json
{
  "role": "manager",
  "permissions": ["view_all", "manage_users", "generate_reports"]
}
```

#### GET /users/:id/performance

**Purpose**: Get user performance metrics
**Response**:

```json
{
  "success": true,
  "data": {
    "userId": "USER001",
    "name": "John Agent",
    "enquiriesCreated": 50,
    "bookingsConverted": 35,
    "conversionRate": 70,
    "totalRevenue": 3500000,
    "averageBookingValue": 100000,
    "followUpRate": 95
  }
}
```

---

### 8. **AI-SPECIFIC ENDPOINTS**

These endpoints help AI provide smarter recommendations

#### GET /ai/metrics/:module

**Purpose**: Get module-specific metrics for context
**Example**: GET /ai/metrics/presales
**Response**:

```json
{
  "success": true,
  "data": {
    "module": "presales",
    "totalEnquiries": 500,
    "pendingEnquiries": 50,
    "conversionRate": 70,
    "averageFollowUpTime": "2 days",
    "topTours": ["Goa Tour", "Kerala Tour", "Rajasthan Tour"],
    "topAgents": ["John", "Jane", "Mike"],
    "commonBudgetRange": "50000-100000"
  }
}
```

#### POST /ai/recommendations

**Purpose**: Get AI-powered recommendations based on context
**Request Body**:

```json
{
  "module": "presales",
  "context": {
    "currentData": { "enquiries": 50, "pending": 10 },
    "userRole": "manager",
    "recentActions": ["created_enquiry", "assigned_enquiry"]
  }
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "recommendations": [
      "Consider following up on 10 pending enquiries",
      "Goa tours have highest conversion rate",
      "Reassign overdue follow-ups to available agents"
    ],
    "suggestedActions": [
      {
        "action": "bulk_followup",
        "description": "Send follow-up messages to pending enquiries"
      }
    ]
  }
}
```

#### POST /ai/log

**Purpose**: Log AI interactions for analytics
**Request Body**:

```json
{
  "userId": "USER001",
  "module": "presales",
  "query": "Show me pending enquiries",
  "response": "Found 10 pending enquiries",
  "timestamp": "2024-01-21T10:30:00Z",
  "actionTaken": true
}
```

---

## 🔌 Implementation Priority

### Phase 1 (High Priority - Week 1-2)

- GET /enquiries
- POST /enquiries
- GET /bookings
- GET /bookings/:id
- GET /guests
- POST /guests

### Phase 2 (Medium Priority - Week 3-4)

- POST /billing/invoice/generate
- POST /billing/calculate-cost
- POST /payments/process
- GET /reports/sales
- GET /users

### Phase 3 (Low Priority - Week 5-6)

- All PUT and DELETE endpoints
- AI-specific endpoints
- Analytics and logging

---

## 🔐 Security Requirements

1. **Authentication**: All endpoints must require valid JWT token
2. **Authorization**: Implement role-based access control (RBAC)
3. **Data Validation**: Validate all input data
4. **Error Handling**: Return proper HTTP status codes
5. **Rate Limiting**: Implement rate limiting for AI endpoints

---

## 📝 Error Response Format

All errors should follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

---

## 🚀 Testing Checklist

- [ ] All endpoints return correct data structure
- [ ] Authentication/Authorization working
- [ ] Error cases handled properly
- [ ] Pagination working (if applicable)
- [ ] Filters working as expected
- [ ] Response times < 1 second
- [ ] Concurrent request handling

---

## 📞 Support

For questions about backend implementation, refer to:

- Frontend code: `/src/services/WaariAIBackendService.js`
- Context Manager: `/src/services/ERPContextManager.js`
- Main AI Service: `/src/services/WaariAIService.js`
