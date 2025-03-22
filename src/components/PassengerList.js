import React from 'react';

const PassengerList = ({ passengers }) => {
  return (
    <div className="passenger-list">
      <table className="passenger-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Nationality</th>
            <th>Boarding Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger, index) => (
            <tr key={index}>
              <td>{passenger['Full Name']}</td>
              <td>{passenger['Nationality']}</td>
              <td>
                {passenger['Boarding Status'] === 'On' ? (
                  <span style={{ color: 'green' }}>✔️</span>
                ) : (
                  <span style={{ color: 'red' }}>❌</span>
                )}
              </td>
              <td>
                {passenger['Boarding Status'] !== 'On' && (
                  <button className="announce-btn">Announce</button>
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
