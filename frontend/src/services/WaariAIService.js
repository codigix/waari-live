/**
 * Waari AI Service
 * Main service that connects all AI modules and handles AI logic
 */

import { searchTrips, generateTripResponse } from "./TripService";
import ERPContextManager from "./ERPContextManager";
import { get, post } from "./apiServices";

class WaariAIService {
  /**
   * Main method to process user query with ERP context
   */
  static async processQueryWithContext(userQuery, reduxState) {
    try {
      // Get current context
      const context = ERPContextManager.generateContextSummary(reduxState);
      const module = ERPContextManager.detectModule();

      console.log("🤖 Processing query in context:", {
        module,
        query: userQuery,
      });

      // Route query to appropriate module handler
      let response = await this.routeQueryToModule(
        userQuery,
        module,
        reduxState,
        context
      );

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
  static async routeQueryToModule(query, module, reduxState, context) {
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

  /**
   * PRESALES Module Handler
   */
  static async handlePresalesQuery(query, reduxState) {
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
  static async handleBookingsQuery(query, reduxState) {
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
  static async handleBillingQuery(query, reduxState) {
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
  static async handlePaymentsQuery(query, reduxState) {
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
  static async handleGuestsQuery(query, reduxState) {
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
  static async handleReportingQuery(query, reduxState) {
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
  static async handleTeamQuery(query, reduxState) {
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
  static async handleToursQuery(query, reduxState) {
    // Delegate to TripService for tour queries
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
  static async handleDashboardQuery(query, reduxState) {
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
  static async handleGeneralQuery(query, reduxState) {
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
