require("dotenv").config();
const axios = require("axios");

const MODEL_ID = (process.env.HUGGINGFACE_MODEL || "HuggingFaceH4/zephyr-7b-beta").trim();
const HUGGINGFACE_API_URL = `https://api-inference.huggingface.co/models/${encodeURIComponent(MODEL_ID)}`;
const API_KEY = process.env.HUGGINGFACE_API_KEY;

const SYSTEM_PROMPT = `You are Waari AI Assistant. You are helpful, friendly, and professional.
You help users with questions about the Waari platform, a travel and tour booking platform.
Waari specializes in:
- Group Tours
- Custom/Tailored Tours
- Travel Packages
- Tour Bookings
- Travel Planning

Be concise and helpful. Keep responses under 150 words.`;

const callHuggingFaceAPI = async (userMessage, conversationHistory = []) => {
  try {
    if (!API_KEY) {
      throw new Error("HUGGINGFACE_API_KEY is not set");
    }

    let conversationText = `${SYSTEM_PROMPT}\n\n`;

    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recentMessages = conversationHistory.slice(-5);
      recentMessages.forEach((msg) => {
        const userText = msg?.user ?? msg?.user_message ?? msg?.message ?? "";
        const assistantText = msg?.assistant ?? msg?.ai_response ?? msg?.response ?? msg?.reply ?? "";
        if (userText || assistantText) {
          conversationText += `User: ${userText}\nAssistant: ${assistantText}\n\n`;
        }
      });
    }

    conversationText += `User: ${userMessage}\nAssistant:`;

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: conversationText,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.9,
        },
        options: {
          wait_for_model: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    let aiResponse = response.data?.[0]?.generated_text ?? "";

    if (aiResponse.includes("Assistant:")) {
      const splitText = aiResponse.split("Assistant:");
      aiResponse = splitText[splitText.length - 1];
    }

    aiResponse = aiResponse.trim().slice(0, 500);

    if (!aiResponse) {
      throw new Error("No response from Hugging Face");
    }

    return {
      success: true,
      text: aiResponse,
    };
  } catch (error) {
    const status = error.response?.status;
    const payload = error.response?.data;
    console.error("Hugging Face API Error:", status || error.message, payload || "");

    return {
      success: false,
      text: "",
      error:
        status === 401 || status === 403
          ? "AUTHORIZATION_ERROR"
          : "REQUEST_FAILED",
      detail: typeof payload === "string" ? payload : undefined,
    };
  }
};

module.exports = {
  callHuggingFaceAPI,
};
