// roleManagementController.js
// Converted from Laravel RoleManagementController.php to Node.js (Express + Supabase)
// Notes:
// - Keep SAME table names (categories, lists, roles, permissions, users, etc.).
// - Uses @supabase/supabase-js for DB operations.
// - Uses jsonwebtoken for token parsing and permission checks (approximation of CommonController::checkToken).
// - Uses bcrypt for password hashing/verification.
// - For mail + PDF features, placeholders are included; wire up as needed in your project.
//
// Environment variables required:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY  (or anon key if you restrict operations)
//   JWT_SECRET                  (to verify tokens you issue elsewhere)
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS  (if you wire up nodemailer)
//
// Usage:
//   const roleManagement = require('./roleManagementController');
//   app.use('/api', roleManagement.router);
//
// This file defines both the router and the handlers exported individually.

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const supabase = require('../../database/supabaseClient'); // Adjust path to your Supabase client setup

// ---------- Router ----------
const router = express.Router();

// ---------- Helpers ----------
function httpError(res, code, message) {
  return res.status(code).json({ message });
}

function ok(res, data) {
  return res.status(200).json(data);
}

// Parse JWT and return payload or null. Equivalent of CommonController::tokenCheck
function tokenCheck(req) {
  try {
    const token = req.header('token') || req.header('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return payload; // e.g. { userId, roleId, clientcode, email, ... }
  } catch (e) {
    return null;
  }
}

// Check token + (optionally) required permission IDs (approximation of CommonController::checkToken)
// In original PHP, they pass permission IDs like [124] to gate endpoints.
// Here we only verify token; if you store permissions in JWT, also check them here.
function checkToken(req, requiredPermissionIds = []) {
  const payload = tokenCheck(req);
  if (!payload) return null;

  // OPTIONAL: Verify permission IDs. You can embed permissions in the JWT like payload.permIds = [124, 125, ...].
  if (requiredPermissionIds.length && Array.isArray(payload.permIds)) {
    const hasAll = requiredPermissionIds.every(id => payload.permIds.includes(id));
    if (!hasAll) return null;
  }
  return payload;
}

// Simple mail transport (configure your SMTP to enable emails)
function makeTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ---------- Validators ----------
function requireBody(res, body, rules) {
  // rules: { field: (val)=>boolean, ... }
  const errors = [];
  for (const [field, validator] of Object.entries(rules)) {
    const val = body[field];
    const valid = validator(val);
    if (!valid) errors.push(`${field} is invalid`);
  }
  if (errors.length) return httpError(res, 400, errors);
  return null;
}

// ---------- Controller Methods (Converted) ----------

// GET /categories
async function getCategories(req, res) {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return httpError(res, 400, error.message);
  return ok(res, { data });
}

// POST /lists/by-category
async function getListsByCatId(req, res) {
  const err = requireBody(res, req.body, {
    catId: (v) => typeof v === 'number' || (/^\d+$/).test(String(v)),
  });
  if (err) return;

  const catId = Number(req.body.catId);
  const { data, error } = await supabase
    .from('lists')
    .select('catId,listId,listName')
    .eq('catId', catId)
    .order('listName', { ascending: true });

  if (error) return httpError(res, 400, error.message);
  const lists_array = (data || []).map(r => ({
    catId: r.catId,
    listId: r.listId,
    listName: r.listName,
  }));
  return ok(res, { data: lists_array });
}

// GET /lists/all  (join categories)
async function getAllLists(req, res) {
  // supabase: define a view or use RPC; here we do two queries for simplicity
  const { data: lists, error } = await supabase
    .from('lists')
    .select('catId,listId,listName, categories:catId ( catName )');
  if (error) return httpError(res, 400, error.message);

  const lists_array = (lists || []).map(v => ({
    catId: v.catId,
    catName: v.categories?.catName || null,
    listId: v.listId,
    listName: v.listName,
  }));
  return ok(res, { data: lists_array });
}

// POST /roles  (add role + permissions)
async function addRoles(req, res) {
  const tokenData = checkToken(req, [124]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const { roleName, isActive, permissions = [], clientcode } = req.body;
  const err = requireBody(res, req.body, {
    roleName: v => typeof v === 'string' && v.trim().length > 0,
    isActive: v => v === 0 || v === 1 || v === '0' || v === '1',
  });
  if (err) return;

  // Insert role
  const now = new Date().toISOString();
  const roleInsert = {
    roleName: String(roleName).trim(),
    isActive: Number(isActive),
    clientcode: clientcode || tokenData.clientcode || null,
    created_at: now,
    updated_at: now,
  };

  const { data: roleRow, error: roleErr } = await supabase
    .from('roles')
    .insert(roleInsert)
    .select('roleId')
    .single();

  if (roleErr) return httpError(res, 400, roleErr.message);
  const roleId = roleRow.roleId;

  // permissions = [{ catId, listIds: [] }, ...]
  const permissionRows = [];
  for (const group of permissions) {
    const { catId, listIds } = group || {};
    if (!catId || !Array.isArray(listIds)) continue;
    for (const listId of listIds) {
      permissionRows.push({ roleId, catId, listId });
    }
  }
  if (permissionRows.length) {
    const { error: permErr } = await supabase.from('permissions').insert(permissionRows);
    if (permErr) return httpError(res, 400, permErr.message);
  }

  return ok(res, { message: 'Role added successfully' });
}

// GET /roles
async function listRoles(req, res) {
  const tokenData = checkToken(req, [125]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  let query = supabase
    .from('roles')
    .select('*')
    .eq('clientcode', req.body?.decrypted_clientcode || tokenData.clientcode)
    .order('created_at', { ascending: false });

  if (req.query.roleName) {
    // Supabase text search; adjust to your schema (ilike for Postgres)
    query = query.ilike('roleName', `%${req.query.roleName}%`);
  }

  const { data, error } = await query;
  if (error) return httpError(res, 400, error.message);

  // Pagination (page, pageSize)
  const page = parseInt(req.query.page || '1', 10);
  const pageSize = parseInt(req.query.pageSize || '10', 10);
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // For exact count, you can re-run with .range and .select('*', { count: 'exact' })
  const { data: pageData, error: pageErr, count } = await supabase
    .from('roles')
    .select('*', { count: 'exact' })
    .eq('clientcode', req.body?.decrypted_clientcode || tokenData.clientcode)
    .order('created_at', { ascending: false })
    .range(start, end);

  if (pageErr) return httpError(res, 400, pageErr.message);

  return ok(res, {
    data: pageData,
    pagination: { page, pageSize, total: count || (data ? data.length : 0) },
  });
}

// POST /roles/get (by roleId)
async function getRoleData(req, res) {
  const tokenData = checkToken(req, [125]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const err = requireBody(res, req.body, {
    roleId: v => typeof v === 'number' || (/^\d+$/).test(String(v)),
  });
  if (err) return;

  const roleId = Number(req.body.roleId);

  const { data: role, error: roleErr } = await supabase
    .from('roles')
    .select('*')
    .eq('roleId', roleId)
    .single();
  if (roleErr) return httpError(res, 400, roleErr.message);

  const { data: perms, error: permErr } = await supabase
    .from('permissions')
    .select('catId,listId')
    .eq('roleId', roleId);
  if (permErr) return httpError(res, 400, permErr.message);

  // Organize like PHP
  const organized = {};
  for (const p of perms || []) {
    if (!organized[p.catId]) organized[p.catId] = { catId: p.catId, listId: [] };
    organized[p.catId].listId.push(p.listId);
  }
  const permissions = Object.values(organized);

  return ok(res, { role, permissions });
}

// PUT /roles/update
async function updateRoleData(req, res) {
  const tokenData = checkToken(req, [126]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const { roleId, roleName, isActive, permissions = [] } = req.body;
  const err = requireBody(res, req.body, {
    roleId: v => typeof v === 'number' || (/^\d+$/).test(String(v)),
    roleName: v => typeof v === 'string' && v.trim().length > 0,
    isActive: v => v === 0 || v === 1 || v === '0' || v === '1',
  });
  if (err) return;

  const now = new Date().toISOString();
  const { error: updErr } = await supabase
    .from('roles')
    .update({ roleName, isActive: Number(isActive), updated_at: now })
    .eq('roleId', Number(roleId));

  if (updErr) return httpError(res, 400, updErr.message);

  // Replace permissions
  const { error: delErr } = await supabase.from('permissions').delete().eq('roleId', Number(roleId));
  if (delErr) return httpError(res, 400, delErr.message);

  const rows = [];
  for (const g of permissions) {
    const { catId, listIds } = g || {};
    if (!catId || !Array.isArray(listIds)) continue;
    for (const listId of listIds) rows.push({ roleId: Number(roleId), catId, listId });
  }
  if (rows.length) {
    const { error: insErr } = await supabase.from('permissions').insert(rows);
    if (insErr) return httpError(res, 400, insErr.message);
  }

  return ok(res, { message: 'Role updated successfully' });
}

// GET /roles/dropdown  (active roles for a client)
async function dropdownRoles(req, res) {
  const tokenData = checkToken(req);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const clientcode = req.query.clientcode || tokenData.clientcode || null;
  let q = supabase.from('roles').select('roleId,roleName').eq('isActive', 1);
  if (clientcode) q = q.eq('clientcode', clientcode);
  const { data, error } = await q.order('roleName', { ascending: true });
  if (error) return httpError(res, 400, error.message);
  return ok(res, { data });
}

// POST /users  (create user)
async function addUser(req, res) {
  const tokenData = checkToken(req, [127]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const {
    firstName, lastName, email, mobile, password,
    roleId, isActive = 1, clientcode
  } = req.body;

  const err = requireBody(res, req.body, {
    firstName: v => typeof v === 'string' && v.trim().length > 0,
    email: v => typeof v === 'string' && /@/.test(v),
    password: v => typeof v === 'string' && v.length >= 4,
    roleId: v => typeof v === 'number' || (/^\d+$/).test(String(v)),
  });
  if (err) return;

  const hashed = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  const insert = {
    firstName: firstName || null,
    lastName: lastName || null,
    email,
    mobile: mobile || null,
    password: hashed,
    roleId: Number(roleId),
    isActive: Number(isActive),
    clientcode: clientcode || tokenData.clientcode || null,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase.from('users').insert(insert).select('uid').single();
  if (error) return httpError(res, 400, error.message);
  return ok(res, { message: 'User created successfully', uid: data?.uid });
}

// GET /users
async function listsUser(req, res) {
  const tokenData = checkToken(req, [128]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  let q = supabase.from('users').select('uid,firstName,lastName,email,mobile,roleId,isActive,clientcode,created_at,updated_at');
  if (req.query.clientcode || tokenData.clientcode) {
    q = q.eq('clientcode', req.query.clientcode || tokenData.clientcode);
  }
  if (req.query.search) {
    const s = `%${req.query.search}%`;
    q = q.or(`firstName.ilike.${s},lastName.ilike.${s},email.ilike.${s}`);
  }
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) return httpError(res, 400, error.message);
  return ok(res, { data });
}

// POST /users/get
async function viewUsersData(req, res) {
  const tokenData = checkToken(req, [128]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const err = requireBody(res, req.body, {
    uid: v => typeof v === 'number' || (/^\d+$/).test(String(v)),
  });
  if (err) return;

  const { data, error } = await supabase.from('users').select('*').eq('uid', Number(req.body.uid)).single();
  if (error) return httpError(res, 400, error.message);
  return ok(res, { data });
}

// PUT /users/update
async function updateUsersData(req, res) {
  const tokenData = checkToken(req, [129]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const { uid, firstName, lastName, email, mobile, roleId, isActive } = req.body;
  const err = requireBody(res, req.body, {
    uid: v => typeof v === 'number' || (/^\d+$/).test(String(v)),
    email: v => !v || (typeof v === 'string' && /@/.test(v)),
  });
  if (err) return;

  const patch = {
    ...(firstName !== undefined ? { firstName } : {}),
    ...(lastName !== undefined ? { lastName } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(mobile !== undefined ? { mobile } : {}),
    ...(roleId !== undefined ? { roleId: Number(roleId) } : {}),
    ...(isActive !== undefined ? { isActive: Number(isActive) } : {}),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('users').update(patch).eq('uid', Number(uid));
  if (error) return httpError(res, 400, error.message);
  return ok(res, { message: 'User updated successfully' });
}

// PATCH /users/status
async function updateUserStatus(req, res) {
  const tokenData = checkToken(req, [129]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const { uid, isActive } = req.body;
  const err = requireBody(res, req.body, {
    uid: v => typeof v === 'number' || (/^\d+$/).test(String(v)),
    isActive: v => v === 0 || v === 1 || v === '0' || v === '1',
  });
  if (err) return;

  const { error } = await supabase
    .from('users')
    .update({ isActive: Number(isActive), updated_at: new Date().toISOString() })
    .eq('uid', Number(uid));

  if (error) return httpError(res, 400, error.message);
  return ok(res, { message: 'Status updated successfully' });
}

// DELETE /users
async function deleteUser(req, res) {
  const tokenData = checkToken(req, [130]);
  if (!tokenData) return httpError(res, 408, 'Invalid Token');

  const { uid } = req.body;
  const err = requireBody(res, req.body, {
    uid: v => typeof v === 'number' || (/^\d+$/).test(String(v)),
  });
  if (err) return;

  const { error } = await supabase.from('users').delete().eq('uid', Number(uid));
  if (error) return httpError(res, 400, error.message);
  return ok(res, { message: 'User deleted successfully' });
}

// POST /auth/login
async function userLogin(req, res) {
  const { email, password } = req.body;
  const err = requireBody(res, req.body, {
    email: v => typeof v === 'string' && /@/.test(v),
    password: v => typeof v === 'string' && v.length > 0,
  });
  if (err) return;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) return httpError(res, 401, 'Invalid email or password');

  const okPass = await bcrypt.compare(password, user.password || '');
  if (!okPass) return httpError(res, 401, 'Invalid email or password');
  if (user.isActive === 0) return httpError(res, 403, 'User is inactive');

  const tokenPayload = {
    uid: user.uid,
    roleId: user.roleId,
    clientcode: user.clientcode,
    email: user.email,
  };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
  return ok(res, { token, user: { uid: user.uid, email: user.email, firstName: user.firstName, lastName: user.lastName, roleId: user.roleId } });
}

// POST /auth/verify-otp
async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  const err = requireBody(res, req.body, {
    email: v => typeof v === 'string' && /@/.test(v),
    otp: v => typeof v === 'string' || typeof v === 'number',
  });
  if (err) return;

  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error || !user) return httpError(res, 404, 'User not found');

  const now = new Date();
  if (user.otp_expires_at && now > new Date(user.otp_expires_at)) {
    return httpError(res, 429, 'OTP has expired. Please request a new one.');
  }
  if ((user.otp_attempts || 0) >= 3) {
    return httpError(res, 429, 'Maximum OTP attempts reached. Please try again later.');
  }
  if (String(otp) !== String(user.otp)) {
    await supabase.from('users').update({ otp_attempts: (user.otp_attempts || 0) + 1 }).eq('uid', user.uid);
    return httpError(res, 400, 'Invalid OTP');
  }

  // Clear OTP on success
  await supabase.from('users').update({ otp: null, otp_attempts: 0, otp_expires_at: null }).eq('uid', user.uid);
  return ok(res, { message: 'OTP verified successfully' });
}

// POST /auth/forget-password  (send OTP)
async function forgetPassword(req, res) {
  const { email } = req.body;
  const err = requireBody(res, req.body, {
    email: v => typeof v === 'string' && /@/.test(v),
  });
  if (err) return;

  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error || !user) return httpError(res, 404, 'User not found');

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // +10 minutes
  const { error: updErr } = await supabase
    .from('users')
    .update({ otp, otp_attempts: 0, otp_expires_at: expiresAt })
    .eq('uid', user.uid);
  if (updErr) return httpError(res, 400, updErr.message);

  const transporter = makeTransport();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      });
    } catch (e) {
      console.warn('Failed to send email:', e.message);
      // continue silently
    }
  }

  return ok(res, { message: 'OTP sent successfully' });
}

// POST /auth/verify-forget-password-otp (reset password using OTP)
async function verifyForgetPasswordOtp(req, res) {
  const { email, otp, newPassword } = req.body;
  const err = requireBody(res, req.body, {
    email: v => typeof v === 'string' && /@/.test(v),
    otp: v => typeof v === 'string' || typeof v === 'number',
    newPassword: v => typeof v === 'string' && v.length >= 4,
  });
  if (err) return;

  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error || !user) return httpError(res, 404, 'User not found');

  const now = new Date();
  if (user.otp_expires_at && now > new Date(user.otp_expires_at)) {
    return httpError(res, 429, 'OTP has expired. Please request a new one.');
  }
  if ((user.otp_attempts || 0) >= 3) {
    return httpError(res, 429, 'Maximum OTP attempts reached. Please try again later.');
  }
  if (String(otp) !== String(user.otp)) {
    await supabase.from('users').update({ otp_attempts: (user.otp_attempts || 0) + 1 }).eq('uid', user.uid);
    return httpError(res, 400, 'Invalid OTP');
  }

  // Ensure new password is not same as old
  const same = await bcrypt.compare(newPassword, user.password || '');
  if (same) return httpError(res, 400, 'New password must be different from the old password');

  const hashed = await bcrypt.hash(newPassword, 10);
  const { error: updErr } = await supabase
    .from('users')
    .update({ password: hashed, otp: null, otp_attempts: 0, otp_expires_at: null })
    .eq('uid', user.uid);
  if (updErr) return httpError(res, 400, updErr.message);

  return ok(res, { message: 'Password changed successfully' });
}

// // GET /test-permission
// async function testPermission(req, res) {
//   const tokenData = tokenCheck(req);
//   if (!tokenData) return httpError(res, 408, 'Invalid Token');

//   const { data: permissions, error } = await supabase
//     .from('permissions')
//     .select('catId,listId')
//     .eq('roleId', tokenData.roleId);

//   if (error) return httpError(res, 400, error.message);

//   const organized = {};
//   for (const p of permissions || []) {
//     if (!organized[p.catId]) organized[p.catId] = { catId: p.catId, listId: [] };
//     organized[p.catId].listId.push(p.listId);
//   }
//   const result = Object.values(organized);
//   return ok(res, { permissions: result });
// }
async function testPermission(req, res) {
  try {
    const tokenData = tokenCheck(req);
    if (!tokenData) return httpError(res, 408, "Invalid Token");

    const { data: permissions, error } = await supabase
      .from("permissions")
      .select("catId, listId")
      .eq("roleId", tokenData.roleId);
     console.log("Permissions data:", permissions); 
    if (error) return httpError(res, 400, error.message);

    return ok(res, { permissions });
  } catch (err) {
    return httpError(res, 500, err.message);
  }
}


// ---------- Router Bindings ----------
router.get('/categories', getCategories);
router.post('/lists/by-category', getListsByCatId);
router.get('/lists/all', getAllLists);

router.post('/roles', addRoles);
router.get('/roles', listRoles);
router.post('/roles/get', getRoleData);
router.put('/roles/update', updateRoleData);
router.get('/roles/dropdown', dropdownRoles);

router.post('/users', addUser);
router.get('/users', listsUser);
router.post('/users/get', viewUsersData);
router.put('/users/update', updateUsersData);
router.patch('/users/status', updateUserStatus);
router.delete('/users', deleteUser);

router.post('/auth/login', userLogin);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/forget-password', forgetPassword);
router.post('/auth/verify-forget-password-otp', verifyForgetPasswordOtp);

router.get('/test-permission', testPermission);

// ---------- Placeholders for the remaining 100+ methods ----------
// The original PHP controller contains many domain-specific endpoints beyond roles/users/auth
// (e.g., enquiries, bookings, exports). We expose names with a generic 501 response so your
// frontend doesn't break while you port logic iteratively. Add implementations as needed.

function notImplemented(name) {
  return async (req, res) => httpError(res, 501, `${name} is not yet implemented in Node port`);
}

// Example of registering placeholders by name:
// router.post('/enquiry/loyalty-booking', notImplemented('loyaltyBooking'));
// router.post('/welcome-booking', notImplemented('welcomeBooking'));
// ... Add more routes mapping to your existing frontend calls.

// ---------- Exports ----------
module.exports = {
  router,
  getCategories,
  getListsByCatId,
  getAllLists,
  addRoles,
  listRoles,
  getRoleData,
  updateRoleData,
  dropdownRoles,
  addUser,
  listsUser,
  viewUsersData,
  updateUsersData,
  updateUserStatus,
  deleteUser,
  userLogin,
  verifyOtp,
  forgetPassword,
  verifyForgetPasswordOtp,
  testPermission,
};