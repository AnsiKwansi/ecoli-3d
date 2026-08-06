import React, { useState, useEffect, useRef } from 'react';

export default function LiveDrugKineticsChart({ selectedDrug, dosage, isApplied, currentSuppression, effectiveRate, resistanceDelay }) {
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [kineticsData, setKineticsData] = useState([]);

  // Generate initial kinetics data points (Gen 0 to 100)
  useEffect(() => {
    const points = [];
    const baseControlRate = 1.2e-6; // Stressed wild-type mutation rate
    const drugSuppressionFraction = currentSuppression / 100;
    const treatedRate = Math.max(1e-11, baseControlRate * (1 - drugSuppressionFraction));

    for (let gen = 0; gen <= 100; gen += 5) {
      // Control climbs under stress
      const controlVal = Math.min(1.5e-6, 1.0e-7 + (baseControlRate - 1.0e-7) * (1 - Math.exp(-gen / 25)));
      // Treated drops when drug is active
      const treatedVal = isApplied 
        ? Math.max(treatedRate, controlVal * (1 - drugSuppressionFraction * (1 - Math.exp(-gen / 15))))
        : controlVal;

      points.push({
        gen,
        controlRate: controlVal,
        treatedRate: treatedVal
      });
    }
    setKineticsData(points);
  }, [selectedDrug, dosage, isApplied, currentSuppression]);

  // Live ticker for generation timeline
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setGeneration(prev => {
          if (prev >= 100) return 0; // Loop back
          return prev + 1;
        });
      }, 150 / speed);
    }
    return () => clearInterval(interval);
  }, [isRunning, speed]);

  // Current active kinetics point
  const activePoint = kineticsData.find(p => p.gen >= generation) || kineticsData[kineticsData.length - 1] || { controlRate: 1.2e-6, treatedRate: 4e-11 };

  // Calculate live mutant colonies accumulated in 10^9 cells
  const controlMutantsAcc = Math.round(1.2e-6 * 1e9 * (generation / 20));
  const treatedMutantsAcc = isApplied 
    ? Math.round(activePoint.treatedRate * 1e9 * (generation / 20))
    : controlMutantsAcc;

  return (
    <div className="live-drug-kinetics-card">
      <div className="kinetics-header-row">
        <div className="kinetics-title">
          <h4>📉 Live Dynamic Anti-Evolutionary Kinetics Assay (100 Generations)</h4>
          <span className="kinetics-subtitle">
            Real-time simulation comparing Untreated Control vs {selectedDrug.name} ({dosage} nM)
          </span>
        </div>

        {/* Live Playback Controls */}
        <div className="kinetics-controls">
          <button
            className={`kinetics-btn ${isRunning ? 'active' : ''}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? '⏸ Pause Simulation' : '▶ Play Live Assay'}
          </button>
          <button
            className="kinetics-btn secondary"
            onClick={() => setGeneration(0)}
          >
            🔄 Reset (Gen 0)
          </button>
          <div className="speed-pills">
            {[1, 2, 5].map(s => (
              <button
                key={s}
                className={`speed-pill ${speed === s ? 'active' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Timeline Progress Bar */}
      <div className="timeline-progress-container">
        <div className="timeline-info">
          <span>Cell Generations: <strong>Gen #{generation} / 100</strong></span>
          <span>Simulation Time: <strong>{(generation * 0.5).toFixed(1)} Hours</strong></span>
        </div>
        <div className="timeline-track">
          <div className="timeline-fill" style={{ width: `${generation}%` }}></div>
          <div className="timeline-head" style={{ left: `${generation}%` }}></div>
        </div>
      </div>

      {/* Live Kinetics Visual Dual Chart */}
      <div className="kinetics-chart-box">
        <div className="chart-legend-row">
          <span className="legend-tag control">🔴 Untreated Stressed Control (Wild-Type)</span>
          <span className="legend-tag treated">
            {isApplied ? `🟢 ${selectedDrug.name} Adjuvant (${dosage} nM)` : '⚪ Adjuvant Inactive (Click Administer)'}
          </span>
        </div>

        {/* Simulated Graph SVG */}
        <div className="svg-chart-container">
          <svg viewBox="0 0 500 160" className="kinetics-svg">
            {/* Grid lines */}
            <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
            <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
            <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
            <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.2)" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="rgba(255,255,255,0.2)" />

            {/* Y-axis Labels */}
            <text x="35" y="25" fill="#94a3b8" fontSize="9" textAnchor="end">1.5e-6</text>
            <text x="35" y="65" fill="#94a3b8" fontSize="9" textAnchor="end">1.0e-6</text>
            <text x="35" y="105" fill="#94a3b8" fontSize="9" textAnchor="end">5.0e-7</text>
            <text x="35" y="143" fill="#94a3b8" fontSize="9" textAnchor="end">1.0e-10</text>

            {/* X-axis Labels */}
            <text x="40" y="155" fill="#94a3b8" fontSize="9">Gen 0</text>
            <text x="150" y="155" fill="#94a3b8" fontSize="9">Gen 25</text>
            <text x="260" y="155" fill="#94a3b8" fontSize="9">Gen 50</text>
            <text x="370" y="155" fill="#94a3b8" fontSize="9">Gen 75</text>
            <text x="475" y="155" fill="#94a3b8" fontSize="9" textAnchor="end">Gen 100</text>

            {/* Dynamic Curve Calculations */}
            {(() => {
              const getControlY = (t) => {
                const u = 1 - t;
                return u * u * u * 130 + 3 * u * u * t * 120 + 3 * u * t * t * 40 + t * t * t * 30;
              };

              const getTreatedY = (t) => {
                const cY = getControlY(t);
                if (!isApplied) return cY;
                const suppressionFrac = Math.min(0.95, currentSuppression / 100);
                const bottomY = 138;
                return cY + (bottomY - cY) * suppressionFrac;
              };

              const getX = (t) => {
                const u = 1 - t;
                return u * u * u * 40 + 3 * u * u * t * 150 + 3 * u * t * t * 250 + t * t * t * 480;
              };

              const treatedPathD = Array.from({ length: 21 }, (_, i) => {
                const stepT = i / 20;
                const px = getX(stepT);
                const py = getTreatedY(stepT);
                return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
              }).join(' ');

              const currentT = Math.max(0, Math.min(1, generation / 100));
              const cx = getX(currentT);
              const controlY = getControlY(currentT);
              const treatedY = getTreatedY(currentT);

              return (
                <g key="kinetics-curves-and-indicators">
                  {/* Control Path (Red curve) */}
                  <path
                    d="M 40 130 C 150 120, 250 40, 480 30"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                  />

                  {/* Treated Path (Green curve) */}
                  <path
                    d={treatedPathD}
                    fill="none"
                    stroke={isApplied ? "#22c55e" : "#94a3b8"}
                    strokeWidth="3"
                    strokeDasharray={isApplied ? "none" : "5 5"}
                  />

                  {/* Live Indicator Pin */}
                  <line x1={cx} y1="20" x2={cx} y2="140" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx={cx} cy={controlY} r="5.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                  <circle cx={cx} cy={treatedY} r="5.5" fill={isApplied ? "#22c55e" : "#94a3b8"} stroke="#ffffff" strokeWidth="2" />
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Live Comparison Counter Cards */}
      <div className="kinetics-comparison-grid">
        <div className="kinetics-card control">
          <div className="kinetics-card-title">🔴 Untreated Wild-Type Control</div>
          <div className="kinetics-stat">
            <span className="lbl">Live Mutation Rate:</span>
            <span className="val text-red">{(activePoint?.controlRate || 1.2e-6).toExponential(2)} / bp / gen</span>
          </div>
          <div className="kinetics-stat">
            <span className="lbl">Accumulated Mutant Colonies:</span>
            <span className="val text-red">{controlMutantsAcc.toLocaleString()} mutants / 10⁹ cells</span>
          </div>
          <div className="kinetics-stat">
            <span className="lbl">Estimated AMR Emergence:</span>
            <span className="val text-red">1.5 Days (Rapid Resistance)</span>
          </div>
        </div>

        <div className={`kinetics-card treated ${isApplied ? 'active' : ''}`}>
          <div className="kinetics-card-title">
            {isApplied ? `🟢 ${selectedDrug.name} (${currentSuppression}% Suppressed)` : '⚪ Adjuvant Inactive'}
          </div>
          <div className="kinetics-stat">
            <span className="lbl">Live Mutation Rate:</span>
            <span className="val text-green">{isApplied ? effectiveRate : (activePoint?.controlRate || 1.2e-6).toExponential(2)} / bp / gen</span>
          </div>
          <div className="kinetics-stat">
            <span className="lbl">Accumulated Mutant Colonies:</span>
            <span className="val text-green">{treatedMutantsAcc.toLocaleString()} mutants / 10⁹ cells</span>
          </div>
          <div className="kinetics-stat">
            <span className="lbl">Estimated AMR Emergence:</span>
            <span className="val text-purple">
              {isApplied ? `${(1.5 * resistanceDelay).toFixed(0)} Days (${resistanceDelay}× Delay)` : '1.5 Days'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
