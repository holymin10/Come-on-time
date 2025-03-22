import React, { useState } from 'react';

const PassengerList = ({ passengers, onBackClick, selectedFlight }) => {
  // Create state to track updated boarding statuses
  const [boardingStatuses, setBoardingStatuses] = useState(
    passengers.map(passenger => passenger['Boarding Status'])
  );

  // Handle cancellation (changing boarding status from Off to On)
  const handleCancellation = (index) => {
    const newBoardingStatuses = [...boardingStatuses];
    newBoardingStatuses[index] = 'On';
    setBoardingStatuses(newBoardingStatuses);
  };

  return (
    <div className="passenger-list">
      <button className="back-button passenger-list-back" onClick={onBackClick}>
        Back to Airlines
      </button>
      
      {/* Flight information display */}
      <div className="flight-info-header">
        <h3>Flight: {selectedFlight}</h3>
      </div>
      
      <table className="passenger-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Nationality</th>
            <th>Flight</th>
            <th>Boarding Status</th>
            <th>Action</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger, index) => (
            <tr key={index}>
              <td>{passenger['Full Name']}</td>
              <td>{passenger['Nationality']}</td>
              <td>{passenger['Flight Number'] || selectedFlight}</td>
              <td>
                {boardingStatuses[index] === 'On' ? (
                  <span style={{ color: 'green' }}>✓</span>
                ) : (
                  <span style={{ color: 'red' }}>✗</span>
                )}
              </td>
              <td>
                {boardingStatuses[index] !== 'On' && (
                  <button className="announce-btn">Announce</button>
                )}
              </td>
              <td>
                {boardingStatuses[index] !== 'On' && (
                  <button 
                    className="cancel-btn" 
                    onClick={() => handleCancellation(index)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PassengerList;