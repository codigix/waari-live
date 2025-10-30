# 🧪 AI ASSISTANT - QUICK TEST GUIDE

## ⚡ **60-SECOND STARTUP**

### **Step 1: Start Backend** (if not running)

```bash
cd D:\Waari\waari-nodejs
npm start
# Wait for: "🟢 Server running on port 3000"
```

### **Step 2: Start Frontend** (if not running)

```bash
cd d:\Waari\waari-reactjs
npm run dev
# Wait for: "Local: http://localhost:5173"
```

### **Step 3: Open Browser**

```
http://localhost:5173
```

### **Step 4: Click Floating AI Button**

- Look for blue circle with sparkle icon in bottom-right corner
- Click it to open chat

---

## ✅ **TEST CASES**

### **TEST 1: Trip Search - Basic**

```
Scenario: User asks for tours
Input:    "Do you have any tours?"
Expected: Lists group tours + tailor-made tours
Result:   ✅ PASS / ❌ FAIL

Debug if failed:
- Check console for errors
- Network tab: Is /api/view-group-tour called?
- Response has data array?
```

---

### **TEST 2: Trip Search - Specific Destination**

```
Scenario: User asks for specific destination
Input:    "Show me tours to Goa"
Expected: Filters tours matching "Goa"
Result:   ✅ PASS / ❌ FAIL

Debug if failed:
- Check if database has tours with "Goa" in name
- searchTrips() filtering working?
```

---

### **TEST 3: Trip Search - No Results**

```
Scenario: User searches for non-existent tour
Input:    "Do you have Mars tours?"
Expected: "I couldn't find any trips matching your search"
Result:   ✅ PASS / ❌ FAIL

Debug if failed:
- generateTripResponse() returns error message?
```

---

### **TEST 4: General Question - Greeting**

```
Scenario: User greets bot
Input:    "Hello"
Expected: Bot greeting response
Result:   ✅ PASS / ❌ FAIL

Debug if failed:
- handleGeneralQuestion() called?
- Greeting keywords matched?
```

---

### **TEST 5: General Question - How to Book**

```
Scenario: User asks about booking
Input:    "How do I book a tour?"
Expected: Booking instructions
Result:   ✅ PASS / ❌ FAIL

Debug if failed:
- "booking" keyword detected?
- Predefined response returned?
```

---

### **TEST 6: Multiple Messages**

```
Scenario: Conversation flow
Input 1:  "What trips do you have?"
Input 2:  "Show me beach tours"
Input 3:  "Can I book?"
Expected: Each gets appropriate response
Result:   ✅ PASS / ❌ FAIL
```

---

## 🔍 **DEBUGGING CHECKLIST**

### **Issue: AI button doesn't appear**

```
❌ Floating button not visible

Check:
1. Browser DevTools Console → Any errors?
2. FloatingAIButton component mounted?
3. CSS loaded? (FloatingAIButton.scss)
4. Position: bottom-right of screen

Fix:
- Hard refresh: Ctrl+Shift+R
- Check src/jsx/components/FloatingAIButton/
```

---

### **Issue: Chat opens but no responses**

```
❌ Click AI button → Chat opens → Type message → No response

Check:
1. Browser Console:
   - Any error messages?
   - Is searchTrips() called?
   - API endpoint errors?

2. Network Tab:
   - Is /api/view-group-tour request made?
   - Response status: 200 OK or error?
   - Check response body

3. Local Storage:
   - Open DevTools → Application → LocalStorage
   - Check: token exists? permissions? clientcode?

Fix:
- Verify API URL in .env is correct
- Check backend is running
- Verify token is valid
```

---

### **Issue: "I couldn't find any trips" always shown**

```
❌ Even when asking for "tours", shows no results

Check:
1. Backend database:
   - grouptours table has data?
   - enquirycustomtours table has data?

2. API Response:
   - /api/view-group-tour returns data?
   - Check Network tab response

3. Filter logic:
   - Is searchTrips() matching correctly?
   - Case sensitivity issue?

Fix:
Test API directly:
curl -X GET "http://localhost:3000/api/view-group-tour?page=1&perPage=10" \
  -H "token: YOUR_TOKEN"

Should return data array, not empty
```

---

### **Issue: API returns 401 Unauthorized**

```
❌ Error: "Unauthorized" in console

Causes:
- Token expired
- Token not in localStorage
- Permission ID wrong
- Token header missing

Fix:
1. Login again to get fresh token
2. Check browser DevTools → Application → LocalStorage → token
3. Verify token is being sent in requests
```

---

## 📊 **BROWSER DEVTOOLS QUICK DEBUG**

### **Console Tab**

```javascript
// Check if functions exist
typeof searchTrips; // Should return "function"
typeof generateTripResponse; // Should return "function"

// Test searchTrips directly
searchTrips("goa").then((result) => console.log(result));
```

### **Network Tab**

```
1. Filter: XHR or Fetch
2. Type query and look for:
   - /api/view-group-tour
   - /api/view-custom-tour
3. Click request → Response tab
4. Should see JSON with data array
```

### **Application Tab**

```
LocalStorage keys to check:
- token (JWT token)
- clientcode (encrypted)
- permissions (user permissions)
- roleId (user role)

If any missing: User not logged in
```

---

## 🎯 **EXPECTED API RESPONSES**

### **Success Response - view-group-tour**

```json
{
  "message": "Group tours fetched successfully",
  "filters": {...},
  "total": 5,
  "perPage": 10,
  "page": 1,
  "data": [
    {
      "groupTourId": 1,
      "tourName": "Bali Paradise",
      "tourCode": "BAL-001",
      "tourTypeName": "Beach",
      "startDate": "2024-02-10",
      "endDate": "2024-02-17",
      "duration": 7,
      "seatsBook": 5,
      "totalSeats": 20
    }
  ]
}
```

### **Success Response - view-custom-tour**

```json
{
  "data": [
    {
      "enquiryCustomId": 1,
      "uniqueEnqueryId": "0001",
      "groupName": "Goa Adventure",
      "tourType": "Beach",
      "startDate": "12-02-2024",
      "endDate": "16-02-2024",
      "duration": "4D-3N"
    }
  ],
  "total": 2,
  "currentPage": 1,
  "perPage": 10,
  "lastPage": 1
}
```

---

## 📱 **USER-FACING TEST PROMPTS**

Try these in the AI chat to verify everything works:

| Prompt               | Expected Result         | Type    |
| -------------------- | ----------------------- | ------- |
| "Show me tours"      | Lists available tours   | Trip    |
| "What tours to Goa?" | Goa tours or no results | Trip    |
| "Holiday packages?"  | Lists all tours         | Trip    |
| "Book a trip"        | Booking instructions    | General |
| "How can I help?"    | Help information        | General |
| "Hi"                 | Greeting response       | General |
| "What's the price?"  | Refer to sales team     | General |

---

## 🚀 **VERIFICATION CHECKLIST**

Before declaring success, verify:

- [ ] Floating AI button appears in UI
- [ ] Click button opens chat modal
- [ ] Can type message in input box
- [ ] Hit Enter/Send shows loading indicator
- [ ] Bot responds with message
- [ ] Typing "tour" triggers trip search
- [ ] Responses are formatted nicely
- [ ] Greeting works
- [ ] Chat messages show timestamps
- [ ] Can send multiple messages
- [ ] UI doesn't freeze or error out
- [ ] Console shows no errors (except expected)
- [ ] Network requests complete successfully

---

## 💡 **QUICK TIPS**

### **Tip 1: Check API is working**

```bash
# From command prompt
curl -X GET "http://localhost:3000/api/view-group-tour?page=1" \
  -H "token: test_token"

# If returns data = API is working ✅
# If returns 401 = Token issue ❌
```

### **Tip 2: Check frontend sees API**

```
Open browser DevTools
Go to Console tab
Type: console.log(import.meta.env.VITE_WAARI_BASEURL)
Should print: http://localhost:3000/api
```

### **Tip 3: Enable verbose logging**

In AIAssistant.jsx, search for `console.error` and add:

```javascript
console.log("Trip keywords found:", isAskingAboutTrips);
console.log("Search results:", searchResults);
console.log("Generated response:", response);
```

---

## ✨ **SUCCESS CRITERIA**

Your AI Assistant is working when:

✅ User clicks AI button → Chat opens  
✅ User types "Do you have tours?" → Shows tours list  
✅ User types "Hello" → Shows greeting  
✅ User types random text → Shows general response  
✅ No console errors  
✅ API calls successful (200 status)  
✅ Responses formatted nicely

---

## 📞 **COMMON ISSUES & QUICK FIXES**

| Issue              | Quick Fix                   |
| ------------------ | --------------------------- |
| Chat doesn't open  | Hard refresh (Ctrl+Shift+R) |
| No response        | Check console errors        |
| 401 Unauthorized   | Login again                 |
| Empty tour list    | Check database has data     |
| Slow response      | Backend might be busy       |
| Button not visible | Check CSS loaded            |

---

## 🎉 **NEXT STEPS**

Once everything works:

1. **Add more trip keywords** for better detection
2. **Test with real data** from your database
3. **Gather user feedback** on UX
4. **Add more general QA** responses
5. **Consider LLM integration** for smarter responses

---

**Test Date**: ****\_\_\_\_****  
**Tester**: ****\_\_\_\_****  
**Results**: ✅ ALL PASS / ⚠️ SOME ISSUES / ❌ MAJOR ISSUES

---

**Happy Testing! 🚀**
