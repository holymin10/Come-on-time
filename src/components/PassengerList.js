import React, { useState } from 'react';

const PassengerList = ({ passengers, onBackClick, selectedFlight }) => {
  // Create state to track updated boarding statuses
  const [boardingStatuses, setBoardingStatuses] = useState(
    passengers.map(passenger => passenger['Boarding Status'])
  );
  
  // Loading state for announce button
  const [announcingPassenger, setAnnouncingPassenger] = useState(null);

  // Handle announce (play audio message)
  const handleAnnounce = async (fullName, passenger) => {
    try {
      setAnnouncingPassenger(fullName);
      
      // Determine language and message based on nationality
      let message;
      let lang;
      
      if (passenger['Nationality'] === "China") {
        message = `${fullName}, 飞机即将起飞。请尽快办理登机手续。`;
        lang = 'zh-CN';
      } else if (passenger['Nationality'] === "Mexico") {
        message = `${fullName}, el avión saldrá pronto. Por favor, apresúrese a realizar el check-in.`;
        lang = 'es-ES';
      } else {
        message = `${fullName}, the plane is about to depart. Please hurry to check in.`;
        lang = 'en-US';
      }
      
      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = lang;
      
      // Play the announcement
      utterance.onend = () => {
        setAnnouncingPassenger(null);
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error(`Error announcing for ${fullName}:`, error);
      setAnnouncingPassenger(null);
    }
  };

  // Handle update (changing boarding status from Off to On)
  const handleUpdate = (index) => {
    const newBoardingStatuses = [...boardingStatuses];
    newBoardingStatuses[index] = 'On';
    setBoardingStatuses(newBoardingStatuses);
  };

  return (
    <div className="passenger-list">
      <div className="flight-info-header">
        <h3>Flight: {selectedFlight}</h3>
      </div>
      
      <table className="passenger-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Nationality</th>
            <th>Flight</th>
            <th>Status</th>
            <th>Action</th>
            <th>Update</th>
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
                  <span className="status-on">✓</span>
                ) : (
                  <span className="status-off">✗</span>
                )}
              </td>
              <td>
                {boardingStatuses[index] !== 'On' && (
                  <button 
                    className="announce-btn"
                    onClick={() => handleAnnounce(passenger['Full Name'], passenger)}
                    disabled={announcingPassenger === passenger['Full Name']}
                  >
                    {announcingPassenger === passenger['Full Name'] ? 'Announcing...' : 'Announce'}
                  </button>
                )}
              </td>
              <td>
                {boardingStatuses[index] !== 'On' && (
                  <button 
                    className="cancel-btn" 
                    onClick={() => handleUpdate(index)}
                  >
                    Arrived
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