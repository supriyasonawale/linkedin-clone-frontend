import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Profile({ user, setUser }) {
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) setBio(user.bio || '');
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login');

    const form = new FormData();
    form.append('bio', bio);
    if (avatarFile) form.append('avatar', avatarFile);

    try {
      const { data } = await api.put('/users/me', form);
      setUser(data);
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  if (!user) return <div className="text-center mt-10">Please login to view your profile</div>;

  // Base URL fallback if VITE_API_URL is undefined
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <div className="mb-6 flex flex-col items-center">
        {user.avatarUrl ? (
          <img
            src={`${apiUrl.replace('/api', '')}${user.avatarUrl}`}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover mb-3"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-500">
            No Avatar
          </div>
        )}
        <div className="text-lg font-semibold">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>

      <form onSubmit={saveProfile} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            className="w-full border rounded-md p-2 resize-none"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Update Avatar</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
        </div>

        <button type="submit" className="btn w-full mt-2">
          Save Profile
        </button>
      </form>
    </div>
  );
}
