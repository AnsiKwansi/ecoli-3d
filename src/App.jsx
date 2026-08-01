import React, { useState } from 'react';
import Scene from './Scene';
import PartInfoPanel from './PartInfoPanel';
import './index.css';

function App() {
  const [selectedPart, setSelectedPart] = useState(null);

  return (
    <div className="app-container">
      {/* UI Overlay Layer */}
      <div className="header">
        <h1>
          E. coli <span>Explorer</span>
        </h1>
        <p>
          Interactive 3D schematic of an Escherichia coli bacterium. Rotate and zoom to explore.
        </p>
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
