import React, { useReducer, useState } from 'react';
import Scene from './Scene';
import ExperimentPanel from './ExperimentPanel';
import InfoPanel from './InfoPanel';
import MetricsBar from './MetricsBar';
import PhasePopup from './PhasePopup';
import GenomeBrowser from './components/GenomeBrowser';
import GeneReactionPanel from './components/GeneReactionPanel';
import MutagenesisPanel from './components/MutagenesisPanel';
import LiteratureLookupPanel from './components/LiteratureLookupPanel';
import AntiEvolutionaryDrugPanel from './components/AntiEvolutionaryDrugPanel';
import { simReducer, initialSimState } from './simulation/SimulationEngine';
import './index.css';
import './App.css';

function App() {
  const [simState, dispatch] = useReducer(simReducer, initialSimState);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedGene, setSelectedGene] = useState(null);
  const [activeTab, setActiveTab] = useState('3d_cell'); // '3d_cell' | 'mutagenesis' | 'literature' | 'anti_evolution' | 'genome' | 'stress_assay'
  const [expressionData, setExpressionData] = useState(null);
  const [lookupTerm, setLookupTerm] = useState('');
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

  const handleSelectLiteratureTerm = (term) => {
    setLookupTerm(term);
    setActiveTab('literature');
  };

  return (
    <div className="app-container" data-theme={theme}>
      {/* Header */}
      <div className="app-header">
        <div className="header-brand-group">
          <h1>E. coli Artificial Cell & Genome Platform</h1>
          <div className="subtitle">In-Vivo DNA Damage Response & Anti-Evolutionary Drug Screening — Dr. Shee Lab</div>
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
            className={`nav-tab-btn ${activeTab === 'mutagenesis' ? 'active' : ''}`}
            onClick={() => setActiveTab('mutagenesis')}
          >
            🧬 Mutagenesis Spectrum
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'literature' ? 'active' : ''}`}
            onClick={() => setActiveTab('literature')}
          >
            📚 Dr. Shee Literature Lookup
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'anti_evolution' ? 'active' : ''}`}
            onClick={() => setActiveTab('anti_evolution')}
          >
            💊 Anti-Evolutionary Screen
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'genome' ? 'active' : ''}`}
            onClick={() => setActiveTab('genome')}
          >
            🔬 BioCyc Genome
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'stress_assay' ? 'active' : ''}`}
            onClick={() => setActiveTab('stress_assay')}
          >
            🧪 Environmental Assays
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

      {/* Tab View 2: Mutagenesis Spectrum */}
      {activeTab === 'mutagenesis' && (
        <div className="view-content view-full-panel">
          <MutagenesisPanel onSelectLiteratureTerm={handleSelectLiteratureTerm} />
        </div>
      )}

      {/* Tab View 3: Dr. Shee Literature Reference Lookup */}
      {activeTab === 'literature' && (
        <div className="view-content view-full-panel">
          <LiteratureLookupPanel initialTerm={lookupTerm} />
        </div>
      )}

      {/* Tab View 4: Anti-Evolutionary Drug Screening */}
      {activeTab === 'anti_evolution' && (
        <div className="view-content view-full-panel">
          <AntiEvolutionaryDrugPanel simState={simState} dispatch={dispatch} />
        </div>
      )}

      {/* Tab View 5: BioCyc Replicon Genome Browser */}
      {activeTab === 'genome' && (
        <div className="view-content view-genome-container">
          <GenomeBrowser
            activeExpressionData={expressionData}
            selectedGene={selectedGene}
            onSelectGene={setSelectedGene}
          />
        </div>
      )}

      {/* Tab View 6: Environmental Stress Reaction Assays */}
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
