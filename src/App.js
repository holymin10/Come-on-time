import React, { useState, useEffect } from 'react';
import AirlineSelection from './components/AirlineSelection';
import FlightSelection from './components/FlightSelection';
import PassengerList from './components/PassengerList';
import * as XLSX from 'xlsx'; // Importing XLSX library
import './App.css'; // Styling

const App = () => {
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flights, setFlights] = useState({
    "Delta Airlines": ["DL 100", "DL 200", "DL 300", "DL 400", "DL 500"],
    "Korean Airlines": ["KE 500", "KE 600", "KE 700", "KE 800", "KE 900"],
    "American Airlines": ["AA 800", "AA 900", "AA 1000", "AA 1100", "AA 1200"],
    "United Airlines": ["UA 100", "UA 200", "UA 300", "UA 400", "UA 500"],
    // Add other airlines...
  });

  const [passengers, setPassengers] = useState([]);
  const [filteredPassengers, setFilteredPassengers] = useState([]); // Store filtered passengers
  const [airlineSearchTerm, setAirlineSearchTerm] = useState(""); // Search term for airline filtering

  useEffect(() => {
    fetchExcelFile();
  }, []);

  const fetchExcelFile = async () => {
    try {
      console.log("Fetching Excel file...");

      const response = await fetch('/sample_passenger_data1.xlsx'); // Update path if necessary
      if (!response.ok) {
        throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
      }

      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      console.log("Fetched Excel data:", jsonData);
      setPassengers(jsonData);
    } catch (error) {
      console.error("Error fetching or reading Excel file:", error);
    }
  };

  const handleAirlineSelection = (airline) => {
    setSelectedAirline(airline);
    setSelectedFlight(null);
    setFilteredPassengers([]);
  };

  const handleFlightSelection = (flight) => {
    setSelectedFlight(flight);
    console.log('Selected flight:', flight);

    if (passengers.length > 0) {
      filterPassengers(flight);
    } else {
      console.log("Data is still loading, cannot filter passengers yet.");
    }
  };

  const normalizeFlightNumber = (flightNumber) => {
    if (flightNumber && flightNumber.trim) {
      const normalized = flightNumber.trim().replace(/\s+/g, '').toUpperCase();
      console.log(`Normalized flight number: '${normalized}'`);
      return normalized;
    }
    return '';
  };
  
  const filterPassengers = (flight) => {
    console.log("Passenger flight numbers:");
    passengers.forEach((passenger) => {
      console.log(`Flight Number: '${passenger['Flight Number']}'`); // Log individual flight numbers
    });
  
    const selectedFlightNormalized = normalizeFlightNumber(selectedFlight);
    console.log(`Selected flight normalized: '${selectedFlightNormalized}'`);
  
    if (!selectedFlightNormalized) {
      console.error('Selected flight is empty or invalid.');
      return; // Exit early if the selected flight is invalid
    }
  
    const filtered = passengers.filter((passenger) => {
      const flightNumber = normalizeFlightNumber(passenger['Flight Number']); // Normalize the flight number
      console.log(`Comparing: '${flightNumber}' with '${selectedFlightNormalized}'`);
  
      // Check if the flight number matches the selected flight
      const isMatch = flightNumber === selectedFlightNormalized;
      console.log(`Match result: ${isMatch}`);
      return isMatch;
    });
  
    console.log('Filtered passengers:', filtered);
    setFilteredPassengers(filtered);
  };
  
  const handleSearchChange = (event) => {
    setAirlineSearchTerm(event.target.value);
  };

  const filteredAirlines = Object.keys(flights).filter((airline) =>
    airline.toLowerCase().includes(airlineSearchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      {!selectedAirline ? (
        <div className="airline-selection-container">
          <input
            type="text"
            placeholder="Search for an airline..."
            value={airlineSearchTerm}
            onChange={handleSearchChange}
            className="airline-search-bar"
          />
          <AirlineSelection
            airlines={filteredAirlines}
            onSelectAirline={handleAirlineSelection}
          />
        </div>
      ) : (
        <div className="flight-selection-container">
          <button className="back-button" onClick={() => setSelectedAirline(null)}>
            Back to Airlines
          </button>

          <FlightSelection
            flights={flights[selectedAirline]}
            onSelectFlight={handleFlightSelection}
            selectedFlight={selectedFlight}
          />
          {selectedFlight && (
            <div className="passenger-list-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredPassengers.length > 0 ? (
                <PassengerList passengers={filteredPassengers} /> // Now handles boarding status internally
              ) : (
                <p>No passengers found for this flight.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
