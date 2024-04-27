import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button'; // Import Button from Material-UI
import './App.css';

function App() {
  const [transitions, setTransitions] = useState([]);
  const [displayedTransitions, setDisplayedTransitions] = useState([]);
  const [error, setError] = useState('');
  // const [performance, setPerformance] = useState(0);
  // const [totalReward, setTotalReward] = useState(0);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const containerRef3 = useRef(null);

  const runSimulation = () => {
    fetch('http://localhost:5000/run_episode')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setTransitions(data.transitions);
        setError('');
        setDisplayedTransitions([]); // Reset displayed transitions before starting new simulation
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. See console for details.');
      });
  };

  const getTurbineClass = (state, action) => {
    if (action === 1) {
      return 'maintenance'; // Maintenance action
    } else if (state === 1) {
      return 'faulty'; // Faulty state
    }
    return 'normal'; // Normal operation
  };

  useEffect(() => {
    if (transitions.length > 0 && displayedTransitions.length < transitions.length) {
      const timer = setTimeout(() => {
        setDisplayedTransitions(transitions.slice(0, displayedTransitions.length + 1));
      }, 500); // Set delay for 0.5 second
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [displayedTransitions, transitions]);

  // Create separate useEffect for each container
  useEffect(() => {
    if (containerRef1.current) {
      containerRef1.current.scrollLeft = containerRef1.current.scrollWidth;
    }
  }, [displayedTransitions]);

  useEffect(() => {
    if (containerRef2.current) {
      containerRef2.current.scrollLeft = containerRef2.current.scrollWidth;
    }
  }, [displayedTransitions]);

  useEffect(() => {
    if (containerRef3.current) {
      containerRef3.current.scrollLeft = containerRef3.current.scrollWidth;
    }
  }, [displayedTransitions]);

  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', color: '#3f51b5', margin: '20px 0' }}>Wind Turbine Simulation</h1>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Button variant="contained" color="primary" onClick={runSimulation}>
          Run Simulation
        </Button>
      </div>
      {error && <p>{error}</p>}

      <div className="card">
      <h1 style={{ textAlign: 'center', color: '#3f51b5', margin: '20px 0' }}>Agent's Actions on Turbine 1</h1>

        {/* <p>Total Reward: {totalReward}</p> */}
        {/* <p>Performance: {performance.toFixed(2)}%</p> */}
        <div className="states-container" ref={containerRef1}>
          {displayedTransitions.map((item, index) => (
            // <div key={index} className={`turbine ${getTurbineClass(item[0], item[1])}`}>
            //   S: {item[0]}, A: {item[1]}, R: {item[2]}, NS: {item[3]}, TR: {item[4]}, Perf: {item[5].toFixed(2)}%
            // </div>
            <div key={index} className={`turbine ${getTurbineClass(item[0], item[1])}`}>
            S: {item[0]}, A: {item[1]}, R: {item[2]}, NS: {item[3]}, 
            {/* Cumulative Reward (State 0): {item[4][0]},  */},
            CR0: {item[4][0]},
            CR1: {item[4][1]}
          </div>
          ))}
        </div>
      </div>
      <div className="card">
      <h1 style={{ textAlign: 'center', color: '#3f51b5', margin: '20px 0' }}>Agent's Actions on Turbine 2</h1>

        <div className="states-container" ref={containerRef2}>
          {/* Optionally duplicate simulation display or for different simulation */}
        </div>
      </div>
      <div className="card">
          <h1 style={{ textAlign: 'center', color: '#3f51b5', margin: '20px 0' }}>Agent's Actions on Turbine 3</h1>

        <div className="states-container" ref={containerRef3}>
          {/* Optionally duplicate simulation display or for different simulation */}
        </div>
      </div>
    </div>
  );
}

export default App;
