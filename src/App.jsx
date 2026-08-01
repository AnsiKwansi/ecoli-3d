import React, { useReducer, useState } from 'react';
import Scene from './Scene';
import ExperimentPanel from './ExperimentPanel';
import InfoPanel from './InfoPanel';
import MetricsBar from './MetricsBar';
import PhasePopup from './PhasePopup';
import GenomeBrowser from './components/GenomeBrowser';
import GeneReactionPanel from './components/GeneReactionPanel';
import { simReducer, initialSimState } from './simulation/SimulationEngine';
import './index.css';
import './App.css';

function App() {
  const [simState, dispatch] = useReducer(simReducer, initialSimState);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedGene, setSelectedGene] = useState(null);
  const [activeTab, setActiveTab] = useState('3d_cell'); // '3d_cell' | 'genome' | 'stress_assay'
  const [expressionData, setExpressionData] = useState(null);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectGeneFromAnywhere = (gene) => {
    setSelectedGene(gene);
    if (activeTab !== 'genome') {
      setActiveTab('genome');
    }
  };

  return (
    <div className="app-container" data-theme={theme}>
      {/* Header */}
      <div className="app-header">
        <div className="header-brand-group">
          <h1>E. coli Artificial Cell & Genome Platform</h1>
          <div className="subtitle">In-Vivo DNA Damage Response & BioCyc Genome Explorer — Dr. Shee Lab</div>
        </div>

        {/* View Navigation Tabs */}
        <div className="header-nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === '3d_cell' ? 'active' : ''}`}
            onClick={() => setActiveTab('3d_cell')}
          >
            🧬 3D Cell Explorer
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'genome' ? 'active' : ''}`}
            onClick={() => setActiveTab('genome')}
          >
            🔬 BioCyc Genome Browser (4.64 Mb)
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'stress_assay' ? 'active' : ''}`}
            onClick={() => setActiveTab('stress_assay')}
          >
            🧪 Environmental Condition Matrix
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Toggle Theme Mode"
        >
          <span className="theme-toggle-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Tab View 1: 3D Cellular Explorer */}
      {activeTab === '3d_cell' && (
        <div className="view-content view-3d-container">
          <ExperimentPanel simState={simState} dispatch={dispatch} />
          <InfoPanel selectedPart={selectedPart} onSelectPart={setSelectedPart} />
          <MetricsBar simState={simState} />
          <PhasePopup phase={simState.phase} />
          
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
      )}

      {/* Tab View 2: BioCyc Replicon Genome Browser */}
      {activeTab === 'genome' && (
        <div className="view-content view-genome-container">
          <GenomeBrowser
            activeExpressionData={expressionData}
            selectedGene={selectedGene}
            onSelectGene={setSelectedGene}
          />
        </div>
      )}

      {/* Tab View 3: Environmental Stress Reaction Assays */}
      {activeTab === 'stress_assay' && (
        <div className="view-content view-assay-container">
          <GeneReactionPanel
            onExpressionUpdate={setExpressionData}
            onSelectGene={handleSelectGeneFromAnywhere}
          />
        </div>
      )}
    </div>
  );
}

export default App;
