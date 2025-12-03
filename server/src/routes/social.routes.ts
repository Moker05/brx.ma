import { Router } from 'express';
import * as SocialController from '../controllers/social.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Posts
router.post('/posts', authenticateToken, SocialController.createPost);
router.get('/posts', SocialController.getPosts);
router.post('/posts/:id/like', authenticateToken, SocialController.likePost);

// Comments
router.post('/posts/:postId/comments', authenticateToken, SocialController.createComment);
router.post('/comments/:id/like', authenticateToken, SocialController.likeComment);

// Profiles
router.get('/profiles/:userId', SocialController.getProfile);
router.put('/profiles', authenticateToken, SocialController.updateProfile);

// Follow
router.post('/follow/:profileId', authenticateToken, SocialController.followUser);

// Leaderboard
router.get('/leaderboard', SocialController.leaderboard);

// Rating
router.post('/rate/:profileId', authenticateToken, SocialController.rateUser);

export default router;
