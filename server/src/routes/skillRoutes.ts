import { Router } from 'express';
import { Skill } from '../models/Skill';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let skills = await Skill.find();
    if (skills.length === 0) {
      skills = await Skill.insertMany([
        { name: 'React', category: 'Frontend', description: 'Web UI library' },
        { name: 'TypeScript', category: 'Language', description: 'Typed JS' },
        { name: 'Node.js', category: 'Backend', description: 'JS runtime' },
        { name: 'Express', category: 'Backend', description: 'Web framework' },
        { name: 'MongoDB', category: 'Database', description: 'NoSQL DB' },
        { name: 'Python', category: 'Language', description: 'General programming' },
        { name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first CSS' },
        { name: 'Docker', category: 'DevOps', description: 'Containerization' },
        { name: 'Git', category: 'DevOps', description: 'Version control' },
        { name: 'UI/UX Design', category: 'Design', description: 'User interfaces' },
      ]);
    }
    return res.json({ success: true, data: skills });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
