const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (u) =>
  jwt.sign({ id: u._id, role: u.role, name: u.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
const emailOk = (e) => /^\S+@\S+\.\S+$/.test(e || '');

// The very first account created becomes the admin; everyone after is a normal user.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !emailOk(email) || !password || password.length < 6)
      return res.status(400).json({ message: 'Enter a name, a valid email and a password of 6+ characters' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'That email is already registered' });
    const role = (await User.countDocuments()) === 0 ? 'admin' : 'user';
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
    res.status(201).json({ token: makeToken(user), user: { name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Could not register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return res.status(400).json({ message: 'Wrong email or password' });
    res.json({ token: makeToken(user), user: { name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: 'Could not log in' });
  }
});

module.exports = router;
