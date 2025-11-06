import React, { useEffect, useState } from 'react';
import api from '../api';
import PostCard from '../components/Postcard';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Feed</h1>
      {posts.map(p => (
        <PostCard key={p._id} post={p} currentUser={user} refresh={load} />
      ))}
    </div>
  );
}
