// src/components/UserCard.jsx

import React from 'react';
import { motion } from 'framer-motion';

const UserCard = ({ user, index }) => {
  const rank = index + 1;

  return (
    <motion.div
      key={user._id} // Use the correct MongoDB _id
      layout // This is the magic prop for animating position changes
      initial={{ opacity: 0, y: 50 }} // Initial state for new items
      animate={{ opacity: 1, y: 0 }} // Animation for new items
      transition={{ duration: 0.5 }} // How long the animation takes
      className="flex items-center justify-between p-4 rounded-xl bg-gray-100 shadow-md transform transition-all duration-700 ease-in-out hover:scale-[1.02] cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <span className="text-xl font-extrabold text-purple-600 w-8 text-center">{rank}</span>
        {/* Profile picture using an img tag */}
        <div className="w-10 h-10 rounded-full border-2 border-purple-400 overflow-hidden">
          <img src={user.profilePic} alt={`${user.name}'s profile`} className="w-full h-full object-cover" />
        </div>
        <span className="text-lg font-semibold text-gray-800 truncate">{user.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-gray-800">{user.totalPoints}</span>
        <span className="text-yellow-500">🔥</span>
      </div>
    </motion.div>
  );
};

export default UserCard;
