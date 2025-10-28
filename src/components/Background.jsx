import React, { useState, useEffect } from 'react';

// The faint hexagon SVG pattern
const svgPattern =
  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='23' viewBox='0 0 20 23'%3e%3cpath d='M10 0 L20 5.75 L20 17.25 L10 23 L0 17.25 L0 5.75 Z' fill='%231F2937' fill-opacity='0.03'/%3e%3c/svg%3e\")";

export const Background = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Create the dynamic radial gradient
  const radialGradient = `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(90, 20, 37, 0.15), transparent 80%)`;

  const backgroundStyle = {
    // Set the static background color
    backgroundColor: '#F3F4F6',
    // Layer the dynamic gradient ON TOP of the static pattern
    backgroundImage: `${radialGradient}, ${svgPattern}`,
  };

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-300 pointer-events-none"
      style={backgroundStyle}
    />
  );
};