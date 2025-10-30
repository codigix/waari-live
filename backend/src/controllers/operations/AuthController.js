const db = require('../../../db'); // MySQL connection
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const operationLogin = async (req, res) => {
  // ✅ Validate input
  await body('email').isEmail().run(req);
  await body('password').notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map(e => e.msg) });
  }

  const { email, password } = req.body;

  // ✅ Fetch user
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    const user = results[0];
    if (!user) {
      return res.status(422).json({ message: 'Invalid email' });
    }

    // ✅ Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(422).json({ message: 'Invalid password' });
    }

    // ✅ Generate token
    const token = `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;

    // ✅ Update token in DB
    db.query('UPDATE users SET token = ? WHERE userId = ?', [token, user.userId], (err) => {
      if (err) return res.status(500).json({ message: err.message });

      return res.status(200).json({
        message: 'Operation logged in successfully',
        token,
        userId: user.userId,
        roleId: user.roleId
      });
    });
  });
};

module.exports = { operationLogin };