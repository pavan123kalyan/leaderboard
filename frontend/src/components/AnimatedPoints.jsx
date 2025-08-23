// src/components/AnimatedPoints.jsx
import React, { useEffect, useState } from 'react';

const AnimatedPoints = ({ points }) => {
  const [displayedPoints, setDisplayedPoints] = useState(0);

  useEffect(() => {
    if (points > 0) {
      const interval = 20; // Time in ms between each number increment
      const increment = Math.ceil(points / (300 / interval)); // Adjust increment size for a 300ms duration

      let currentPoints = 0;
      const timer = setInterval(() => {
        currentPoints += increment;
        if (currentPoints >= points) {
          setDisplayedPoints(points);
          clearInterval(timer);
        } else {
          setDisplayedPoints(currentPoints);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [points]);

  return (
    <div className="text-xl font-bold text-green-500 transition-all duration-300 transform scale-105">
      +{displayedPoints}
    </div>
  );
};

export default AnimatedPoints;