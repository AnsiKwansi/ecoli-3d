import React from 'react';

export default function MetricsBar({ simState }) {
  const {
    dsbCount, maxDsbs, gamgfpBound,
    dimerCount, maxDimers, uvrabcBound,
    oxCount, maxOx, glycosylaseBound,
    sosLevel, cellViability, mutationCount, elapsedTime, phase
  } = simState;

  if (phase === 'IDLE') return null;

  const isDead = phase === 'CELL_DEATH' || cellViability <= 20;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="metrics-bar">
      {/* Live / Dead Cell Viability Visual Status Badge */}
      <div className="metric">
        <div 
          className="metric-value" 
          style={{ color: isDead ? '#ef4444' : '#60a5fa', fontSize: '1rem', fontWeight: 800 }}
        >
          {isDead ? '💀 CELL DEAD' : '🔵 CELL ALIVE'}
        </div>
        <div className="metric-label">{isDead ? 'Pitch Black' : 'Natural Envelope'}</div>
      </div>

      <div className="metric-divider" />

      {/* DSBs & GamGFP */}
      <div className="metric">
        <div className="metric-value" style={{ color: '#ef4444' }}>{dsbCount}</div>
        <div className="metric-label">Active DSBs</div>
        <div className="metric-sub">{maxDsbs > 0 ? `of ${maxDsbs} total` : ''}</div>
      </div>

      <div className="metric-divider" />

      <div className="metric">
        <div className="metric-value" style={{ color: '#22c55e' }}>{gamgfpBound}</div>
        <div className="metric-label">GamGFP Foci</div>
        <div className="metric-sub">bound to DSBs</div>
      </div>

      {/* UV Thymine Dimers (if present) */}
      {maxDimers > 0 && (
        <>
          <div className="metric-divider" />
          <div className="metric">
            <div className="metric-value" style={{ color: '#38bdf8' }}>{dimerCount}</div>
            <div className="metric-label">UV Dimers</div>
            <div className="metric-sub">{uvrabcBound} UvrABC (NER)</div>
          </div>
        </>
      )}

      {/* Oxidative Damage (if present) */}
      {maxOx > 0 && (
        <>
          <div className="metric-divider" />
          <div className="metric">
            <div className="metric-value" style={{ color: '#eab308' }}>{oxCount}</div>
            <div className="metric-label">Oxidative Damage</div>
            <div className="metric-sub">{glycosylaseBound} Glycosylase (BER)</div>
          </div>
        </>
      )}

      <div className="metric-divider" />

      {/* SOS Level */}
      <div className="metric">
        <div className="metric-value" style={{ color: '#f59e0b' }}>{Math.round(sosLevel)}%</div>
        <div className="metric-label">SOS Level</div>
        <div className="metric-bar-track">
          <div className="metric-bar-fill sos-bar" style={{ width: `${sosLevel}%` }} />
        </div>
      </div>

      <div className="metric-divider" />

      {/* Mutations */}
      <div className="metric">
        <div className="metric-value" style={{ color: '#eab308' }}>{mutationCount}</div>
        <div className="metric-label">Mutations</div>
        <div className="metric-sub">acquired</div>
      </div>

      <div className="metric-divider" />

      {/* Dynamic Mutation Rate */}
      <div className="metric">
        <div className="metric-value" style={{ color: '#a855f7', fontSize: '0.85rem' }}>
          {(simState.mutationRate || 1.2e-6).toExponential(1)}
        </div>
        <div className="metric-label">f_mut / bp</div>
        <div className="metric-sub">
          {simState.appliedAntiEvoDrugs?.length > 0 ? '💊 Drug Inhibited' : 'Uninhibited'}
        </div>
      </div>

      <div className="metric-divider" />

      {/* Cell Viability */}
      <div className="metric">
        <div className="metric-value" style={{ color: cellViability > 50 ? '#22c55e' : cellViability > 20 ? '#f59e0b' : '#ef4444' }}>
          {Math.round(cellViability)}%
        </div>
        <div className="metric-label">Cell Viability</div>
        <div className="metric-bar-track">
          <div
            className="metric-bar-fill viability-bar"
            style={{
              width: `${cellViability}%`,
              backgroundColor: cellViability > 50 ? '#22c55e' : cellViability > 20 ? '#f59e0b' : '#ef4444',
            }}
          />
        </div>
      </div>

      <div className="metric-divider" />

      {/* Timer */}
      <div className="metric">
        <div className="metric-value" style={{ color: '#94a3b8' }}>{formatTime(elapsedTime)}</div>
        <div className="metric-label">Elapsed</div>
        <div className="metric-sub">sim. time</div>
      </div>
    </div>
  );
}
