import React, { useState } from 'react';
import Scene from './Scene';
import PartInfoPanel from './PartInfoPanel';
import './index.css';

function App() {
  const [selectedPart, setSelectedPart] = useState(null);

  return (
    <div className="app-container">
      {/* UI Overlay Layer */}
      <div className="app-header">
        <h1>E. coli 3D Explorer</h1>
        <div className="subtitle">Dr. Shee Lab Research Visualization</div>
      </div>

      <PartInfoPanel selectedPart={selectedPart} onSelectPart={setSelectedPart} />

      {/* 3D Canvas Layer */}
      <div className="canvas-container">
        <Scene selectedPart={selectedPart} onSelectPart={setSelectedPart} />
      </div>
    </div>
  );
}

export default App;
