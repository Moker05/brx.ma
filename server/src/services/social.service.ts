import { prisma } from '../utils/prisma';

interface CreatePostDTO {
  symbol: string;
  assetType: string;
  content: string;
  sentiment?: string;
  targetPrice?: number;
}

export const SocialService = {
  async ensureProfileForUser(userId: string) {
    let profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await prisma.userProfile.create({ data: { userId } });
    }
    return profile;
  },

  async createPost(userId: string, dto: CreatePostDTO) {
    const profile = await this.ensureProfileForUser(userId);
    const post = await prisma.post.create({
      data: {
        userId: profile.id,
        symbol: dto.symbol,
        assetType: dto.assetType,
        content: dto.content,
        sentiment: dto.sentiment,
        targetPrice: dto.targetPrice,
      },
    });
    return post;
  },

  async getPostsBySymbol(symbol?: string, page = 1, limit = 20) {
    const where = symbol ? { symbol } : {};
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, displayName: true, avatar: true, tier: true },
        },
      },
    });
    return posts;
  },

  async likePost(userId: string, postId: string) {
    const profile = await this.ensureProfileForUser(userId);
    // Check existing like
    const existing = await prisma.like.findFirst({ where: { userId: profile.id, postId } });
    if (existing) return { alreadyLiked: true };

    await prisma.like.create({ data: { userId: profile.id, postId } });
    const post = await prisma.post.update({ where: { id: postId }, data: { likesCount: { increment: 1 } } });
    return post;
  },

  async createComment(userId: string, postId: string, content: string, parentId?: string) {
    const profile = await this.ensureProfileForUser(userId);
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: profile.id,
        content,
        parentId,
      },
    });
    await prisma.post.update({ where: { id: postId }, data: { commentsCount: { increment: 1 } } });
    return comment;
  },

  async likeComment(userId: string, commentId: string) {
    const profile = await this.ensureProfileForUser(userId);
    const existing = await prisma.like.findFirst({ where: { userId: profile.id, commentId } });
    if (existing) return { alreadyLiked: true };
    await prisma.like.create({ data: { userId: profile.id, commentId } });
    const comment = await prisma.comment.update({ where: { id: commentId }, data: { likesCount: { increment: 1 } } });
    return comment;
  },

  async getUserProfileByUserId(userId: string) {
    const profile = await prisma.userProfile.findUnique({ where: { userId }, include: { posts: true, followers: true, following: true } });
    return profile;
  },

  async updateProfile(userId: string, data: Partial<{ displayName: string; bio: string; avatar: string; isPublic: boolean }>) {
    const profile = await prisma.userProfile.update({ where: { userId }, data });
    return profile;
  },

  async followUser(followerUserId: string, followingProfileId: string) {
    const followerProfile = await this.ensureProfileForUser(followerUserId);
    if (followerProfile.id === followingProfileId) throw new Error('Cannot follow yourself');

    const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: followerProfile.id, followingId: followingProfileId } } }).catch(() => null);
    if (existing) return { alreadyFollowing: true };

    await prisma.follow.create({ data: { followerId: followerProfile.id, followingId: followingProfileId } });
    await prisma.userProfile.update({ where: { id: followingProfileId }, data: { followersCount: { increment: 1 } } });
    await prisma.userProfile.update({ where: { id: followerProfile.id }, data: { followingCount: { increment: 1 } } });
    return { success: true };
  },

  async getLeaderboard(limit = 20) {
    const list = await prisma.userProfile.findMany({
      orderBy: [{ followersCount: 'desc' }, { rating: 'desc' }],
      take: limit,
      select: { id: true, userId: true, displayName: true, avatar: true, followersCount: true, rating: true, tier: true },
    });
    return list;
  },

  async rateUser(raterUserId: string, ratedProfileId: string, rating: number, comment?: string) {
    // Create rating
    await prisma.userRating.create({ data: { raterId: raterUserId, ratedId: ratedProfileId, rating: Math.max(1, Math.min(5, Math.round(rating))), comment } });

    // Recompute aggregate
    const agg = await prisma.userRating.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: { ratedId: ratedProfileId },
    });

    const newAvg = agg._avg.rating ?? 0;
    const count = agg._count.rating ?? 0;

    const updated = await prisma.userProfile.update({ where: { id: ratedProfileId }, data: { rating: newAvg, ratingCount: count } });
    return updated;
  },
};

export default SocialService;
