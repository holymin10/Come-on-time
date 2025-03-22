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
    "Delta Airlines": ["DL 100", "DL 200", "DL 300", "DL 400", "DL 500", "DL 600", "DL 700", "DL 800"], // More flights added
    "Korean Airlines": ["KE 500", "KE 600", "KE 700", "KE 800", "KE 900", "KE 1000", "KE 1100", "KE 1200"], // More flights added
    "American Airlines": ["AA 800", "AA 900", "AA 1000", "AA 1100", "AA 1200", "AA 1300", "AA 1400", "AA 1500"], // More flights added
    "United Airlines": ["UA 100", "UA 200", "UA 300", "UA 400", "UA 500", "UA 600", "UA 700", "UA 800"], // More flights added
    "British Airways": ["BA 100", "BA 200", "BA 300", "BA 400", "BA 500", "BA 600", "BA 700", "BA 800"], // More flights added
    "Lufthansa": ["LH 100", "LH 200", "LH 300", "LH 400", "LH 500", "LH 600", "LH 700", "LH 800"], // More flights added
    "Air France": ["AF 100", "AF 200", "AF 300", "AF 400", "AF 500", "AF 600", "AF 700", "AF 800"], // More flights added
    "Emirates": ["EK 100", "EK 200", "EK 300", "EK 400", "EK 500", "EK 600", "EK 700", "EK 800"], // More flights added
    // Add more airlines with flights as needed...
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
            <div className="passenger-list-container">
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
