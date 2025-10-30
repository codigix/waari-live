const db = require('../../db');
const axios = require('axios');

// ✅ Check token and permissions
// const checkToken = async (token, listIds) => {
//   if (!token) {
//     return { status: 408, message: 'Token is required' };
//   }

//   const [user] = await db.query(
//     'SELECT * FROM users WHERE token = ? AND status = 1',
//     [token]
//   );

//   if (!user.length) {
//     return { status: 408, message: 'Invalid Token' };
//   }

//   const [userWithPermissions] = await db.query(
//     `SELECT users.*, permissions.listId FROM users
//      JOIN permissions ON users.roleId = permissions.roleId
//      WHERE users.token = ? AND permissions.listId IN (?)`,
//     [token, listIds]
//   );

//   if (!userWithPermissions.length) {
//     return { status: 403, message: 'You do not have access permission for this' };
//   }

//   return { status: 200, data: userWithPermissions[0] };
// };
const checkToken = async (token, listIds) => {
  if (!token) {
    return { status: 408, message: 'Token is required' };
  }

  // ✅ Find user with token
  const [users] = await db.query(
    'SELECT * FROM users WHERE token = ? AND status = 1',
    [token]
  );

  if (!users.length) {
    return { status: 408, message: 'Invalid Token' };
  }

  const user = users[0];

  // ✅ Check permissions
  const [userWithPermissions] = await db.query(
    `SELECT users.*, permissions.listId 
     FROM users
     JOIN permissions ON users.roleId = permissions.roleId
     WHERE users.userId = ? AND permissions.listId IN (?)`,
    [user.userId, listIds]
  );

  if (!userWithPermissions.length) {
    return { status: 403, message: 'You do not have access permission for this' };
  }

  // ✅ Return user safely
  return { status: 200, data: userWithPermissions[0] };
};


// ✅ Token lookup (influencersaffiliates)
const token = async (token) => {
  if (!token) return [];

  const [result] = await db.query(
    'SELECT * FROM influencersaffiliates WHERE token = ?',
    [token]
  );

  return result.length ? result[0] : [];
};

// ✅ Generate guest ID
const generateGuestId = (firstName, lastName) => {
  const first = firstName?.substring(0, 2) || '';
  const last = lastName?.substring(0, 2) || '';
  return (first + last).toUpperCase() + Math.floor(1000 + Math.random() * 9000) + 'S';
};

// ✅ Token check (users)
const tokenCheck = async (token) => {
  if (!token) return [];

  const [result] = await db.query(
    'SELECT * FROM users WHERE token = ?',
    [token]
  );
  console.log("Token check result:", result);
  return result.length ? result[0] : [];
};


// ✅ WhatsApp message sender
const whatsAppMessageSend = async (jsonData) => {
  try {
    const whatsappApi = process.env.WHATSAPP_API;
    if (!whatsappApi) throw new Error('WhatsApp API key is not set in environment variables.');

    const response = await axios.post(
      'https://api.interakt.ai/v1/public/message/',
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${whatsappApi}`
        }
      }
    );

    return response.data;
  } catch (err) {
    return { message: err.message };
  }
};

module.exports = {
  checkToken,
  token,
  generateGuestId,
  tokenCheck,
  whatsAppMessageSend
};
