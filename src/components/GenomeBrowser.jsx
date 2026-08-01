/**
 * GenomeBrowser.jsx
 * 
 * Interactive BioCyc E. coli K-12 (COLI-K12 replicon) Genome Browser Replica
 * Supports full 4,497 gene dataset (b0001 to b4497 across 4,641,652 bp chromosome),
 * linear track zooming, coordinate jumping, functional pathway categorization, promoter box motifs, and FASTA sequence generator.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { REPLICON_INFO, PATHWAY_CATEGORIES, GENE_LOCI, generateFastaSequence } from '../data/ecoli_genome_k12';

export default function GenomeBrowser({ activeExpressionData, onSelectGene, selectedGene }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [zoomLevel, setZoomLevel] = useState(1); // 1x to 50x
  const [centerBp, setCenterBp] = useState(2320826); // Default chromosome mid-point
  const [jumpInputBp, setJumpInputBp] = useState('');
  const [showFastaModal, setShowFastaModal] = useState(false);

  // Auto-center replicon track when selectedGene changes
  useEffect(() => {
    if (selectedGene && selectedGene.start) {
      setCenterBp(Math.round((selectedGene.start + selectedGene.end) / 2));
    }
  }, [selectedGene]);

  // Expression lookup map
  const expressionMap = useMemo(() => {
    if (!activeExpressionData || !activeExpressionData.geneExpressions) return {};
    const map = {};
    activeExpressionData.geneExpressions.forEach(g => {
      map[g.locusTag] = g;
    });
    return map;
  }, [activeExpressionData]);

  // Linear viewport bounds
  const visibleWindowBp = useMemo(() => {
    const windowSize = REPLICON_INFO.lengthBp / zoomLevel;
    let min = Math.max(1, Math.round(centerBp - windowSize / 2));
    let max = Math.min(REPLICON_INFO.lengthBp, Math.round(centerBp + windowSize / 2));
    return { min, max, size: max - min };
  }, [centerBp, zoomLevel]);

  // Filtered & viewport-windowed genes list covering all 4,497 genes
  const visibleGenes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    
    return GENE_LOCI.filter(gene => {
      const matchesCategory = selectedCategory === 'ALL' || gene.pathway === selectedCategory;
      if (!matchesCategory) return false;

      if (term) {
        return (
          gene.name.toLowerCase().includes(term) ||
          gene.locusTag.toLowerCase().includes(term) ||
          gene.product.toLowerCase().includes(term) ||
          (gene.synonyms && gene.synonyms.some(s => s.toLowerCase().includes(term)))
        );
      }

      // If no search term, return genes in current viewport range or top curated genes
      if (zoomLevel > 1) {
        return gene.end >= visibleWindowBp.min && gene.start <= visibleWindowBp.max;
      }
      
      return true;
    });
  }, [searchTerm, selectedCategory, zoomLevel, visibleWindowBp]);

  // Group visible genes by pathway category
  const groupedGenesByPathway = useMemo(() => {
    const groups = {};
    Object.keys(PATHWAY_CATEGORIES).forEach(catKey => {
      const categoryGenes = visibleGenes.filter(g => g.pathway === catKey);
      if (categoryGenes.length > 0) {
        groups[catKey] = {
          categoryInfo: PATHWAY_CATEGORIES[catKey],
          plusStrand: categoryGenes.filter(g => g.strand === '+').slice(0, 40),
          minusStrand: categoryGenes.filter(g => g.strand === '-').slice(0, 40),
          totalCount: categoryGenes.length
        };
      }
    });
    return groups;
  }, [visibleGenes]);

  // Handle circular genome click to jump coordinates
  const handleCircularClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const clickX = e.clientX - rect.left - cx;
    const clickY = e.clientY - rect.top - cy;

    // Calculate angle in radians [0..2PI] starting from top
    let angle = Math.atan2(clickY, clickX) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;

    const targetBp = Math.round((angle / (2 * Math.PI)) * REPLICON_INFO.lengthBp);
    setCenterBp(targetBp);
  };

  // Jump to coordinate form submit
  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(jumpInputBp.replace(/,/g, ''), 10);
    if (!isNaN(val) && val >= 1 && val <= REPLICON_INFO.lengthBp) {
      setCenterBp(val);
      setJumpInputBp('');
    }
  };

  // Selected gene FASTA generator
  const activeFasta = useMemo(() => {
    if (!selectedGene) return null;
    return generateFastaSequence(selectedGene.locusTag);
  }, [selectedGene]);

  return (
    <div className="genome-browser-container">
      {/* Top Header - BioCyc Replica Info */}
      <div className="biocyc-header">
        <div className="biocyc-branding">
          <div className="biocyc-logo">BioCyc</div>
          <div className="biocyc-title-group">
            <h2>E. coli K-12 Whole Genome Browser</h2>
            <div className="biocyc-replicon-tag">
              <span>Replicon: <strong>{REPLICON_INFO.replicon}</strong> ({REPLICON_INFO.lengthBp.toLocaleString()} bp)</span>
              <span className="dot-sep">•</span>
              <span>All <strong>{REPLICON_INFO.totalGenesCount.toLocaleString()} Genes Loaded</strong> (b0001..b4497)</span>
              <span className="dot-sep">•</span>
              <span>GenBank: <a href={`https://www.ncbi.nlm.nih.gov/nuccore/${REPLICON_INFO.genbankAcc}`} target="_blank" rel="noreferrer">{REPLICON_INFO.genbankAcc}</a></span>
            </div>
          </div>
        </div>

        <a 
          href={REPLICON_INFO.biocycUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="biocyc-external-link"
        >
          Open on BioCyc.org ↗
        </a>
      </div>

      {/* Control Bar: Search, Category Filter & Coordinate Jump */}
      <div className="genome-controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search across all 4,497 genes (recA, lexA, b0001..b4497, product)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <form onSubmit={handleJumpSubmit} className="jump-coord-form">
          <input
            type="text"
            placeholder="Jump to bp (e.g. 1000000)..."
            value={jumpInputBp}
            onChange={(e) => setJumpInputBp(e.target.value)}
            className="jump-input"
          />
          <button type="submit" className="jump-btn">Go</button>
        </form>

        <div className="pathway-filters">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-dropdown"
          >
            <option value="ALL">All 4,497 Genes (8 Functional Pathways)</option>
            {Object.entries(PATHWAY_CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Jump Buttons */}
      <div className="quick-jump-bar">
        <span className="jump-label">Quick Jump Locus Range:</span>
        <button className="quick-jump-btn" onClick={() => setCenterBp(1000)}>0 Mb (oriC)</button>
        <button className="quick-jump-btn" onClick={() => setCenterBp(1000000)}>1.0 Mb (recA / sulA)</button>
        <button className="quick-jump-btn" onClick={() => setCenterBp(2320826)}>2.32 Mb (ter)</button>
        <button className="quick-jump-btn" onClick={() => setCenterBp(3500000)}>3.5 Mb (gadAB)</button>
        <button className="quick-jump-btn" onClick={() => setCenterBp(4243000)}>4.24 Mb (lexA / uvrA)</button>
      </div>

      {/* Main Dual Grid: Left 360° Circular Genome, Right Categorized Linear Replicon Track */}
      <div className="genome-dual-view">
        {/* Left: Circular Chromosome (4.64 Mb) */}
        <div className="circular-view-card">
          <div className="card-header">
            <h3>Circular Chromosome (4.64 Mb)</h3>
            <span className="card-sub">Click circumference to jump replicon position</span>
          </div>

          <div className="circular-svg-container" onClick={handleCircularClick}>
            <svg viewBox="0 0 300 300" className="circular-genome-svg">
              {/* Outer Backbone */}
              <circle cx="150" cy="150" r="110" fill="none" stroke="var(--panel-border)" strokeWidth="8" />
              
              {/* Replicon Origin (oriC ~3.92 Mb) & Ter markers */}
              <text x="150" y="32" fill="#2563eb" fontSize="10" textAnchor="middle" fontWeight="bold">oriC (0 Mb / 4.64 Mb)</text>
              <text x="150" y="278" fill="var(--text-muted)" fontSize="9" textAnchor="middle">ter (2.32 Mb)</text>

              {/* Sampled Gene Loci Dots on Circumference */}
              {GENE_LOCI.filter((_, idx) => idx % 12 === 0).map((gene) => {
                const angle = (gene.start / REPLICON_INFO.lengthBp) * 2 * Math.PI - Math.PI / 2;
                const r = 110;
                const x = 150 + r * Math.cos(angle);
                const y = 150 + r * Math.sin(angle);
                const isSelected = selectedGene && selectedGene.locusTag === gene.locusTag;

                const expr = expressionMap[gene.locusTag];
                let color = PATHWAY_CATEGORIES[gene.pathway]?.color || '#64748b';
                if (expr && expr.regulation === 'UPREGULATED') color = '#16a34a';
                if (expr && expr.regulation === 'DOWNREGULATED') color = '#dc2626';

                return (
                  <g key={gene.locusTag} className="circular-gene-group" onClick={(e) => { e.stopPropagation(); onSelectGene(gene); }}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 6 : (expr && expr.foldChange > 2 ? 5 : 3.5)}
                      fill={color}
                      stroke={isSelected ? 'var(--text-primary)' : 'none'}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                  </g>
                );
              })}

              {/* Viewport Arc Indicator */}
              {(() => {
                const startAngle = (visibleWindowBp.min / REPLICON_INFO.lengthBp) * 2 * Math.PI - Math.PI / 2;
                const endAngle = (visibleWindowBp.max / REPLICON_INFO.lengthBp) * 2 * Math.PI - Math.PI / 2;
                const r = 110;
                const x1 = 150 + r * Math.cos(startAngle);
                const y1 = 150 + r * Math.sin(startAngle);
                const x2 = 150 + r * Math.cos(endAngle);
                const y2 = 150 + r * Math.sin(endAngle);
                const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;

                return (
                  <path
                    d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="4"
                    opacity="0.8"
                  />
                );
              })()}

              {/* Center Info */}
              <g transform="translate(150, 150)">
                <text textAnchor="middle" y="-10" fill="var(--text-primary)" fontSize="13" fontWeight="bold">COLI-K12</text>
                <text textAnchor="middle" y="10" fill="var(--text-muted)" fontSize="10">{centerBp.toLocaleString()} bp</text>
                <text textAnchor="middle" y="26" fill="var(--accent)" fontSize="9">Zoom: {zoomLevel}×</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Categorized Linear Replicon Track */}
        <div className="linear-view-card">
          <div className="linear-card-header">
            <div>
              <h3>Categorized Replicon Gene Track</h3>
              <div className="viewport-coords">
                Showing {visibleWindowBp.min.toLocaleString()} bp — {visibleWindowBp.max.toLocaleString()} bp (Span: {visibleWindowBp.size.toLocaleString()} bp)
              </div>
            </div>

            {/* Zoom Slider */}
            <div className="zoom-control-group">
              <span className="zoom-label">Zoom Level:</span>
              <input
                type="range"
                min="1"
                max="50"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="zoom-slider"
              />
              <span className="zoom-val">{zoomLevel}×</span>
            </div>
          </div>

          {/* Base Pair Coordinate Ruler */}
          <div className="bp-ruler">
            <div className="ruler-line"></div>
            <div className="ruler-ticks">
              <span>{visibleWindowBp.min.toLocaleString()} bp</span>
              <span>{Math.round((visibleWindowBp.min + visibleWindowBp.max) / 2).toLocaleString()} bp</span>
              <span>{visibleWindowBp.max.toLocaleString()} bp</span>
            </div>
          </div>

          {/* Categorized Pathway Sections */}
          <div className="loci-track-container">
            {Object.keys(groupedGenesByPathway).length === 0 ? (
              <div className="no-genes-msg">No matching gene loci found for "{searchTerm}".</div>
            ) : (
              Object.entries(groupedGenesByPathway).map(([catKey, group]) => (
                <div key={catKey} className="pathway-category-section" style={{ '--cat-color': group.categoryInfo.color }}>
                  {/* Category Header Bar */}
                  <div className="category-section-header">
                    <span className="category-icon">{group.categoryInfo.icon}</span>
                    <h4 className="category-title">{group.categoryInfo.name}</h4>
                    <span className="category-count-badge">{group.totalCount} Genes</span>
                  </div>

                  {/* + Strand Genes */}
                  {group.plusStrand.length > 0 && (
                    <div className="strand-group">
                      <div className="strand-label strand-plus">+ Strand (5' → 3')</div>
                      <div className="loci-track-lane lane-plus">
                        {group.plusStrand.map((gene) => {
                          const expr = expressionMap[gene.locusTag];
                          const isSelected = selectedGene && selectedGene.locusTag === gene.locusTag;
                          const pathColor = group.categoryInfo.color;

                          return (
                            <div
                              key={gene.locusTag}
                              className={`gene-block-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onSelectGene(gene)}
                              style={{
                                '--path-color': pathColor,
                              }}
                            >
                              <div className="gene-locus-badge">{gene.locusTag}</div>
                              <div className="gene-name-title">{gene.name}</div>
                              <div className="gene-product-subtitle">{gene.product}</div>
                              <div className="gene-coords-tag">{gene.start.toLocaleString()}..{gene.end.toLocaleString()} bp</div>

                              {expr && expr.regulation !== 'UNCHANGED' && (
                                <div className={`expr-tag ${expr.regulation.toLowerCase()}`}>
                                  {expr.regulation === 'UPREGULATED' ? '▲' : '▼'} {expr.foldChange}×
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* - Strand Genes */}
                  {group.minusStrand.length > 0 && (
                    <div className="strand-group">
                      <div className="strand-label strand-minus">- Strand (3' ← 5')</div>
                      <div className="loci-track-lane lane-minus">
                        {group.minusStrand.map((gene) => {
                          const expr = expressionMap[gene.locusTag];
                          const isSelected = selectedGene && selectedGene.locusTag === gene.locusTag;
                          const pathColor = group.categoryInfo.color;

                          return (
                            <div
                              key={gene.locusTag}
                              className={`gene-block-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => onSelectGene(gene)}
                              style={{
                                '--path-color': pathColor,
                              }}
                            >
                              <div className="gene-locus-badge">{gene.locusTag}</div>
                              <div className="gene-name-title">{gene.name}</div>
                              <div className="gene-product-subtitle">{gene.product}</div>
                              <div className="gene-coords-tag">{gene.start.toLocaleString()}..{gene.end.toLocaleString()} bp</div>

                              {expr && expr.regulation !== 'UNCHANGED' && (
                                <div className={`expr-tag ${expr.regulation.toLowerCase()}`}>
                                  {expr.regulation === 'UPREGULATED' ? '▲' : '▼'} {expr.foldChange}×
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Gene Detail & FASTA Viewer Drawer / Panel */}
      {selectedGene && (
        <div className="gene-detail-panel">
          <div className="detail-header">
            <div className="detail-title-group">
              <span className="detail-locus-pill">{selectedGene.locusTag}</span>
              <h3>{selectedGene.name} <em>({selectedGene.product})</em></h3>
            </div>
            <button className="close-detail-btn" onClick={() => onSelectGene(null)}>✕</button>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Replicon Location:</span>
              <span className="val">{selectedGene.start.toLocaleString()} — {selectedGene.end.toLocaleString()} bp ({selectedGene.end - selectedGene.start} bp)</span>
            </div>

            <div className="detail-item">
              <span className="label">Strand Orientation:</span>
              <span className="val">{selectedGene.strand === '+' ? "Forward (+ strand 5'→3')" : "Reverse (- strand 3'←5')"}</span>
            </div>

            <div className="detail-item">
              <span className="label">Operon Association:</span>
              <span className="val">{selectedGene.operon || 'Single gene transcription unit'}</span>
            </div>

            <div className="detail-item">
              <span className="label">Functional Pathway:</span>
              <span className="val" style={{ color: PATHWAY_CATEGORIES[selectedGene.pathway]?.color, fontWeight: 700 }}>
                {PATHWAY_CATEGORIES[selectedGene.pathway]?.name}
              </span>
            </div>
          </div>

          <p className="detail-desc">{selectedGene.description}</p>

          {selectedGene.promoters && (
            <div className="promoter-box-section">
              <span className="section-label">Promoters & Regulatory Binding Motifs:</span>
              <div className="promoter-tags">
                {selectedGene.promoters.map(p => (
                  <span key={p} className="promoter-tag">⚡ {p}</span>
                ))}
                {selectedGene.regulatoryMotifs && selectedGene.regulatoryMotifs.map(m => (
                  <span key={m} className="motif-tag">🔒 {m}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action: Open FASTA Generator */}
          <div className="detail-actions">
            <button 
              className="fasta-btn"
              onClick={() => setShowFastaModal(true)}
            >
              📄 View Nucleotide Sequence (FASTA)
            </button>

            <a
              href={`https://biocyc.org/gene?orgid=ECOLI&id=${selectedGene.locusTag}`}
              target="_blank"
              rel="noreferrer"
              className="biocyc-gene-link"
            >
              View on BioCyc / EcoCyc Database ↗
            </a>
          </div>
        </div>
      )}

      {/* FASTA Modal */}
      {showFastaModal && selectedGene && activeFasta && (
        <div className="fasta-modal-overlay" onClick={() => setShowFastaModal(false)}>
          <div className="fasta-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nucleotide FASTA Sequence — {selectedGene.name} ({selectedGene.locusTag})</h3>
              <button className="close-modal-btn" onClick={() => setShowFastaModal(false)}>✕</button>
            </div>

            <div className="fasta-meta-bar">
              <span>Length: <strong>{activeFasta.lengthBp} bp</strong></span>
              <span>Coordinates: <strong>{selectedGene.start}..{selectedGene.end} bp</strong></span>
              <span>Strand: <strong>{selectedGene.strand}</strong></span>
            </div>

            <textarea 
              className="fasta-textarea"
              readOnly 
              value={activeFasta.fastaText}
            />

            <div className="modal-footer">
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(activeFasta.fastaText);
                  alert('FASTA sequence copied to clipboard!');
                }}
              >
                📋 Copy FASTA to Clipboard
              </button>
              
              <button 
                className="download-btn"
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([activeFasta.fastaText], {type: 'text/plain'});
                  element.href = URL.createObjectURL(file);
                  element.download = `${selectedGene.locusTag}_${selectedGene.name}.fasta`;
                  document.body.appendChild(element);
                  element.click();
                }}
              >
                💾 Download .FASTA File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
