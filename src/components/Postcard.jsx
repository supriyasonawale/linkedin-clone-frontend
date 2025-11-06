import React, { useState } from 'react';
import api from '../api';
import CommentList from './CommentList';

export default function PostCard({ post, currentUser, refresh }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(post?.text || '');
  const [commentText, setCommentText] = useState('');

  // Toggle like
  const toggleLike = async () => {
    await api.post(`/posts/${post._id}/like`);
    refresh();
  };

  // Submit comment
  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText) return;
    await api.post(`/posts/${post._id}/comment`, { text: commentText });
    setCommentText('');
    refresh();
  };

  // Save edit
  const saveEdit = async () => {
    const form = new FormData();
    form.append('text', text);
    await api.put(`/posts/${post._id}`, form);
    setEditing(false);
    refresh();
  };

  // Delete post
  const deletePost = async () => {
    if (!confirm('Delete post?')) return;
    await api.delete(`/posts/${post._id}`);
    refresh();
  };

  // Safe check for likes
  const liked = post?.likes?.find(l => l === (currentUser?.id || currentUser?._id));

  // Safe URL for image
  const imageUrl = post?.imageUrl
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`.replace('/api','') + post.imageUrl
    : null;

  return (
    <div className="card bg-white p-4 rounded shadow mb-4">
      {/* Header: username + timestamp + edit/delete */}
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{post?.userName || 'Unknown User'}</div>
          <div className="text-gray-500 text-sm">
            {post?.createdAt ? new Date(post.createdAt).toLocaleString() : ''}
          </div>
        </div>
        {currentUser && post?.userId === (currentUser?.id || currentUser?._id) && (
          <div className="flex gap-2">
            <button className="text-gray-600 text-sm" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button className="text-red-500 text-sm" onClick={deletePost}>Delete</button>
          </div>
        )}
      </div>

      {/* Post content */}
      {editing ? (
        <>
          <textarea
            className="textarea mt-3 w-full border rounded p-2"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={saveEdit}>Save</button>
            <button className="bg-gray-200 px-4 py-1 rounded" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-3 whitespace-pre-wrap">{text}</div>

          {/* Image display */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="post"
              className="mt-3 rounded-md max-w-full object-cover"
              onError={e => e.style.display = 'none'} // safe fallback
            />
          )}

          {/* Like / comments summary */}
          <div className="flex items-center gap-3 mt-3">
            <button className="text-blue-600 font-semibold" onClick={toggleLike}>
              {liked ? 'Unlike' : 'Like'} ({post?.likes?.length || 0})
            </button>
            <div className="text-gray-500 text-sm">{post?.comments?.length || 0} comments</div>
          </div>

          {/* Comment list */}
          <CommentList comments={post?.comments || []} />

          {/* Add comment */}
          {currentUser && (
            <form onSubmit={submitComment} className="mt-3 flex gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Write a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-4 py-1 rounded">Comment</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
