import React from 'react';

// 1. Define and export the VegIcon
export const VegIcon = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline-block', verticalAlign: 'middle' }} // Helps with alignment
  >
    <rect 
      x="2" 
      y="2" 
      width="20" 
      height="20" 
      rx="2" 
      stroke="#008000" // Green
      strokeWidth="2"
    />
    <circle 
      cx="12" 
      cy="12" 
      r="6" 
      fill="#008000" // Green
    />
  </svg>
);

// 2. Define and export the NonVegIcon
export const NonVegIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {/* Outer square */}
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="2"
      stroke="#DA251D" // Red border
      strokeWidth="2"
    />
    {/* Inner circle (replaces the polygon) */}
    <circle
      cx="12" // Center X-coordinate
      cy="12" // Center Y-coordinate
      r="6"  // Radius of the circle (adjust as needed for size)
      fill="#DA251D" // Red fill
    />
  </svg>
);