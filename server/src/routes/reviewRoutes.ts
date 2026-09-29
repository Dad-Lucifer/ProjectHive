import { Router } from 'express';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/projects/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ projectId: req.params.id }).populate('reviewerId', 'name avatarUrl');
    return res.json({ success: true, data: reviews });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

router.post('/projects/:id/reviews', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { revieweeId, rating, comment } = req.body;
    if (revieweeId === req.user!._id.toString()) {
      return res.status(400).json({ success: false, error: { code: 'SELF_REVIEW_NOT_ALLOWED', message: "You can't review yourself." } });
    }

    const review = await Review.create({
      projectId: req.params.id as string,
      reviewerId: req.user!._id,
      revieweeId,
      rating,
      comment,
    });

    const userReviews = await Review.find({ revieweeId });
    const avgRating = userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length;
    await User.updateOne({ _id: revieweeId }, { 'reputation.averageRating': avgRating, 'reputation.ratingCount': userReviews.length });

    return res.status(201).json({ success: true, data: review });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: { code: 'UNKNOWN', message: err.message } });
  }
});

export default router;
