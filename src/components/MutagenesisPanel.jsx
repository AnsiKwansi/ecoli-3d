import React, { useState } from 'react';
import { MUTAGENESIS_TYPES } from '../data/mutagenesis_data';
import LiveDnaMutagenesisSimulator from './LiveDnaMutagenesisSimulator';

export default function MutagenesisPanel({ onSelectLiteratureTerm }) {
  const [selectedTypeId, setSelectedTypeId] = useState('sim');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const selectedType = MUTAGENESIS_TYPES.find(t => t.id === selectedTypeId) || MUTAGENESIS_TYPES[0];

  const categories = ['ALL', ...new Set(MUTAGENESIS_TYPES.map(t => t.category))];

  const filteredTypes = activeCategoryFilter === 'ALL'
    ? MUTAGENESIS_TYPES
    : MUTAGENESIS_TYPES.filter(t => t.category === activeCategoryFilter);

  return (
    <div className="mutagenesis-panel-container">
      {/* Header */}
      <div className="mutagenesis-header">
        <div>
          <h2>🧬 In-Depth Mutagenesis Spectrum & Pathways in <i>E. coli</i></h2>
          <p className="subtitle">
            Molecular mechanisms of spontaneous, lesion-bypass, oxidative, and stress-induced mutagenesis (Dr. Shee Lab)
          </p>
        </div>
        <div className="category-filter-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pill-btn ${activeCategoryFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mutagenesis-layout">
        {/* Left Sidebar: List of Mutagenesis Types */}
        <div className="mutagenesis-list-sidebar">
          {filteredTypes.map(type => (
            <div
              key={type.id}
              className={`mutagenesis-card-item ${selectedTypeId === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedTypeId(type.id)}
            >
              <div className="card-item-header">
                <span className="card-item-title">{type.name}</span>
                <span className="card-item-badge">{type.category}</span>
              </div>
              <div className="card-item-rates">
                <span>Basal: <code className="code-rate">{type.baseRatePerGen}</code></span>
                <span>Stressed: <code className="code-rate stressed">{type.stressedRatePerGen}</code></span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Area: Deep Dive Detail View */}
        <div className="mutagenesis-detail-view">
          <div className="detail-header-banner">
            <h3>{selectedType.name}</h3>
            <span className="category-tag">{selectedType.category}</span>
          </div>

          <p className="detail-description">{selectedType.description}</p>

          {/* Quick Metrics Bar */}
          <div className="detail-metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Basal Mutation Rate</span>
              <span className="metric-val">{selectedType.baseRatePerGen} / bp / gen</span>
            </div>
            <div className="metric-box highlight">
              <span className="metric-label">Stress-Induced Multiplier</span>
              <span className="metric-val text-amber">
                {(Number(selectedType.stressedRatePerGen) / Number(selectedType.baseRatePerGen)).toLocaleString()}× Upregulated
              </span>
            </div>
            <div className="metric-box">
              <span className="metric-label">Stressed Mutation Rate</span>
              <span className="metric-val text-red">{selectedType.stressedRatePerGen} / bp / gen</span>
            </div>
          </div>

          {/* Interactive Live DNA Sequence & Base-Pairing Alignment Simulator */}
          <LiveDnaMutagenesisSimulator selectedType={selectedType} />

          {/* Key Enzymes Interactive Tags */}
          <div className="detail-section">
            <h4>🔬 Primary Enzymes & Molecular Factors</h4>
            <div className="enzymes-flex-list">
              {selectedType.primaryEnzymes.map(enzyme => (
                <button
                  key={enzyme}
                  className="enzyme-btn"
                  onClick={() => onSelectLiteratureTerm && onSelectLiteratureTerm(enzyme)}
                  title={`Click to lookup "${enzyme}" in Dr. Shee literature reference`}
                >
                  <span className="enzyme-icon">🧪</span>
                  <span>{enzyme}</span>
                  <span className="lookup-hint">🔍 lookup</span>
                </button>
              ))}
            </div>
          </div>

          {/* Environmental Drivers */}
          <div className="detail-section">
            <h4>🧪 Key Environmental Stress Drivers</h4>
            <div className="drivers-flex-list">
              {selectedType.environmentalDrivers.map(driver => (
                <span key={driver} className="driver-pill">
                  ⚡ {driver}
                </span>
              ))}
            </div>
          </div>

          {/* Mutational Spectrum Bar Breakdown */}
          <div className="detail-section">
            <h4>📊 Mutational Spectrum Distribution (%)</h4>
            <div className="spectrum-bars-container">
              <div className="spectrum-bar-item">
                <div className="bar-info">
                  <span>Transitions (A:T ↔ G:C)</span>
                  <span>{selectedType.spectrum.transitions}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill transition-fill"
                    style={{ width: `${selectedType.spectrum.transitions}%` }}
                  ></div>
                </div>
              </div>

              <div className="spectrum-bar-item">
                <div className="bar-info">
                  <span>Transversions (Purine ↔ Pyrimidine)</span>
                  <span>{selectedType.spectrum.transversions}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill transversion-fill"
                    style={{ width: `${selectedType.spectrum.transversions}%` }}
                  ></div>
                </div>
              </div>

              <div className="spectrum-bar-item">
                <div className="bar-info">
                  <span>Frameshifts (+1 / -1 bp)</span>
                  <span>{selectedType.spectrum.frameshifts}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill frameshift-fill"
                    style={{ width: `${selectedType.spectrum.frameshifts}%` }}
                  ></div>
                </div>
              </div>

              <div className="spectrum-bar-item">
                <div className="bar-info">
                  <span>Structural Deletions / IS Insertion</span>
                  <span>{selectedType.spectrum.deletions}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill deletion-fill"
                    style={{ width: `${selectedType.spectrum.deletions}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Molecular Mechanism Deep Dive */}
          <div className="detail-section mechanism-box">
            <h4>🧬 Molecular Mechanism</h4>
            <p>{selectedType.molecularMechanism}</p>
          </div>

          {/* Evolutionary & Biological Significance */}
          <div className="detail-section significance-box">
            <h4>🎯 Biological Significance & Evolvability</h4>
            <p>{selectedType.biologicalSignificance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
