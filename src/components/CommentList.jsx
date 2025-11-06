import React from 'react';

export default function CommentList({ comments = [] }) {
  return (
    <div className="mt-3">
      {comments.map((c, idx) => (
        <div key={idx} className="border-t border-gray-100 pt-2 mt-2">
          <div className="text-sm font-medium">{c.userName} <span className="small"> • {new Date(c.createdAt).toLocaleString()}</span></div>
          <div className="text-sm">{c.text}</div>
        </div>
      ))}
    </div>
  );
}
