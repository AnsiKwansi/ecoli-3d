import React, { useState, useEffect } from 'react';

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
      // Control climbs up under stress (1.0e-10 -> 1.5e-6)
      const controlVal = Math.min(1.5e-6, 1.0e-10 + (baseControlRate - 1.0e-10) * (1 - Math.exp(-gen / 30)));
      
      // Treated drops down when drug is active (1.5e-6 -> treatedRate)
      const treatedVal = isApplied 
        ? Math.max(treatedRate, baseControlRate * Math.exp(-gen / (20 + (100 - currentSuppression) / 2)))
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

  // SVG Coordinates calculation for separated lines
  const getCoords = (gen, rate, isControl) => {
    const x = 40 + (gen / 100) * 440;
    if (isControl) {
      // Control goes UP: y=130 (Gen 0) -> y=30 (Gen 100)
      return { x, y: 130 - (gen / 100) * 100 };
    } else {
      if (!isApplied) {
        // Inactive baseline at bottom
        return { x, y: 135 };
      }
      // Treated goes DOWN: y=30 (Gen 0) -> y=138 (Gen 100)
      return { x, y: 30 + (gen / 100) * 108 };
    }
  };

  const currentX = 40 + (generation / 100) * 440;
  const controlPinY = 130 - (generation / 100) * 100;
  const treatedPinY = isApplied ? (30 + (generation / 100) * 108) : 135;

  return (
    <div className="live-drug-kinetics-card">
      <div className="kinetics-header-row">
        <div className="kinetics-title">
          <h4>📉 Live Dynamic Anti-Evolutionary Kinetics Assay (100 Generations)</h4>
          <span className="kinetics-subtitle">
            Real-time dual kinetics curve: Red line (Untreated Control) climbs UP under stress; Green line ({selectedDrug.name}) drops DOWN upon drug administration
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
          <span className="legend-tag control">🔴 Untreated Control: Mutation Escalation (Climbs UP)</span>
          <span className="legend-tag treated">
            {isApplied 
              ? `🟢 ${selectedDrug.name} (${dosage} nM): Mutagenesis Suppression (Drops DOWN)` 
              : '⚪ Adjuvant Inactive (Click "Administer" above to see Green Curve drop DOWN)'}
          </span>
        </div>

        {/* Simulated Graph SVG with 2 Separated Distinct Curves */}
        <div className="svg-chart-container">
          <svg viewBox="0 0 500 170" className="kinetics-svg">
            {/* Grid lines */}
            <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
            <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
            <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.08)" strokeDasharray="4" />
            <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.2)" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="rgba(255,255,255,0.2)" />

            {/* Y-axis Labels */}
            <text x="35" y="25" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="end">1.5e-6 (High Stress)</text>
            <text x="35" y="65" fill="#94a3b8" fontSize="9" textAnchor="end">1.0e-6</text>
            <text x="35" y="105" fill="#94a3b8" fontSize="9" textAnchor="end">5.0e-7</text>
            <text x="35" y="143" fill="#22c55e" fontSize="9" fontWeight="bold" textAnchor="end">1.0e-10 (Suppressed)</text>

            {/* X-axis Labels */}
            <text x="40" y="158" fill="#94a3b8" fontSize="9">Gen 0</text>
            <text x="150" y="158" fill="#94a3b8" fontSize="9">Gen 25</text>
            <text x="260" y="158" fill="#94a3b8" fontSize="9">Gen 50</text>
            <text x="370" y="158" fill="#94a3b8" fontSize="9">Gen 75</text>
            <text x="475" y="158" fill="#94a3b8" fontSize="9" textAnchor="end">Gen 100</text>

            {/* 🔴 Control Path: Red Curve Going UP */}
            <path
              d="M 40 130 C 140 120, 260 45, 480 30"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <text x="440" y="24" fill="#ef4444" fontSize="9" fontWeight="bold">▲ Control Escalation</text>

            {/* 🟢 Treated Path: Green Curve Going DOWN */}
            {isApplied ? (
              <>
                <path
                  d="M 40 30 C 140 80, 260 135, 480 138"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <text x="440" y="152" fill="#22c55e" fontSize="9" fontWeight="bold">▼ Adjuvant Suppression</text>
              </>
            ) : (
              <path
                d="M 40 135 L 480 135"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )}

            {/* Live Indicator Vertical Marker */}
            <line x1={currentX} y1="20" x2={currentX} y2="140" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* 🔴 Control Pin (Rising) */}
            <circle cx={currentX} cy={controlPinY} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
            
            {/* 🟢 Treated Pin (Falling) */}
            {isApplied ? (
              <circle cx={currentX} cy={treatedPinY} r="6" fill="#22c55e" stroke="#ffffff" strokeWidth="2" />
            ) : (
              <circle cx={currentX} cy={135} r="4" fill="#64748b" stroke="#ffffff" strokeWidth="1" />
            )}
          </svg>
        </div>
      </div>

      {/* Live Comparison Counter Cards */}
      <div className="kinetics-comparison-grid">
        <div className="kinetics-card control">
          <div className="kinetics-card-title">🔴 Untreated Wild-Type Control (Climbing UP)</div>
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
            {isApplied ? `🟢 ${selectedDrug.name} (Dropping DOWN - ${currentSuppression}% Suppressed)` : '⚪ Adjuvant Inactive (Click Administer Above)'}
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
