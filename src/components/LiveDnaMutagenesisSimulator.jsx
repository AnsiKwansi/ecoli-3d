import React, { useState, useEffect } from 'react';

// Default wild-type template sequence (24 bp coding fragment)
const INITIAL_TEMPLATE = ['A', 'T', 'G', 'C', 'G', 'T', 'A', 'T', 'T', 'C', 'C', 'G', 'A', 'T', 'T', 'A', 'G', 'C', 'G', 'T', 'A', 'C', 'G', 'T'];

const COMPLEMENT_MAP = {
  'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C',
  '8oG': 'A', // 8-oxoG mispairs with A
  'meG': 'T', // O6-meG mispairs with T
  'TT': 'A',  // Pyrimidine dimer bypassed by Pol IV placing A opposite
  '-': '-',   // Frameshift deletion gap
};

// Helper function to guarantee choosing a different base
function pickDifferentBase(current) {
  const bases = ['A', 'T', 'C', 'G'];
  const available = bases.filter(b => b !== current && current !== '8oG' && current !== 'meG' && current !== 'TT' && current !== 'IS5');
  if (available.length === 0) return 'A';
  return available[Math.floor(Math.random() * available.length)];
}

export default function LiveDnaMutagenesisSimulator({ selectedType }) {
  const [templateStrand, setTemplateStrand] = useState(INITIAL_TEMPLATE);
  const [replicatedStrand, setReplicatedStrand] = useState(INITIAL_TEMPLATE.map(b => COMPLEMENT_MAP[b] || 'T'));
  const [activeMutations, setActiveMutations] = useState([]);
  const [replicationCycle, setReplicationCycle] = useState(1);
  const [isAutoMutating, setIsAutoMutating] = useState(false);

  // Initialize or reset strands back to wild-type
  const resetToWildtype = () => {
    const wtTemplate = [...INITIAL_TEMPLATE];
    const wtComplement = wtTemplate.map(b => COMPLEMENT_MAP[b] || 'T');
    setTemplateStrand(wtTemplate);
    setReplicatedStrand(wtComplement);
    setActiveMutations([]);
    setReplicationCycle(1);
    setIsAutoMutating(false);
  };

  // Induce a single mutation event cleanly with guaranteed mutation effect
  const induceSingleMutation = (overrideType) => {
    let newTemplate = [...templateStrand];
    let newReplicated = [...replicatedStrand];
    let newEvent = null;

    const typeId = overrideType || selectedType?.id || 'sim';
    const nextCycleNum = replicationCycle + 1;

    if (typeId === 'spontaneous') {
      // Spontaneous Replicative: Pol III DnaQ exonuclease proofreading failure (mismatch)
      const targetIdx = Math.floor(Math.random() * newTemplate.length);
      const originalBase = newTemplate[targetIdx];
      const mispairedBase = pickDifferentBase(COMPLEMENT_MAP[originalBase] || 'T');
      newReplicated[targetIdx] = mispairedBase; // Mismatch on replicated strand
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: 'Spontaneous Proofreading Mismatch',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): Pol III DnaQ exonuclease proofreading failed; left ${originalBase}:${mispairedBase} mismatch`,
        status: 'MUTATION'
      };
    }
    else if (typeId === 'sim') {
      // Stress-Induced Mutagenesis (SIM): Pol IV error near DSB focus
      const targetIdx = Math.floor(Math.random() * newTemplate.length);
      const originalBase = newTemplate[targetIdx];
      const newBase = pickDifferentBase(originalBase);
      newTemplate[targetIdx] = newBase;
      newReplicated[targetIdx] = pickDifferentBase(COMPLEMENT_MAP[newBase] || 'A'); // Error-prone misrepair
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: 'Stress-Induced Mutagenic DSB Repair',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): RecA/Pol IV mutagenic repair near DSB site (${originalBase} → ${newBase})`,
        status: 'MUTATION'
      };
    }
    else if (typeId === 'base_sub') {
      // Base Substitution: Transition or Transversion
      const targetIdx = Math.floor(Math.random() * newTemplate.length);
      const originalBase = newTemplate[targetIdx];
      const newBase = pickDifferentBase(originalBase);
      newTemplate[targetIdx] = newBase;
      newReplicated[targetIdx] = COMPLEMENT_MAP[newBase] || 'T';
      const isTransition = (originalBase === 'A' && newBase === 'G') || (originalBase === 'G' && newBase === 'A') || (originalBase === 'C' && newBase === 'T') || (originalBase === 'T' && newBase === 'C');
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: 'Base Substitution',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): Nucleotide substitution (${originalBase} → ${newBase}) [${isTransition ? 'Transition' : 'Transversion'}]`,
        status: 'MUTATION'
      };
    }
    else if (typeId === 'tls') {
      // Translesion DNA Synthesis (TLS): Pyrimidine Dimer + DinB misinsertion
      const targetIdx = Math.floor(Math.random() * Math.max(1, newTemplate.length - 1));
      newTemplate[targetIdx] = 'TT';
      newReplicated[targetIdx] = 'C'; // Pol IV TLS misinsertion opposite dimer
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: 'TLS Bypass Error',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): UV Thymine Dimer (T-T) bypassed by Pol IV (DinB), misinserting Cytosine`,
        status: 'LESION_BYPASS'
      };
    }
    else if (typeId === 'oxidative') {
      // Oxidative Base Damage: 8-oxoG
      const targetIdx = Math.floor(Math.random() * newTemplate.length);
      newTemplate[targetIdx] = '8oG';
      newReplicated[targetIdx] = 'A'; // 8-oxoG:A mispair
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: '8-oxoG Oxidative Damage',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): ROS hydroxyl radical oxidized Guanine to 8-oxoG (causes G:C → T:A transversion)`,
        status: 'OXIDATIVE'
      };
    }
    else if (typeId === 'frameshift') {
      // Frameshift Mutagenesis (+1 / -1 bp)
      const isInsertion = Math.random() > 0.5;
      const targetIdx = Math.floor(Math.random() * Math.max(1, newTemplate.length - 1));
      if (isInsertion) {
        newTemplate.splice(targetIdx, 0, 'T');
        newReplicated.splice(targetIdx, 0, 'A');
        newEvent = {
          cycle: nextCycleNum,
          pos: targetIdx + 1,
          type: '+1 bp Frameshift Insertion',
          desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): Pol IV slippage inserted +1 bp Thymine into homopolymer run`,
          status: 'FRAMESHIFT'
        };
      } else {
        if (newTemplate.length > 5) {
          const removedBase = newTemplate[targetIdx];
          newTemplate.splice(targetIdx, 1);
          newReplicated.splice(targetIdx, 1);
          newEvent = {
            cycle: nextCycleNum,
            pos: targetIdx + 1,
            type: '-1 bp Frameshift Deletion',
            desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): Polymerase slippage deleted 1 bp (${removedBase})`,
            status: 'FRAMESHIFT'
          };
        }
      }
    }
    else if (typeId === 'alkylation') {
      // Alkylation Mutagenesis: O6-methylguanine
      const targetIdx = Math.floor(Math.random() * newTemplate.length);
      newTemplate[targetIdx] = 'meG';
      newReplicated[targetIdx] = 'T'; // Pairs with Thymine
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: 'O6-Methylguanine Alkylation',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): MNNG alkylation formed O6-meG, pairing with Thymine (fixes G:C → A:T mutation)`,
        status: 'ALKYLATION'
      };
    }
    else if (typeId === 'is_transposition') {
      // Insertion Sequence Transposition: IS5
      const targetIdx = Math.floor(Math.random() * Math.max(1, newTemplate.length - 1));
      newTemplate.splice(targetIdx, 0, 'IS5');
      newReplicated.splice(targetIdx, 0, 'IS5');
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: 'IS5 Transposon Insertion',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): Stress-induced IS5 transposition inserted mobile element block`,
        status: 'TRANSPOSON'
      };
    }
    else {
      // General Fallback Mutation
      const targetIdx = Math.floor(Math.random() * newTemplate.length);
      const originalBase = newTemplate[targetIdx];
      const newBase = pickDifferentBase(originalBase);
      newTemplate[targetIdx] = newBase;
      newReplicated[targetIdx] = COMPLEMENT_MAP[newBase] || 'A';
      newEvent = {
        cycle: nextCycleNum,
        pos: targetIdx + 1,
        type: 'Replicative Mutation',
        desc: `Gen #${nextCycleNum} (Pos #${targetIdx + 1}): Replicative error altered nucleotide (${originalBase} → ${newBase})`,
        status: 'MUTATION'
      };
    }

    setTemplateStrand(newTemplate);
    setReplicatedStrand(newReplicated);
    setReplicationCycle(nextCycleNum);
    if (newEvent) {
      setActiveMutations(prev => [newEvent, ...prev]);
    }
  };

  // Induce 5x Multi-Mutation Burst
  const induceMultiBurst = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        induceSingleMutation();
      }, i * 150);
    }
  };

  // Continuous Auto-Mutate Timer
  useEffect(() => {
    let timer = null;
    if (isAutoMutating) {
      timer = setInterval(() => {
        induceSingleMutation();
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isAutoMutating, selectedType, templateStrand, replicatedStrand, replicationCycle]);

  // Calculate live matching stats safely
  let totalBases = Math.min(templateStrand.length, replicatedStrand.length);
  let matchCount = 0;
  let mismatchCount = 0;
  let lesionCount = 0;

  const basePairsComparison = [];

  for (let i = 0; i < totalBases; i++) {
    const tBase = templateStrand[i] || 'A';
    const rBase = replicatedStrand[i] || 'T';
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

  const fidelityPercentage = totalBases > 0 ? ((matchCount / totalBases) * 100).toFixed(1) : '100.0';

  return (
    <div className="live-dna-simulator-card">
      <div className="sim-card-header">
        <div className="sim-header-title">
          <h4>🧬 Multi-Step Accumulating DNA Mutagenesis & Sequence Alignment</h4>
          <span className="sim-subtitle">
            Induce multiple continuous mutation events across generations for pathway: <strong>{selectedType?.name || 'SIM'}</strong>
          </span>
        </div>
        <div className="sim-header-actions">
          <button
            className="sim-action-btn primary"
            onClick={() => induceSingleMutation()}
          >
            ⚡ Induce 1× Mutation ({selectedType?.name?.split(' ')[0] || 'SIM'})
          </button>
          <button
            className="sim-action-btn burst"
            onClick={induceMultiBurst}
          >
            💥 Induce 5× Multi-Burst
          </button>
          <button
            className={`sim-action-btn toggle ${isAutoMutating ? 'active' : ''}`}
            onClick={() => setIsAutoMutating(!isAutoMutating)}
          >
            {isAutoMutating ? '⏸ Pause Auto-Mutate' : '▶ Auto-Mutate Mode'}
          </button>
          <button
            className="sim-action-btn secondary"
            onClick={resetToWildtype}
          >
            🔄 Reset to Wild-Type
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
        <div className="sim-metric-badge highlight">
          <span className="metric-lbl">Accumulated Events</span>
          <span className="metric-num">{activeMutations.length} mutations</span>
        </div>
      </div>

      {/* Real-Time Dual Strand Alignment Visualization */}
      <div className="dna-strands-alignment-box">
        <div className="strand-label-row">
          <span className="strand-tag sense">Sense Strand (5' → 3')</span>
          <span className="strand-tag-right">Watson-Crick Base Alignment (Gen #{replicationCycle})</span>
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

      {/* Accumulated Mutation History Log */}
      {activeMutations.length > 0 ? (
        <div className="active-mutations-log">
          <h5>⚡ Accumulated Mutation History Log ({activeMutations.length} total events):</h5>
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
          <span>DNA sequence is wild-type. Click <strong>"⚡ Induce 1× Mutation"</strong>, <strong>"💥 5× Multi-Burst"</strong>, or <strong>"▶ Auto-Mutate Mode"</strong> to accumulate multiple mutations over time.</span>
        </div>
      )}
    </div>
  );
}
