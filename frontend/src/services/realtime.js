// src/services/realtime.js
// Lightweight cross-tab realtime using BroadcastChannel; replace with WebSocket later

const CHANNEL_NAME = 'leaderboard-updates';

export function createRealtime() {
  let channel;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (_) {
    channel = null; // unsupported environment
  }

  const listeners = new Set();

  if (channel) {
    channel.onmessage = (ev) => {
      const message = ev?.data;
      if (!message || typeof message.type !== 'string') return;
      listeners.forEach((fn) => fn(message));
    };
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    broadcast(message) {
      if (!channel) return;
      channel.postMessage(message);
    },
    close() {
      try { channel?.close?.(); } catch (_) {}
      listeners.clear();
    },
  };
}


