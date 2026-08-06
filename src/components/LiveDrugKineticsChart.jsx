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

  // Chart Layout Coordinates (viewBox 0 0 560 180)
  const leftX = 65;
  const rightX = 510;
  const topY = 25;
  const bottomY = 142;
  const widthX = rightX - leftX;
  const heightY = bottomY - topY;

  const currentX = leftX + (generation / 100) * widthX;

  // Control Pin Y position (climbs UP from bottomY to topY)
  const controlPinY = bottomY - (generation / 100) * (heightY - 10);

  // Treated Pin Y position (drops DOWN from topY to bottomY when applied)
  const treatedPinY = isApplied ? (topY + 5 + (generation / 100) * (heightY - 10)) : (bottomY - 5);

  return (
    <div className="live-drug-kinetics-card">
      {/* Header & Controls */}
      <div className="kinetics-header-row">
        <div className="kinetics-title">
          <h4>📉 Live Dynamic Anti-Evolutionary Kinetics Assay (100 Generations)</h4>
          <span className="kinetics-subtitle">
            Dual kinetics comparison: Red line (Untreated Control) escalates UP; Green line ({selectedDrug.name}) suppresses DOWN
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

      {/* Ultra-Clean Visual Dual Chart */}
      <div className="kinetics-chart-box">
        <div className="chart-legend-row">
          <span className="legend-tag control">🔴 Untreated Control (Mutation Rate Climbs UP)</span>
          <span className="legend-tag treated">
            {isApplied 
              ? `🟢 ${selectedDrug.name} (${dosage} nM) (Suppression Drops DOWN)` 
              : '⚪ Adjuvant Inactive (Click "Administer" to activate Green Curve)'}
          </span>
        </div>

        {/* High-Clarity SVG Graph */}
        <div className="svg-chart-container">
          <svg viewBox="0 0 560 180" className="kinetics-svg">
            <defs>
              {/* Subtle Red Area Glow */}
              <linearGradient id="redGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
              {/* Subtle Green Area Glow */}
              <linearGradient id="greenGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            <line x1={leftX} y1={topY} x2={rightX} y2={topY} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1={leftX} y1={topY + heightY * 0.33} x2={rightX} y2={topY + heightY * 0.33} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1={leftX} y1={topY + heightY * 0.66} x2={rightX} y2={topY + heightY * 0.66} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <line x1={leftX} y1={bottomY} x2={rightX} y2={bottomY} stroke="rgba(255,255,255,0.15)" />

            {/* Vertical Y-Axis Line */}
            <line x1={leftX} y1={topY - 5} x2={leftX} y2={bottomY} stroke="rgba(255,255,255,0.15)" />

            {/* Y-Axis Rate Labels (Positioned cleanly to the left without overlap) */}
            <text x={leftX - 8} y={topY + 3} fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="end">1.5e-6</text>
            <text x={leftX - 8} y={topY + heightY * 0.33 + 3} fill="#94a3b8" fontSize="8.5" textAnchor="end">1.0e-6</text>
            <text x={leftX - 8} y={topY + heightY * 0.66 + 3} fill="#94a3b8" fontSize="8.5" textAnchor="end">5.0e-7</text>
            <text x={leftX - 8} y={bottomY + 3} fill="#10b981" fontSize="9" fontWeight="700" textAnchor="end">1.0e-10</text>

            {/* X-Axis Generation Labels */}
            <text x={leftX} y={bottomY + 16} fill="#94a3b8" fontSize="8.5" textAnchor="middle">Gen 0</text>
            <text x={leftX + widthX * 0.25} y={bottomY + 16} fill="#94a3b8" fontSize="8.5" textAnchor="middle">Gen 25</text>
            <text x={leftX + widthX * 0.50} y={bottomY + 16} fill="#94a3b8" fontSize="8.5" textAnchor="middle">Gen 50</text>
            <text x={leftX + widthX * 0.75} y={bottomY + 16} fill="#94a3b8" fontSize="8.5" textAnchor="middle">Gen 75</text>
            <text x={rightX} y={bottomY + 16} fill="#94a3b8" fontSize="8.5" textAnchor="middle">Gen 100</text>

            {/* 🔴 Red Curve Area Fill & Line (Climbing UP) */}
            <path
              d={`M ${leftX} ${bottomY - 5} C ${leftX + 110} ${bottomY - 15}, ${leftX + 240} ${topY + 20}, ${rightX} ${topY + 5} L ${rightX} ${bottomY} L ${leftX} ${bottomY} Z`}
              fill="url(#redGlow)"
            />
            <path
              d={`M ${leftX} ${bottomY - 5} C ${leftX + 110} ${bottomY - 15}, ${leftX + 240} ${topY + 20}, ${rightX} ${topY + 5}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* 🟢 Green Curve Area Fill & Line (Dropping DOWN) */}
            {isApplied ? (
              <>
                <path
                  d={`M ${leftX} ${topY + 5} C ${leftX + 110} ${topY + 45}, ${leftX + 240} ${bottomY - 10}, ${rightX} ${bottomY - 3} L ${rightX} ${bottomY} L ${leftX} ${bottomY} Z`}
                  fill="url(#greenGlow)"
                />
                <path
                  d={`M ${leftX} ${topY + 5} C ${leftX + 110} ${topY + 45}, ${leftX + 240} ${bottomY - 10}, ${rightX} ${bottomY - 3}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <line
                x1={leftX}
                y1={bottomY - 3}
                x2={rightX}
                y2={bottomY - 3}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}

            {/* End Callout Labels (Neatly placed without overlapping grid or axis) */}
            <g transform={`translate(${rightX - 95}, ${topY - 15})`}>
              <rect x="0" y="0" width="105" height="16" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="0.8" />
              <text x="52" y="11" fill="#fca5a5" fontSize="8" fontWeight="700" textAnchor="middle">▲ Control Escalation</text>
            </g>

            {isApplied && (
              <g transform={`translate(${rightX - 110}, ${bottomY + 22})`}>
                <rect x="0" y="0" width="120" height="16" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="0.8" />
                <text x="60" y="11" fill="#6ee7b7" fontSize="8" fontWeight="700" textAnchor="middle">▼ Adjuvant Suppression</text>
              </g>
            )}

            {/* Live Vertical Cursor Timeline Line */}
            <line x1={currentX} y1={topY - 8} x2={currentX} y2={bottomY + 4} stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Live Glowing Pin: Control (Red) */}
            <circle cx={currentX} cy={controlPinY} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

            {/* Live Glowing Pin: Treated (Green) */}
            {isApplied ? (
              <circle cx={currentX} cy={treatedPinY} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            ) : (
              <circle cx={currentX} cy={bottomY - 3} r="3.5" fill="#64748b" stroke="#ffffff" strokeWidth="1" />
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
