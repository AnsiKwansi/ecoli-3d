import React, { useState, useEffect, useRef } from 'react';

const PHASE_MESSAGES = {
  IRRADIATED: {
    title: 'DNA Damage Detected',
    body: 'UV photons have been absorbed by the DNA, causing thymine dimers and double-strand breaks (DSBs) along the chromosome. The dark break points with red halos represent sites where both strands of the double helix have been severed.',
    icon: '☢️',
    color: '#ef4444',
  },
  SOS_ACTIVE: {
    title: 'SOS Response Activated',
    body: 'RecA protein is polymerizing on single-stranded DNA near the break sites (orange filaments), stimulating LexA repressor to auto-cleave. As LexA degrades, ~40 SOS genes are derepressed. GamGFP (green foci) is binding to the broken DNA ends, competing with RecBCD for access.',
    icon: '🧬',
    color: '#f59e0b',
  },
  REPAIRING: {
    title: 'Repair Enzymes at Work',
    body: 'RecBCD helicase-nuclease (purple) is processing the broken DNA ends. Homologous recombination is underway — the cell is using its sister chromosome as a template to accurately repair each double-strand break. Green GamGFP foci will fade as breaks are sealed.',
    icon: '🔧',
    color: '#22c55e',
  },
  RESOLVED: {
    title: 'Cell Survived ✓',
    body: 'All double-strand breaks have been successfully repaired. The SOS response is winding down as LexA repressor re-accumulates and silences the SOS genes. The cell has returned to normal growth.',
    icon: '✅',
    color: '#22c55e',
  },
  CELL_DEATH: {
    title: 'Cell Death ✕',
    body: 'The number of simultaneous DSBs overwhelmed the cell\'s repair capacity. Unrepaired breaks led to chromosome fragmentation and loss of essential genes. The cell membrane has depolarized and the cell is no longer viable.',
    icon: '💀',
    color: '#ef4444',
  },
};

export default function PhasePopup({ phase }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);
  const prevPhase = useRef(phase);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== prevPhase.current && PHASE_MESSAGES[phase]) {
      setMessage(PHASE_MESSAGES[phase]);
      setVisible(true);

      // Auto-dismiss after 8 seconds (except terminal states)
      if (timerRef.current) clearTimeout(timerRef.current);
      if (phase !== 'RESOLVED' && phase !== 'CELL_DEATH') {
        timerRef.current = setTimeout(() => setVisible(false), 8000);
      }
    }
    if (phase === 'IDLE') {
      setVisible(false);
      setMessage(null);
    }
    prevPhase.current = phase;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase]);

  if (!visible || !message) return null;

  return (
    <div className="phase-popup" style={{ '--popup-color': message.color }}>
      <div className="phase-popup-header">
        <span className="phase-popup-icon">{message.icon}</span>
        <span className="phase-popup-title">{message.title}</span>
        <button className="phase-popup-close" onClick={() => setVisible(false)}>✕</button>
      </div>
      <p className="phase-popup-body">{message.body}</p>
    </div>
  );
}
