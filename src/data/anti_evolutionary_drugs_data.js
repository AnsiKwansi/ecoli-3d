/**
 * Antimutagenesis & Anti-Evolutionary Drug Candidates Dataset
 * Designed for targeting pro-mutator pathways in E. coli to suppress stress-induced mutagenesis (SIM)
 * and prevent antimicrobial resistance (AMR) evolution.
 */

export const ANTI_EVOLUTIONARY_DRUGS = [
  {
    id: 'lexa_inh_1',
    name: 'LexA-Inh-1 (LexA Autoproteolysis Suppressor)',
    target: 'LexA Repressor Protein Active Site',
    targetCategory: 'SOS Signaling / Regulatory',
    chemicalClass: 'Peptidomimetic Boronic Acid',
    mechanism: 'Binds to the Ser-119 / Lys-156 catalytic dyad of the LexA repressor protein, blocking RecA*-catalyzed self-cleavage even during high single-stranded DNA availability. Keeps SOS genes (dinB, umuDC, recA) permanently repressed.',
    ic50: '45 nM',
    maxSuppressionPct: 88,
    amrDelayFactor: '250x',
    cellSurvivalImpact: 'Protective under moderate stress; prevents hyper-mutation',
    visualColor: '#3b82f6',
    sheeRationale: 'Inhibiting LexA autoproteolysis halts SOS derepression at the top of the signaling cascade, blocking transcription of Pol IV (DinB) and Pol V (UmuD\'2C).'
  },
  {
    id: 'reca_block_x',
    name: 'RecA-Block-X (RecA Filamentation Inhibitor)',
    target: 'RecA ATP-Binding Core & ssDNA Binding Loop',
    targetCategory: 'Recombination & Co-Protease',
    chemicalClass: 'Substituted Polyphosphate / Zinc Complex',
    mechanism: 'Interferes with RecA nucleoprotein filament assembly on single-stranded DNA and inhibits RecA ATPase activity. Prevents both recombinational strand exchange and LexA co-protease activation.',
    ic50: '120 nM',
    maxSuppressionPct: 92,
    amrDelayFactor: '400x',
    cellSurvivalImpact: 'Reduces homologous recombination efficiency by 30%',
    visualColor: '#ec4899',
    sheeRationale: 'RecA is essential for double-strand break repair foci formation and LexA cleavage. Inhibiting RecA filamentation blocks both stress-induced mutagenesis and mutagenic recombinational repair.'
  },
  {
    id: 'dinb_inh_4',
    name: 'DinB-Inh-4 (Pol IV TLS Active Site Inhibitor)',
    target: 'DNA Polymerase IV (DinB) Active Site Pocket',
    targetCategory: 'Error-Prone Translesion Synthesis',
    chemicalClass: 'Quinoline-3-Carboxamide Derivative',
    mechanism: 'Selectively docks into the spacious active site of Pol IV (DinB), competing with incoming dNTPs during translesion synthesis without inhibiting the essential replicative DNA Polymerase III holoenzyme.',
    ic50: '85 nM',
    maxSuppressionPct: 85,
    amrDelayFactor: '180x',
    cellSurvivalImpact: 'Neutral to cell viability; highly specific anti-mutagenic effect',
    visualColor: '#10b981',
    sheeRationale: 'DinB is responsible for error-prone DSB repair synthesis under RpoS and SOS control. Selective DinB inhibitors prevent frameshift and point mutations without killing the bacterium.'
  },
  {
    id: 'umuc_shield',
    name: 'UmuC-Shield (Pol V Mutasome Inhibitor)',
    target: 'UmuC Polymerase Subunit & UmuD\' Binding Interface',
    targetCategory: 'Translesion DNA Synthesis',
    chemicalClass: 'Small Molecule Protein-Protein Interaction Inhibitor',
    mechanism: 'Disrupts the assembly of the active Pol V mutasome complex (UmuD\'2C-RecA-ATP), blocking error-prone translesion synthesis past pyrimidine dimers and bulky lesions.',
    ic50: '210 nM',
    maxSuppressionPct: 78,
    amrDelayFactor: '120x',
    cellSurvivalImpact: 'Slight sensitivity to high UV radiation',
    visualColor: '#f59e0b',
    sheeRationale: 'Pol V is the primary mutagenic polymerase bypassing pyrimidine dimers. Blocking UmuC assembly prevents targeted UV mutagenesis.'
  },
  {
    id: 'nac_ros_scavenger',
    name: 'N-Acetylcysteine + Deferoxamine (ROS Scavenger)',
    target: 'Hydroxyl Radicals & Intracellular Fe(II)',
    targetCategory: 'Oxidative Stress Scavenger',
    chemicalClass: 'Thiol Antioxidant & Iron Chelator Adjuvant',
    mechanism: 'Quenches reactive oxygen species (ROS) and chelates free intracellular Fe(II), preventing Fenton reaction-mediated hydroxyl radical generation and 8-oxo-dG accumulation in genomic DNA.',
    ic50: '500 uM',
    maxSuppressionPct: 80,
    amrDelayFactor: '95x',
    cellSurvivalImpact: 'Highly protective; improves cell viability under oxidative stress',
    visualColor: '#06b6d4',
    sheeRationale: 'Oxidative stress triggers 8-oxo-dG transversions and R-loop-mediated double-strand breaks. ROS scavenging reduces endogenous break initiation.'
  },
  {
    id: 'mfd_enhancer',
    name: 'Mfd-Enhancer-A (Transcription-Coupled Repair Modulator)',
    target: 'Mfd (Mutation Frequency Decline) Translocase',
    targetCategory: 'Transcription-Coupled Repair',
    chemicalClass: 'Allosteric ATPase Activator',
    mechanism: 'Allosterically accelerates Mfd translocase activity to rapidly displace stalled RNA polymerase at damaged DNA sites, recruiting high-fidelity Nucleotide Excision Repair (UvrABC) before error-prone Pol IV/V arrive.',
    ic50: '320 nM',
    maxSuppressionPct: 72,
    amrDelayFactor: '85x',
    cellSurvivalImpact: 'Protective against transcription-blocking lesions',
    visualColor: '#8b5cf6',
    sheeRationale: 'Promoting error-free transcription-coupled repair prevents stalled RNA Pol complexes from collapsing into mutagenic double-strand breaks.'
  }
];
