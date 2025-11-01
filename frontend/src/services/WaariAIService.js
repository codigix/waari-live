/**
 * Waari AI Service
 * Main service that connects all AI modules and handles AI logic
 */

import { searchTrips, generateTripResponse, getGroupTours, getTailorMadeTours } from "./TripService";
import ERPContextManager from "./ERPContextManager";
import { post } from "./apiServices";

class WaariAIService {
  /**
   * Main method to process user query with ERP context
   */
  static async processQueryWithContext(userQuery, reduxState, conversationHistory = []) {
    try {
      const context = ERPContextManager.generateContextSummary(reduxState);
      const module = ERPContextManager.detectModule();

      console.log("🤖 Processing query in context:", {
        module,
        query: userQuery,
      });

      const moduleResponse = await this.routeQueryToModule(
        userQuery,
        module,
        reduxState
      );

      const historyPayload = this.prepareConversationHistory(conversationHistory);
      let backendResponse = null;

      try {
        const apiResponse = await post("/ai/assistant", {
          message: userQuery,
          history: historyPayload,
          context,
          module,
        });
        backendResponse = apiResponse?.data?.data ?? apiResponse?.data ?? null;
      } catch (apiError) {
        console.error("❌ AI backend error:", apiError);
      }

      let response = this.mergeResponses(backendResponse, moduleResponse);

      response = this.applyRolePersona(response, reduxState);

      return {
        ...response,
        context: module,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error processing query:", error);
      return {
        success: false,
        text: "I encountered an error processing your request. Please try again. 😅",
        suggestions: ["Show me available tours", "How can you help me?"],
      };
    }
  }

  /**
   * Route query to appropriate module handler
   */
  static async routeQueryToModule(query, module, reduxState) {
    const lowerQuery = query.toLowerCase();

    if (this.isDataAssistantQuery(lowerQuery)) {
      return this.handleDataAssistantQuery(query);
    }

    if (module === "GENERAL") {
      const tourKeywords = ["tour", "trip", "package", "itinerary", "travel"];
      const bookingKeywords = ["booking", "bookings", "reservation", "confirm", "seat"];
      const enquiryKeywords = ["enquiry", "inquiry", "lead", "prospect", "follow-up"];

      if (tourKeywords.some((word) => lowerQuery.includes(word))) {
        module = "TOURS";
      } else if (bookingKeywords.some((word) => lowerQuery.includes(word))) {
        module = "BOOKINGS";
      } else if (enquiryKeywords.some((word) => lowerQuery.includes(word))) {
        module = "PRESALES";
      }
    }

    switch (module) {
      case "PRESALES":
        return this.handlePresalesQuery(query, reduxState);

      case "BOOKINGS":
        return this.handleBookingsQuery(query, reduxState);

      case "BILLING":
        return this.handleBillingQuery(query, reduxState);

      case "PAYMENTS":
        return this.handlePaymentsQuery(query, reduxState);

      case "GUESTS":
        return this.handleGuestsQuery(query, reduxState);

      case "REPORTING":
        return this.handleReportingQuery(query, reduxState);

      case "TEAM":
        return this.handleTeamQuery(query, reduxState);

      case "TOURS":
        return this.handleToursQuery(query, reduxState);

      case "DASHBOARD":
        return this.handleDashboardQuery(query, reduxState);

      default:
        return this.handleGeneralQuery(query, reduxState);
    }
  }

  static applyRolePersona(response, reduxState) {
    if (!response || typeof response !== "object") {
      return response;
    }

    const personaResponse = { ...response };
    const roleId = this.resolveRoleId(reduxState);

    if (typeof roleId !== "number") {
      return personaResponse;
    }

    const personas = {
      1: {
        message:
          "Since you have admin access, I can highlight system metrics, role management, and company-wide insights.",
        suggestions: ["Show me system metrics", "Review pending approvals"],
      },
      2: {
        message:
          "Your sales role lets you focus on enquiries, conversions, and customer follow-ups. I can surface leads that need attention.",
        suggestions: ["Show pending enquiries", "Suggest follow-up actions"],
      },
      3: {
        message:
          "With an operations role, I can help track tour logistics, guest documents, and departure readiness.",
        suggestions: ["Show upcoming departures", "Check guest document status"],
      },
    };

    const persona = personas[roleId];

    if (!persona) {
      return personaResponse;
    }

    const baseText = personaResponse.text ?? "";
    const addition = persona.message;
    personaResponse.text = baseText
      ? `${baseText}\n\n${addition}`
      : addition;

    const existingSuggestions = Array.isArray(personaResponse.suggestions)
      ? personaResponse.suggestions
      : [];
    const personaSuggestions = Array.isArray(persona.suggestions)
      ? persona.suggestions.filter((suggestion) => !existingSuggestions.includes(suggestion))
      : [];

    if (personaSuggestions.length > 0) {
      personaResponse.suggestions = [...existingSuggestions, ...personaSuggestions];
    }

    personaResponse.persona = roleId;

    return personaResponse;
  }

  static resolveRoleId(reduxState) {
    const candidates = [
      reduxState?.auth?.roleId,
      reduxState?.auth?.role?.id,
      reduxState?.auth?.role?.roleId,
      reduxState?.auth?.user?.roleId,
      reduxState?.auth?.user?.role_id,
      reduxState?.auth?.user?.role?.id,
      reduxState?.auth?.user?.role?.roleId,
      reduxState?.auth?.profile?.roleId,
      reduxState?.auth?.profile?.role?.id,
      reduxState?.user?.roleId,
      reduxState?.user?.role?.id,
    ];

    for (const candidate of candidates) {
      const normalized = this.normalizeRoleCandidate(candidate);
      if (typeof normalized === "number") {
        return normalized;
      }
    }

    return null;
  }

  static normalizeRoleCandidate(candidate) {
    if (candidate === null || candidate === undefined) {
      return null;
    }

    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }

    if (typeof candidate === "string") {
      const trimmed = candidate.trim();
      if (!trimmed) {
        return null;
      }

      try {
        const parsed = JSON.parse(trimmed);
        return this.normalizeRoleCandidate(parsed);
      } catch (error) {
        const numeric = Number(trimmed);
        return Number.isNaN(numeric) ? null : numeric;
      }
    }

    if (typeof candidate === "object") {
      const nestedCandidates = [
        candidate.roleId,
        candidate.role_id,
        candidate.id,
        candidate.value,
        candidate.role?.id,
        candidate.role?.roleId,
        candidate.role?.value,
      ];

      for (const nested of nestedCandidates) {
        const normalized = this.normalizeRoleCandidate(nested);
        if (typeof normalized === "number") {
          return normalized;
        }
      }
    }

    return null;
  }

  static mergeResponses(backendResponse, moduleResponse) {
    const moduleData =
      moduleResponse && typeof moduleResponse === "object"
        ? { ...moduleResponse }
        : {};

    const result = {
      success: moduleData.success ?? true,
      ...moduleData,
    };

    const backendData = this.extractResponseFields(backendResponse);

    const moduleHasText = typeof result.text === "string" && result.text.trim();

    if (backendData.success === true && backendData.text) {
      result.text = backendData.text;
    } else if (!moduleHasText && backendData.text) {
      result.text = backendData.text;
    } else if (!moduleHasText) {
      result.text = "";
    }

    const moduleSuggestions = Array.isArray(moduleData.suggestions)
      ? moduleData.suggestions.slice()
      : [];
    const combinedSuggestions = [...moduleSuggestions];

    backendData.suggestions.forEach((suggestion) => {
      if (!combinedSuggestions.includes(suggestion)) {
        combinedSuggestions.push(suggestion);
      }
    });

    result.suggestions = combinedSuggestions;

    if (!result.action && backendData.action) {
      result.action = backendData.action;
    }

    if (typeof result.actionable !== "boolean" && typeof backendData.actionable === "boolean") {
      result.actionable = backendData.actionable;
    }

    if (!result.filters && backendData.filters) {
      result.filters = backendData.filters;
    }

    if (typeof backendData.success === "boolean") {
      result.success = backendData.success;
    }

    return result;
  }

  static extractResponseFields(payload) {
    const base = {
      text: "",
      suggestions: [],
      action: undefined,
      actionable: undefined,
      filters: undefined,
      success: undefined,
    };

    if (!payload) {
      return base;
    }

    if (typeof payload === "string") {
      return {
        ...base,
        text: payload.trim(),
      };
    }

    if (typeof payload !== "object") {
      return base;
    }

    const candidates = [];

    if (payload.data) {
      candidates.push(this.extractResponseFields(payload.data));
    }

    if (payload.reply) {
      const normalizedReply = this.extractResponseFields(payload.reply);
      const extraSuggestions = Array.isArray(payload.suggestions)
        ? payload.suggestions
            .filter((item) => typeof item === "string" && item.trim())
            .map((item) => item.trim())
        : [];
      extraSuggestions.forEach((suggestion) => {
        if (!normalizedReply.suggestions.includes(suggestion)) {
          normalizedReply.suggestions.push(suggestion);
        }
      });
      if (typeof payload.success === "boolean") {
        normalizedReply.success = payload.success;
      }
      candidates.push(normalizedReply);
    }

    if (!payload.data && !payload.reply) {
      const suggestions = Array.isArray(payload.suggestions)
        ? payload.suggestions
            .filter((item) => typeof item === "string" && item.trim())
            .map((item) => item.trim())
        : [];

      candidates.push({
        text:
          typeof payload.text === "string"
            ? payload.text.trim()
            : typeof payload.message === "string"
            ? payload.message.trim()
            : "",
        suggestions,
        action:
          typeof payload.action === "string"
            ? payload.action
            : typeof payload.suggestedAction === "string"
            ? payload.suggestedAction
            : undefined,
        actionable:
          typeof payload.actionable === "boolean"
            ? payload.actionable
            : undefined,
        filters: payload.filters,
        success:
          typeof payload.success === "boolean" ? payload.success : undefined,
      });
    }

    if (!candidates.length) {
      return base;
    }

    const merged = candidates.reduce(
      (acc, item) => {
        if (item.text) {
          acc.text = item.text;
        }
        if (Array.isArray(item.suggestions)) {
          item.suggestions.forEach((suggestion) => {
            if (!acc.suggestions.includes(suggestion)) {
              acc.suggestions.push(suggestion);
            }
          });
        }
        if (item.action) {
          acc.action = item.action;
        }
        if (typeof item.actionable === "boolean") {
          acc.actionable = item.actionable;
        }
        if (item.filters && !acc.filters) {
          acc.filters = item.filters;
        }
        if (typeof item.success === "boolean") {
          acc.success = item.success;
        }
        return acc;
      },
      { ...base }
    );

    if (!merged.actionable && merged.action) {
      merged.actionable = true;
    }

    return merged;
  }

  static prepareConversationHistory(history) {
    if (!Array.isArray(history)) {
      return [];
    }

    const sanitized = history
      .filter((entry) => entry && typeof entry.text === "string" && entry.text.trim())
      .map((entry) => ({
        sender: entry.sender === "bot" ? "assistant" : "user",
        text: entry.text.trim(),
      }));

    const pairs = [];
    let current = null;

    sanitized.forEach((entry) => {
      if (entry.sender === "user") {
        if (current && (current.user || current.assistant)) {
          pairs.push(current);
        }
        current = { user: entry.text };
      } else {
        if (current && current.user) {
          current.assistant = entry.text;
          pairs.push(current);
          current = null;
        } else {
          pairs.push({ assistant: entry.text });
        }
      }
    });

    if (current && (current.user || current.assistant)) {
      pairs.push(current);
    }

    return pairs.slice(-6);
  }

  static isDataAssistantQuery(lowerQuery) {
    const triggers = [
      "upcoming group",
      "highest profit",
      "pending payment",
      "pending invoice",
      "monthly summary",
      "performance summary",
      "data export",
      "export list",
      "custom data",
      "less than",
      "under",
      "report",
      "summary",
      "pending payments",
      "profit",
    ];
    return triggers.some((phrase) => lowerQuery.includes(phrase));
  }

  static isLowBookingQuery(lowerQuery) {
    return (
      lowerQuery.includes("upcoming") &&
      (lowerQuery.includes("group tour") || lowerQuery.includes("tours")) &&
      (lowerQuery.includes("less than") || lowerQuery.includes("under") || lowerQuery.includes("below") || lowerQuery.includes("fewer"))
    );
  }

  static isPerformanceQuery(lowerQuery) {
    return (
      lowerQuery.includes("monthly summary") ||
      lowerQuery.includes("performance summary") ||
      (lowerQuery.includes("summary") && lowerQuery.includes("month")) ||
      (lowerQuery.includes("report") && lowerQuery.includes("month"))
    );
  }

  static isExportQuery(lowerQuery) {
    return lowerQuery.includes("export");
  }

  static async handleDataAssistantQuery(query) {
    const lowerQuery = query.toLowerCase();
    try {
      if (this.isLowBookingQuery(lowerQuery)) {
        return await this.generateLowBookingReport(query);
      }
      if (this.isPerformanceQuery(lowerQuery)) {
        return await this.generateMonthlyPerformanceSummary();
      }
      if (this.isExportQuery(lowerQuery)) {
        return this.generateExportGuidance(query);
      }
      return this.generateGenericDataAssistantResponse(query);
    } catch (error) {
      console.error("Data assistant error:", error);
      return {
        success: false,
        text: "I could not process that data request right now. Please try again shortly.",
        suggestions: ["Show me all tours", "Generate monthly summary"],
      };
    }
  }

  static extractNumericThreshold(query) {
    const match = query.match(/(?:less than|under|below|fewer than|<)\s*(\d+)/i);
    if (match && match[1]) {
      const value = Number(match[1]);
      if (!Number.isNaN(value) && value > 0) {
        return value;
      }
    }
    return 10;
  }

  static parseDateValue(value) {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === "string") {
      const cleaned = value.trim();
      if (!cleaned) {
        return null;
      }
      const parts = cleaned.split(/[-/]/).map((part) => part.trim());
      if (parts.length === 3) {
        let day;
        let month;
        let year;
        if (parts[0].length === 4) {
          year = Number(parts[0]);
          month = Number(parts[1]) - 1;
          day = Number(parts[2]);
        } else if (parts[2].length === 4) {
          day = Number(parts[0]);
          month = Number(parts[1]) - 1;
          year = Number(parts[2]);
        } else {
          return null;
        }
        if (
          Number.isInteger(day) &&
          Number.isInteger(month) &&
          Number.isInteger(year) &&
          month >= 0 &&
          month < 12 &&
          day >= 1 &&
          day <= 31
        ) {
          return new Date(year, month, day);
        }
      }
      const parsed = new Date(cleaned);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    if (typeof value === "number") {
      const fromNumber = new Date(value);
      if (!Number.isNaN(fromNumber.getTime())) {
        return fromNumber;
      }
    }
    return null;
  }

  static formatTourLine(tour) {
    const startDate = tour.startDate || tour.start_date || tour.start;
    const seatsBooked = Number(tour.seatsBook) || 0;
    const totalSeats = Number(tour.totalSeats) || 0;
    const availability = totalSeats > 0 ? `${seatsBooked}/${totalSeats}` : `${seatsBooked}`;
    return `${tour.tourName || tour.groupName || "Tour"} • Start: ${startDate || "N/A"} • Booked: ${availability}`;
  }

  static async generateLowBookingReport(query) {
    const threshold = this.extractNumericThreshold(query);
    const response = await getGroupTours({ perPage: 200, page: 1 });
    const tours = Array.isArray(response?.data) ? response.data : [];
    const now = new Date();
    const filtered = tours
      .map((tour) => ({
        ...tour,
        startDateValue: this.parseDateValue(tour.startDate || tour.start_date || tour.start),
        seatsBookedValue: Number(tour.seatsBook) || 0,
      }))
      .filter(
        (tour) =>
          tour.startDateValue &&
          tour.startDateValue >= now &&
          tour.seatsBookedValue < threshold
      )
      .sort((a, b) => a.startDateValue - b.startDateValue);

    if (filtered.length === 0) {
      return {
        success: true,
        text: `I did not find upcoming group tours with fewer than ${threshold} bookings. All scheduled departures are above that threshold.`,
        suggestions: ["Show me all upcoming tours", "Generate monthly summary", "Export tour data"],
        action: "DATA_INSIGHT",
      };
    }

    const preview = filtered.slice(0, 5).map((tour, index) => `${index + 1}. ${this.formatTourLine(tour)}`).join("\n");
    const remaining = filtered.length > 5 ? `\n...and ${filtered.length - 5} more.` : "";
    const text = `I found ${filtered.length} upcoming group tour${filtered.length > 1 ? "s" : ""} with fewer than ${threshold} bookings:\n\n${preview}${remaining}\n\nWould you like me to prepare a follow-up plan or export a list?`;

    return {
      success: true,
      text,
      suggestions: ["Export low booking tours", "Notify sales team", "Compare with last month"],
      action: "DATA_INSIGHT",
      actionable: true,
    };
  }

  static async generateMonthlyPerformanceSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [groupResponse, tailorResponse] = await Promise.all([
      getGroupTours({ perPage: 200, page: 1 }),
      getTailorMadeTours({ perPage: 200, page: 1 }),
    ]);
    const groupTours = Array.isArray(groupResponse?.data) ? groupResponse.data : [];
    const tailorTours = Array.isArray(tailorResponse?.data) ? tailorResponse.data : [];

    const groupThisMonth = groupTours.filter((tour) => {
      const date = this.parseDateValue(tour.startDate || tour.start_date || tour.start);
      return date && date >= startOfMonth && date < startOfNextMonth;
    });

    const tailorThisMonth = tailorTours.filter((tour) => {
      const date = this.parseDateValue(tour.startDate || tour.start_date || tour.start);
      return date && date >= startOfMonth && date < startOfNextMonth;
    });

    const totalSeats = groupThisMonth.reduce((acc, tour) => acc + (Number(tour.totalSeats) || 0), 0);
    const totalBooked = groupThisMonth.reduce((acc, tour) => acc + (Number(tour.seatsBook) || 0), 0);
    const occupancy = totalSeats > 0 ? ((totalBooked / totalSeats) * 100).toFixed(1) : "0.0";
    const upcomingDepartures = groupThisMonth.filter((tour) => {
      const date = this.parseDateValue(tour.startDate || tour.start_date || tour.start);
      return date && date >= now;
    }).length;

    const text = `Here is this month's performance snapshot:\n\n• Group tours scheduled: ${groupThisMonth.length}\n• Seats booked: ${totalBooked}${totalSeats > 0 ? ` out of ${totalSeats}` : ""}\n• Average occupancy: ${occupancy}%\n• Tailor-made enquiries this month: ${tailorThisMonth.length}\n• Upcoming departures remaining this month: ${upcomingDepartures}\n\nLet me know if you want deeper insights or an export.`;

    return {
      success: true,
      text,
      suggestions: ["Compare with last month", "Show low booking tours", "Export monthly data"],
      action: "DATA_SUMMARY",
    };
  }

  static generateExportGuidance(query) {
    const lower = query.toLowerCase();
    const focus = lower.includes("pending")
      ? "pending payments"
      : lower.includes("vendor")
      ? "vendor records"
      : "tour data";
    const text = `I can prepare an export file for ${focus}. Let me know the format (CSV or Excel) and the filters you need, such as date range, module, or status. Once confirmed, I'll compile it and notify you when it's ready.`;
    return {
      success: true,
      text,
      suggestions: ["Export as CSV", "Export as Excel", "Filter by date range"],
      action: "DATA_EXPORT",
      actionable: true,
    };
  }

  static generateGenericDataAssistantResponse() {
    const text = `I can help analyze your ERP data. You can ask me to run performance summaries, find low occupancy tours, highlight pending payments, or prepare exports. Just specify what data or time period you need.`;
    return {
      success: true,
      text,
      suggestions: ["Show low booking tours", "Generate monthly summary", "Export pending payments"],
      action: "DATA_ASSISTANT",
    };
  }

  /**
   * PRESALES Module Handler
   */
  static async handlePresalesQuery(query) {
    const lowerQuery = query.toLowerCase();

    // Check what the user wants to do
    if (/search|find|show|look for|display|list|available/i.test(lowerQuery)) {
      // Search for tours
      const searchResults = await searchTrips(query);
      const response = generateTripResponse(searchResults, query);

      return {
        ...response,
        action: "SEARCH_TOURS",
        actionable: true,
        suggestedAction: "Show me these tours in detail",
      };
    }

    if (/create|new|add|register|enquiry|inquiry/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📝 I can help you create a new enquiry! Here's what I need:
1. **Customer Name**: Who is this enquiry from?
2. **Tour Preference**: Which tour are they interested in?
3. **Duration**: How many days?
4. **Budget**: What's their budget range?
5. **Group Size**: How many people?
6. **Travel Dates**: When do they want to travel?

You can fill this information step by step, and I'll guide you through the enquiry creation process.`,
        action: "CREATE_ENQUIRY",
        actionable: true,
        suggestedAction: "Help me create a new enquiry",
      };
    }

    if (/assign|allocate|transfer|delegate|assign to/i.test(lowerQuery)) {
      return {
        success: true,
        text: `👤 I can help you assign enquiries to team members. To do this, I need:
1. **Which enquiry** do you want to assign?
2. **To which team member** should it be assigned?
3. **Priority level** (High/Medium/Low)?
4. **Follow-up deadline**?

Assigning enquiries strategically helps ensure timely follow-ups and better conversion rates.`,
        action: "ASSIGN_ENQUIRY",
        actionable: true,
      };
    }

    if (/follow.?up|remind|status|track/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📞 Enquiry follow-up is crucial for conversions! I can help you:
- Get a list of overdue follow-ups
- Schedule follow-up reminders
- Track enquiry status
- Suggest next best action for each enquiry
- Generate follow-up reports

Would you like to see pending follow-ups or create a follow-up plan?`,
        action: "FOLLOWUP_ENQUIRY",
        actionable: true,
      };
    }

    // Default presales response
    return {
      success: true,
      text: `Hi! 👋 In the Presales module, I can help you:
- **Search tours** matching customer requirements
- **Create new enquiries** from customer inquiries
- **Assign enquiries** to team members
- **Track follow-ups** and conversions
- **View enquiry status** and history

What would you like to do?`,
      suggestions: [
        "Search for tours",
        "Create new enquiry",
        "Show pending follow-ups",
        "Assign enquiries",
      ],
    };
  }

  /**
   * BOOKINGS Module Handler
   */
  static async handleBookingsQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/view|show|details|information|status/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📋 I can help you view booking details. Do you want to:
- View **specific booking** details
- Check **guest assignments**
- See **accommodation arrangements**
- Track **transportation details**
- View **payment status**
- Check **add-on services**

Which booking would you like to check?`,
        action: "VIEW_BOOKING",
        actionable: true,
      };
    }

    if (/guest|member|participant|traveler/i.test(lowerQuery)) {
      return {
        success: true,
        text: `👥 I can help you manage guests in bookings. I can:
- **Add new guests** to a booking
- **Update guest information**
- **Upload guest documents** (passport, visa, etc.)
- **Assign guest roles** (lead, companion, etc.)
- **View guest list** for a booking
- **Export guest details**

Which booking's guests would you like to manage?`,
        action: "MANAGE_GUESTS",
        actionable: true,
      };
    }

    if (/cancel|refund|delete|remove/i.test(lowerQuery)) {
      return {
        success: true,
        text: `⚠️ Booking cancellation is a sensitive operation. Before I help, please confirm:
1. **Which booking** needs to be cancelled?
2. **Reason** for cancellation?
3. **Refund policy** to apply?
4. **Customer communication** - have they been informed?

Cancellations can impact revenue and customer relationships. Let's handle this carefully!`,
        action: "CANCEL_BOOKING",
        actionable: true,
      };
    }

    // Default bookings response
    return {
      success: true,
      text: `📅 In the Bookings module, I can help you:
- **View booking** details and status
- **Manage guests** and participants
- **Arrange accommodations** and transportation
- **Track payments** and adjustments
- **Add services** and upgrades
- **Handle cancellations** if needed
- **Generate booking reports**

What would you like to do?`,
      suggestions: [
        "View booking details",
        "Manage guests",
        "Check payment status",
        "Update arrangements",
      ],
    };
  }

  /**
   * BILLING Module Handler
   */
  static async handleBillingQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/invoice|bill|charge|amount|cost|price/i.test(lowerQuery)) {
      return {
        success: true,
        text: `💰 I can help you with invoicing! I can:
- **Generate invoices** for bookings
- **Calculate costs** based on tour details
- **Apply discounts** and adjustments
- **View invoice status**
- **Track payment status**
- **Generate billing reports**
- **Manage recurring charges**

Which booking would you like to invoice?`,
        action: "GENERATE_INVOICE",
        actionable: true,
      };
    }

    if (/discount|adjustment|refund|credit|debit/i.test(lowerQuery)) {
      return {
        success: true,
        text: `🏷️ I can help you manage adjustments and discounts. I can:
- **Apply discounts** (percentage or fixed)
- **Process refunds** (full or partial)
- **Add credits** or adjustments
- **Apply coupon codes**
- **Track adjustment history**
- **Validate discount rules**

Tell me which booking needs adjustment and why?`,
        action: "APPLY_ADJUSTMENT",
        actionable: true,
      };
    }

    if (/report|summary|analysis|trend|profit/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📊 I can help you generate billing reports:
- **Revenue summary** by period
- **Outstanding payments** list
- **Collected payments** analysis
- **Discount analysis**
- **Profit margins** by tour
- **Customer payment behavior**

What period would you like to analyze?`,
        action: "GENERATE_REPORT",
        actionable: true,
      };
    }

    // Default billing response
    return {
      success: true,
      text: `💳 In the Billing module, I can help you:
- **Generate invoices** for bookings
- **Calculate costs** accurately
- **Apply discounts** and adjustments
- **Process refunds**
- **Track payment status**
- **Generate financial reports**
- **Manage billing records**

What do you need help with?`,
      suggestions: [
        "Generate invoice",
        "Apply discount",
        "View payment status",
        "Generate report",
      ],
    };
  }

  /**
   * PAYMENTS Module Handler
   */
  static async handlePaymentsQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/process|pay|payment|collect/i.test(lowerQuery)) {
      return {
        success: true,
        text: `💳 I can help you process payments! I can:
- **Collect payment** from customer
- **Generate payment link**
- **Track payment status**
- **Process partial payments**
- **Manage payment plans**
- **Record manual payments**
- **Send payment reminders**

Which booking's payment would you like to process?`,
        action: "PROCESS_PAYMENT",
        actionable: true,
      };
    }

    if (/receipt|voucher|proof/i.test(lowerQuery)) {
      return {
        success: true,
        text: `🧾 I can help with receipts and vouchers:
- **Generate receipt** for payment
- **Create payment voucher**
- **Email receipt** to customer
- **Track receipt history**
- **Reissue receipt** if needed

Which payment would you like receipt for?`,
        action: "GENERATE_RECEIPT",
        actionable: true,
      };
    }

    if (/fail|error|issue|problem|retry/i.test(lowerQuery)) {
      return {
        success: true,
        text: `⚠️ I can help troubleshoot payment issues:
- **Retry failed payment**
- **Check payment gateway status**
- **Investigate transaction**
- **Suggest alternative payment method**
- **Escalate to support** if needed

Tell me which payment is having issues?`,
        action: "RESOLVE_PAYMENT_ISSUE",
        actionable: true,
      };
    }

    // Default payments response
    return {
      success: true,
      text: `💰 In the Payments module, I can help you:
- **Process payments** securely
- **Generate receipts** and vouchers
- **Track payment history**
- **Manage payment methods**
- **Handle failed payments**
- **Process refunds**
- **Generate payment reports**

What do you need?`,
      suggestions: [
        "Process payment",
        "Generate receipt",
        "Check payment status",
        "Retry failed payment",
      ],
    };
  }

  /**
   * GUESTS Module Handler
   */
  static async handleGuestsQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/add|new|register|create/i.test(lowerQuery)) {
      return {
        success: true,
        text: `➕ I can help you add new guests! I need:
- **Full Name**
- **Date of Birth**
- **Contact Information** (phone, email)
- **Address**
- **Document Details** (passport, ID, etc.)
- **Relationship** to group (lead/companion)
- **Special Requirements** (dietary, medical, etc.)

Start with the guest's full name?`,
        action: "ADD_GUEST",
        actionable: true,
      };
    }

    if (/document|passport|visa|id|upload/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📄 I can help manage guest documents:
- **Upload passport** copy
- **Add visa** details
- **Upload ID** proof
- **Track document** status
- **Set reminders** for expiring documents
- **Generate document** checklist

Which guest's documents would you like to manage?`,
        action: "MANAGE_DOCUMENTS",
        actionable: true,
      };
    }

    if (/list|view|all|export|report/i.test(lowerQuery)) {
      return {
        success: true,
        text: `👥 I can help you view and manage guest lists:
- **View all guests** for a booking
- **Export guest list**
- **Generate guest report**
- **Filter guests** by criteria
- **Search guests** by name/ID
- **Print guest manifest**

Which booking's guests would you like to see?`,
        action: "VIEW_GUESTS",
        actionable: true,
      };
    }

    // Default guests response
    return {
      success: true,
      text: `👤 In the Guests module, I can help you:
- **Add new guests** to bookings
- **Update guest information**
- **Manage guest documents**
- **Track special requirements**
- **View guest lists**
- **Export guest data**
- **Generate guest reports**

What would you like to do?`,
      suggestions: [
        "Add new guest",
        "Manage documents",
        "View guest list",
        "Export data",
      ],
    };
  }

  /**
   * REPORTING Module Handler
   */
  static async handleReportingQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/sales|revenue|booking|tour/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📈 I can help generate sales reports:
- **Monthly sales** summary
- **Sales by tour type**
- **Sales by team member**
- **Booking trends**
- **Revenue analysis**
- **Period-over-period** comparison
- **Sales forecast**

Which time period would you like to analyze?`,
        action: "SALES_REPORT",
        actionable: true,
      };
    }

    if (/commission|payment|earning|bonus/i.test(lowerQuery)) {
      return {
        success: true,
        text: `💵 I can help with commission reports:
- **Commission calculation** by agent
- **Commission summary** by period
- **Payment tracking**
- **Commission breakup** by tour
- **Pending commissions**
- **Payment history**

Which agent or period would you like to check?`,
        action: "COMMISSION_REPORT",
        actionable: true,
      };
    }

    if (/profit|margin|cost|expense/i.test(lowerQuery)) {
      return {
        success: true,
        text: `💰 I can help analyze profitability:
- **Profit by tour**
- **Profit margin** analysis
- **Cost breakdown**
- **Expenses** tracking
- **Profitability trends**
- **Best performing** tours

What would you like to analyze?`,
        action: "PROFIT_REPORT",
        actionable: true,
      };
    }

    // Default reporting response
    return {
      success: true,
      text: `📊 In the Reporting module, I can help you:
- **Generate sales reports**
- **Analyze commission** and earnings
- **View profit analysis**
- **Track key metrics**
- **Compare periods**
- **Export reports**
- **Create insights**

What report would you like?`,
      suggestions: [
        "Generate sales report",
        "Show commissions",
        "Analyze profits",
        "Export data",
      ],
    };
  }

  /**
   * TEAM Module Handler
   */
  static async handleTeamQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/user|add|create|new|register/i.test(lowerQuery)) {
      return {
        success: true,
        text: `👤 I can help you add new team members:
- **User details** (name, email, phone)
- **Assign role** (Admin, Manager, Agent, etc.)
- **Set permissions**
- **Assign office/team**
- **Send invitation**
- **Track onboarding**

What's the new team member's name?`,
        action: "ADD_USER",
        actionable: true,
      };
    }

    if (/role|permission|access|authorize/i.test(lowerQuery)) {
      return {
        success: true,
        text: `🔐 I can help manage roles and permissions:
- **Create new role**
- **Assign roles** to users
- **Set permissions**
- **Manage access levels**
- **Review permissions** for a user
- **Audit permission** changes

Which user's permissions would you like to manage?`,
        action: "MANAGE_ROLES",
        actionable: true,
      };
    }

    if (/performance|activity|report|assignment/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📊 I can help track team performance:
- **User activity** report
- **Assignment tracking**
- **Performance metrics**
- **Follow-up completion** rate
- **Booking conversion** rate
- **Team comparison**

Which team member would you like to analyze?`,
        action: "TEAM_REPORT",
        actionable: true,
      };
    }

    // Default team response
    return {
      success: true,
      text: `👥 In the Team module, I can help you:
- **Add new users**
- **Manage roles** and permissions
- **Track team activity**
- **View performance** metrics
- **Manage assignments**
- **Generate team reports**

What would you like to do?`,
      suggestions: [
        "Add new user",
        "Manage permissions",
        "View performance",
        "Generate report",
      ],
    };
  }

  /**
   * TOURS Module Handler
   */
  static async handleToursQuery(query) {
    const searchResults = await searchTrips(query);
    const response = generateTripResponse(searchResults, query);

    return {
      ...response,
      action: "SEARCH_TOURS",
      actionable: true,
    };
  }

  /**
   * DASHBOARD Module Handler
   */
  static async handleDashboardQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/quick|search|find|tour/i.test(lowerQuery)) {
      const searchResults = await searchTrips(query);
      return generateTripResponse(searchResults, query);
    }

    if (/status|booking|enquiry|overview/i.test(lowerQuery)) {
      return {
        success: true,
        text: `📊 From the Dashboard, I can give you quick status updates:
- **Total bookings** count
- **Pending enquiries**
- **Revenue** summary
- **Team activity**
- **Upcoming tours**
- **System alerts**

What would you like to check?`,
        suggestions: [
          "Show me total bookings",
          "What's pending?",
          "Revenue summary",
          "Team activity",
        ],
      };
    }

    // Default dashboard response
    return {
      success: true,
      text: `🏠 Hi! I'm Waari AI, your ERP assistant. From the dashboard, I can help you:
- **Quick tour search**
- **Booking status** overview
- **Navigate modules** (Presales, Bookings, Billing, etc.)
- **Get quick insights**
- **Answer questions** about your ERP

What would you like to do?`,
      suggestions: [
        "Search for tours",
        "Show bookings",
        "Navigate to sales",
        "Show me everything",
      ],
    };
  }

  /**
   * GENERAL Query Handler
   */
  static async handleGeneralQuery(query) {
    const lowerQuery = query.toLowerCase();

    if (/help|what can you do|capabilities|features|assist/i.test(lowerQuery)) {
      return {
        success: true,
        text: `Hi! 👋 I'm Waari AI, your complete ERP assistant. I can help you with:

**Tour Management** 🌍
- Search tours by destination, date, budget
- Get tour recommendations
- Check availability

**Presales** 📞
- Create enquiries
- Manage follow-ups
- Convert enquiries to bookings

**Bookings** 📅
- Manage confirmed bookings
- Assign guests
- Handle arrangements

**Billing & Payments** 💰
- Generate invoices
- Process payments
- Track financial records

**Guest Management** 👥
- Add and manage guests
- Handle documents
- Track requirements

**Reports** 📊
- Sales and revenue analysis
- Commission tracking
- Performance metrics

**Team Management** 👤
- Manage users and roles
- Set permissions
- Track performance

I'm context-aware, so I adapt my help based on which module you're using. Just ask me anything! 🚀`,
        suggestions: [
          "How do I search tours?",
          "Create a new enquiry",
          "Show bookings",
          "Generate report",
        ],
      };
    }

    // Default general response
    return {
      success: true,
      text: `👋 I'm Waari AI! I can help you navigate and manage your entire ERP system. You can ask me about:
- **Tours** - Search and recommendations
- **Bookings** - Management and tracking
- **Billing** - Invoices and payments
- **Guests** - Information and documents
- **Reports** - Analytics and insights
- **Team** - User and role management

What would you like help with?`,
      suggestions: [
        "Search for tours",
        "Create enquiry",
        "Show bookings",
        "Generate report",
      ],
    };
  }

  /**
   * Get action-specific suggestions
   */
  static getActionSuggestions(action) {
    const suggestions = {
      SEARCH_TOURS: [
        "Show me more results",
        "Filter by price",
        "Filter by duration",
        "Compare tours",
      ],
      CREATE_ENQUIRY: [
        "Create another enquiry",
        "Assign to team",
        "Set follow-up reminder",
      ],
      ASSIGN_ENQUIRY: [
        "Bulk assign enquiries",
        "Set follow-up schedule",
        "View assigned enquiries",
      ],
      GENERATE_INVOICE: [
        "Send invoice to customer",
        "Track payment",
        "Apply discount",
      ],
      PROCESS_PAYMENT: [
        "Generate receipt",
        "Send reminder",
        "View payment history",
      ],
      ADD_GUEST: [
        "Add another guest",
        "Upload documents",
        "Set special requirements",
      ],
      SALES_REPORT: ["Export as PDF", "Compare periods", "Email report"],
    };

    return suggestions[action] || [];
  }
}

export default WaariAIService;
