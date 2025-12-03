import { prisma } from '../utils/prisma';

export const ProfileSyncService = {
  /**
   * Recompute simple aggregated metrics for a user's profile and update tier
   * This is intentionally conservative — more advanced PnL computation can be added later.
   */
  async syncProfileMetricsByUserId(userId: string) {
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) return null;

    // Followers / following counts
    const followersCount = await prisma.follow.count({ where: { followingId: profile.id } });
    const followingCount = await prisma.follow.count({ where: { followerId: profile.id } });

    // Rating aggregation
    const ratingAgg = await prisma.userRating.aggregate({ _avg: { rating: true }, _count: { rating: true }, where: { ratedId: profile.id } });
    const avgRating = ratingAgg._avg.rating ?? 0;
    const ratingCount = ratingAgg._count.rating ?? 0;

    // Simplified tier calculation based on rating (fallback) and followers
    let tier = 'BRONZE';
    if (avgRating >= 4.5 || followersCount >= 1000) tier = 'DIAMOND';
    else if (avgRating >= 4.0 || followersCount >= 500) tier = 'PLATINUM';
    else if (avgRating >= 3.5 || followersCount >= 200) tier = 'GOLD';
    else if (avgRating >= 3.0 || followersCount >= 50) tier = 'SILVER';

    const updated = await prisma.userProfile.update({ where: { id: profile.id }, data: { followersCount, followingCount, rating: avgRating, ratingCount, tier } });
    return updated;
  },

  async syncAllProfilesBatch(limit = 100) {
    const profiles = await prisma.userProfile.findMany({ take: limit });
    const results = [] as any[];
    for (const p of profiles) {
      // eslint-disable-next-line no-await-in-loop
      const r = await this.syncProfileMetricsByUserId(p.userId);
      results.push(r);
    }
    return results;
  },
};

export default ProfileSyncService;
