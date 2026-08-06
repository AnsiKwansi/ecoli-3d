import React from 'react';

/**
 * PromoterKineticMonitor.jsx
 * 
 * Displays real-time Transcriptional Regulatory Network (TRN) master regulator levels
 * and active promoter induction percentages (% max rate).
 */
export function PromoterKineticMonitor({ state }) {
  const {
    cAMPLevel = 10,
    ppgppLevel = 5,
    sigma32Level = 5,
    sigmaSLevel = 10,
    gadELevel = 5,
    oxyRLevel = 5,
    promoters = {
      PlacZ: 2,
      PgroE: 5,
      PgadA: 5,
      PkatG: 5,
      PrelA: 5,
      PlexA: 10,
    }
  } = state;

  const regulators = [
    { id: 'cAMP', name: 'cAMP-CRP', level: cAMPLevel, barBg: '#f59e0b', desc: 'Catabolite Repression' },
    { id: 'ppgpp', name: '(p)ppGpp', level: ppgppLevel, barBg: '#e11d48', desc: 'Stringent Response' },
    { id: 'sigma32', name: 'σ³² (RpoH)', level: sigma32Level, barBg: '#f97316', desc: 'Heat Shock Regulon' },
    { id: 'gadE', name: 'GadE', level: gadELevel, barBg: '#ec4899', desc: 'Acid Resistance' },
    { id: 'oxyR', name: 'OxyR/SoxRS', level: oxyRLevel, barBg: '#eab308', desc: 'ROS Defense' },
    { id: 'sigmaS', name: 'σˢ (RpoS)', level: sigmaSLevel, barBg: '#a855f7', desc: 'General Stress' },
  ];

  const promoterList = [
    { id: 'PlacZ', name: 'P_lacZ (Lac Operon)', value: promoters.PlacZ, color: '#f59e0b' },
    { id: 'PgroE', name: 'P_groE (Chaperones GroEL/ES)', value: promoters.PgroE, color: '#f97316' },
    { id: 'PgadA', name: 'P_gadA (Glutamate Decarb)', value: promoters.PgadA, color: '#ec4899' },
    { id: 'PkatG', name: 'P_katG (Hydroperoxidase I)', value: promoters.PkatG, color: '#eab308' },
    { id: 'PrelA', name: 'P_relA (ppGpp Synthase)', value: promoters.PrelA, color: '#e11d48' },
    { id: 'PlexA', name: 'P_lexA / P_recA (SOS DDR)', value: promoters.PlexA, color: '#0284c7' },
  ];

  return (
    <div className="trn-card">
      <div className="trn-card-header">
        <div className="trn-card-title">
          <span>📊</span> TRN Promoter & Regulon Monitor
        </div>
        <span className="trn-badge">Live Kinetics</span>
      </div>

      {/* Master Regulators Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="trn-section-title">Master Transcription Factors</div>
        <div className="trn-regulator-grid">
          {regulators.map((reg) => (
            <div key={reg.id} className="trn-reg-item">
              <div className="trn-reg-name">
                <span>{reg.name}</span>
                <span className="trn-reg-val">{reg.level}%</span>
              </div>
              <div className="trn-reg-track">
                <div
                  className="trn-reg-fill"
                  style={{ width: `${reg.level}%`, backgroundColor: reg.barBg }}
                />
              </div>
              <div className="trn-reg-desc">{reg.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Promoter Induction % Bar Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--panel-border)', paddingTop: '0.6rem' }}>
        <div className="trn-section-title">Promoter Induction Rate (% Max Transcripts)</div>
        <div className="promoter-kinetic-list">
          {promoterList.map((prom) => (
            <div key={prom.id} className="promoter-item">
              <div className="promoter-item-header">
                <span className="promoter-item-name">{prom.name}</span>
                <span className="promoter-item-val" style={{ color: prom.color }}>{prom.value}%</span>
              </div>
              <div className="promoter-track">
                <div
                  className="promoter-fill"
                  style={{ width: `${prom.value}%`, backgroundColor: prom.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
