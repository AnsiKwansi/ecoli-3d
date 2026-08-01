/**
 * SimulationEngine.js
 * 
 * Core state machine for the DNA Damage Response simulation.
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
  { id: 'uv', name: 'UV Radiation', color: '#a855f7', dsbMultiplier: 1.0 },
  { id: 'mitomycin_c', name: 'Mitomycin C', color: '#ef4444', dsbMultiplier: 1.5 },
  { id: 'ciprofloxacin', name: 'Ciprofloxacin', color: '#f59e0b', dsbMultiplier: 0.8 },
  { id: 'h2o2', name: 'H₂O₂ (Oxidative)', color: '#06b6d4', dsbMultiplier: 0.6 },
];

export const initialSimState = {
  phase: SIM_STATES.IDLE,
  uvDose: 30,               // J/m² (slider value)
  selectedToxin: TOXINS[0],
  dsbCount: 0,
  maxDsbs: 0,
  gamgfpBound: 0,
  recaActive: 0,
  lexaLevel: 100,           // 100 = fully repressed, 0 = fully degraded
  sosLevel: 0,              // 0–100%
  cellViability: 100,       // 100% = healthy, 0% = dead
  elapsedTime: 0,           // simulated seconds
  timeScale: 1,
  dsbSites: [],             // Array of { id, position: [x,y,z], state: 'FRESH'|'GAMGFP_BOUND'|'REPAIRING'|'REPAIRED' }
  uvFlashActive: false,
};

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
      const multiplier = state.selectedToxin.dsbMultiplier;
      const numDsbs = Math.max(1, Math.round((dose / 10) * multiplier));
      
      // Generate DSB sites along the nucleoid
      const newDsbs = [];
      for (let i = 0; i < numDsbs; i++) {
        newDsbs.push({
          id: `dsb-${Date.now()}-${i}`,
          // Random position inside the nucleoid volume
          position: [
            (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 1.2,
          ],
          state: 'FRESH',
          spawnTime: 0,
        });
      }

      return {
        ...state,
        phase: SIM_STATES.IRRADIATED,
        dsbCount: numDsbs,
        maxDsbs: numDsbs,
        gamgfpBound: 0,
        recaActive: 0,
        lexaLevel: 100,
        sosLevel: 0,
        cellViability: 100,
        elapsedTime: 0,
        dsbSites: newDsbs,
        uvFlashActive: true,
      };
    }

    case 'UV_FLASH_DONE':
      return { ...state, uvFlashActive: false };

    case 'TICK': {
      const dt = action.payload; // delta time in seconds
      const elapsed = state.elapsedTime + dt;
      let { phase, dsbSites, gamgfpBound, recaActive, lexaLevel, sosLevel, cellViability, dsbCount } = state;

      if (phase === SIM_STATES.IDLE || phase === SIM_STATES.RESOLVED || phase === SIM_STATES.CELL_DEATH) {
        return state;
      }

      // Phase transitions based on elapsed time
      if (phase === SIM_STATES.IRRADIATED && elapsed > 2) {
        phase = SIM_STATES.SOS_ACTIVE;
      }

      if (phase === SIM_STATES.SOS_ACTIVE) {
        // LexA degrades over time
        lexaLevel = Math.max(0, lexaLevel - dt * 15);
        // SOS level rises as LexA drops
        sosLevel = Math.min(100, 100 - lexaLevel);
        // RecA forms
        recaActive = Math.min(dsbCount, Math.floor(sosLevel / (100 / Math.max(1, state.maxDsbs))));

        // GamGFP binds to DSBs over time
        const bindRate = dt * 2; // ~2 DSBs bound per second
        let newBound = gamgfpBound;

        dsbSites = dsbSites.map(dsb => {
          if (dsb.state === 'FRESH' && newBound < dsbCount) {
            if (Math.random() < bindRate) {
              newBound++;
              return { ...dsb, state: 'GAMGFP_BOUND' };
            }
          }
          return dsb;
        });
        gamgfpBound = newBound;

        // Transition to repairing once all DSBs have GamGFP
        if (gamgfpBound >= dsbCount && elapsed > 5) {
          phase = SIM_STATES.REPAIRING;
        }
      }

      if (phase === SIM_STATES.REPAIRING) {
        // Repair DSBs one by one
        const repairRate = dt * 0.8;
        let repairedCount = 0;

        dsbSites = dsbSites.map(dsb => {
          if (dsb.state === 'GAMGFP_BOUND' && Math.random() < repairRate) {
            return { ...dsb, state: 'REPAIRING' };
          }
          if (dsb.state === 'REPAIRING' && Math.random() < repairRate * 0.5) {
            return { ...dsb, state: 'REPAIRED' };
          }
          if (dsb.state === 'REPAIRED') repairedCount++;
          return dsb;
        });

        dsbCount = dsbSites.filter(d => d.state !== 'REPAIRED').length;
        gamgfpBound = dsbSites.filter(d => d.state === 'GAMGFP_BOUND' || d.state === 'REPAIRING').length;

        // Cell viability decreases if too many DSBs linger
        if (state.maxDsbs > 6) {
          cellViability = Math.max(0, cellViability - dt * (state.maxDsbs - 5) * 2);
        }

        // Check resolution
        if (repairedCount >= state.maxDsbs) {
          phase = SIM_STATES.RESOLVED;
          dsbCount = 0;
          sosLevel = 0;
          lexaLevel = 100;
        }

        if (cellViability <= 0) {
          phase = SIM_STATES.CELL_DEATH;
        }
      }

      return {
        ...state,
        phase,
        dsbSites,
        dsbCount,
        gamgfpBound,
        recaActive,
        lexaLevel,
        sosLevel,
        cellViability,
        elapsedTime: elapsed,
      };
    }

    case 'RESET':
      return { ...initialSimState };

    default:
      return state;
  }
}
