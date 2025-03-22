import React from 'react';

const AirlineSelection = ({ airlines, onSelectAirline }) => {
  return (
    <div>
      <h2>Select Your Airline</h2>
      <ul>
        {airlines.map((airline, index) => (
          <li key={index} onClick={() => onSelectAirline(airline)}>
            {airline}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AirlineSelection;
