/**
 * SimulationEngine.js
 * 
 * Multi-Pathway Core State Machine for Artificial Cell DNA Damage Response.
 * Pathways:
 *  - NER (Nucleotide Excision Repair): Thymine dimers repaired by UvrABC
 *  - BER (Base Excision Repair): Oxidative damage repaired by DNA Glycosylase
 *  - HR / SOS (Homologous Recombination): DSBs repaired by RecBCD/RecA with GamGFP foci tracking
 * 
 * States: IDLE → IRRADIATED → SOS_ACTIVE → REPAIRING → RESOLVED | CELL_DEATH
 */

export const SIM_STATES = {
  IDLE: 'IDLE',
  IRRADIATED: 'IRRADIATED',
  SOS_ACTIVE: 'SOS_ACTIVE',
  REPAIRING: 'REPAIRING',
  RESOLVED: 'RESOLVED',
  CELL_DEATH: 'CELL_DEATH',
};

export const TOXINS = [
  { id: 'uv', name: 'UV Radiation', color: '#38bdf8', dsbMultiplier: 1.0, dimerMultiplier: 2.0, oxMultiplier: 0.2 },
  { id: 'mitomycin_c', name: 'Mitomycin C', color: '#ef4444', dsbMultiplier: 1.6, dimerMultiplier: 0.0, oxMultiplier: 0.1 },
  { id: 'ciprofloxacin', name: 'Ciprofloxacin', color: '#f59e0b', dsbMultiplier: 1.4, dimerMultiplier: 0.0, oxMultiplier: 0.1 },
  { id: 'h2o2', name: 'H₂O₂ (Oxidative)', color: '#eab308', dsbMultiplier: 0.5, dimerMultiplier: 0.0, oxMultiplier: 2.5 },
];

export const initialSimState = {
  phase: SIM_STATES.IDLE,
  uvDose: 30,               // J/m² (slider value)
  selectedToxin: TOXINS[0],
  
  // DSB / HR Pathway
  dsbCount: 0,
  maxDsbs: 0,
  gamgfpBound: 0,
  recaActive: 0,
  dsbSites: [],             // { id, position: [x,y,z], state: 'FRESH'|'GAMGFP_BOUND'|'REPAIRING'|'REPAIRED'|'MUTATED' }
  
  // UV Thymine Dimer / NER Pathway
  dimerCount: 0,
  maxDimers: 0,
  uvrabcBound: 0,
  dimerSites: [],           // { id, position: [x,y,z], state: 'FRESH'|'UVRABC_BOUND'|'REPAIRED' }
  
  // Oxidative Damage / BER Pathway
  oxCount: 0,
  maxOx: 0,
  glycosylaseBound: 0,
  oxDamageSites: [],        // { id, position: [x,y,z], state: 'FRESH'|'GLYCOSYLASE_BOUND'|'REPAIRED' }
  
  // Global SOS & Viability Metrics
  lexaLevel: 100,           // 100 = fully repressed, 0 = fully degraded
  sosLevel: 0,              // 0–100%
  cellViability: 100,       // 100% = healthy, 0% = dead
  mutationCount: 0,         // Number of genetic mutations acquired
  elapsedTime: 0,           // simulated seconds
  timeScale: 1,
  uvFlashActive: false,
};

function getRandomNucleoidPos() {
  return [
    (Math.random() - 0.5) * 1.2,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 1.2,
  ];
}

export function simReducer(state, action) {
  switch (action.type) {
    case 'SET_UV_DOSE':
      return { ...state, uvDose: action.payload };

    case 'SET_TOXIN':
      return { ...state, selectedToxin: action.payload };

    case 'SET_TIME_SCALE':
      return { ...state, timeScale: action.payload };

    case 'IRRADIATE': {
      const dose = state.uvDose;
      const toxin = state.selectedToxin;
      
      const numDsbs = Math.max(1, Math.round((dose / 10) * toxin.dsbMultiplier));
      const numDimers = Math.round((dose / 8) * toxin.dimerMultiplier);
      const numOx = Math.round((dose / 8) * toxin.oxMultiplier);

      const dsbSites = Array.from({ length: numDsbs }, (_, i) => ({
        id: `dsb-${Date.now()}-${i}`,
        position: getRandomNucleoidPos(),
        state: 'FRESH',
      }));

      const dimerSites = Array.from({ length: numDimers }, (_, i) => ({
        id: `dimer-${Date.now()}-${i}`,
        position: getRandomNucleoidPos(),
        state: 'FRESH',
      }));

      const oxDamageSites = Array.from({ length: numOx }, (_, i) => ({
        id: `ox-${Date.now()}-${i}`,
        position: getRandomNucleoidPos(),
        state: 'FRESH',
      }));

      return {
        ...state,
        phase: SIM_STATES.IRRADIATED,
        dsbCount: numDsbs,
        maxDsbs: numDsbs,
        gamgfpBound: 0,
        recaActive: 0,
        dsbSites,
        
        dimerCount: numDimers,
        maxDimers: numDimers,
        uvrabcBound: 0,
        dimerSites,

        oxCount: numOx,
        maxOx: numOx,
        glycosylaseBound: 0,
        oxDamageSites,

        lexaLevel: 100,
        sosLevel: 0,
        cellViability: 100,
        mutationCount: 0,
        elapsedTime: 0,
        uvFlashActive: true,
      };
    }

    case 'UV_FLASH_DONE':
      return { ...state, uvFlashActive: false };

    case 'TICK': {
      const dt = action.payload; // delta time in seconds
      const elapsed = state.elapsedTime + dt;
      let {
        phase,
        dsbSites, dsbCount, gamgfpBound, recaActive,
        dimerSites, dimerCount, uvrabcBound,
        oxDamageSites, oxCount, glycosylaseBound,
        lexaLevel, sosLevel, cellViability
      } = state;

      if (phase === SIM_STATES.IDLE || phase === SIM_STATES.RESOLVED || phase === SIM_STATES.CELL_DEATH) {
        return state;
      }

      // Phase transition: IRRADIATED → SOS_ACTIVE
      if (phase === SIM_STATES.IRRADIATED && elapsed > 1.5) {
        phase = SIM_STATES.SOS_ACTIVE;
      }

      // Phase: SOS_ACTIVE
      if (phase === SIM_STATES.SOS_ACTIVE) {
        // LexA degrades over time
        lexaLevel = Math.max(0, lexaLevel - dt * 20);
        sosLevel = Math.min(100, 100 - lexaLevel);
        recaActive = Math.min(dsbCount, Math.floor(sosLevel / (100 / Math.max(1, state.maxDsbs))));

        // 1. GamGFP binding to DSBs
        let newGamBound = gamgfpBound;
        dsbSites = dsbSites.map(dsb => {
          if (dsb.state === 'FRESH' && Math.random() < dt * 2.5) {
            newGamBound++;
            return { ...dsb, state: 'GAMGFP_BOUND' };
          }
          return dsb;
        });
        gamgfpBound = newGamBound;

        // 2. UvrABC binding to Thymine Dimers (NER)
        let newUvrBound = uvrabcBound;
        dimerSites = dimerSites.map(dimer => {
          if (dimer.state === 'FRESH' && Math.random() < dt * 3) {
            newUvrBound++;
            return { ...dimer, state: 'UVRABC_BOUND' };
          }
          return dimer;
        });
        uvrabcBound = newUvrBound;

        // 3. DNA Glycosylase binding to Oxidative Damage (BER)
        let newGlyBound = glycosylaseBound;
        oxDamageSites = oxDamageSites.map(ox => {
          if (ox.state === 'FRESH' && Math.random() < dt * 3) {
            newGlyBound++;
            return { ...ox, state: 'GLYCOSYLASE_BOUND' };
          }
          return ox;
        });
        glycosylaseBound = newGlyBound;

        // Transition to REPAIRING
        if (elapsed > 4.5) {
          phase = SIM_STATES.REPAIRING;
        }
      }

      // Phase: REPAIRING
      if (phase === SIM_STATES.REPAIRING) {
        const isHighStress = state.maxDsbs >= 5 || state.maxDimers >= 8;

        // 1. Repair DSBs (HR / SOS)
        dsbSites = dsbSites.map(dsb => {
          if (dsb.state === 'GAMGFP_BOUND' && Math.random() < dt * 0.9) {
            return { ...dsb, state: 'REPAIRING' };
          }
          if (dsb.state === 'REPAIRING' && Math.random() < dt * 0.6) {
            const isMutagenic = isHighStress && Math.random() < 0.35;
            return { ...dsb, state: isMutagenic ? 'MUTATED' : 'REPAIRED' };
          }
          return dsb;
        });

        // 2. Repair Dimers (NER)
        dimerSites = dimerSites.map(dimer => {
          if (dimer.state === 'UVRABC_BOUND' && Math.random() < dt * 1.2) {
            return { ...dimer, state: 'REPAIRED' };
          }
          return dimer;
        });

        // 3. Repair Oxidative Damage (BER)
        oxDamageSites = oxDamageSites.map(ox => {
          if (ox.state === 'GLYCOSYLASE_BOUND' && Math.random() < dt * 1.4) {
            return { ...ox, state: 'REPAIRED' };
          }
          return ox;
        });

        // Calculate remaining active counts
        const remainingDsbs = dsbSites.filter(d => d.state !== 'REPAIRED' && d.state !== 'MUTATED').length;
        const remainingDimers = dimerSites.filter(d => d.state !== 'REPAIRED').length;
        const remainingOx = oxDamageSites.filter(o => o.state !== 'REPAIRED').length;

        dsbCount = remainingDsbs;
        dimerCount = remainingDimers;
        oxCount = remainingOx;

        gamgfpBound = dsbSites.filter(d => d.state === 'GAMGFP_BOUND' || d.state === 'REPAIRING').length;
        uvrabcBound = dimerSites.filter(d => d.state === 'UVRABC_BOUND').length;
        glycosylaseBound = oxDamageSites.filter(o => o.state === 'GLYCOSYLASE_BOUND').length;

        // Viability drop under heavy total lesion load
        const totalMaxLesions = state.maxDsbs + state.maxDimers + state.maxOx;
        if (totalMaxLesions > 10) {
          cellViability = Math.max(0, cellViability - dt * (totalMaxLesions - 8) * 1.5);
        }

        // Check if all lesions repaired
        const totalRemaining = remainingDsbs + remainingDimers + remainingOx;
        if (totalRemaining === 0) {
          phase = SIM_STATES.RESOLVED;
          sosLevel = 0;
          lexaLevel = 100;
        }

        if (cellViability <= 0) {
          phase = SIM_STATES.CELL_DEATH;
        }
      }

      const mutationCount = dsbSites.filter(d => d.state === 'MUTATED').length;

      return {
        ...state,
        phase,
        dsbSites, dsbCount, gamgfpBound, recaActive,
        dimerSites, dimerCount, uvrabcBound,
        oxDamageSites, oxCount, glycosylaseBound,
        lexaLevel, sosLevel, cellViability, mutationCount,
        elapsedTime: elapsed,
      };
    }

    case 'RESET':
      return { ...initialSimState };

    default:
      return state;
  }
}

