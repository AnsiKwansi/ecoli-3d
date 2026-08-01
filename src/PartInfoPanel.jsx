import React from 'react';
import { Info, X } from 'lucide-react';

export default function PartInfoPanel({ selectedPart, onSelectPart }) {
  if (!selectedPart) {
    return (
      <div className="glass-panel helper-toast">
        <Info size={18} color="#60a5fa" />
        <span>Click on any labeled part to explore its biological function.</span>
      </div>
    );
  }

  return (
    <div className="glass-panel info-panel">
      <div className="info-header">
        <h2>{selectedPart.name}</h2>
        <button 
          onClick={() => onSelectPart(null)}
          className="close-btn"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="info-desc">
        {selectedPart.description}
      </div>
      
      <div className="info-fact">
        <div className="fact-title">Fast Fact</div>
        <div className="fact-text">
          E. coli is a gram-negative, facultative anaerobic, rod-shaped bacterium commonly found in the lower intestine of warm-blooded organisms.
        </div>
      </div>
    </div>
  );
}
