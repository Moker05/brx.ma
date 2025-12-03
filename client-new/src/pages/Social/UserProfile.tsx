import React from 'react';
import { useParams } from 'react-router-dom';
import { useUserProfile } from '../../hooks/useSocial';
import { UserAvatar } from '../../components/social/UserAvatar';
import { TierBadge } from '../../components/social/TierBadge';

export function UserProfile() {
  const { userId } = useParams();
  const { data: profile, isLoading } = useUserProfile(userId || '');

  if (isLoading) return <div>Chargement...</div>;
  if (!profile) return <div>Profil introuvable</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <UserAvatar name={profile.displayName || 'User'} avatar={profile.avatar} size="lg" verified={profile.verified} />
        <div>
          <h2 className="text-2xl font-bold">{profile.displayName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <TierBadge tier={profile.tier} />
            <div className="text-sm">⭐ {profile.rating}</div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h3 className="font-semibold">Bio</h3>
        <p className="text-sm text-base-content/70 mt-2">{profile.bio}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <h4 className="font-semibold">Stats</h4>
          <div className="mt-2 text-sm">PNL total: {profile.totalPnL}</div>
          <div className="mt-1 text-sm">Win rate: {profile.winRate}%</div>
          <div className="mt-1 text-sm">Followers: {profile.followersCount}</div>
        </div>

        <div className="card p-4 md:col-span-2">
          <h4 className="font-semibold">Posts</h4>
          <div className="mt-2 text-sm">Liste des posts de l'utilisateur (non implémenté: nécessite endpoint paginé)</div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
