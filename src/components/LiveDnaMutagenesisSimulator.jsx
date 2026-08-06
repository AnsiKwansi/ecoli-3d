import React, { useState, useEffect, useRef } from 'react';

// Default template sequence (24 bp coding fragment)
const INITIAL_TEMPLATE = ['A', 'T', 'G', 'C', 'G', 'T', 'A', 'T', 'T', 'C', 'C', 'G', 'A', 'T', 'T', 'A', 'G', 'C', 'G', 'T', 'A', 'C', 'G', 'T'];

const COMPLEMENT_MAP = {
  'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C',
  '8oG': 'A', // 8-oxoG mispairs with A
  'meG': 'T', // O6-meG mispairs with T
  'TT': 'A',  // Pyrimidine dimer bypassed by Pol IV placing A opposite
  '-': '-',   // Frameshift deletion gap
};

export default function LiveDnaMutagenesisSimulator({ selectedType }) {
  const [templateStrand, setTemplateStrand] = useState(INITIAL_TEMPLATE);
  const [replicatedStrand, setReplicatedStrand] = useState(INITIAL_TEMPLATE.map(b => COMPLEMENT_MAP[b] || 'T'));
  const [stressLevel, setStressLevel] = useState(75); // 0% to 100%
  const [activeMutations, setActiveMutations] = useState([]);
  const [replicationCycle, setReplicationCycle] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Initialize or reset strands based on selected mutagenesis type
  const resetToWildtype = () => {
    const wtTemplate = [...INITIAL_TEMPLATE];
    const wtComplement = wtTemplate.map(b => COMPLEMENT_MAP[b]);
    setTemplateStrand(wtTemplate);
    setReplicatedStrand(wtComplement);
    setActiveMutations([]);
    setReplicationCycle(1);
  };

  // Induce a live mutation event based on current mutagenesis type & stress level
  const induceLiveMutation = () => {
    let newTemplate = [...templateStrand];
    let newReplicated = [...replicatedStrand];
    let newMutationsList = [];

    const typeId = selectedType?.id || 'sim';

    if (typeId === 'base_sub') {
      // Base substitution: G:C -> A:T transition or C:G -> A:T transversion
      const targetIdx = Math.floor(Math.random() * (newTemplate.length - 2)) + 1;
      const originalBase = newTemplate[targetIdx];
      const newBase = originalBase === 'G' ? 'A' : (originalBase === 'A' ? 'G' : (originalBase === 'C' ? 'T' : 'C'));
      newTemplate[targetIdx] = newBase;
      // Replicated strand mispairs initially or fixes new complement
      newReplicated[targetIdx] = COMPLEMENT_MAP[newBase];
      newMutationsList.push({
        pos: targetIdx + 1,
        type: 'Base Substitution',
        desc: `Position #${targetIdx + 1}: ${originalBase} → ${newBase} (${originalBase === 'G' || originalBase === 'A' ? 'Transition' : 'Transversion'})`,
        status: 'MUTATION'
      });
    } 
    else if (typeId === 'tls') {
      // Translesion Synthesis: UV causes T-T dimer at pos 7-8, DinB bypasses with mispair
      const targetIdx = 7;
      newTemplate[targetIdx] = 'TT';
      newTemplate[targetIdx + 1] = 'TT';
      newReplicated[targetIdx] = 'A';
      newReplicated[targetIdx + 1] = 'C'; // Error-prone TLS bypass misinsertion
      newMutationsList.push({
        pos: targetIdx + 1,
        type: 'TLS Bypass Error',
        desc: `Position #${targetIdx + 1}-${targetIdx + 2}: Pyrimidine T-T Dimer bypassed by Pol IV (DinB), misinserting C opposite dimer`,
        status: 'LESION_BYPASS'
      });
    }
    else if (typeId === 'oxidative') {
      // Oxidative 8-oxoG: Guanine oxidizes to 8-oxoG at pos 4, mispairs with Adenine
      const targetIdx = 4;
      newTemplate[targetIdx] = '8oG';
      newReplicated[targetIdx] = 'A'; // 8-oxoG:A mispair -> G:C to T:A transversion
      newMutationsList.push({
        pos: targetIdx + 1,
        type: '8-oxoG Oxidative Damage',
        desc: `Position #${targetIdx + 1}: Guanine oxidized to 8-oxoG by ROS; mispairs with Adenine causing G:C → T:A transversion`,
        status: 'OXIDATIVE'
      });
    }
    else if (typeId === 'frameshift') {
      // Frameshift +1 or -1 bp in homopolymer run (T T T at pos 6-8)
      const isInsertion = Math.random() > 0.5;
      if (isInsertion) {
        newTemplate.splice(8, 0, 'T');
        newReplicated.splice(8, 0, 'A');
        newMutationsList.push({
          pos: 9,
          type: '+1 bp Frameshift Insertion',
          desc: 'Position #9: Pol IV slippage inserted +1 Thymine in TTT homopolymer run, shifting reading frame (+1)',
          status: 'FRAMESHIFT'
        });
      } else {
        newTemplate.splice(8, 1);
        newReplicated.splice(8, 1);
        newMutationsList.push({
          pos: 8,
          type: '-1 bp Frameshift Deletion',
          desc: 'Position #8: Polymerase slippage deleted 1 bp in homopolymer run, shifting reading frame (-1)',
          status: 'FRAMESHIFT'
        });
      }
    }
    else if (typeId === 'alkylation') {
      // Alkylation MNNG: O6-methylguanine at pos 11, pairs with T
      const targetIdx = 10;
      newTemplate[targetIdx] = 'meG';
      newReplicated[targetIdx] = 'T';
      newMutationsList.push({
        pos: targetIdx + 1,
        type: 'O6-Methylguanine Alkylation',
        desc: `Position #${targetIdx + 1}: MNNG alkylation generated O6-meG, pairing with Thymine to fix G:C → A:T mutation`,
        status: 'ALKYLATION'
      });
    }
    else if (typeId === 'is_transposition') {
      // Insertion Sequence transposition
      const targetIdx = 12;
      newTemplate.splice(targetIdx, 0, 'IS5', 'IS5');
      newReplicated.splice(targetIdx, 0, 'IS5', 'IS5');
      newMutationsList.push({
        pos: targetIdx + 1,
        type: 'IS5 Transposon Insertion',
        desc: `Position #${targetIdx + 1}: Stress-induced transposition inserted mobile IS5 element block into promoter/gene`,
        status: 'TRANSPOSON'
      });
    }
    else if (typeId === 'sim') {
      // Stress-Induced Mutagenesis: Cluster of multiple mutations around DSB site
      const targetIdx1 = 5;
      const targetIdx2 = 14;
      newTemplate[targetIdx1] = 'A';
      newReplicated[targetIdx1] = 'C'; // Mismatch
      newTemplate[targetIdx2] = '8oG';
      newReplicated[targetIdx2] = 'A';
      newMutationsList.push({
        pos: targetIdx1 + 1,
        type: 'DSB Hotspot Mutation #1',
        desc: `Position #${targetIdx1 + 1}: Pol IV error near DSB repair focus (G → A substitution)`,
        status: 'MUTATION'
      });
      newMutationsList.push({
        pos: targetIdx2 + 1,
        type: 'DSB Hotspot Mutation #2',
        desc: `Position #${targetIdx2 + 1}: RecA-dependent oxidative lesion cluster (8-oxoG:A mispair)`,
        status: 'MUTATION'
      });
    }
    else {
      // Basal replicative error
      const targetIdx = 11;
      newTemplate[targetIdx] = 'C';
      newReplicated[targetIdx] = 'A'; // Mismatch
      newMutationsList.push({
        pos: targetIdx + 1,
        type: 'Spontaneous Proofreading Error',
        desc: `Position #${targetIdx + 1}: Pol III DnaQ exonuclease missed C:A mispair during DNA synthesis`,
        status: 'MUTATION'
      });
    }

    setTemplateStrand(newTemplate);
    setReplicatedStrand(newReplicated);
    setActiveMutations(newMutationsList);
    setReplicationCycle(prev => prev + 1);
  };

  // Calculate live matching stats
  let totalBases = Math.min(templateStrand.length, replicatedStrand.length);
  let matchCount = 0;
  let mismatchCount = 0;
  let lesionCount = 0;

  const basePairsComparison = [];

  for (let i = 0; i < totalBases; i++) {
    const tBase = templateStrand[i];
    const rBase = replicatedStrand[i];
    const expectedComplement = COMPLEMENT_MAP[tBase] || 'T';

    let status = 'MATCH';
    let hydrogenBonds = '||'; // Default A-T

    if (tBase === 'C' || tBase === 'G') {
      hydrogenBonds = '|||'; // C-G triple bond
    }

    if (tBase === '8oG' || tBase === 'meG' || tBase === 'TT' || tBase === 'IS5') {
      status = 'LESION';
      lesionCount++;
      hydrogenBonds = '⚡';
    } else if (rBase !== expectedComplement) {
      status = 'MISMATCH';
      mismatchCount++;
      hydrogenBonds = '✕';
    } else {
      matchCount++;
    }

    basePairsComparison.push({
      index: i + 1,
      top: tBase,
      bottom: rBase,
      bonds: hydrogenBonds,
      status: status
    });
  }

  const fidelityPercentage = ((matchCount / totalBases) * 100).toFixed(1);

  return (
    <div className="live-dna-simulator-card">
      <div className="sim-card-header">
        <div className="sim-header-title">
          <h4>🧬 Live Real-Condition DNA Sequence & Base-Pairing Alignment</h4>
          <span className="sim-subtitle">
            Simulates Watson-Crick hydrogen bonding, base mispairings, and lesion bypass in real time
          </span>
        </div>
        <div className="sim-header-actions">
          <button
            className="sim-action-btn primary"
            onClick={induceLiveMutation}
          >
            ⚡ Induce Live Mutation Event ({selectedType?.name || 'SIM'})
          </button>
          <button
            className="sim-action-btn secondary"
            onClick={resetToWildtype}
          >
            🔄 Reset to Wild-Type DNA
          </button>
        </div>
      </div>

      {/* Live Metrics Row */}
      <div className="sim-metrics-row">
        <div className="sim-metric-badge">
          <span className="metric-lbl">Total Sequence Length</span>
          <span className="metric-num">{totalBases} bp</span>
        </div>
        <div className="sim-metric-badge success">
          <span className="metric-lbl">Matching Base Pairs</span>
          <span className="metric-num">{matchCount} / {totalBases} ({fidelityPercentage}%)</span>
        </div>
        <div className={`sim-metric-badge ${mismatchCount > 0 ? 'danger' : ''}`}>
          <span className="metric-lbl">Mismatched / Mutated Bases</span>
          <span className="metric-num">{mismatchCount} bp</span>
        </div>
        <div className={`sim-metric-badge ${lesionCount > 0 ? 'warning' : ''}`}>
          <span className="metric-lbl">DNA Lesions / Adducts</span>
          <span className="metric-num">{lesionCount} sites</span>
        </div>
        <div className="sim-metric-badge">
          <span className="metric-lbl">Replication Cycle</span>
          <span className="metric-num">Gen #{replicationCycle}</span>
        </div>
      </div>

      {/* Real-Time Dual Strand Alignment Visualization */}
      <div className="dna-strands-alignment-box">
        <div className="strand-label-row">
          <span className="strand-tag sense">Sense Strand (5' → 3')</span>
          <span className="strand-tag-right">Watson-Crick Base Alignment</span>
        </div>

        {/* Top Strand: 5' to 3' */}
        <div className="dna-sequence-row top-strand">
          <span className="prime-end">5' -</span>
          {basePairsComparison.map((bp) => (
            <div
              key={`top-${bp.index}`}
              className={`nucleotide-box ${bp.status.toLowerCase()} ${bp.top.length > 2 ? 'wide-block' : ''}`}
              title={`Pos #${bp.index}: ${bp.top}`}
            >
              <span className="base-char">{bp.top}</span>
              <span className="pos-index">#{bp.index}</span>
            </div>
          ))}
          <span className="prime-end">- 3'</span>
        </div>

        {/* Hydrogen Bonding & Alignment Status Line */}
        <div className="dna-sequence-row bonding-line">
          <span className="prime-end-spacer"></span>
          {basePairsComparison.map((bp) => (
            <div
              key={`bonds-${bp.index}`}
              className={`bonding-cell ${bp.status.toLowerCase()}`}
            >
              {bp.bonds}
            </div>
          ))}
          <span className="prime-end-spacer"></span>
        </div>

        {/* Bottom Strand: 3' to 5' */}
        <div className="dna-sequence-row bottom-strand">
          <span className="prime-end">3' -</span>
          {basePairsComparison.map((bp) => (
            <div
              key={`bottom-${bp.index}`}
              className={`nucleotide-box ${bp.status.toLowerCase()} ${bp.bottom.length > 2 ? 'wide-block' : ''}`}
              title={`Pos #${bp.index}: ${bp.bottom}`}
            >
              <span className="base-char">{bp.bottom}</span>
            </div>
          ))}
          <span className="prime-end">- 5'</span>
        </div>

        <div className="strand-label-row bottom">
          <span className="strand-tag antisense">Replicated / Antisense Strand (3' ← 5')</span>
          <span className="legend-pills">
            <span className="legend-item match">■ Matching (A:T, C:G)</span>
            <span className="legend-item mismatch">■ Mismatch / Mutation</span>
            <span className="legend-item lesion">■ Lesion / Dimer / 8-oxoG</span>
          </span>
        </div>
      </div>

      {/* Active Mutation Log & Molecular Description */}
      {activeMutations.length > 0 ? (
        <div className="active-mutations-log">
          <h5>⚡ Live Detected Mutation Events:</h5>
          <div className="mutation-log-items">
            {activeMutations.map((m, idx) => (
              <div key={idx} className={`log-item ${m.status.toLowerCase()}`}>
                <span className="log-badge">{m.type}</span>
                <span className="log-desc">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="active-mutations-log clean">
          <span className="clean-icon">✅</span>
          <span>DNA sequence is currently Wild-Type (100% Fidelity). Click <strong>"⚡ Induce Live Mutation Event"</strong> to simulate base mispairings under real stress conditions.</span>
        </div>
      )}
    </div>
  );
}
