const router = require('express').Router();
const Student = require('../models/Student');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

// Dashboard numbers. Must be above '/:id'.
router.get('/stats', async (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [total, thisWeek, recent, courses] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ createdAt: { $gte: weekAgo } }),
    Student.find().sort({ createdAt: -1 }).limit(5),
    Student.distinct('course'),
  ]);
  res.json({ total, thisWeek, courses: courses.length, recent });
});

// List with search + pagination
router.get('/', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 8, 50);
  const search = (req.query.search || '').trim();
  const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = search
    ? { $or: ['name', 'email', 'course'].map((f) => ({ [f]: { $regex: safe, $options: 'i' } })) }
    : {};
  const [students, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Student.countDocuments(filter),
  ]);
  res.json({ students, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
});

router.get('/:id', async (req, res) => {
  const s = await Student.findById(req.params.id).catch(() => null);
  if (!s) return res.status(404).json({ message: 'Student not found' });
  res.json(s);
});

const saveError = (e) =>
  e.code === 11000 ? 'A student with this email already exists' : 'Please check the student details';

router.post('/', adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Student.create(req.body));
  } catch (e) {
    res.status(400).json({ message: saveError(e) });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ message: 'Student not found' });
    res.json(s);
  } catch (e) {
    res.status(400).json({ message: saveError(e) });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  const s = await Student.findByIdAndDelete(req.params.id).catch(() => null);
  if (!s) return res.status(404).json({ message: 'Student not found' });
  res.json({ message: 'Student deleted' });
});

module.exports = router;
