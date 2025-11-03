const db = require("../models");
const bcrypt = require("bcryptjs");

class CommonController {
  static async checkToken(token, requiredPermissions = []) {
    // Implementation for token verification and permission checking
    // This would verify the token and check if user has the required permissions
    try {
      // Your token verification logic here
      return { userId: 1, roleId: 1 }; // Example response
    } catch (error) {
      return null;
    }
  }

  static async checkUserPermissions(userId, permissionIds) {
    // Check if user has the required permissions
    const query = `
      SELECT COUNT(*) as count 
      FROM permissions p
      JOIN user_roles ur ON ur.role_id = p.role_id
      WHERE ur.user_id = ? AND p.list_id IN (?)
    `;

    const [results] = await db.execute(query, [userId, permissionIds]);
    return results[0].count === permissionIds.length;
  }

  static generateGuestId(firstName, lastName) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${firstName.charAt(0)}${lastName.charAt(
      0
    )}${randomNum}`.toUpperCase();
  }

  static async whatsAppMessageSend(data) {
    // Implementation for sending WhatsApp messages
    console.log("Sending WhatsApp message:", data);
    return { success: true };
  }
}

module.exports = CommonController;
