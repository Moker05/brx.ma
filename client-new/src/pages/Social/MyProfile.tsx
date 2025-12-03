import React, { useState } from 'react';
import { useUserProfile } from '../../hooks/useSocial';
import { socialAPI } from '../../services/socialAPI';
import { useAuth } from '../../context/AuthContext';

export function MyProfile() {
  const { user } = useAuth();
  const userId = user?.id;
  const { data: profile, isLoading } = useUserProfile(userId || '');
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatar, setAvatar] = useState(profile?.avatar || '');

  if (isLoading) return <div>Chargement...</div>;

  const save = async () => {
    await socialAPI.updateMyProfile({ displayName, bio, avatar });
    // Ideally invalidate query, but keep simple — user will see updated values after reload
    alert('Profil mis à jour');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <div className="card p-4 mb-4">
        <label className="label">Display name</label>
        <input className="input input-bordered" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <label className="label mt-2">Bio</label>
        <textarea className="textarea textarea-bordered" value={bio} onChange={(e) => setBio(e.target.value)} />
        <label className="label mt-2">Avatar URL</label>
        <input className="input input-bordered" value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        <div className="mt-3">
          <button className="btn btn-primary" onClick={save}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
