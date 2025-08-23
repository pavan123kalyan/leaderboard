// src/components/Leaderboard.jsx

import React from 'react';
import UserCard from './UserCard';
import { AnimatePresence, motion } from 'framer-motion';

const Leaderboard = ({ users }) => {
  const [filter, setFilter] = React.useState('');
  if (!users || !Array.isArray(users)) {
    return <div>Loading users...</div>;
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(filter.trim().toLowerCase())
  );
  const sortedUsers = [...filtered]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl w-full text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-purple-600">Top Rankings</h2>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name"
          className="p-2 border-2 border-purple-200 rounded-lg w-48 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Top 3 Section */}
      <div className="relative grid grid-cols-3 gap-4 mb-8 text-center">
        <AnimatePresence>
                              {sortedUsers.slice(0, 3).map((user, index) => (
            <motion.div
              key={user._id}
              layout // The layout prop handles the animation of position changes.
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.1, 
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className={`
                relative flex flex-col items-center p-4 rounded-xl shadow-lg border-2
                cursor-pointer
                ${index === 0 ? 'bg-yellow-300 border-yellow-500' : index === 1 ? 'bg-gray-300 border-gray-500' : 'bg-orange-300 border-orange-500'}
              `}
            >
                            {/* Profile Picture */}
              <motion.div 
                className={`
                  w-20 h-20 rounded-full mb-2 border-2 overflow-hidden
                  ${index === 0 ? 'border-yellow-600' : index === 1 ? 'border-gray-600' : 'border-orange-600'}
                `}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <img src={user.profilePic} alt={`${user.name}'s profile`} className="w-full h-full object-cover" />
              </motion.div>
              
              <span className="text-base font-semibold truncate w-full">{user.name}</span>
              <span className="text-xs text-gray-700 font-bold mt-1">{user.totalPoints} pts</span>
              
                            {/* Rank numbers (1st, 2nd, 3rd) with background styling */}
              <motion.div
                className={`
                  mt-4 text-xl font-extrabold text-white rounded-full
                  flex items-center justify-center
                  w-8 h-8
                  ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-500' : 'bg-orange-500'}
                `}
                whileHover={{ 
                  scale: 1.2,
                  rotate: 360,
                  transition: { type: "spring", stiffness: 500, damping: 8 }
                }}
              >
                {index + 1}
              </motion.div>
            </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Ranked List Section (only ranks 4-10) */}
      <div className="space-y-4">
        <AnimatePresence>
                    {sortedUsers.slice(3).map((user, index) => (
            <UserCard key={user._id} user={user} index={index + 3} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
