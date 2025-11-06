import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const goProfile = () => {
    if (user) navigate('/profile');
    else navigate('/login'); // safety if somehow user is null
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="container flex-between py-3">
        <Link to="/" className="text-2xl font-bold text-blue-600">LinkedMini</Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="text-sm text-gray-700">Hello, {user.name}</div>
              <Link to="/create" className="btn">Create Post</Link>
              <button onClick={goProfile} className="btn-ghost">Profile</button>
              <button onClick={logout} className="btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/signup" className="btn-ghost">Signup</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
