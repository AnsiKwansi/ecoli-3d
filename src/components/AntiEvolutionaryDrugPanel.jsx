import React, { useState } from 'react';
import { ANTI_EVOLUTIONARY_DRUGS } from '../data/anti_evolutionary_drugs_data';

export default function AntiEvolutionaryDrugPanel({ simState, dispatch }) {
  const [selectedDrugId, setSelectedDrugId] = useState('lexa_inh_1');
  const [dosage, setDosage] = useState(100); // nM or uM
  const [appliedDrugs, setAppliedDrugs] = useState([]);

  const selectedDrug = ANTI_EVOLUTIONARY_DRUGS.find(d => d.id === selectedDrugId) || ANTI_EVOLUTIONARY_DRUGS[0];

  // Calculate live efficacy based on dosage and selected drug
  const maxSupp = selectedDrug.maxSuppressionPct;
  const currentSuppression = Math.round((maxSupp * dosage) / (dosage + 50));
  const effectiveMutationRate = ((simState.mutationRate || 1.2e-6) * (1 - currentSuppression / 100)).toExponential(2);
  const resistanceDelayMultiplier = Math.round((Number(selectedDrug.amrDelayFactor.replace('x', '')) * currentSuppression) / 100);

  const toggleApplyDrug = (drug) => {
    if (appliedDrugs.some(d => d.id === drug.id)) {
      setAppliedDrugs(appliedDrugs.filter(d => d.id !== drug.id));
      if (dispatch) {
        dispatch({ type: 'REMOVE_ANTI_EVOLUTIONARY_DRUG', payload: drug.id });
      }
    } else {
      const drugConfig = { ...drug, dosage, suppression: currentSuppression };
      setAppliedDrugs([...appliedDrugs, drugConfig]);
      if (dispatch) {
        dispatch({ type: 'APPLY_ANTI_EVOLUTIONARY_DRUG', payload: drugConfig });
      }
    }
  };

  return (
    <div className="anti-evo-panel-container">
      {/* Panel Header */}
      <div className="anti-evo-header">
        <div>
          <h2>💊 Antimutagenesis & Anti-Evolutionary Drug Screening</h2>
          <p className="subtitle">
            Targeting pro-mutator pathways (LexA cleavage, RecA filamentation, DinB/Pol IV, Pol V) to block antimicrobial resistance (AMR) evolution
          </p>
        </div>
        <div className="applied-drugs-count-badge">
          <span>Active Screening Adjuvants: <strong>{appliedDrugs.length}</strong></span>
        </div>
      </div>

      <div className="anti-evo-layout">
        {/* Sidebar: Candidate Drug Targets */}
        <div className="anti-evo-sidebar">
          <h4>🎯 Anti-Evolutionary Drug Candidates</h4>
          {ANTI_EVOLUTIONARY_DRUGS.map(drug => {
            const isApplied = appliedDrugs.some(d => d.id === drug.id);
            return (
              <div
                key={drug.id}
                className={`drug-card-item ${selectedDrugId === drug.id ? 'selected' : ''} ${isApplied ? 'applied' : ''}`}
                onClick={() => setSelectedDrugId(drug.id)}
              >
                <div className="drug-item-header">
                  <span className="drug-name">{drug.name}</span>
                  <span className="drug-badge">{drug.targetCategory}</span>
                </div>
                <div className="drug-target-text">Target: {drug.target}</div>
                <div className="drug-card-footer">
                  <span className="drug-ic50">IC₅₀: {drug.ic50}</span>
                  {isApplied && <span className="applied-tag">✅ ACTIVE IN CELL</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Area: Interactive Screening & Docking Simulator */}
        <div className="anti-evo-detail">
          <div className="drug-detail-banner" style={{ borderLeftColor: selectedDrug.visualColor }}>
            <div>
              <h3>{selectedDrug.name}</h3>
              <div className="drug-meta-row">
                <span className="meta-item">Class: {selectedDrug.chemicalClass}</span>
                <span className="meta-item">Target: {selectedDrug.target}</span>
              </div>
            </div>
            <button
              className={`apply-drug-btn ${appliedDrugs.some(d => d.id === selectedDrug.id) ? 'active' : ''}`}
              onClick={() => toggleApplyDrug(selectedDrug)}
            >
              {appliedDrugs.some(d => d.id === selectedDrug.id)
                ? '🔴 Remove Drug Adjuvant'
                : '🟢 Administer Anti-Evolutionary Compound'}
            </button>
          </div>

          {/* Dosage & Kinetic Controls Slider */}
          <div className="dosage-control-box">
            <div className="slider-label-row">
              <span className="control-title">🧪 Compound Concentration / Dose</span>
              <span className="control-value">{dosage} nM</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={dosage}
              onChange={(e) => setDosage(Number(e.target.value))}
              className="slider dosage-slider"
            />
            <div className="slider-ticks">
              <span>Sub-inhibitory (10 nM)</span>
              <span>Therapeutic (100 nM)</span>
              <span>Saturating (500 nM)</span>
            </div>
          </div>

          {/* Live Efficacy Metrics Dashboard */}
          <div className="efficacy-metrics-grid">
            <div className="eff-card">
              <span className="eff-label">Mutagenesis Suppression</span>
              <span className="eff-val text-green">{currentSuppression}% Reduction</span>
              <div className="eff-progress-track">
                <div
                  className="eff-progress-fill"
                  style={{ width: `${currentSuppression}%`, backgroundColor: '#10b981' }}
                ></div>
              </div>
            </div>

            <div className="eff-card">
              <span className="eff-label">Effective Cellular Mutation Rate</span>
              <span className="eff-val text-blue">{effectiveMutationRate} / bp / gen</span>
              <span className="eff-subtext">Uninhibited: {(simState.mutationRate || 1.2e-6).toExponential(2)}</span>
            </div>

            <div className="eff-card">
              <span className="eff-label">AMR Evolution Delay Factor</span>
              <span className="eff-val text-purple">{resistanceDelayMultiplier}× Slower</span>
              <span className="eff-subtext">Postpones resistance emergence</span>
            </div>
          </div>

          {/* Targeted Molecular Mechanism */}
          <div className="drug-section mechanism-card">
            <h4>🔬 Targeted Inhibitory Mechanism</h4>
            <p>{selectedDrug.mechanism}</p>
          </div>

          {/* Dr. Shee Research Rationale */}
          <div className="drug-section shee-rationale-card">
            <h4>📄 Scientific & Evolutionary Rationale (Dr. Shee Lab)</h4>
            <p>"{selectedDrug.sheeRationale}"</p>
          </div>

          {/* Cellular Impact & Toxicity Profile */}
          <div className="drug-section toxicity-card">
            <h4>🛡️ Cellular Safety Profile & Viability Impact</h4>
            <p>{selectedDrug.cellSurvivalImpact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
