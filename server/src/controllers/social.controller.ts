import { Request, Response } from 'express';
import SocialService from '../services/social.service';
import ProfileSyncService from '../services/profileSync.service';

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const { symbol, assetType, content, sentiment, targetPrice } = req.body;
    const post = await SocialService.createPost(userId, { symbol, assetType, content, sentiment, targetPrice });
    res.status(201).json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { symbol, page = '1', limit = '20' } = req.query as any;
    const posts = await SocialService.getPostsBySymbol(symbol, parseInt(page, 10), parseInt(limit, 10));
    res.json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const { id } = req.params;
    const result = await SocialService.likePost(userId, id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const comment = await SocialService.createComment(userId, postId, content, parentId);
    res.status(201).json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const { id } = req.params;
    const result = await SocialService.likeComment(userId, id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // this is the User.id
    const profile = await SocialService.getUserProfileByUserId(userId);
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const payload = req.body;
    const updated = await SocialService.updateProfile(userId, payload);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const { profileId } = req.params; // the UserProfile.id to follow
    const result = await SocialService.followUser(userId, profileId);
    // Sync follower metrics quickly
    await ProfileSyncService.syncProfileMetricsByUserId((req as any).userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const leaderboard = async (_req: Request, res: Response) => {
  try {
    const list = await SocialService.getLeaderboard();
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rateUser = async (req: Request, res: Response) => {
  try {
    const raterId = (req as any).userId as string; // User.id
    const { profileId } = req.params; // UserProfile.id
    const { rating, comment } = req.body;
    const updated = await SocialService.rateUser(raterId, profileId, rating, comment);
    // Re-sync profile metrics
    await ProfileSyncService.syncProfileMetricsByUserId((req as any).userId);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createPost,
  getPosts,
  likePost,
  createComment,
  likeComment,
  getProfile,
  updateProfile,
  followUser,
  leaderboard,
  rateUser,
};
