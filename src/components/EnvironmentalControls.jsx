import React from 'react';

/**
 * EnvironmentalControls.jsx
 * 
 * Interactive control panel for nutrient availability (glucose, carbon sources, starvation)
 * and physical/chemical environmental factors (temperature, pH, osmolality).
 */
export function EnvironmentalControls({ state, dispatch }) {
  const {
    temperature = 37,
    phLevel = 7.0,
    osmolality = 0.15,
    glucoseConcentration = 1.0,
    carbonSource = 'glucose',
    aminoAcidStarvation = false,
  } = state;

  return (
    <div className="trn-card">
      <div className="trn-card-header">
        <div className="trn-card-title">
          <span>🧪</span> Environmental & Nutrient Factors
        </div>
        <span className="trn-badge">TRN Active</span>
      </div>

      {/* Carbon & Metabolic Availability */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div className="trn-section-title">Metabolic & Carbon Availability</div>

        {/* Primary Carbon Source */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div className="trn-slider-header">
            <span>Primary Carbon Source:</span>
            <span className="trn-val-highlight" style={{ textTransform: 'capitalize' }}>{carbonSource}</span>
          </div>
          <div className="carbon-source-grid">
            {['glucose', 'lactose', 'glycerol'].map((src) => (
              <button
                key={src}
                onClick={() => dispatch({ type: 'SET_CARBON_SOURCE', payload: src })}
                className={`carbon-btn ${carbonSource === src ? 'active' : ''}`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {/* Glucose Concentration Slider */}
        <div className="trn-slider-group">
          <div className="trn-slider-header">
            <span>Glucose Concentration:</span>
            <span className="trn-val-highlight">{glucoseConcentration.toFixed(2)} g/L</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="2.0"
            step="0.05"
            value={glucoseConcentration}
            onChange={(e) => dispatch({ type: 'SET_GLUCOSE', payload: parseFloat(e.target.value) })}
            className="slider"
          />
          <div className="trn-slider-limits">
            <span>0.0 (Depleted)</span>
            <span>1.0 (Optimal)</span>
            <span>2.0 (Rich)</span>
          </div>
        </div>

        {/* Amino Acid Starvation Toggle */}
        <div className="trn-toggle-box">
          <div>
            <div className="trn-toggle-title">Amino Acid Starvation</div>
            <div className="trn-toggle-sub">(Triggers (p)ppGpp Stringent Response)</div>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_AMINO_ACID_STARVATION', payload: !aminoAcidStarvation })}
            className={`trn-toggle-btn ${aminoAcidStarvation ? 'starved' : ''}`}
          >
            {aminoAcidStarvation ? 'STARVED (ON)' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Physical & Stress Parameters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid var(--panel-border)', paddingTop: '0.6rem' }}>
        <div className="trn-section-title">Physical & Chemical Stressors</div>

        {/* Temperature Control */}
        <div className="trn-slider-group">
          <div className="trn-slider-header">
            <span>Temperature (Heat Shock):</span>
            <span className="trn-val-highlight">{temperature}°C</span>
          </div>
          <input
            type="range"
            min="30"
            max="45"
            step="1"
            value={temperature}
            onChange={(e) => dispatch({ type: 'SET_TEMPERATURE', payload: parseInt(e.target.value, 10) })}
            className="slider"
          />
          <div className="trn-slider-limits">
            <span>30°C</span>
            <span>37°C (Normal)</span>
            <span>45°C (Heat)</span>
          </div>
        </div>

        {/* pH Level Control */}
        <div className="trn-slider-group">
          <div className="trn-slider-header">
            <span>pH Level (Acid Stress):</span>
            <span className="trn-val-highlight">pH {phLevel.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="4.0"
            max="8.5"
            step="0.1"
            value={phLevel}
            onChange={(e) => dispatch({ type: 'SET_PH_LEVEL', payload: parseFloat(e.target.value) })}
            className="slider"
          />
          <div className="trn-slider-limits">
            <span>pH 4.0 (Acid)</span>
            <span>pH 7.0</span>
            <span>pH 8.5</span>
          </div>
        </div>

        {/* Osmolality Control */}
        <div className="trn-slider-group">
          <div className="trn-slider-header">
            <span>Osmolality (NaCl):</span>
            <span className="trn-val-highlight">{osmolality.toFixed(2)} M</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={osmolality}
            onChange={(e) => dispatch({ type: 'SET_OSMOLALITY', payload: parseFloat(e.target.value) })}
            className="slider"
          />
        </div>
      </div>
    </div>
  );
}
