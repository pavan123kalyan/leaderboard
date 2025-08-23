// src/components/History.jsx

import React from 'react';

const History = ({ history, usersById }) => {
  if (!history?.length) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-full text-gray-800">
        <h2 className="text-2xl font-bold text-purple-600 mb-2">Recent Claims</h2>
        <p className="text-gray-500">No claims yet.</p>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl w-full text-gray-800">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Recent Claims</h2>
      <ul className="space-y-3">
                {history.slice(0, 10).map((h) => {
          // Check if userId is populated (has user data) or just an ID
          const userName = h.userId?.name || usersById[h.userId]?.name || 'Unknown';
          const userProfilePic = h.userId?.profilePic || usersById[h.userId]?.profilePic || 'https://placehold.co/100x100/6B46C1/FFFFFF?text=U';
          
          return (
            <li key={h._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-300">
                  <img src={userProfilePic} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <span className="font-medium">{userName}</span>
              </div>
              <div className="text-sm text-gray-600">
                +{h.awardedPoints} pts · {new Date(h.timestamp).toLocaleTimeString()}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default History;
