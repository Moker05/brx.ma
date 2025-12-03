import axios from 'axios';

const API_URL = 'http://localhost:5000/api/social';

export interface Post {
  id: string;
  userId: string;
  user?: any;
  symbol: string;
  assetType: string;
  content: string;
  sentiment?: string;
  targetPrice?: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLikedByMe?: boolean;
}

export interface UserProfile {
  id: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  tier: string;
  rating: number;
  totalPnL: number;
  winRate: number;
  followersCount: number;
  followingCount: number;
  verified: boolean;
  isFollowedByMe?: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  profile: UserProfile;
  rank: number;
}

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('brx_token')}` });

export const socialAPI = {
  // Posts
  createPost: async (data: { symbol: string; assetType: string; content: string; sentiment?: string; targetPrice?: number }) => {
    const response = await axios.post(`${API_URL}/posts`, data, { headers: authHeader() });
    return response.data.data || response.data;
  },

  getPostsBySymbol: async (symbol: string, page = 1) => {
    const q = symbol ? `?symbol=${encodeURIComponent(symbol)}&page=${page}` : `?page=${page}`;
    const response = await axios.get(`${API_URL}/posts${q}`);
    return response.data.data || response.data;
  },

  likePost: async (postId: string) => {
    const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, { headers: authHeader() });
    return response.data.data || response.data;
  },

  // Comments
  createComment: async (postId: string, content: string, parentId?: string) => {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content, parentId }, { headers: authHeader() });
    return response.data.data || response.data;
  },

  // Profile
  getUserProfile: async (userId: string) => {
    const response = await axios.get(`${API_URL}/profiles/${userId}`);
    return response.data.data || response.data;
  },

  updateMyProfile: async (data: { displayName?: string; bio?: string; avatar?: string }) => {
    const response = await axios.put(`${API_URL}/profiles`, data, { headers: authHeader() });
    return response.data.data || response.data;
  },

  followUser: async (profileId: string) => {
    const response = await axios.post(`${API_URL}/follow/${profileId}`, {}, { headers: authHeader() });
    return response.data.data || response.data;
  },

  // Leaderboard
  getLeaderboard: async (period = 'month', limit = 50) => {
    const response = await axios.get(`${API_URL}/leaderboard?period=${period}&limit=${limit}`);
    return response.data.data || response.data;
  },

  rateUser: async (profileId: string, rating: number, comment?: string) => {
    const response = await axios.post(`${API_URL}/rate/${profileId}`, { rating, comment }, { headers: authHeader() });
    return response.data.data || response.data;
  },
};
