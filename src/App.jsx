import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from './api';
import Header from './components/Header';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile'; // ← correct file

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const { data } = await api.get('/users/me');
        setUser(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        localStorage.removeItem('token');
      }
    };
    load();
  }, []);

  return (
    <div className="body-bg">
      <Header user={user} setUser={setUser} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Feed user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/create" element={<CreatePost user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
}
