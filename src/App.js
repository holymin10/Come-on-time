import React, { useState, useEffect } from 'react';
import AirlineSelection from './components/AirlineSelection';
import FlightSelection from './components/FlightSelection';
import PassengerList from './components/PassengerList';
import * as XLSX from 'xlsx';
import './App.css';

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
  const [filteredPassengers, setFilteredPassengers] = useState([]);
  const [airlineSearchTerm, setAirlineSearchTerm] = useState('');

  // Fetch the Excel file only once
  useEffect(() => {
    if (passengers.length === 0) {
      fetchExcelFile();
    }
  }, [passengers]);

  const fetchExcelFile = async () => {
    try {
      console.log("Fetching Excel file...");
      const response = await fetch('/sample_passenger_data1.xlsx'); // Ensure correct path to the file
      if (!response.ok) throw new Error(`Failed to fetch Excel file: ${response.statusText}`);

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
    console.log('Selected flight:', flight);

    const normalizedFlight = normalizeFlightNumber(flight);
    if (!normalizedFlight) return; // Exit early if invalid flight number

    setSelectedFlight(normalizedFlight);
    console.log(`Selected flight normalized: ${normalizedFlight}`);

    if (passengers.length > 0) {
      filterPassengers(normalizedFlight);
    } else {
      console.log("Data is still loading, cannot filter passengers yet.");
    }
  };

  // Normalize flight number (remove spaces and make uppercase)
  const normalizeFlightNumber = (flightNumber) => {
    const normalized = flightNumber?.trim().replace(/\s+/g, '').toUpperCase();
    console.log(`Normalized flight number: '${normalized}'`);
    return normalized;
  };

  const filterPassengers = (flight) => {
    console.log("Filtering passengers...");

    const selectedFlightNormalized = normalizeFlightNumber(flight);
    if (!selectedFlightNormalized) {
      console.error('Selected flight is empty or invalid.');
      return;
    }

    const filtered = passengers.filter((passenger) => {
      const flightNumber = normalizeFlightNumber(passenger['Flight Number']);
      return flightNumber === selectedFlightNormalized;
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
                <PassengerList passengers={filteredPassengers} />
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
