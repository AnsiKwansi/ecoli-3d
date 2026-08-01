import React, { useReducer, useState } from 'react';
import Scene from './Scene';
import ExperimentPanel from './ExperimentPanel';
import InfoPanel from './InfoPanel';
import MetricsBar from './MetricsBar';
import PhasePopup from './PhasePopup';
import { simReducer, initialSimState } from './simulation/SimulationEngine';
import './index.css';

function App() {
  const [simState, dispatch] = useReducer(simReducer, initialSimState);
  const [selectedPart, setSelectedPart] = useState(null);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-container" data-theme={theme}>
      {/* Header */}
      <div className="app-header">
        <h1>E. coli Artificial Cell</h1>
        <div className="subtitle">In-Vivo DNA Damage Response Simulator — Dr. Shee Lab</div>
      </div>

      {/* Theme Toggle Button */}
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title="Toggle Theme Mode"
      >
        <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* Left: Experiment Controls */}
      <ExperimentPanel simState={simState} dispatch={dispatch} />

      {/* Right: Info Panel (on click) */}
      <InfoPanel selectedPart={selectedPart} onSelectPart={setSelectedPart} />

      {/* Bottom: Live Metrics */}
      <MetricsBar simState={simState} />

      {/* Phase Popup Notifications */}
      <PhasePopup phase={simState.phase} />

      {/* 3D Canvas */}
      <div className="canvas-container">
        <Scene
          simState={simState}
          dispatch={dispatch}
          selectedPart={selectedPart}
          onSelectPart={setSelectedPart}
          theme={theme}
        />
      </div>
    </div>
  );
}

export default App;

