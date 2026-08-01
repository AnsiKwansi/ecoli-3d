import React from 'react';

export default function MetricsBar({ simState }) {
  const { dsbCount, maxDsbs, gamgfpBound, sosLevel, cellViability, elapsedTime, phase } = simState;

  if (phase === 'IDLE') return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="metrics-bar">
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

      <div className="metric-divider" />

      <div className="metric">
        <div className="metric-value" style={{ color: '#f59e0b' }}>{Math.round(sosLevel)}%</div>
        <div className="metric-label">SOS Level</div>
        <div className="metric-bar-track">
          <div className="metric-bar-fill sos-bar" style={{ width: `${sosLevel}%` }} />
        </div>
      </div>

      <div className="metric-divider" />

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

      <div className="metric">
        <div className="metric-value" style={{ color: '#94a3b8' }}>{formatTime(elapsedTime)}</div>
        <div className="metric-label">Elapsed</div>
        <div className="metric-sub">sim. time</div>
      </div>
    </div>
  );
}
