import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import "./AIAssistant.scss";
import WaariAIService from "../../services/WaariAIService";
import ERPContextManager from "../../services/ERPContextManager";
import {
  searchTrips,
  generateTripResponse,
  generateSuggestedQuestions,
} from "../../services/TripService";

const AIAssistant = ({ isOpen, onClose }) => {
  const reduxState = useSelector((state) => state);
  // Popular questions pool for suggestions
  const popularQuestions = [
    "What's the duration of tours?",
    "Tell me about pricing options",
    "What activities are included?",
    "How do I book a tour?",
    "Where are your destinations?",
    "Tell me about accommodation",
    "How does transportation work?",
    "What are payment options?",
    "Is it safe to travel with you?",
    "Tell me about group sizes",
    "When are tours available?",
    "What reviews do you have?",
  ];

  // Helper function to get random popular questions for suggestions
  const getRandomPopularQuestions = (count = 4) => {
    const shuffled = [...popularQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // User preference state for smart context
  const [userPreferences, setUserPreferences] = useState({
    budget: null,
    duration: null,
    activityType: null,
    groupType: null,
    destination: null,
  });

  // Get initial greeting based on current module
  const getInitialGreeting = () => {
    const module = ERPContextManager.detectModule();
    const greetings = {
      PRESALES:
        "Hello! 👋 I'm Waari AI. I can help you with presales management - search tours, create enquiries, assign them to team members, and track follow-ups. What would you like to do? 🚀",
      BOOKINGS:
        "Hello! 👋 I'm Waari AI. I can help manage your bookings - view details, manage guests, arrange accommodations, and handle all booking operations. How can I help? 📅",
      BILLING:
        "Hello! 👋 I'm Waari AI. I can help with billing - generate invoices, calculate costs, apply discounts, and track payments. What do you need? 💰",
      PAYMENTS:
        "Hello! 👋 I'm Waari AI. I can help process payments - collect payments, generate receipts, handle failed payments. What would you like? 💳",
      GUESTS:
        "Hello! 👋 I'm Waari AI. I can help manage guests - add new guests, manage documents, track requirements. How can I assist? 👥",
      REPORTING:
        "Hello! 👋 I'm Waari AI. I can help with reports - generate sales analysis, commission tracking, profit analysis. What report do you need? 📊",
      TEAM: "Hello! 👋 I'm Waari AI. I can help manage your team - add users, manage roles, set permissions, track performance. How can I help? 👤",
      TOURS:
        "Hello! 👋 I'm Waari AI. I can help with tour management - search tours, filter, create new tours, check availability. What do you need? 🌍",
      DASHBOARD:
        "Hello! 👋 I'm Waari AI, your personal ERP assistant. I can help you navigate your system across all modules. What can I do for you today? 🚀",
      GENERAL:
        "Hello! 👋 I'm Waari AI, your complete ERP assistant. I can help you manage tours, bookings, billing, guests, reports, and more. How can I assist? 🎯",
    };

    return greetings[module] || greetings.GENERAL;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: getInitialGreeting(),
      sender: "bot",
      timestamp: new Date(),
      suggestions: getRandomPopularQuestions(4),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Extract user preferences from query
  const extractPreferences = (query) => {
    const lowerQuery = query.toLowerCase();
    const newPrefs = { ...userPreferences };

    // Budget detection
    const budgetPatterns = [
      { pattern: /under\s*₹?(\d+[kK]?)/i, budget: "budget" },
      { pattern: /(\d+[kK]?)\s*to\s*(\d+[kK]?)/i, budget: "mid-range" },
      { pattern: /(affordable|cheap|budget|economical)/i, budget: "budget" },
      { pattern: /(premium|luxury|expensive|high-end)/i, budget: "premium" },
    ];
    budgetPatterns.forEach((bp) => {
      if (bp.pattern.test(query)) newPrefs.budget = bp.budget;
    });

    // Duration detection
    if (/([2-3]\s*(day|days)|(weekend|short))/i.test(query))
      newPrefs.duration = "2-3 days";
    if (/([4-5]\s*(day|days))/i.test(query)) newPrefs.duration = "4-5 days";
    if (/([6-8]\s*(day|days)|week)/i.test(query))
      newPrefs.duration = "6-8 days";
    if (/([10-14]\s*(day|days)|long)/i.test(query))
      newPrefs.duration = "10+ days";

    // Activity type detection
    const activityKeywords = [
      {
        keywords: ["adventure", "trek", "hike", "extreme", "adrenaline"],
        type: "Adventure",
      },
      { keywords: ["beach", "relax", "chill", "resort"], type: "Beach" },
      {
        keywords: ["culture", "heritage", "historical", "temple", "monument"],
        type: "Cultural",
      },
      {
        keywords: ["mountain", "himalayas", "peak", "nature"],
        type: "Mountain",
      },
    ];
    activityKeywords.forEach((ak) => {
      if (ak.keywords.some((kw) => lowerQuery.includes(kw))) {
        newPrefs.activityType = ak.type;
      }
    });

    // Group type detection
    if (/(couple|honeymoon|romantic)/i.test(query))
      newPrefs.groupType = "Couple";
    if (/(family|kids|children)/i.test(query)) newPrefs.groupType = "Family";
    if (/(solo|alone|single)/i.test(query)) newPrefs.groupType = "Solo";
    if (/(friends|group)/i.test(query)) newPrefs.groupType = "Group";

    // Destination detection (you can expand this)
    const destinations = [
      "goa",
      "kerala",
      "delhi",
      "mumbai",
      "rajasthan",
      "himalayas",
      "bangalore",
    ];
    destinations.forEach((dest) => {
      if (lowerQuery.includes(dest))
        newPrefs.destination = dest.charAt(0).toUpperCase() + dest.slice(1);
    });

    return newPrefs;
  };

  // Get strategic follow-up questions based on missing preferences
  const getFollowUpQuestions = () => {
    const questions = [];

    if (!userPreferences.budget) {
      questions.push({
        text: "What's your budget range?",
        options: [
          "💰 Budget (Under ₹25k)",
          "💳 Mid-range (₹25k-50k)",
          "💎 Premium (₹50k+)",
        ],
      });
    }

    if (!userPreferences.duration) {
      questions.push({
        text: "How many days do you have?",
        options: ["⏰ 2-3 days", "📅 4-5 days", "🎒 6-8 days", "🏖️ 10+ days"],
      });
    }

    if (!userPreferences.activityType) {
      questions.push({
        text: "What type of experience?",
        options: ["🏖️ Beach", "🏔️ Mountain", "🎪 Culture", "⛰️ Adventure"],
      });
    }

    return questions;
  };

  // Get smart suggestions based on preferences
  const getSmartSuggestions = () => {
    const suggestions = [];
    const prefs = userPreferences;

    if (prefs.destination) {
      suggestions.push(
        `Show me ${prefs.activityType || "adventure"} tours to ${
          prefs.destination
        }`
      );
    }

    if (prefs.duration && prefs.budget) {
      suggestions.push(`${prefs.duration} trip in ${prefs.budget} budget`);
    }

    if (prefs.groupType) {
      suggestions.push(`Perfect for ${prefs.groupType} travelers`);
    }

    if (suggestions.length === 0) {
      return getRandomPopularQuestions(4);
    }

    // Fill remaining with popular questions
    while (suggestions.length < 4) {
      const popular = getRandomPopularQuestions(1);
      if (!suggestions.includes(popular[0])) {
        suggestions.push(popular[0]);
      }
    }

    return suggestions.slice(0, 4);
  };

  const handleSendMessage = async (e, messageToSend = null) => {
    if (e && e.preventDefault) e.preventDefault();

    const queryToProcess = messageToSend || inputValue;
    if (!queryToProcess.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: queryToProcess,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // 🎯 Use WaariAIService with context awareness
      console.log("🚀 Processing query with ERP context");
      const response = await WaariAIService.processQueryWithContext(
        queryToProcess,
        reduxState
      );

      console.log("✅ AI Response:", response);

      const botMessage = {
        id: messages.length + 2,
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        suggestions: response.suggestions || getSmartSuggestions(),
        filters: response.filters || undefined,
        action: response.action,
        actionable: response.actionable,
        context: response.context,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Error processing message:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I encountered an error processing your request. Please try again later! 😅",
        sender: "bot",
        timestamp: new Date(),
        suggestions: getRandomPopularQuestions(4),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneralQuestion = async (query) => {
    const lowerQuery = query.toLowerCase();

    // Comprehensive predefined responses for common questions
    const responses = {
      greeting: {
        keywords: ["hello", "hi", "hey", "greetings", "what's up", "howdy"],
        response:
          "Hi there! 👋 I'm your AI Assistant at Waari! I'm here to help you find the perfect trip! You can ask me about tours, destinations, travel packages, or anything else. What are you looking for? 🌍",
      },
      help: {
        keywords: [
          "help",
          "what can you do",
          "assist",
          "capabilities",
          "features",
          "how can you help",
        ],
        response:
          "I can help you with:\n• Finding group tours 🚌\n• Discovering tailor-made tours ✨\n• Searching for specific destinations 🗺️\n• Learning about travel dates and durations 📅\n• Information about pricing and packages 💰\n• Booking process and procedures 📋\n• Questions about facilities and amenities 🏨\n• Travel tips and destination insights 🗺️\n\nJust ask me about any trip or destination you're interested in!",
      },
      pricing: {
        keywords: [
          "price",
          "cost",
          "expensive",
          "cheap",
          "affordable",
          "how much",
          "budget",
        ],
        response:
          "Great question about pricing! 💰 Tour prices vary based on:\n• Season (peak vs off-season)\n• Duration of the trip\n• Type of accommodation\n• Inclusions (meals, activities, etc.)\n• Group size\n\nWould you like me to search for tours in a specific price range? Just tell me your budget!",
      },
      booking: {
        keywords: [
          "book",
          "reserve",
          "how to book",
          "booking process",
          "register",
          "enrollment",
        ],
        response:
          "Great! Here's how to book a tour with us:\n1. Browse available tours 🔍\n2. Check the itinerary and dates 📋\n3. Review pricing and inclusions 💰\n4. Contact our sales team for confirmation 📞\n5. Complete the booking and payment 💳\n\nWould you like me to help you find a specific tour to book?",
      },
      duration: {
        keywords: [
          "duration",
          "how long",
          "days",
          "nights",
          "week",
          "length of trip",
        ],
        response:
          "Our tours range from short getaways to extended holidays! ⏰\n• Weekend trips: 2-3 days\n• Short trips: 4-5 days\n• Standard tours: 6-8 days\n• Extended tours: 10+ days\n\nTell me how many days you have available, and I'll find the perfect trip for you! 🎯",
      },
      destination: {
        keywords: ["where", "destination", "place", "location", "visit"],
        response:
          "We offer amazing tours to various destinations! 🌟 Some popular ones include:\n• Goa - Beaches & relaxation 🏖️\n• Kerala - Backwaters & nature 🌴\n• Rajasthan - Palaces & culture 🏛️\n• Himalayas - Mountains & adventure 🏔️\n• Delhi & North India - History & culture 🕌\n\nWhich destination interests you? I can show you available tours!",
      },
      accommodation: {
        keywords: [
          "hotel",
          "accommodation",
          "stay",
          "where to stay",
          "lodging",
          "resort",
          "facility",
        ],
        response:
          "Our tours include comfortable accommodations! 🏨 We offer:\n• Budget hotels - Comfortable and affordable\n• Mid-range hotels - Good comfort & amenities\n• Premium hotels - Luxury & exclusive experience\n• Resorts - All-inclusive experience\n\nWould you like me to find tours with a specific type of accommodation?",
      },
      transport: {
        keywords: [
          "transport",
          "travel",
          "how to reach",
          "flight",
          "train",
          "bus",
          "vehicle",
          "car",
          "drive",
        ],
        response:
          "We take care of your transportation! 🚌 Our packages typically include:\n• Coach/Bus transport 🚌\n• Local transfers 🚗\n• Optional flight arrangements ✈️\n• Train bookings (on request) 🚂\n\nAll transport is included in the tour price for your convenience. Would you like to explore available tours?",
      },
      activities: {
        keywords: [
          "activity",
          "activities",
          "what to do",
          "adventure",
          "experience",
          "sightseeing",
          "things to do",
        ],
        response:
          "Our tours include amazing activities! 🎉 Depending on the destination:\n• Sightseeing & cultural tours 🏛️\n• Beach & water sports 🏄‍♂️\n• Mountain trekking & hiking 🥾\n• Wildlife spotting 🦁\n• Local experiences & shopping 🛍️\n• Adventure activities 🪂\n\nWhich type of activity interests you? I'll find the perfect tour!",
      },
      group: {
        keywords: [
          "group",
          "family",
          "friends",
          "couple",
          "solo",
          "how many people",
        ],
        response:
          "Great question! 👥 Our tours work for:\n• Solo travelers - Meet new people! 🚶‍♂️\n• Couples - Perfect getaway 💑\n• Small groups - Friends & family 👨‍👩‍👧‍👦\n• Large groups - Corporate & events 🏢\n\nAll our tours are inclusive and welcoming. Tell me your group size, and I'll recommend perfect options!",
      },
      dates: {
        keywords: [
          "when",
          "date",
          "season",
          "time",
          "availability",
          "departure date",
          "start date",
        ],
        response:
          "Perfect! Timing is important 📅 Tours are available:\n• Year-round for most destinations\n• Peak seasons: Oct-Mar (cooler weather)\n• Off-season: Apr-Sep (budget-friendly)\n• Special offers: Available throughout the year\n\nTell me your preferred dates or season, and I'll show you available tours!",
      },
      payment: {
        keywords: [
          "payment",
          "pay",
          "refund",
          "cancellation",
          "policy",
          "emi",
          "installment",
        ],
        response:
          "About payment options: 💳\n• Multiple payment modes accepted\n• Flexible EMI options available\n• Secure online payment gateway\n• Cancellation policy: Refer our T&C\n• Full refund/rescheduling policies\n\nContact our sales team for specific details or explore tours now!",
      },
      visa: {
        keywords: [
          "visa",
          "passport",
          "document",
          "requirement",
          "international",
        ],
        response:
          "For international tours, you may need: 📖\n• Valid passport\n• Visa (if required for the country)\n• Travel insurance (recommended)\n• Copies of documents\n\nOur team can guide you through the documentation process. Which country are you planning to visit?",
      },
      safety: {
        keywords: ["safe", "safety", "secure", "protection"],
        response:
          "Safety is our top priority! 🛡️\n• Experienced guides on all tours\n• Safe & reliable transportation\n• 24/7 emergency support\n• Travel insurance options\n• Well-established partner hotels\n\nYou can travel with confidence with Waari! Would you like to book a tour?",
      },
      review: {
        keywords: ["review", "rating", "feedback", "testimonial", "rating"],
        response:
          "Our customers love their experiences with us! ⭐ You can:\n• Check reviews on our website\n• See customer testimonials\n• Ask about past tours\n• Connect with our support team\n\nWould you like to explore tours that have great reviews? I can help!",
      },
      contact: {
        keywords: ["contact", "phone", "email", "support", "call", "reach"],
        response:
          "You can reach us at: 📞\n• Visit our website for contact details\n• Call our sales team for instant support\n• Email us for detailed inquiries\n• Chat with us here (24/7 available)\n\nHow can I help you find the perfect tour right now?",
      },
    };

    // Check predefined responses
    for (const [key, { keywords, response }] of Object.entries(responses)) {
      if (keywords.some((kw) => lowerQuery.includes(kw))) {
        return response;
      }
    }

    // Smart fallback response based on question type
    if (lowerQuery.includes("?")) {
      // It's a question
      if (lowerQuery.includes("can") || lowerQuery.includes("could")) {
        return "Great question! 🤔 For specific details about what we can arrange, our team is here to help! Tell me more about what you're looking for, or ask about:\n• Tours to specific destinations\n• Custom trip planning\n• Group arrangements\n• Special packages\n\nWhat sounds interesting to you? 😊";
      }
      if (lowerQuery.includes("why") || lowerQuery.includes("what")) {
        return "That's a thoughtful question! 💭 To give you the best answer, I'd like to know more. Are you asking about:\n• Tour planning & preparation?\n• Destination insights?\n• Our services & offerings?\n• Travel tips & advice?\n\nFeel free to ask, and I'll do my best to help! 🌟";
      }
      return "Interesting question! 🤔 While I'm specialized in helping with tour bookings and travel queries, our expert team can help with almost anything travel-related. \n\nWould you like to:\n• Explore available tours?\n• Get destination recommendations?\n• Learn about booking options?\n\nLet me know how I can assist! 😊";
    }

    // It's a statement or comment
    return "That sounds great! 🎉 I'd love to help you with a tour experience! \n\nWould you be interested in:\n• Exploring popular destinations? 🌍\n• Learning about tour packages? 🎁\n• Getting personalized recommendations? ✨\n• Checking availability & pricing? 💰\n\nWhat would you like to know? 😊";
  };

  if (!isOpen) return null;

  return (
    <div className="ai-assistant-overlay" onClick={onClose}>
      <div
        className="ai-assistant-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ai-assistant-header">
          <div className="ai-assistant-title">
            <div className="ai-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8V4m0 16v-4m8-8h-4m-8 0H4m11.313 11.313l2.828-2.828m-5.656 0l-2.828 2.828m0-5.656l2.828-2.828m-5.656 0l2.828 2.828" />
              </svg>
            </div>
            <div>
              <h2>Waari AI</h2>
              <span className="status-badge">Ready to help</span>
            </div>
          </div>
          <button className="ai-close-btn" onClick={onClose} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="ai-messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`ai-message ${message.sender}`}>
              <div className="ai-message-content">
                {message.sender === "bot" && (
                  <div className="ai-avatar">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                    </svg>
                  </div>
                )}
                <div>
                  <div className="ai-message-text">{message.text}</div>
                  {/* Show filter buttons if available */}
                  {message.filters && message.filters.length > 0 && (
                    <div className="ai-filters">
                      {message.filters.map((filter, index) => (
                        <button
                          key={index}
                          className="ai-filter-btn"
                          onClick={() => handleSendMessage(null, filter)}
                          disabled={isLoading}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Show suggestions as clickable buttons */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="ai-suggestions">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="ai-suggestion-btn"
                          onClick={() => handleSendMessage(null, suggestion)}
                          disabled={isLoading}
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <span className="ai-message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="ai-message bot">
              <div className="ai-message-content">
                <div className="ai-avatar">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
                <div className="ai-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="ai-input-form">
          <div className="ai-input-wrapper">
            <input
              type="text"
              className="ai-input"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={isLoading || !inputValue.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4429026 C0.994623095,2.0591707 0.837654326,3.0143979 1.15159189,3.97788954 L3.03521743,10.4188826 C3.03521743,10.5759799 3.34915502,10.7330773 3.50612381,10.7330773 L16.6915026,11.5185642 C16.6915026,11.5185642 17.1624089,11.5185642 17.1624089,12.0493666 C17.1624089,12.5801689 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
