import React, { useState } from 'react';
import { TOXINS } from './simulation/SimulationEngine';
import { EnvironmentalControls } from './components/EnvironmentalControls';
import { PromoterKineticMonitor } from './components/PromoterKineticMonitor';

export default function ExperimentPanel({ simState, dispatch }) {
  const [activeTab, setActiveTab] = useState('factors'); // 'factors' | 'trn' | 'ddr'
  const isRunning = simState.phase !== 'IDLE' && simState.phase !== 'RESOLVED' && simState.phase !== 'CELL_DEATH';
  const isDead = simState.phase === 'CELL_DEATH' || simState.cellViability <= 20;

  const chemicalToxins = TOXINS.filter(t => ['uv', 'mitomycin_c', 'ciprofloxacin', 'h2o2'].includes(t.id));
  const physicalFactors = TOXINS.filter(t => ['heat_shock', 'acid_stress', 'osmotic_shock'].includes(t.id));

  return (
    <div className="experiment-panel">
      <div className="panel-header">
        <h2>Environmental & Gene Regulation</h2>
        <div className="panel-subtitle">Dr. Chandan Shee Lab — In-Vivo Experiment</div>
      </div>

      {/* Tab Switcher */}
      <div className="exp-tabs-container">
        <button
          onClick={() => setActiveTab('factors')}
          className={`exp-tab-btn ${activeTab === 'factors' ? 'active' : ''}`}
        >
          🧪 Nutrients & Stress
        </button>
        <button
          onClick={() => setActiveTab('trn')}
          className={`exp-tab-btn ${activeTab === 'trn' ? 'active' : ''}`}
        >
          📊 TRN Promoters
        </button>
        <button
          onClick={() => setActiveTab('ddr')}
          className={`exp-tab-btn ${activeTab === 'ddr' ? 'active' : ''}`}
        >
          🧬 DNA Damage
        </button>
      </div>

      {/* Live / Dead Cell Status Indicator Pill */}
      <div 
        className="live-dead-status-banner"
        style={{
          background: isDead ? 'rgba(239, 68, 68, 0.15)' : 'rgba(96, 165, 250, 0.15)',
          border: `1px solid ${isDead ? '#ef4444' : '#60a5fa'}`,
          color: isDead ? '#ef4444' : '#60a5fa'
        }}
      >
        <span className="status-dot" style={{ backgroundColor: isDead ? '#ef4444' : '#60a5fa' }}></span>
        <span>{isDead ? '💀 DEAD CELL (Enveloped Envelope)' : '🔵 ALIVE CELL (Dynamic TRN Active)'}</span>
      </div>

      {activeTab === 'factors' && (
        <EnvironmentalControls state={simState} dispatch={dispatch} />
      )}

      {activeTab === 'trn' && (
        <PromoterKineticMonitor state={simState} />
      )}

      {activeTab === 'ddr' && (
        <>
          {/* UV Exposure Control */}
          <div className="control-group">
            <label>
              <span className="control-label">UV Irradiation Dose</span>
              <span className="control-value">{simState.uvDose} J/m²</span>
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={simState.uvDose}
              onChange={(e) => dispatch({ type: 'SET_UV_DOSE', payload: Number(e.target.value) })}
              disabled={isRunning}
              className="slider uv-slider"
            />
            <div className="slider-labels">
              <span>Low dose</span>
              <span>High dose</span>
            </div>
          </div>

          {/* Category 1: DNA Damage & Chemical Stressors */}
          <div className="control-group">
            <label className="control-label">
              <span>🧬 DNA Damage & Toxins</span>
            </label>
            <div className="toxin-grid">
              {chemicalToxins.map((toxin) => (
                <button
                  key={toxin.id}
                  className={`toxin-btn ${simState.selectedToxin.id === toxin.id ? 'active' : ''}`}
                  style={{
                    '--toxin-color': toxin.color,
                    borderColor: simState.selectedToxin.id === toxin.id ? toxin.color : 'transparent',
                  }}
                  onClick={() => dispatch({ type: 'SET_TOXIN', payload: toxin })}
                  disabled={isRunning}
                >
                  <span className="toxin-dot" style={{ backgroundColor: toxin.color }}></span>
                  {toxin.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category 2: Physical Environmental Stressors */}
          <div className="control-group">
            <label className="control-label">
              <span>🌡️ Environmental Conditions</span>
            </label>
            <div className="toxin-grid">
              {physicalFactors.map((factor) => (
                <button
                  key={factor.id}
                  className={`toxin-btn ${simState.selectedToxin.id === factor.id ? 'active' : ''}`}
                  style={{
                    '--toxin-color': factor.color,
                    borderColor: simState.selectedToxin.id === factor.id ? factor.color : 'transparent',
                  }}
                  onClick={() => dispatch({ type: 'SET_TOXIN', payload: factor })}
                  disabled={isRunning}
                >
                  <span className="toxin-dot" style={{ backgroundColor: factor.color }}></span>
                  {factor.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Action Button */}
      <div className="control-group">
        <button
          className="action-btn irradiate-btn"
          onClick={() => dispatch({ type: 'IRRADIATE' })}
          disabled={isRunning}
          style={{
            background: simState.selectedToxin.color
              ? `linear-gradient(135deg, ${simState.selectedToxin.color}, #3b82f6)`
              : undefined
          }}
        >
          <span className="btn-icon">⚡</span>
          {simState.selectedToxin.id === 'uv' ? 'Irradiate Cell' : `Apply ${simState.selectedToxin.name}`}
        </button>
      </div>

      {/* Quick Lethal Shock Demonstration Button */}
      <button
        className="action-btn lethal-btn"
        onClick={() => {
          dispatch({ type: 'SET_UV_DOSE', payload: 100 });
          dispatch({ type: 'IRRADIATE' });
        }}
        disabled={isRunning}
      >
        💀 Trigger Lethal Shock (Show Black Dead Cell)
      </button>

      {/* Time Scale */}
      <div className="control-group" style={{ marginTop: '0.5rem' }}>
        <label>
          <span className="control-label">Time Scale</span>
          <span className="control-value">{simState.timeScale}×</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={simState.timeScale}
          onChange={(e) => dispatch({ type: 'SET_TIME_SCALE', payload: Number(e.target.value) })}
          className="slider time-slider"
        />
      </div>

      {/* Reset */}
      <button
        className="action-btn reset-btn"
        onClick={() => dispatch({ type: 'RESET' })}
      >
        🔵 Reset Cell to Default State
      </button>
    </div>
  );
}
