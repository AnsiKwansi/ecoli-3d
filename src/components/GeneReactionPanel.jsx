/**
 * GeneReactionPanel.jsx
 * 
 * Environmental Condition Reaction & Gene Expression Testing Simulator Panel
 * Allows users to test E. coli genome response under UV, ROS, Antibiotic, Thermal, Acid, and Osmotic stresses.
 * Powered by real-time ODE kinetics engine for live transcription/translation dynamics over time.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ENVIRONMENTAL_CONDITIONS, calculateGeneExpressions } from '../simulation/GeneExpressionEngine';
import { kineticsInstance } from '../simulation/KineticsEngine';
import { PATHWAY_CATEGORIES } from '../data/ecoli_genome_k12';

export default function GeneReactionPanel({ onExpressionUpdate, onSelectGene }) {
  const [selectedCondition, setSelectedCondition] = useState(ENVIRONMENTAL_CONDITIONS[0]);
  const [intensity, setIntensity] = useState(selectedCondition.defaultIntensity);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastAssayResult, setLastAssayResult] = useState(null);
  const [kineticsState, setKineticsState] = useState(kineticsInstance.getCurrentState());

  // Subscribe to real-time kinetics engine
  useEffect(() => {
    kineticsInstance.setCondition(selectedCondition.id, intensity);
    const unsubscribe = kineticsInstance.subscribe((state) => {
      setKineticsState(state);
    });
    return unsubscribe;
  }, [selectedCondition, intensity]);

  // Update intensity when condition changes
  const handleConditionChange = (cond) => {
    setSelectedCondition(cond);
    setIntensity(cond.defaultIntensity);
    kineticsInstance.setCondition(cond.id, cond.defaultIntensity);
  };

  // Calculate base gene expression kinetics
  const rawExpressionResults = useMemo(() => {
    return calculateGeneExpressions(selectedCondition.id, intensity);
  }, [selectedCondition, intensity]);

  // Apply live time-series scaling from kinetics engine to make fold-changes dynamic over time
  const expressionResults = useMemo(() => {
    const timeFactor = Math.min(1.0, Math.max(0.1, kineticsState.timeMin / 15.0));
    const dynamicGenes = rawExpressionResults.geneExpressions.map(gene => {
      if (gene.regulation === 'UNCHANGED') return gene;
      const liveFold = Number((1.0 + (gene.foldChange - 1.0) * timeFactor * kineticsState.inductionProfile).toFixed(2));
      return {
        ...gene,
        foldChange: liveFold
      };
    });

    const maxFoldGene = [...dynamicGenes].sort((a, b) => b.foldChange - a.foldChange)[0];

    return {
      ...rawExpressionResults,
      geneExpressions: dynamicGenes,
      summary: {
        ...rawExpressionResults.summary,
        maxFoldGene
      }
    };
  }, [rawExpressionResults, kineticsState]);

  // Sync results to parent/genome browser
  useEffect(() => {
    if (onExpressionUpdate) {
      onExpressionUpdate(expressionResults);
    }
  }, [expressionResults, onExpressionUpdate]);

  const sortedGenesByFold = useMemo(() => {
    return [...expressionResults.geneExpressions]
      .filter(g => g.regulation !== 'UNCHANGED')
      .sort((a, b) => b.foldChange - a.foldChange);
  }, [expressionResults]);

  // Execute Assay Action
  const handleExecuteAssay = () => {
    setIsSimulating(true);
    kineticsInstance.reset();
    kineticsInstance.start();
    setTimeout(() => {
      setIsSimulating(false);
      setLastAssayResult({
        condition: selectedCondition,
        intensity,
        summary: expressionResults.summary,
        timestamp: new Date().toLocaleTimeString()
      });
    }, 600);
  };

  return (
    <div className="gene-reaction-container">
      {/* Control Banner */}
      <div className="reaction-header">
        <h2>Environmental Condition Gene Reaction Matrix</h2>
        <p>Real-time transcription kinetics, regulon induction, and dynamic fold-change expression across the 4.64 Mb E. coli K-12 genome under environmental stressors.</p>
      </div>

      {/* Grid: Left Condition Controls, Right Expression Heatmap & Fold-Change Charts */}
      <div className="reaction-grid">
        {/* Left: Stressor Selector & Controls */}
        <div className="reaction-controls-card">
          <h3>Select Environmental Stress Factor</h3>
          
          <div className="condition-selector-list">
            {ENVIRONMENTAL_CONDITIONS.map((cond) => (
              <button
                key={cond.id}
                className={`condition-btn ${selectedCondition.id === cond.id ? 'active' : ''}`}
                style={{ '--cond-color': cond.color }}
                onClick={() => handleConditionChange(cond)}
              >
                <span className="cond-icon">{cond.icon}</span>
                <div className="cond-info">
                  <div className="cond-name">{cond.name}</div>
                  <div className="cond-cat">{cond.category}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Intensity Slider */}
          <div className="intensity-control-group">
            <label className="intensity-label">
              <span>Stress Dose / Intensity ({selectedCondition.unit}):</span>
              <strong style={{ color: selectedCondition.color }}>{intensity} {selectedCondition.unit}</strong>
            </label>

            <input
              type="range"
              min={selectedCondition.min}
              max={selectedCondition.max}
              step={selectedCondition.unit === 'mM' || selectedCondition.unit === 'µg/mL' ? 0.5 : 1}
              value={intensity}
              onChange={(e) => {
                const val = Number(e.target.value);
                setIntensity(val);
                kineticsInstance.setCondition(selectedCondition.id, val);
              }}
              className="intensity-slider"
              style={{ '--thumb-color': selectedCondition.color }}
            />

            <div className="slider-limits">
              <span>Min: {selectedCondition.min} {selectedCondition.unit}</span>
              <span>Max: {selectedCondition.max} {selectedCondition.unit}</span>
            </div>
          </div>

          {/* Condition Description & Regulon */}
          <div className="condition-summary-box" style={{ borderColor: selectedCondition.color }}>
            <div className="summary-title">Primary Regulatory Regulon:</div>
            <div className="regulon-badge" style={{ backgroundColor: selectedCondition.color }}>
              {selectedCondition.primaryRegulon}
            </div>
            <p className="summary-text">{selectedCondition.description}</p>
          </div>

          {/* Execute Button */}
          <button
            className="run-test-btn"
            style={{ backgroundColor: selectedCondition.color }}
            onClick={handleExecuteAssay}
            disabled={isSimulating}
          >
            {isSimulating ? '⚡ Initializing Live Kinetics...' : '🧪 Execute Stress Assay'}
          </button>
        </div>

        {/* Right: Real-Time Live Kinetics & Fold-Change Charts */}
        <div className="reaction-results-card">
          {/* Sleek High-Contrast Biological Kinetics Toolbar */}
          <div className="kinetics-toolbar">
            <div className="time-display-group">
              <div className="time-badge">
                <span className="live-pulse-dot"></span>
                <span className="time-label">Post-Exposure Time:</span>
                <strong className="time-val">t = {kineticsState.timeMin} min</strong>
              </div>
            </div>

            <div className="playback-controls">
              {kineticsState.isPlaying ? (
                <button className="kinetics-btn pause-btn" onClick={() => kineticsInstance.pause()}>
                  ⏸ Pause Kinetics
                </button>
              ) : (
                <button className="kinetics-btn play-btn" onClick={() => kineticsInstance.start()}>
                  ▶ Run Live Kinetics
                </button>
              )}

              <button className="kinetics-btn reset-btn" onClick={() => kineticsInstance.reset()}>
                🔄 Reset (t=0)
              </button>

              <div className="speed-selector">
                <button className={`speed-btn ${kineticsState.speedMultiplier === 1 ? 'active' : ''}`} onClick={() => kineticsInstance.setSpeed(1)}>1×</button>
                <button className={`speed-btn ${kineticsState.speedMultiplier === 2 ? 'active' : ''}`} onClick={() => kineticsInstance.setSpeed(2)}>2×</button>
                <button className={`speed-btn ${kineticsState.speedMultiplier === 5 ? 'active' : ''}`} onClick={() => kineticsInstance.setSpeed(5)}>5×</button>
                <button className={`speed-btn ${kineticsState.speedMultiplier === 10 ? 'active' : ''}`} onClick={() => kineticsInstance.setSpeed(10)}>10×</button>
              </div>
            </div>
          </div>

          {/* Active Assay Execution Diagnostic Banner */}
          {lastAssayResult && (
            <div className="assay-execution-banner" style={{ borderColor: lastAssayResult.condition.color }}>
              <div className="banner-title">
                <span>✅ Live Kinetics Assay Running: <strong>{lastAssayResult.condition.name}</strong> ({lastAssayResult.intensity} {lastAssayResult.condition.unit})</span>
              </div>
              <div className="banner-details">
                <span>Induction Status: <strong>{lastAssayResult.summary.regulonStatus}</strong></span>
                <span className="dot-sep">•</span>
                <span>Max Induced Gene: <strong style={{ color: lastAssayResult.condition.color }}>{lastAssayResult.summary.maxFoldGene?.name} ({lastAssayResult.summary.maxFoldGene?.foldChange}×)</strong></span>
              </div>
              {lastAssayResult.summary.maxFoldGene && (
                <button
                  className="banner-jump-btn"
                  onClick={() => onSelectGene && onSelectGene(lastAssayResult.summary.maxFoldGene)}
                >
                  🔍 View {lastAssayResult.summary.maxFoldGene.name} in Genome Browser
                </button>
              )}
            </div>
          )}

          {/* Live Real-Time Biological Telemetry Grid */}
          <div className="live-telemetry-grid">
            <div className="telemetry-card">
              <span className="telemetry-lbl">mRNA Accumulation</span>
              <strong className="telemetry-val text-blue">{kineticsState.mRNACopies.toLocaleString()} <small>copies/cell</small></strong>
              <div className="telemetry-sub">Synthesis Rate: {kineticsState.elongationRateNtSec} nt/sec</div>
            </div>

            <div className="telemetry-card">
              <span className="telemetry-lbl">Protein Yield</span>
              <strong className="telemetry-val text-green">{kineticsState.proteinMolecules.toLocaleString()} <small>molecules</small></strong>
              <div className="telemetry-sub">Active RNAP: {kineticsState.activeRNAP.toLocaleString()}</div>
            </div>

            <div className="telemetry-card">
              <span className="telemetry-lbl">TF Binding Affinity</span>
              <strong className="telemetry-val text-purple">{kineticsState.transcriptionFactorBindingPct}% <small>bound</small></strong>
              <div className="telemetry-sub">Induction: {(kineticsState.inductionProfile * 100).toFixed(0)}%</div>
            </div>

            <div className="telemetry-card">
              <span className="telemetry-lbl">Cell Viability Rate</span>
              <strong className={`telemetry-val ${kineticsState.viability > 70 ? 'text-green' : 'text-red'}`}>{kineticsState.viability}% <small>alive</small></strong>
              <div className="telemetry-sub">Stress Load: {selectedCondition.name}</div>
            </div>
          </div>

          <div className="results-header">
            <h3>Live Transcriptional Fold-Change Kinetics</h3>
            <div className="regulon-status-pill">
              {expressionResults.summary.regulonStatus}
            </div>
          </div>

          {/* Gene Fold-Change Bar Chart */}
          <div className="fold-chart-container">
            <h4>Highest Responding Loci (Dynamic Real-Time Fold-Change)</h4>

            <div className={`fold-bars-list ${isSimulating ? 'simulating-pulse' : ''}`}>
              {sortedGenesByFold.length === 0 ? (
                <div className="no-genes-msg">No genes significantly upregulated for this condition intensity.</div>
              ) : (
                sortedGenesByFold.map((gene) => {
                  const maxFold = expressionResults.summary.maxFoldGene ? expressionResults.summary.maxFoldGene.foldChange : 50;
                  const barWidth = Math.min(100, Math.max(5, (gene.foldChange / maxFold) * 100));
                  const pathColor = PATHWAY_CATEGORIES[gene.pathway]?.color || '#3b82f6';

                  return (
                    <div 
                      key={gene.locusTag} 
                      className="fold-bar-item"
                      onClick={() => onSelectGene && onSelectGene(gene)}
                      title={`Click to view ${gene.name} (${gene.locusTag}) in Genome Browser`}
                    >
                      <div className="bar-gene-info">
                        <span className="bar-gene-name">{gene.name}</span>
                        <span className="bar-gene-locus">({gene.locusTag})</span>
                      </div>

                      <div className="bar-track">
                        <div 
                          className={`bar-fill ${gene.regulation.toLowerCase()}`}
                          style={{ width: `${barWidth}%`, backgroundColor: gene.regulation === 'UPREGULATED' ? pathColor : '#ef4444' }}
                        ></div>
                      </div>

                      <div className="bar-value">
                        <span className={gene.regulation === 'UPREGULATED' ? 'text-green' : 'text-red'}>
                          {gene.regulation === 'UPREGULATED' ? '▲' : '▼'} {gene.foldChange}×
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
