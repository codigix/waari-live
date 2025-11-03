/**
 * ERP Context Manager
 * Detects which module the user is in and extracts relevant context for AI
 */

export class ERPContextManager {
  /**
   * Detect current module based on URL path
   */
  static detectModule() {
    const currentPath = window.location.pathname;
    console.log("🔍 Current path:", currentPath);

    if (currentPath.includes("presale") || currentPath.includes("enquiry")) {
      return "PRESALES";
    } else if (
      currentPath.includes("confirmed") ||
      currentPath.includes("booking")
    ) {
      return "BOOKINGS";
    } else if (
      currentPath.includes("billing") ||
      currentPath.includes("invoice")
    ) {
      return "BILLING";
    } else if (
      currentPath.includes("payment") ||
      currentPath.includes("receipt")
    ) {
      return "PAYMENTS";
    } else if (
      currentPath.includes("guest") ||
      currentPath.includes("member")
    ) {
      return "GUESTS";
    } else if (
      currentPath.includes("report") ||
      currentPath.includes("chart")
    ) {
      return "REPORTING";
    } else if (currentPath.includes("user") || currentPath.includes("team")) {
      return "TEAM";
    } else if (currentPath.includes("view-tour")) {
      return "TOURS";
    } else if (currentPath.includes("dashboard")) {
      return "DASHBOARD";
    }

    return "GENERAL";
  }

  /**
   * Extract context data from Redux store
   */
  static extractContextFromRedux(state) {
    const module = this.detectModule();

    return {
      module,
      auth: {
        userId: state.auth?.userId,
        roleId: state.auth?.roleId,
        permissions: state.auth?.permissions || [],
      },
      form: state.form || {},
      groupTour: state.groupTour || {},
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get context-aware system message for different modules
   */
  static getSystemMessageForModule(module) {
    const systemMessages = {
      PRESALES: `You are Waari AI, an expert assistant for the Presales team. Help users:
- Search for tours matching customer requirements
- Create new enquiries
- Assign enquiries to team members
- Follow up on potential bookings
- Track enquiry status
Always suggest tours based on customer budget, duration, and preferences.`,

      BOOKINGS: `You are Waari AI, a booking management expert. Help users:
- Manage confirmed bookings
- Track booking status
- Arrange accommodation and transportation
- Handle guest assignments
- Process booking cancellations
- Recommend add-ons or upgrades
Suggest actions to optimize bookings and improve customer satisfaction.`,

      BILLING: `You are Waari AI, a billing and invoicing expert. Help users:
- Generate and manage invoices
- Calculate tour costs and pricing
- Handle discounts and adjustments
- Track payment status
- Process refunds
- Generate billing reports
Ensure accurate financial records and timely billing.`,

      PAYMENTS: `You are Waari AI, a payment processing expert. Help users:
- Process payments
- Generate receipts
- Handle payment failures
- Manage payment plans
- Track payment history
- Suggest payment options
Ensure secure and timely payment processing.`,

      GUESTS: `You are Waari AI, a guest management expert. Help users:
- Add and manage guest information
- Track guest documents
- Handle guest inquiries
- Manage guest feedback
- Create guest groups
- Generate guest reports
Maintain accurate and organized guest records.`,

      REPORTING: `You are Waari AI, a reporting and analytics expert. Help users:
- Generate performance reports
- Analyze sales trends
- Calculate commissions
- Create profit reports
- Identify business insights
- Compare period-over-period data
Provide actionable business intelligence.`,

      TEAM: `You are Waari AI, a team management expert. Help users:
- Manage user accounts
- Assign roles and permissions
- Track team performance
- Manage team assignments
- Handle user access
- Generate team reports
Ensure proper team structure and access control.`,

      TOURS: `You are Waari AI, a tour management expert. Help users:
- Search and filter tours
- Create new tours
- Edit tour details
- Manage tour inventory
- Track seat availability
- Recommend tours
Provide comprehensive tour information and management.`,

      DASHBOARD: `You are Waari AI, your personal ERP assistant. Help users with:
- Quick tour searches
- Booking status checks
- Financial summaries
- Team activity
- System overview
- Navigation and features
Provide quick insights and assistance.`,

      GENERAL: `You are Waari AI, your intelligent ERP assistant. Help users navigate and optimize their Waari travel management system. You can assist with:
- Tour search and recommendations
- Booking management
- Billing and payments
- Guest information
- Reports and analytics
- Team collaboration
Always provide context-aware suggestions and help users achieve their goals efficiently.`,
    };

    return systemMessages[module] || systemMessages.GENERAL;
  }

  /**
   * Extract relevant data based on current module and Redux state
   */
  static extractModuleSpecificData(module, reduxState, urlParams = {}) {
    const baseData = {
      module,
      currentPage: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    switch (module) {
      case "PRESALES":
        return {
          ...baseData,
          type: "Presales Management",
          context: "User is viewing or managing presales enquiries",
          availableActions: [
            "Search for tours",
            "Create new enquiry",
            "Assign enquiry",
            "Follow up enquiry",
            "Move to booking",
          ],
        };

      case "BOOKINGS":
        return {
          ...baseData,
          type: "Booking Management",
          context: "User is managing confirmed bookings",
          availableActions: [
            "View booking details",
            "Update booking",
            "Assign guests",
            "Manage arrangements",
            "Process cancellation",
            "Add services",
          ],
        };

      case "BILLING":
        return {
          ...baseData,
          type: "Billing & Invoicing",
          context: "User is managing billing and invoices",
          availableActions: [
            "Generate invoice",
            "Calculate costs",
            "Apply discounts",
            "View payment status",
            "Generate billing reports",
          ],
        };

      case "PAYMENTS":
        return {
          ...baseData,
          type: "Payment Processing",
          context: "User is processing payments",
          availableActions: [
            "Process payment",
            "Generate receipt",
            "View payment history",
            "Handle payment issues",
          ],
        };

      case "GUESTS":
        return {
          ...baseData,
          type: "Guest Management",
          context: "User is managing guest information",
          availableActions: [
            "Add guest",
            "Update guest info",
            "Upload documents",
            "View guest history",
            "Export guest data",
          ],
        };

      case "REPORTING":
        return {
          ...baseData,
          type: "Reports & Analytics",
          context: "User is viewing reports and analytics",
          availableActions: [
            "Generate sales report",
            "View commission report",
            "Analyze trends",
            "Create custom report",
          ],
        };

      case "TEAM":
        return {
          ...baseData,
          type: "Team Management",
          context: "User is managing team and users",
          availableActions: [
            "Add user",
            "Edit user",
            "Assign role",
            "Set permissions",
            "View team report",
          ],
        };

      case "TOURS":
        return {
          ...baseData,
          type: "Tour Management",
          context: "User is viewing or managing tours",
          availableActions: [
            "Search tours",
            "Filter tours",
            "Create tour",
            "Edit tour details",
            "Check availability",
            "View itinerary",
          ],
        };

      case "DASHBOARD":
        return {
          ...baseData,
          type: "Dashboard",
          context: "User is on main dashboard",
          availableActions: [
            "View summaries",
            "Quick search",
            "Navigate modules",
          ],
        };

      default:
        return baseData;
    }
  }

  /**
   * Generate context summary for AI
   */
  static generateContextSummary(reduxState) {
    const module = this.detectModule();
    const moduleData = this.extractModuleSpecificData(module, reduxState);
    const auth = reduxState.auth || {};

    return {
      systemPrompt: this.getSystemMessageForModule(module),
      contextSummary: {
        ...moduleData,
        userRole: auth.roleId,
        userPermissions: auth.permissions,
      },
      instructions: this.getModuleInstructions(module),
    };
  }

  /**
   * Get specific instructions for the module
   */
  static getModuleInstructions(module) {
    const instructions = {
      PRESALES: {
        priority: "Convert enquiries to bookings",
        focus: "Customer needs and tour matching",
        tone: "Proactive and consultative",
      },
      BOOKINGS: {
        priority: "Ensure smooth booking execution",
        focus: "Customer satisfaction and arrangements",
        tone: "Organized and supportive",
      },
      BILLING: {
        priority: "Ensure accurate financial records",
        focus: "Correct calculations and timely billing",
        tone: "Professional and precise",
      },
      PAYMENTS: {
        priority: "Secure and timely payments",
        focus: "Payment processing and compliance",
        tone: "Secure and clear",
      },
      GUESTS: {
        priority: "Complete and accurate guest info",
        focus: "Data accuracy and organization",
        tone: "Detailed and organized",
      },
      REPORTING: {
        priority: "Provide actionable insights",
        focus: "Trends, performance, and predictions",
        tone: "Analytical and insightful",
      },
      TEAM: {
        priority: "Efficient team management",
        focus: "Roles, permissions, and productivity",
        tone: "Organized and supportive",
      },
      TOURS: {
        priority: "Optimize tour management",
        focus: "Inventory, availability, and details",
        tone: "Informative and helpful",
      },
      DASHBOARD: {
        priority: "Quick navigation and insights",
        focus: "Summary data and quick actions",
        tone: "Friendly and efficient",
      },
      GENERAL: {
        priority: "Provide helpful assistance",
        focus: "User needs and system features",
        tone: "Helpful and professional",
      },
    };

    return instructions[module] || instructions.GENERAL;
  }
}

export default ERPContextManager;
