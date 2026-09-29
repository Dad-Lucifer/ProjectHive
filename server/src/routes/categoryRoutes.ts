import { Router } from 'express';
import { Category } from '../models/Category';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let categories = await Category.find();
    if (categories.length === 0) {
      categories = await Category.insertMany([
        { name: 'Web Development', description: 'Web apps and sites', icon: 'Globe' },
        { name: 'Mobile Apps', description: 'iOS and Android applications', icon: 'Smartphone' },
        { name: 'Artificial Intelligence', description: 'Machine learning & NLP', icon: 'Brain' },
        { name: 'Data Science', description: 'Data analysis and visualization', icon: 'BarChart' },
        { name: 'DevOps & Systems', description: 'Infrastructure & CI/CD', icon: 'Server' },
        { name: 'Cybersecurity', description: 'Security and ethical hacking', icon: 'Shield' },
      ]);
    }
    return res.json({ success: true, data: categories });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
