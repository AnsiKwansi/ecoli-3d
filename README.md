# E. coli Artificial Cell — DNA Damage Response Simulator

An interactive 3D in-vivo experimental simulation platform modeling **DNA damage response (DDR) in an engineered artificial *E. coli* cell chassis** subjected to **UV radiation** and **environmental stressors**. Developed for the **Dr. Chandan Shee Lab**.

**[Live Demo](https://AnsiKwansi.github.io/ecoli-3d/)**

---

## 🎯 Research Objectives & Compliance

Per Dr. Chandan Shee's directives:
> *"Artificial cell focusing on DNA damage response against UV radiation and other environmental factors. Focus on in-vivo experiment!"*

This application simulates the molecular genetics and spatial dynamics of double-strand break (DSB) repair, SOS induction, and fluorescent reporter tracking inside a living cell environment under environmental stress.

---

## 🔬 In-Vivo Experiment Features

### 1. Environmental Stressors & UV Radiation
- **UV Exposure Control**: Quantitative slider ($5\text{ to }100\text{ J/m}^2$) to deliver controlled UV irradiation.
- **Environmental Factors**:
  - **UV Radiation**: Induces pyrimidine dimers and downstream double-strand DNA breaks.
  - **Mitomycin C**: Interstrand crosslinker inducing severe replication fork collapse.
  - **Ciprofloxacin**: Gyrase/topoisomerase IV poison causing persistent DSBs.
  - **$\text{H}_2\text{O}_2$ (Oxidative Stress)**: Reactive oxygen species inducing single and double strand DNA breakage.

### 2. Molecular Machinery & In-Vivo Tracking
- **GamGFP Reporter Foci**: Simulates bacteriophage Gam protein fused to GFP binding explicitly to double-stranded DNA ends.
- **LexA Cleavage & SOS Response**: Live monitoring of LexA repressor cleavage and % SOS pathway activation.
- **RecA Filamentation & RecBCD Engine**: Visualized repair complexes assembling at damage sites on the supercoiled nucleoid.
- **Stress-Induced Mutagenesis (SIM)**: High stress levels upregulate error-prone DNA Polymerase IV (DinB), leading to mutation acquisition.
- **Cell Viability & Survival Dynamics**: Quantitative tracking of cell viability percentage ($0\% - 100\%$) and cell fate (Resolution vs. Cell Death).

---

## 🛠️ How It Works (Under the Hood)

- **3D Spatial Simulation**: Procedurally generated 3D supercoiled chromosomal nucleoid and reporter plasmids using Catmull-Rom curves.
- **Instanced Ribosome Crowding**: Over 500 instanced meshes simulating dense cytoplasmic crowding.
- **State Machine Architecture**: `SimulationEngine.js` models multi-phase cellular kinetics (`IDLE` $\rightarrow$ `IRRADIATED` $\rightarrow$ `SOS_ACTIVE` $\rightarrow$ `REPAIRING` $\rightarrow$ `RESOLVED` / `CELL_DEATH`).
- **Tech Stack**: React, Vite, Three.js, React Three Fiber, and Postprocessing (Bloom & Fluorescent Foci effects).

---

## 🚀 Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment
To build and deploy updates to GitHub Pages:
```bash
npm run deploy
```

