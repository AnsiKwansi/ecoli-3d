import React from 'react';

export default function PartInfoPanel({ selectedPart, onSelectPart }) {
  if (!selectedPart) {
    return (
      <div className="instructions">
        Select a labeled structure to explore its function
      </div>
    );
  }

  return (
    <div className="info-panel visible">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h2 style={{ color: selectedPart.color || '#fff', background: 'none', WebkitTextFillColor: 'initial' }}>
          {selectedPart.name}
        </h2>
        <button 
          onClick={() => onSelectPart(null)}
          style={{ 
            background: 'none', border: 'none', color: '#94a3b8', 
            cursor: 'pointer', fontSize: '1.25rem', padding: '0 4px' 
          }}
        >
          ✕
        </button>
      </div>
      
      <p>{selectedPart.description}</p>
      
      {selectedPart.reference && (
        <div style={{ 
          marginTop: '1.5rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.8rem'
        }}>
          <div style={{ color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference</div>
          <a 
            href={selectedPart.reference.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#60a5fa', textDecoration: 'none', lineHeight: 1.4, display: 'inline-block' }}
          >
            {selectedPart.reference.title} ↗
          </a>
        </div>
      )}
    </div>
  );
}
