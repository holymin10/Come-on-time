// src/components/FlightSelection.js

import React from 'react';

const FlightSelection = ({ flights, onSelectFlight, selectedFlight }) => {
  return (
    <div>
      <h2>Select a Flight</h2>
      <ul>
        {flights.map((flight, index) => (
          <li
            key={index}
            onClick={() => onSelectFlight(flight)}
            style={{
              opacity: flight === selectedFlight ? 0.5 : 1,  // Make the selected flight transparent
              backgroundColor: flight === selectedFlight ? '#D6D6D6' : '#5346d9',  // Change background for selected flight
            }}
          >
            {flight}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightSelection;
