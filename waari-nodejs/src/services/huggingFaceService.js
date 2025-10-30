const axios = require('axios');

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

const SYSTEM_PROMPT = You are Waari AI Assistant. You are helpful, friendly, and professional.
You help users with questions about the Waari platform - a travel and tour booking platform.
Waari specializes in:
- Group Tours
- Custom/Tailored Tours
- Travel Packages
- Tour Bookings
- Travel Planning

Be concise and helpful. Keep responses under 150 words.;

const callHuggingFaceAPI = async (userMessage, conversationHistory = []) => {
  try {
    if (!API_KEY) {
      throw new Error('HUGGINGFACE_API_KEY is not set in .env file');
    }

    let conversationText = SYSTEM_PROMPT + '\n\n';
    
    if (conversationHistory && conversationHistory.length > 0) {
      const recentMessages = conversationHistory.slice(-5);
      recentMessages.forEach(msg => {
        conversationText += User: $(.user_message)\nAssistant: $(.ai_response)\n\n;
      });
    }

    conversationText += User: $()\nAssistant: ;

    console.log('🤖 Calling Hugging Face API...');

    const response = await axios.post(
      HUGGINGFACE_API_URL,
      {
        inputs: conversationText,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.9,
        },
      },
      {
        headers: {
          Authorization: Bearer $(),
        },
        timeout: 60000,
      }
    );

    let aiResponse = response.data[0]?.generated_text || '';

    if (aiResponse.includes('Assistant: ')) {
      aiResponse = aiResponse.split('Assistant: ')[1] || aiResponse;
    }

    aiResponse = aiResponse.trim().substring(0, 500);

    if (!aiResponse) {
      throw new Error('No response from Hugging Face');
    }

    console.log('✅ Got response from Hugging Face');
    return aiResponse;

  } catch (error) {
    console.error('❌ Hugging Face API Error:', error.message);
    
    return 'I apologize, but I'\''m having trouble processing your request right now. Please try again in a moment. For urgent assistance, please contact our support team.';
  }
};

module.exports = {
  callHuggingFaceAPI,
};
