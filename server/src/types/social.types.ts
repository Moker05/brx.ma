export enum Sentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL',
}

export enum AssetType {
  STOCK = 'STOCK',
  CRYPTO = 'CRYPTO',
  OPCVM = 'OPCVM',
}

export enum UserTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

export interface CreatePostDTO {
  symbol: string;
  assetType: AssetType;
  content: string;
  sentiment?: Sentiment;
  targetPrice?: number;
}

export interface CreateCommentDTO {
  postId: string;
  content: string;
  parentId?: string;
}

export interface UpdateProfileDTO {
  displayName?: string;
  bio?: string;
  avatar?: string;
  isPublic?: boolean;
}

export interface LeaderboardQuery {
  period?: 'week' | 'month' | 'year' | 'all';
  limit?: number;
  tier?: UserTier;
}

export interface RateUserDTO {
  rating: number;
  comment?: string;
}

export default {};
