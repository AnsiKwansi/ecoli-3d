import React, { useState, useEffect, useRef } from 'react';

const PHASE_MESSAGES = {
  IRRADIATED: {
    title: 'DNA Lesions & Stress Induced',
    body: 'Environmental exposure has damaged the bacterial chromosome! UV radiation induces helix-distorting Thymine Dimers (blue spots, repaired via NER) and Double-Strand Breaks (red halos, repaired via HR). Oxidative stressors induce 8-oxoG lesions (yellow spots, repaired via BER).',
    icon: '☢️',
    color: '#ef4444',
  },
  SOS_ACTIVE: {
    title: 'Repair Machinery Activated',
    body: 'Multi-pathway DNA repair engines assemble: UvrABC excinuclease binds to Thymine Dimers for Nucleotide Excision Repair (NER), DNA Glycosylase binds to oxidative lesions for Base Excision Repair (BER), and GamGFP green foci bind to DSBs alongside RecA filaments to trigger the SOS Response.',
    icon: '🧬',
    color: '#f59e0b',
  },
  REPAIRING: {
    title: 'Active DNA Repair & Mutagenesis',
    body: 'UvrABC excises pyrimidine dimers, DNA Glycosylase removes damaged bases, and RecBCD/RecA repair double-strand breaks. Under high stress, SOS derepresses error-prone Polymerase IV (DinB), driving Stress-Induced Mutagenesis (SIM) to create survival variants.',
    icon: '🔧',
    color: '#22c55e',
  },
  RESOLVED: {
    title: 'Genome Integrity Restored',
    body: 'All DNA lesions (dimers, oxidative sites, and DSBs) have been excised and repaired! If high stress forced error-prone Pol IV activity, new mutations (yellow glow) persist in the chromosome, providing evolutionary diversity.',
    icon: '✅',
    color: '#22c55e',
  },
  CELL_DEATH: {
    title: 'Cell Death ✕',
    body: 'The massive accumulation of unrepaired double-strand breaks and helix-distorting lesions overwhelmed the cell\'s NER, BER, and HR repair capacity, causing chromosomal collapse and membrane depolarization.',
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

      // Auto-dismiss after 9 seconds (except terminal states)
      if (timerRef.current) clearTimeout(timerRef.current);
      if (phase !== 'RESOLVED' && phase !== 'CELL_DEATH') {
        timerRef.current = setTimeout(() => setVisible(false), 9000);
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

