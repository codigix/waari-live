/**
 * Waari AI Backend Service
 * Handles all backend API calls for Waari AI operations
 * This file can be extended as your backend grows
 */

import { get, post, put, del } from "./apiServices";

class WaariAIBackendService {
  /**
   * GET PRESALES DATA
   */
  static async getEnquiries(filters = {}) {
    try {
      const response = await get("/enquiries", filters);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching enquiries:", error);
      return { data: [] };
    }
  }

  static async createEnquiry(enquiryData) {
    try {
      const response = await post("/enquiries", enquiryData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error creating enquiry:", error);
      return { success: false, error: error.message };
    }
  }

  static async assignEnquiry(enquiryId, assigneeId) {
    try {
      const response = await put(`/enquiries/${enquiryId}/assign`, {
        assignedTo: assigneeId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error assigning enquiry:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET BOOKINGS DATA
   */
  static async getBookings(filters = {}) {
    try {
      const response = await get("/bookings", filters);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      return { data: [] };
    }
  }

  static async getBookingDetails(bookingId) {
    try {
      const response = await get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching booking details:", error);
      return null;
    }
  }

  static async updateBooking(bookingId, updateData) {
    try {
      const response = await put(`/bookings/${bookingId}`, updateData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error updating booking:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET GUESTS DATA
   */
  static async getGuests(filters = {}) {
    try {
      const response = await get("/guests", filters);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching guests:", error);
      return { data: [] };
    }
  }

  static async addGuest(guestData) {
    try {
      const response = await post("/guests", guestData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error adding guest:", error);
      return { success: false, error: error.message };
    }
  }

  static async updateGuest(guestId, updateData) {
    try {
      const response = await put(`/guests/${guestId}`, updateData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error updating guest:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET BILLING DATA
   */
  static async generateInvoice(bookingId) {
    try {
      const response = await post(`/billing/invoice/generate`, {
        bookingId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error generating invoice:", error);
      return { success: false, error: error.message };
    }
  }

  static async calculateCost(tourData) {
    try {
      const response = await post("/billing/calculate-cost", tourData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error calculating cost:", error);
      return { success: false, error: error.message };
    }
  }

  static async applyDiscount(invoiceId, discountData) {
    try {
      const response = await put(
        `/billing/invoice/${invoiceId}/discount`,
        discountData
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error applying discount:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET PAYMENT DATA
   */
  static async processPayment(paymentData) {
    try {
      const response = await post("/payments/process", paymentData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error processing payment:", error);
      return { success: false, error: error.message };
    }
  }

  static async generateReceipt(paymentId) {
    try {
      const response = await post(`/payments/${paymentId}/receipt`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error generating receipt:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET REPORTS DATA
   */
  static async getSalesReport(filters = {}) {
    try {
      const response = await get("/reports/sales", filters);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching sales report:", error);
      return { data: [] };
    }
  }

  static async getCommissionReport(filters = {}) {
    try {
      const response = await get("/reports/commission", filters);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching commission report:", error);
      return { data: [] };
    }
  }

  static async getProfitReport(filters = {}) {
    try {
      const response = await get("/reports/profit", filters);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching profit report:", error);
      return { data: [] };
    }
  }

  /**
   * GET TEAM DATA
   */
  static async getUsers(filters = {}) {
    try {
      const response = await get("/users", filters);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      return { data: [] };
    }
  }

  static async addUser(userData) {
    try {
      const response = await post("/users", userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error adding user:", error);
      return { success: false, error: error.message };
    }
  }

  static async updateUserRole(userId, roleData) {
    try {
      const response = await put(`/users/${userId}/role`, roleData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Error updating user role:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * GET AI-SPECIFIC DATA (Context-aware suggestions)
   */
  static async getModuleMetrics(module) {
    try {
      const response = await get(`/ai/metrics/${module}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching module metrics:", error);
      return { data: {} };
    }
  }

  static async getRecommendations(context) {
    try {
      const response = await post("/ai/recommendations", context);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
      return { data: [] };
    }
  }

  /**
   * LOG AI INTERACTIONS (for analytics)
   */
  static async logAIInteraction(interactionData) {
    try {
      // This logs user interactions with AI for analytics
      const response = await post("/ai/log", {
        module: interactionData.module,
        query: interactionData.query,
        response: interactionData.response,
        timestamp: new Date(),
        userId: interactionData.userId,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error logging AI interaction:", error);
      // Don't throw error - logging failure shouldn't break the app
      return {};
    }
  }
}

export default WaariAIBackendService;
