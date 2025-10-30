# 🚀 Waari AI - Backend Quick Start Guide

## For Backend Developers

This guide helps you understand what backend support Waari AI needs and how to implement it.

---

## 🎯 What is Waari AI?

Waari AI is now a **context-aware assistant** that adapts to what the user is doing. Instead of only helping with tour search, it helps across the entire ERP:

- **Presales**: "Help me create an enquiry" → AI guides through enquiry creation
- **Bookings**: "Show me booking details" → AI retrieves and explains booking
- **Billing**: "Generate invoice" → AI helps create and manage invoices
- **Payments**: "Process payment" → AI guides payment processing
- **Guests**: "Add new guest" → AI helps manage guest information
- **Reporting**: "Show me profit report" → AI generates and explains reports
- **Team**: "Add new user" → AI helps manage team members

---

## 🔧 Your Task (Backend)

### Priority 1: Essential APIs (Week 1)

These are the most important APIs needed first:

#### 1. **Create Enquiry Endpoint**

```
POST /enquiries
```

What AI needs: When user asks "Create an enquiry", the backend receives:

```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+91-98765-43210",
  "tourInterest": "Goa Tour",
  "budget": "50000",
  "groupSize": 3,
  "duration": "5-7 days",
  "preferredDates": "2024-03-01,2024-03-08"
}
```

What AI expects back:

```json
{
  "success": true,
  "data": {
    "id": "ENQ123",
    "customerName": "John Doe",
    "status": "created"
  }
}
```

---

#### 2. **Get Enquiries Endpoint**

```
GET /enquiries?page=1&perPage=20&status=pending
```

What AI needs: When user asks "Show me pending enquiries", AI calls this and expects:

```json
{
  "success": true,
  "data": [
    {
      "id": "ENQ001",
      "customerName": "Jane Smith",
      "tourInterest": "Kerala Tour",
      "budget": "75000",
      "groupSize": 2,
      "status": "pending",
      "createdAt": "2024-01-15"
    }
  ],
  "total": 10
}
```

---

#### 3. **Get Bookings Endpoint**

```
GET /bookings?page=1&perPage=20
```

Returns list of bookings like above.

---

#### 4. **Get Booking Details Endpoint**

```
GET /bookings/:id
```

When user asks "Show me booking BOOK123 details", AI needs:

```json
{
  "success": true,
  "data": {
    "id": "BOOK001",
    "customerName": "John Doe",
    "tourName": "Goa Beach Tour",
    "groupSize": 4,
    "totalCost": 100000,
    "paid": 50000,
    "pending": 50000,
    "status": "confirmed",
    "guests": [...],
    "accommodation": {...},
    "transportation": {...}
  }
}
```

---

#### 5. **Add Guest Endpoint**

```
POST /guests
```

Request:

```json
{
  "bookingId": "BOOK001",
  "name": "Jane Doe",
  "age": 32,
  "phone": "+91-98765-43210",
  "email": "jane@example.com",
  "passportNo": "N1234567"
}
```

---

### Priority 2: Billing & Payments (Week 2)

#### 6. **Generate Invoice**

```
POST /billing/invoice/generate
```

#### 7. **Calculate Cost**

```
POST /billing/calculate-cost
```

#### 8. **Process Payment**

```
POST /payments/process
```

---

### Priority 3: Reports & Team (Week 3)

#### 9. **Get Sales Report**

```
GET /reports/sales?startDate=2024-01-01&endDate=2024-12-31
```

#### 10. **Get Users**

```
GET /users
```

---

## 📝 Implementation Steps

### Step 1: Create API Endpoints

Start with Priority 1 endpoints. Follow this structure for EACH endpoint:

```javascript
// Example: POST /enquiries
router.post("/enquiries", authenticateToken, async (req, res) => {
  try {
    // 1. Validate input
    const { customerName, customerEmail, tourInterest, budget } = req.body;

    if (!customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Customer name and email are required",
        },
      });
    }

    // 2. Process business logic
    const enquiry = await Enquiry.create({
      customerName,
      customerEmail,
      tourInterest,
      budget,
      status: "pending",
      createdAt: new Date(),
    });

    // 3. Return standardized response
    res.json({
      success: true,
      data: {
        id: enquiry.id,
        customerName: enquiry.customerName,
        status: enquiry.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: error.message,
      },
    });
  }
});
```

---

### Step 2: Standard Response Format

ALL endpoints must return this format:

**Success:**

```json
{
  "success": true,
  "data": {
    /* your data */
  }
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

### Step 3: Authentication

All endpoints require authentication. Expect:

- Header: `token: <JWT_TOKEN>`
- Header: `clientcode: <encrypted_clientcode>`

Existing middleware should handle this (use existing patterns from your codebase).

---

### Step 4: Testing

After implementing each endpoint, test with:

**Test with curl**:

```bash
curl -X GET http://localhost:3000/api/enquiries \
  -H "token: YOUR_TOKEN" \
  -H "clientcode: YOUR_CLIENTCODE"
```

**Test in browser console**:

```javascript
fetch("/api/enquiries", {
  headers: {
    token: localStorage.getItem("token"),
    clientcode: localStorage.getItem("clientcode"),
  },
})
  .then((r) => r.json())
  .then(console.log);
```

---

## 🗂️ Database Considerations

### Enquiry Schema

```
id (UUID)
customerName (String)
customerEmail (String)
customerPhone (String)
tourInterest (String)
budget (Number)
groupSize (Number)
duration (String)
preferredDates (Date range)
status (pending|assigned|converted|lost)
assignedTo (userId)
createdAt (DateTime)
updatedAt (DateTime)
lastFollowUp (DateTime)
```

### Booking Schema

```
id (UUID)
customerId (UUID)
customerName (String)
tourId (UUID)
groupSize (Number)
totalCost (Number)
paidAmount (Number)
status (confirmed|processing|completed|cancelled)
travelDate (DateTime)
createdAt (DateTime)
guests (Array of Guest IDs)
accommodation (Object)
transportation (Object)
```

---

## 🔗 How Frontend Calls Backend

When frontend asks something, here's the flow:

```
Frontend: "Create enquiry for Goa tour, budget 50k, 4 people"
         ↓
AI Service (WaariAIService): Detects PRESALES module, handles presales query
         ↓
Suggests: "Let me help you create an enquiry"
         ↓
User clicks: "Create enquiry"
         ↓
Frontend calls: WaariAIBackendService.createEnquiry({...})
         ↓
API call: POST /enquiries with enquiry data
         ↓
Your Backend: Validates, creates enquiry, returns success
         ↓
Frontend: Shows confirmation "Enquiry created! ID: ENQ123"
```

---

## 📊 Common Use Cases

### Use Case 1: Sales Manager wants overview

**User**: "What's pending?"
**AI Flow**:

1. Detects: Presales module
2. Calls: GET /enquiries?status=pending
3. Backend returns: 15 pending enquiries
4. AI says: "You have 15 pending enquiries. Would you like to assign them?"

---

### Use Case 2: Agent creates new enquiry

**User**: "Create enquiry for family trip to Kerala, 7 days, 50k budget"
**AI Flow**:

1. Parses user message for: destination, duration, budget
2. Asks missing info: "Group size?"
3. User: "4 people, John family"
4. AI calls: POST /enquiries with all data
5. Backend creates and returns: ENQ456
6. AI: "Enquiry created! Want to assign it to someone?"

---

### Use Case 3: Generate billing report

**User**: "Generate January profit report"
**AI Flow**:

1. Detects: Reporting module
2. Calls: GET /reports/profit?startDate=2024-01-01&endDate=2024-01-31
3. Backend returns: Profit data
4. AI: "Your profit was ₹5L in January. Top tour: Goa (₹2.5L)"

---

## ⚠️ Common Mistakes to Avoid

1. **Wrong Response Format**

   - ❌ Don't return: `{ data: [...] }`
   - ✅ Do return: `{ success: true, data: [...] }`

2. **Missing Error Handling**

   - ❌ Don't crash on error
   - ✅ Do return: `{ success: false, error: { code, message } }`

3. **No Pagination**

   - ❌ Return all 10000 records
   - ✅ Return: 20 records with total count

4. **Authentication Issues**

   - ❌ Don't check authentication
   - ✅ Do validate token on every endpoint

5. **No Input Validation**
   - ❌ Accept any input
   - ✅ Validate email format, dates, numbers, etc.

---

## 🚀 Deployment Checklist

Before going live:

- [ ] All Priority 1 endpoints implemented
- [ ] Authentication working
- [ ] Response format correct
- [ ] Error handling implemented
- [ ] Pagination working
- [ ] Input validation done
- [ ] Database queries optimized
- [ ] Tested with Frontend
- [ ] No breaking changes
- [ ] Documentation updated

---

## 📞 Questions? Check These Files

1. **What exact endpoints do I need?**
   → See `WAARI_AI_BACKEND_REQUIREMENTS.md`

2. **How does frontend call backend?**
   → See `src/services/WaariAIBackendService.js`

3. **What data structures expected?**
   → See response examples in requirements

4. **How does context work?**
   → See `src/services/ERPContextManager.js`

5. **What's the overall flow?**
   → See `WAARI_AI_ERP_IMPLEMENTATION_SUMMARY.md`

---

## 💡 Pro Tips

1. **Start small**: Implement GET /enquiries first, test it works
2. **Use your existing patterns**: Follow your codebase conventions
3. **Test incrementally**: Test each endpoint as you build
4. **Error messages matter**: Clear error messages help frontend debug
5. **Response times**: Keep API responses under 1 second
6. **Pagination**: Always include pagination for list endpoints
7. **Filtering**: Support common filters (status, date range, etc.)

---

## 🎯 Success Metrics

You'll know it's working when:

- ✅ Frontend shows no errors in console
- ✅ AI responds with module-specific messages
- ✅ User can click suggestions
- ✅ Data appears in responses
- ✅ New records can be created
- ✅ Reports can be generated
- ✅ Everything is fast (<1s response time)

---

**Start with Priority 1 endpoints. You've got this! 🚀**
