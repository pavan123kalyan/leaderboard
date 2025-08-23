// src/App.jsx

import React, { useEffect, useMemo, useState } from 'react';
import Leaderboard from './components/Leaderboard';
import ClaimPoints from './components/ClaimPoints';
import History from './components/History';
import AnimatedPoints from './components/AnimatedPoints';
import { claimPoints as apiClaimPoints, fetchUsers, fetchHistory, createUser } from './services/api';
import { createRealtime } from './services/realtime';

// Remove the initialUsers data since it is now stored in MongoDB.
// We will now fetch this data from the backend.

function App() {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [realtime] = useState(() => createRealtime());
  const [awardedPoints, setAwardedPoints] = useState(0);

  // Effect to fetch initial data and subscribe to real-time updates
  useEffect(() => {
    // Fetch initial data from the backend
    const getInitialData = async () => {
        try {
            const usersData = await fetchUsers();
            const historyData = await fetchHistory();
            setUsers(usersData);
            setHistory(historyData);
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };
    getInitialData();

    // Subscribe to real-time updates from other tabs/clients
    const unsubscribe = realtime.subscribe((msg) => {
      if (msg.type === 'user_points_updated') {
        const { userId, awardedPoints: newPoints, timestamp } = msg.payload;
        // Update state based on the broadcast message
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, totalPoints: u.totalPoints + newPoints } : u)));
        setHistory((prev) => [
          { _id: `${Date.now()}-${userId}`, userId, awardedPoints: newPoints, timestamp },
          ...prev,
        ]);
      }
    });
    return () => unsubscribe();
  }, [realtime]);

  // Handler to add a new user to the list
  const handleAddUser = async (newUser) => {
    try {
      // Create user in the backend
      const createdUser = await createUser(newUser);
      
      // Update local state with the created user
      setUsers((prev) => [...prev, createdUser]);
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  const handleClaim = async (userId) => {
    try {
      // Pass the userId (which is the MongoDB _id) to the API
      const result = await apiClaimPoints(userId);
      const awarded = Number(result.awardedPoints) || 0;

      setAwardedPoints(0);
      setTimeout(() => {
        setAwardedPoints(awarded);
      }, 10);

      // The key is to match on the correct _id from the result
      setUsers((prev) => prev.map((u) => (u._id === result.user._id ? { ...u, totalPoints: u.totalPoints + awarded } : u)));
      
      // The history entry needs to use the correct _id and name
      setHistory((prev) => [
        { _id: `${Date.now()}-${result.user._id}`, userId: result.user._id, awardedPoints: awarded, timestamp: result.timestamp },
        ...prev,
      ]);

      realtime.broadcast({
        type: 'user_points_updated',
        payload: { userId: result.user._id, awardedPoints: awarded, timestamp: result.timestamp },
      });

      return awarded;
    } catch (error) {
      console.error("Error claiming points:", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 min-h-screen p-4 font-sans text-white flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Dynamic Leaderboard</h1>
        <p className="text-indigo-200 mt-2 text-sm sm:text-base">Claim your spot on the top!</p>
      </header>
      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-8">
        <div className="space-y-6">
          <ClaimPoints users={users} onAddUser={handleAddUser} onClaim={handleClaim} />
          {awardedPoints > 0 && (
            <div className="text-center">
              <p className="text-lg text-white">You claimed:</p>
              <AnimatedPoints key={awardedPoints} points={awardedPoints} />
            </div>
          )}
          <History history={history} usersById={Object.fromEntries(users.map(u => [u._id, u]))} />
        </div>
        <Leaderboard users={users} />
      </main>
    </div>
  );
}

export default App;
