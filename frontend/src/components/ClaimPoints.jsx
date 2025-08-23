// src/components/ClaimPoints.jsx
import React, { useMemo, useState } from 'react';

const defaultAvatar = (name) => {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || 'U';
  return `https://placehold.co/100x100/6B46C1/FFFFFF?text=${encodeURIComponent(initial)}`;
};

const ClaimPoints = ({ users, onAddUser, onClaim }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserPoints, setNewUserPoints] = useState('');
  const [lastAwarded, setLastAwarded] = useState(null);

  const isValidNewUser = useMemo(() => {
    const nameOk = newUserName.trim().length > 0;
    const pointsNum = Number(newUserPoints);
    const pointsOk = Number.isFinite(pointsNum) && pointsNum >= 0;
    return nameOk && pointsOk;
  }, [newUserName, newUserPoints]);

  const handleClaim = async () => {
    if (!selectedUser) {
      alert('Please select a user first!');
      return;
    }
    const awarded = await onClaim?.(selectedUser);
    setLastAwarded(awarded ?? null);
  };

  const handleAddUser = () => {
    if (!isValidNewUser) return;
    const userPayload = {
      name: newUserName.trim(),
      totalPoints: Number(newUserPoints) || 0,
      profilePic: defaultAvatar(newUserName),
    };
    onAddUser?.(userPayload);
    setIsAdding(false);
    setNewUserName('');
    setNewUserPoints('');
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl w-full text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-purple-600">Claim Points</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          + Add User
        </button>
      </div>

      {lastAwarded != null && (
        <div className="mt-3 text-center text-sm text-gray-700">
          Awarded <span className="font-bold text-purple-700">{lastAwarded}</span> points!
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <label htmlFor="userSelect" className="sr-only">Select user</label>
        <select
          id="userSelect"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-3 border-2 border-purple-300 rounded-lg w-full sm:w-auto text-lg font-medium text-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors duration-200 bg-white"
        >
          <option value="" disabled className="text-gray-400">Select a user...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id} className="text-gray-900 font-semibold p-2 bg-white border-b border-gray-200">
              {user.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleClaim}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg w-full sm:w-auto transform transition-transform duration-200 hover:scale-105"
        >
          Claim Points
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-gray-800">
            <h3 className="text-2xl font-bold text-purple-600 mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="newUserName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  id="newUserName"
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="newUserPoints" className="block text-sm font-medium text-gray-700 mb-1">Starting Points</label>
                <input
                  id="newUserPoints"
                  type="number"
                  min="0"
                  value={newUserPoints}
                  onChange={(e) => setNewUserPoints(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => { setIsAdding(false); setNewUserName(''); setNewUserPoints(''); }}
                  className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={!isValidNewUser}
                  className={`px-4 py-2 rounded-lg text-white font-semibold ${isValidNewUser ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-300 cursor-not-allowed'}`}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimPoints;

 