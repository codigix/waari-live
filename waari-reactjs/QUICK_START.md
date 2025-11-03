# 🚀 QUICK START - WAARI PDF + AI IMPLEMENTATION

## ⏱️ 5-MINUTE SETUP

### Step 1: Backend Directories (1 minute)

```bash
# Create required directories
mkdir D:\Waari\waari-nodejs\public\pdfs
mkdir D:\Waari\waari-nodejs\public\uploads
```

### Step 2: Dependencies (Already Installed ✅)

```
✅ puppeteer        - PDF generation
✅ ejs             - HTML templates
✅ axios           - API calls
✅ @supabase/supabase-js - Storage
```

### Step 3: Supabase Setup (2 minutes)

1. Go to: https://app.supabase.com
2. Click on "Storage" → "Create new bucket"
3. Name: `pdfs`
4. Make it **PUBLIC**
5. Done! ✅

### Step 4: Environment Variables (1 minute)

**File:** `D:\Waari\waari-nodejs\.env`

Add these:

```env
HUGGINGFACE_API_KEY=hf_YOUR_TOKEN_HERE
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.1
```

Get API key from: https://huggingface.co/settings/tokens

### Step 5: Start Server (1 minute)

```bash
cd D:\Waari\waari-nodejs
npm start
```

Expected output:

```
✅ Server running at http://localhost:3000
✅ PDF Routes registered
✅ AI Routes ready
```

---

## 🧪 QUICK TESTS

### Test 1: PDF Generation

```bash
curl -X POST http://localhost:3000/api/generate-predeparture-pdf \
  -H "Content-Type: application/json" \
  -H "token: test_token" \
  -d '{"groupTourId": 1}'
```

Expected: `{ "success": true, "url": "..." }`

### Test 2: AI Chat

```bash
curl -X POST http://localhost:3000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, what is Waari?"}'
```

Expected: AI response about Waari tours

---

## 💡 FRONTEND INTEGRATION

### Add to React Component:

```javascript
import axios from "axios";

// Generate PDF
const generatePdf = async (tourId) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/generate-predeparture-pdf",
      { groupTourId: tourId },
      { headers: { token: localStorage.getItem("token") } }
    );
    console.log("PDF URL:", res.data.url);
  } catch (error) {
    console.error("PDF Error:", error);
  }
};

// Chat with AI
const chatWithAI = async (message) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/ai-chat",
      { message },
      { headers: { token: localStorage.getItem("token") } }
    );
    console.log("AI Response:", res.data.data.aiResponse);
  } catch (error) {
    console.error("AI Error:", error);
  }
};
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Created `/public/pdfs` directory
- [ ] Created Supabase "pdfs" bucket
- [ ] Added Hugging Face API key to .env
- [ ] Started backend server
- [ ] Tested PDF endpoint (curl)
- [ ] Tested AI endpoint (curl)
- [ ] Updated React component with functions
- [ ] Tested from frontend browser

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot find module 'puppeteer'"

```bash
npm install puppeteer --save
```

### Issue: Puppeteer fails on Windows

```bash
npm install --save-optional @vscode/sqlite3
```

### Issue: "SUPABASE_URL not set"

Check `.env` file has:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=xxxxx
```

### Issue: "PDF not generating"

Check:

1. `/public/pdfs` directory exists
2. Puppeteer is installed
3. `predeparture.ejs` template exists
4. Tour ID exists in database

---

## 📞 STATUS

| Component      | Status       | File                  |
| -------------- | ------------ | --------------------- |
| PDF Routes     | ✅ Ready     | pdfRoutes.js          |
| PDF Controller | ✅ Ready     | pdfController.js      |
| AI Routes      | ✅ Ready     | aiRoutes.js           |
| AI Service     | ⚠️ Needs Fix | huggingFaceService.js |
| AI Controller  | ⚠️ Empty     | aiController.js       |
| Server Config  | ✅ Updated   | server.js             |

---

## 🎯 NEXT STEPS

1. **Now**: Setup directories and Supabase (5 min)
2. **Then**: Start server and run curl tests (2 min)
3. **Finally**: Update React components (10 min)

**Total Time: ~20 minutes** ⏱️

---

For detailed docs, see:

- 📖 PDF_FIX_GUIDE.md
- 📊 IMPLEMENTATION_STATUS.md
