# 🔧 AI ASSISTANT - DEBUG GUIDE

## Problem: "I couldn't find any trips" message

When you type "Show me tours" or any trip query, the AI returns "I couldn't find any trips" instead of showing database results.

---

## Step 1: Check Browser Console 🔍

1. Open your browser
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Type "show me tours" in the AI chat
5. Look for these messages:

```
🔍 Trip query detected: show me tours
🎫 Fetching group tours with filters: {perPage: 100, ...}
✅ Group tours response: {message: "...", data: [...], ...}
🔎 Searching trips for query: show me tours
📊 Raw group tours count: 5
✅ Matched group tours: 2
📊 Search results: {groupTours: Array(2), tailorMadeTours: Array(0), total: 2}
💬 Generated response: {text: "I found 2 trip(s)...", success: true}
```

### What Each Message Means:

| Message                         | What It Means                      |
| ------------------------------- | ---------------------------------- |
| `🔍 Trip query detected`        | ✅ Keyword detected correctly      |
| `🎫 Fetching group tours`       | ✅ API call being made             |
| `❌ Error fetching group tours` | ❌ API failed (check next section) |
| `📊 Raw group tours count: 0`   | ❌ No tours in database            |
| `✅ Matched group tours: 0`     | ❌ No tours match the filter       |
| `💬 Generated response`         | Response generated                 |

---

## Step 2: Check for API Errors ❌

If you see:

```
❌ Error fetching group tours: {error: "Unauthorized"}
```

**This means: TOKEN NOT WORKING** 🔴

### Fix:

1. Make sure you're **logged in** to the application
2. Check if token is in LocalStorage:
   - Open DevTools → Application → LocalStorage
   - Look for `token` key
   - It should have a long JWT string

If no token exists:

- ✅ Login to the application first
- Then try the AI chat again

---

## Step 3: Check if Database Has Data 📊

In browser console, run:

```javascript
// If you have group tours in database
console.log("Should see group tour count > 0 in previous logs");

// Or check the raw API response
console.log("Check 'Raw group tours count' message above");
```

If you see `Raw group tours count: 0`:

- ❌ Database is empty
- Go to phpmyadmin and check:
  ```sql
  SELECT COUNT(*) FROM grouptours;
  SELECT COUNT(*) FROM enquirycustomtours;
  ```

---

## Step 4: Test API Directly 🌐

Open a new terminal and run:

```bash
# Test Group Tours API
curl -X GET "http://localhost:3000/api/view-group-tour?page=1&perPage=10" ^
  -H "token: test_token"

# Expected response should have "data" array
```

**If you see `"error": "Unauthorized"`:**

- Backend token validation is failing
- The API requires a valid token from your login

**If you see `"data": []`:**

- API is working but database is empty

**If you see `"data": [{...}, {...}]`:**

- API is working and has data! ✅

---

## Step 5: Check Backend Logs 📝

1. Go to your Node.js terminal (where you ran `npm start`)
2. When you type in AI chat, you should see:

```
[/view-group-tour] Fetching tours...
[/view-custom-tour] Fetching custom tours...
```

**If you don't see these:**

- Frontend is not calling the API
- Problem is in TripService.js

**If you see these but with errors:**

- API is being called but failing
- Check the error message

---

## QUICK CHECKLIST ✅

Before debugging further, verify:

- [ ] Backend is running (`npm start` in Node.js folder)
- [ ] Frontend is running (`npm run dev` in React folder)
- [ ] You're logged in to the application
- [ ] Browser DevTools console is open
- [ ] You see `🔍 Trip query detected` in console

---

## Common Issues & Solutions

### Issue 1: "I couldn't find any trips" but database has tours

**Cause:** Filter is too strict

**Solution:**
Check the console messages:

- `Raw group tours count: 0` = No API data
- `Matched group tours: 0` = API has data but filter doesn't match

Try searching without keywords to see all tours:

```
Just type: "tours"
Instead of: "tours to paris"
```

### Issue 2: API returns 401 Unauthorized

**Cause:** Token expired or invalid

**Solution:**

1. Logout and login again
2. Make sure you see token in LocalStorage
3. Try again

### Issue 3: No console messages at all

**Cause:** AI not detecting keywords

**Solution:**
Make sure your query contains one of these words:

```
trip, tour, destination, package, travel,
holiday, vacation, itinerary, departure, booking
```

Try: "Show me tours" (contains "tour" keyword)

---

## When Everything Works ✅

You should see:

1. Message in console: `🔍 Trip query detected`
2. API response with tours in data
3. Matched tours count > 0
4. AI chat shows formatted tour list
5. No red errors in console

---

## Need More Help?

1. Take a screenshot of DevTools console
2. Share the output of the debug messages
3. Run the backend API test (curl command above)
4. Check if database has data

**File locations for reference:**

- Frontend: `d:\Waari\waari-reactjs\src\services\TripService.js`
- Backend: `D:\Waari\waari-nodejs\src\routes\groupTourRoute.js`
- Database: Check `grouptours` and `enquirycustomtours` tables
