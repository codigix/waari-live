# 🤖 AI Assistant Implementation Guide - Complete Flow

## 📊 Overview

Your AI Assistant will follow this architecture:

```
User Query
    ↓
┌─────────────────────────────────────┐
│  AIAssistant.jsx (Frontend)         │
│  - Detects keywords                 │
│  - Routes to handlers               │
└─────────────────────────────────────┘
    ↓
    ├─→ TRIP QUESTION? ────────────────┐
    │                                   │
    │   TripService.js                 │
    │   ├─ searchTrips()              │
    │   ├─ generateTripResponse()      │
    │                                   │
    │   API CALLS ↓                     │
    │   ├─ GET /api/view-group-tour   │
    │   ├─ GET /api/view-custom-tour  │
    │   ├─ GET /api/tour-type-list    │
    │   └─ GET /api/city-list         │
    │                                   │
    │   Backend (Node.js)             │
    │   └─ Database (MySQL)           │
    │                                   │
    └────────────────────────────────┘
    │
    └─→ GENERAL QUESTION? ─────────────┐
        handleGeneralQuestion()         │
        (Predefined responses)          │
        ────────────────────────────────┘
    ↓
Display Response


```

---

## 🏗️ **COMPLETE SYSTEM ARCHITECTURE**

### **Frontend (React - d:\Waari\waari-reactjs)**

#### **1. FloatingAIButton.jsx** (Entry point)

- **Location**: `src/jsx/components/FloatingAIButton/FloatingAIButton.jsx`
- **Purpose**: Floating button to open chat
- **Action**: Opens AIAssistant modal

#### **2. AIAssistant.jsx** (Main Chat Interface)

- **Location**: `src/jsx/layouts/AIAssistant.jsx`
- **Purpose**: Chat interface, message handling, routing
- **Flow**:
  ```
  User types message
    ↓
  Detect keywords (trip, tour, travel, etc.)
    ↓
  ├─ TRIP keywords found?
  │  └─ Call searchTrips() from TripService
  │
  └─ NO trip keywords?
     └─ Call handleGeneralQuestion()
  ```

#### **3. TripService.js** (Data Service)

- **Location**: `src/services/TripService.js`
- **Functions**:
  - `getGroupTours(filters)` - Fetch group tours
  - `getTailorMadeTours(filters)` - Fetch tailor-made tours
  - `getTourTypes()` - Fetch available tour types
  - `getCities()` - Fetch available cities
  - `searchTrips(query)` - Filter & search tours
  - `generateTripResponse(searchResults)` - Format for display

#### **4. API Service**

- **Location**: `src/services/apiServices.js`
- **Purpose**: Axios wrapper with token handling
- **Base URL**: `http://localhost:3000/api` (from `.env`)

---

### **Backend (Node.js - D:\Waari\waari-nodejs)**

#### **API Endpoints**

| Endpoint                | Method | Purpose                        | Returns                    |
| ----------------------- | ------ | ------------------------------ | -------------------------- |
| `/api/view-group-tour`  | GET    | Fetch group tours              | Array of group tours       |
| `/api/view-custom-tour` | GET    | Fetch custom/tailor-made tours | Array of tailor-made tours |
| `/api/tour-type-list`   | GET    | Fetch all tour types           | Array of tour types        |
| `/api/city-list`        | GET    | Fetch all cities               | Array of cities            |

#### **API Response Examples**

**GET /api/view-group-tour?page=1&perPage=10**

```json
{
  "message": "Group tours fetched successfully",
  "filters": {...},
  "total": 25,
  "perPage": 10,
  "page": 1,
  "data": [
    {
      "groupTourId": 1,
      "tourName": "Bali Paradise",
      "tourCode": "BAL-001",
      "tourTypeName": "Beach Tour",
      "startDate": "2024-02-10",
      "endDate": "2024-02-17",
      "duration": 7,
      "seatsBook": 5,
      "totalSeats": 20
    }
  ]
}
```

**GET /api/view-custom-tour?page=1&perPage=10**

```json
{
  "data": [
    {
      "enquiryCustomId": 1,
      "uniqueEnqueryId": "0001",
      "groupName": "Goa Adventure Group",
      "tourType": "Beach",
      "startDate": "12-02-2024",
      "endDate": "16-02-2024",
      "duration": "4D-3N"
    }
  ],
  "total": 10,
  "currentPage": 1,
  "perPage": 10,
  "lastPage": 1
}
```

---

## 💻 **IMPLEMENTATION CHECKLIST**

### ✅ **PART 1: Frontend Setup**

- [x] TripService.js exists at `src/services/TripService.js`
- [x] AIAssistant.jsx exists at `src/jsx/layouts/AIAssistant.jsx`
- [x] FloatingAIButton.jsx exists at `src/jsx/components/FloatingAIButton/`
- [x] APIServices.js configured with token handling
- [x] .env has `VITE_WAARI_BASEURL=http://localhost:3000/api`

**Verification**:

```bash
# Frontend should be running on port 5173
npm run dev

# Test AI button appears in UI
# Click floating AI button to open chat
```

---

### ✅ **PART 2: Backend Setup**

- [x] Server.js registers groupTourRoutes
- [x] /view-group-tour endpoint exists
- [x] /view-custom-tour endpoint exists
- [x] /tour-type-list endpoint exists
- [x] /city-list endpoint exists
- [x] Token validation middleware in place

**Verification**:

```bash
# Backend should be running on port 3000
npm start

# Test endpoints work
curl -X GET http://localhost:3000/api/view-group-tour \
  -H "token: YOUR_TOKEN"
```

---

## 🔄 **COMPLETE FLOW EXAMPLE**

### **User Scenario: "Show me tours to Bali"**

```
1. User types message in AI Chat:
   "Show me tours to Bali"

2. AIAssistant.jsx receives message:
   ├─ Check if contains trip keywords: "tours" ✅
   └─ isAskingAboutTrips = TRUE

3. Call TripService.searchTrips("Show me tours to Bali"):
   ├─ Call getGroupTours({perPage: 20})
   │  └─ API: GET /api/view-group-tour?perPage=20&page=1
   │     ↓
   │     Backend queries MySQL: SELECT * FROM grouptours
   │     ↓
   │     Returns: [{ tourName: "Bali Paradise", ...}, ...]
   │
   ├─ Call getTailorMadeTours({perPage: 20})
   │  └─ API: GET /api/view-custom-tour?perPage=20&page=1
   │     ↓
   │     Backend queries MySQL: SELECT * FROM enquirycustomtours
   │     ↓
   │     Returns: [{ groupName: "Bali Trip", ...}, ...]
   │
   └─ Filter both results for "bali" keyword
      ├─ matchedGroupTours = [tours containing "bali"]
      └─ matchedTailorMade = [custom tours containing "bali"]

4. Call generateTripResponse(searchResults):
   ├─ Format group tours:
   │  "1. **Bali Paradise** (Code: BAL-001)
   │   • Type: Beach Tour
   │   • Duration: 7 days
   │   • Seats: 5/20 booked
   │   • Dates: 2024-02-10 - 2024-02-17"
   │
   └─ Format tailor-made tours:
      "1. **Bali Trip** (ID: 0001)
       • Type: Beach
       • Duration: 4D-3N
       • Dates: 12-02-2024 - 16-02-2024"

5. Return formatted response to user:
   "I found 2 trip(s) for you! 🎉

    Group Tours (1):
    1. Bali Paradise (Code: BAL-001)
    • Type: Beach Tour
    • Duration: 7 days
    • Seats: 5/20 booked
    • Dates: 2024-02-10 - 2024-02-17

    Tailor-Made Tours (1):
    1. Bali Trip (ID: 0001)
    • Type: Beach
    • Duration: 4D-3N
    • Dates: 12-02-2024 - 16-02-2024

    Would you like more details?"

6. User sees response in chat
```

---

## 🎯 **TRIP KEYWORDS DETECTED**

Current keywords that trigger trip search:

```javascript
"trip",
  "tour",
  "destination",
  "package",
  "travel",
  "holiday",
  "vacation",
  "itinerary",
  "departure",
  "booking";
```

**What happens with these keywords**:

- User: "Show me **trips** to Dubai" → Searches database ✅
- User: "What **tours** do you have?" → Searches database ✅
- User: "I want a **vacation**" → Searches database ✅
- User: "How do I **book**?" → Predefined answer ✅
- User: "Hello" → Predefined greeting ✅

---

## 🐛 **TROUBLESHOOTING**

### **Issue 1: API returns 401 Unauthorized**

```
❌ Error: GET /api/view-group-tour returns 401

Solution:
1. Check token is in localStorage
2. Verify token is not expired
3. Check permission ID (32 for /view-group-tour)
4. Look at backend CommonController.checkToken()
```

### **Issue 2: No tours returned even though database has data**

```
❌ Issue: Search returns "No tours found"

Possible causes:
1. API returned empty array
2. Database has no matching records
3. Filter query too strict

Debug:
- Open browser Network tab
- Check API response data
- Verify database has grouptours table
- Check enquiryProcess field = 2 for custom tours
```

### **Issue 3: Chat appears but AI doesn't respond**

```
❌ Issue: Message sent but no response

Check:
1. Console errors (browser DevTools)
2. API call made? (Network tab)
3. Token valid?
4. searchTrips() returns data?
5. generateTripResponse() formats correctly?
```

---

## 📝 **NEXT ENHANCEMENT IDEAS**

### Future Improvements:

1. **Add more keywords** for better detection
2. **Filter by date range** - "Tours in March"
3. **Filter by price** - "Budget tours under $500"
4. **Filter by duration** - "7-day tours"
5. **Sort results** - "Cheapest tours first"
6. **Save favorites** - "Remember my liked tours"
7. **Real AI integration** - Use LLM for natural language
8. **Voice input** - Speak to assistant
9. **Multi-language** - Support multiple languages
10. **Booking integration** - Direct booking from chat

---

## 🚀 **TESTING THE AI ASSISTANT**

### **Test 1: Trip Search**

```
Input:  "What tour packages to Goa do you have?"
Expect: List of tours + tailor-made options
Status: ✅
```

### **Test 2: General Question**

```
Input:  "How do I book?"
Expect: Predefined booking instructions
Status: ✅
```

### **Test 3: No Results**

```
Input:  "Any tour to Mars?"
Expect: "I couldn't find any trips matching your search"
Status: ✅
```

### **Test 4: Multiple Tours**

```
Input:  "Show me all tours"
Expect: Lists top 3, shows "...and X more tours"
Status: ✅
```

---

## 📞 **QUICK REFERENCE**

### Files You Need:

```
Frontend:
├── src/jsx/layouts/AIAssistant.jsx          ✅
├── src/jsx/components/FloatingAIButton/     ✅
├── src/services/TripService.js              ✅
└── src/services/apiServices.js              ✅

Backend:
├── server.js (registers routes)             ✅
├── src/routes/groupTourRoute.js             ✅
└── src/services (database queries)          ✅

Config:
├── .env (API URL)                           ✅
└── Backend .env (database)                  ✅
```

### Key Functions:

```javascript
// Frontend calls
searchTrips(userQuery); // Main search function
generateTripResponse(results); // Format response
handleGeneralQuestion(query); // General QA

// Backend endpoints
GET / api / view - group - tour;
GET / api / view - custom - tour;
GET / api / tour - type - list;
GET / api / city - list;
```

---

## ✨ **STATUS: READY TO USE**

Your AI Assistant is fully configured and ready to:

- ✅ Answer trip-related questions
- ✅ Search group tours database
- ✅ Search tailor-made tours database
- ✅ Handle general questions
- ✅ Display formatted responses

**Next Step**: Test it by clicking the floating AI button and asking about trips!

---

**Last Updated**: Now  
**Version**: 1.0  
**Status**: Production Ready
