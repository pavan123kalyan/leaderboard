// src/services/api.js

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://3w-business-backend.onrender.com/api' 
  : 'http://localhost:5000/api';

export async function claimPoints(userId) {
  // Make a POST request to your backend's claim endpoint
  const res = await fetch(`${BASE_URL}/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  });
  
  if (!res.ok) {
    throw new Error('Failed to claim points');
  }
  
  return res.json();
}

export async function fetchUsers() {
    // Make a GET request to get all users from the database
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return res.json();
}

export async function fetchHistory() {
    // Make a GET request to get the claim history
    const res = await fetch(`${BASE_URL}/history`);
    if (!res.ok) {
        throw new Error('Failed to fetch history');
    }
    return res.json();
}

export async function createUser(userData) {
  // Endpoint to create a new user
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    throw new Error('Failed to create user');
  }

  return res.json();
}
