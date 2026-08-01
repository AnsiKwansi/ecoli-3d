import React from 'react';
import { TOXINS } from './simulation/SimulationEngine';

export default function ExperimentPanel({ simState, dispatch }) {
  const isRunning = simState.phase !== 'IDLE' && simState.phase !== 'RESOLVED' && simState.phase !== 'CELL_DEATH';

  return (
    <div className="experiment-panel">
      <div className="panel-header">
        <h2>In-Vivo Controls</h2>
        <div className="panel-subtitle">In-Vivo Cellular Experiment</div>
      </div>

      {/* UV Dose Slider */}
      <div className="control-group">
        <label>
          <span className="control-label">UV Exposure</span>
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

      {/* Stressor Selection */}
      <div className="control-group">
        <label className="control-label">Environmental Stressor</label>
        <div className="toxin-grid">
          {TOXINS.map((toxin) => (
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

      {/* Action Buttons */}
      <div className="control-group">
        <button
          className="action-btn irradiate-btn"
          onClick={() => dispatch({ type: 'IRRADIATE' })}
          disabled={isRunning}
        >
          <span className="btn-icon">⚡</span>
          {simState.selectedToxin.id === 'uv' ? 'Irradiate Cell' : 'Inject Stressor'}
        </button>
      </div>

      {/* Time Scale */}
      <div className="control-group">
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
        Reset Cell
      </button>

      {/* Phase indicator */}
      {simState.phase !== 'IDLE' && (
        <div className={`phase-indicator phase-${simState.phase.toLowerCase()}`}>
          <span className="phase-dot"></span>
          {simState.phase === 'IRRADIATED' && 'DNA Damage Occurring…'}
          {simState.phase === 'SOS_ACTIVE' && 'SOS Response Activated'}
          {simState.phase === 'REPAIRING' && 'Repair Enzymes Working…'}
          {simState.phase === 'RESOLVED' && '✓ Cell Survived'}
          {simState.phase === 'CELL_DEATH' && '✕ Cell Death'}
        </div>
      )}
    </div>
  );
}
