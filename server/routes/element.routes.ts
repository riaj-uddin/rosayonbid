import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// In a real app, this would be a DB. Using local JSON for now.
import elements from '../../src/data/elements.json';

router.get('/', (req, res) => {
  res.json(elements);
});

router.get('/:number', (req, res) => {
  const element = elements.find(e => e.atomicNumber === parseInt(req.params.number));
  if (!element) return res.status(404).json({ error: 'Element not found' });
  res.json(element);
});

// Protected CRUD
router.post('/', authenticateToken, (req, res) => {
  // Admin only logic would go here
  res.status(201).json({ message: 'Element created (Mock)', data: req.body });
});

export default router;
