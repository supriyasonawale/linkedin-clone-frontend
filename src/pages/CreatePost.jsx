import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreatePost({ user }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // new state for preview
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file)); // generate preview URL
    } else {
      setPreviewUrl(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { 
      alert('Login first'); 
      navigate('/login'); 
      return; 
    }

    const form = new FormData();
    form.append('text', text);
    if (image) form.append('image', image);

    try {
      await api.post('/posts', form);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="card max-w-lg mx-auto mt-5 p-4">
      <h2 className="text-lg font-semibold mb-3">Create Post</h2>
      <form onSubmit={submit} className="space-y-3">
        <textarea
          className="textarea w-full border rounded-md p-2"
          placeholder="What's on your mind?"
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full max-h-64 object-cover rounded-md"
            />
          )}
        </div>

        <button type="submit" className="btn w-full mt-2">Post</button>
      </form>
    </div>
  );
}
