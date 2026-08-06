/**
 * GeneExpressionEngine.js
 * 
 * Environmental Condition Reaction & Expression Kinetics Model for E. coli K-12
 * Models genome-wide transcriptional upregulation, repression, and transcription factor activity
 * under 6 distinct environmental stress conditions.
 */

import { GENE_LOCI, PATHWAY_CATEGORIES } from '../data/ecoli_genome_k12';

export const ENVIRONMENTAL_CONDITIONS = [
  {
    id: 'uv_radiation',
    name: 'UV Radiation (254 nm)',
    category: 'Radiation / Mutagen',
    icon: '⚡',
    color: '#38bdf8',
    defaultIntensity: 40,
    unit: 'J/m²',
    min: 5,
    max: 100,
    description: 'Induces DNA thymine dimers and double-strand breaks. Triggers the master SOS regulon via RecA filamentation and LexA repressor auto-cleavage.',
    primaryRegulon: 'SOS Regulon (LexA Repressed)',
    affectedPathways: ['SOS_DNA_REPAIR', 'REPLICATION_TRANSCRIPTION']
  },
  {
    id: 'oxidative_stress',
    name: 'Oxidative Stress (H₂O₂)',
    category: 'Chemical ROS',
    icon: '🧪',
    color: '#eab308',
    defaultIntensity: 5,
    unit: 'mM',
    min: 0.5,
    max: 25,
    description: 'Generates reactive oxygen species (hydroxyl radicals) causing 8-oxoguanine base damage and single-strand breaks. Activates OxyR and SoxRS regulons.',
    primaryRegulon: 'OxyR / SoxRS Regulons',
    affectedPathways: ['ROS_DEFENSE', 'SOS_DNA_REPAIR']
  },
  {
    id: 'ciprofloxacin',
    name: 'Fluoroquinolone (Ciprofloxacin)',
    category: 'Antibiotic Stress',
    icon: '💊',
    color: '#a855f7',
    defaultIntensity: 2,
    unit: 'µg/mL',
    min: 0.1,
    max: 10,
    description: 'Poisons DNA gyrase (GyrA) and Topoisomerase IV, trapping covalent cleavage complexes that collapse replication forks into persistent DSBs.',
    primaryRegulon: 'MarRAB / SOS Regulons',
    affectedPathways: ['ANTIBIOTIC_EFFLUX', 'SOS_DNA_REPAIR', 'REPLICATION_TRANSCRIPTION']
  },
  {
    id: 'heat_shock',
    name: 'Thermal Stress (42°C)',
    category: 'Temperature',
    icon: '🔥',
    color: '#f97316',
    defaultIntensity: 42,
    unit: '°C',
    min: 30,
    max: 50,
    description: 'Causes widespread cytoplasmic protein unfolding and aggregation. Destabilizes σ32 repressor complexes, driving transient expression of molecular chaperones.',
    primaryRegulon: 'σ32 (RpoH) Heat Shock Regulon',
    affectedPathways: ['HEAT_SHOCK']
  },
  {
    id: 'acid_stress',
    name: 'Acid Shock (pH 4.5)',
    category: 'pH / Ion Stress',
    icon: '🧪',
    color: '#ec4899',
    defaultIntensity: 4.5,
    unit: 'pH',
    min: 3.5,
    max: 7.0,
    description: 'Acidifies intracellular cytoplasm. Triggers the Gad acid resistance system (GadA/GadB glutamate decarboxylase) to consume excess H+ ions.',
    primaryRegulon: 'GadX / GadW Acid Regulon',
    affectedPathways: ['ACID_RESISTANCE']
  },
  {
    id: 'osmotic_shock',
    name: 'Hyperosmotic Shock (NaCl)',
    category: 'Osmolality',
    icon: '💧',
    color: '#06b6d4',
    defaultIntensity: 0.5,
    unit: 'M NaCl',
    min: 0.1,
    max: 1.2,
    description: 'Causes rapid cell plasmolysis and loss of turgor pressure. Activates EnvZ/OmpR two-component signal transduction and proP/otsAB osmoprotectants.',
    primaryRegulon: 'EnvZ / OmpR / RpoS Regulons',
    affectedPathways: ['OSMOTIC_STRESS']
  },
  {
    id: 'carbon_shift',
    name: 'Carbon Shift (Glucose → Lactose)',
    category: 'Metabolic / Catabolite',
    icon: '🍬',
    color: '#f59e0b',
    defaultIntensity: 0.2,
    unit: 'g/L Glucose',
    min: 0.0,
    max: 2.0,
    description: 'Glucose depletion causes adenylyl cyclase activation, producing cAMP. The cAMP-CRP complex binds Lac promoter operator sites, driving transcription of the lacZYA operon.',
    primaryRegulon: 'cAMP-CRP Catabolite Regulon',
    affectedPathways: ['METABOLISM_ENZYMES']
  },
  {
    id: 'amino_acid_starvation',
    name: 'Amino Acid Starvation (Stringent)',
    category: 'Nutrient Starvation',
    icon: '🥀',
    color: '#be123c',
    defaultIntensity: 80,
    unit: '% Starved',
    min: 10,
    max: 100,
    description: 'Uncharged tRNAs entering ribosome A-sites activate RelA synthase, producing (p)ppGpp alarmones. Reconfigures RNA polymerase to upregulate amino acid biosynthesis and rpoS.',
    primaryRegulon: '(p)ppGpp / RelA Stringent Regulon',
    affectedPathways: ['METABOLISM_ENZYMES', 'REPLICATION_TRANSCRIPTION']
  }
];

/**
 * Calculate fold-change expression for every gene locus under a given condition & intensity
 */
export function calculateGeneExpressions(conditionId, intensity) {
  const condition = ENVIRONMENTAL_CONDITIONS.find(c => c.id === conditionId) || ENVIRONMENTAL_CONDITIONS[0];
  
  // Normalize intensity factor between 0.2 and 3.0
  const normFactor = Math.max(0.1, Math.min(1.0, (intensity - condition.min) / (condition.max - condition.min || 1)));
  const scaling = 0.5 + normFactor * 2.5;

  const geneData = GENE_LOCI.map(gene => {
    let foldChange = 1.0;
    let regulation = 'UNCHANGED'; // 'UPREGULATED' | 'DOWNREGULATED' | 'UNCHANGED'
    let mechanism = 'Basal transcription';

    switch (conditionId) {
      case 'uv_radiation':
        if (['recA', 'lexA', 'dinB', 'sulA', 'uvrA', 'uvrB', 'uvrC', 'umuD', 'umuC'].includes(gene.name)) {
          if (gene.name === 'recA') foldChange = 18.0 * scaling;
          else if (gene.name === 'dinB') foldChange = 15.0 * scaling;
          else if (gene.name === 'sulA') foldChange = 28.0 * scaling;
          else if (gene.name === 'umuD' || gene.name === 'umuC') foldChange = 38.0 * scaling;
          else foldChange = 10.0 * scaling;
          mechanism = 'LexA repressor cleavage (RecA* stimulated)';
          regulation = 'UPREGULATED';
        } else if (gene.name === 'dnaA') {
          foldChange = 0.4 / scaling;
          mechanism = 'Replication initiation arrest';
          regulation = 'DOWNREGULATED';
        }
        break;

      case 'oxidative_stress':
        if (['oxyR', 'katG', 'ahpC', 'soxS', 'fpg', 'sodA'].includes(gene.name)) {
          if (gene.name === 'katG') foldChange = 42.0 * scaling;
          else if (gene.name === 'soxS') foldChange = 25.0 * scaling;
          else if (gene.name === 'ahpC') foldChange = 18.0 * scaling;
          else if (gene.name === 'fpg') foldChange = 8.0 * scaling;
          else foldChange = 6.0 * scaling;
          mechanism = 'OxyR disulfide activation / SoxR oxidation';
          regulation = 'UPREGULATED';
        }
        break;

      case 'ciprofloxacin':
        if (['marA', 'recA', 'dinB', 'acrA', 'acrB', 'tolC', 'gyrA'].includes(gene.name)) {
          if (gene.name === 'marA') foldChange = 34.0 * scaling;
          else if (gene.name === 'recA' || gene.name === 'dinB') foldChange = 18.8 * scaling;
          else if (gene.name === 'acrA' || gene.name === 'acrB') foldChange = 14.2 * scaling;
          else if (gene.name === 'gyrA') foldChange = 6.6 * scaling;
          else foldChange = 8.5 * scaling;
          mechanism = 'MarR inactivation & DSB-induced SOS';
          regulation = 'UPREGULATED';
        }
        break;

      case 'heat_shock':
        if (['rpoH', 'dnaK', 'dnaJ', 'ibpA', 'ibpB', 'groEL', 'groES', 'clpB', 'cspA'].includes(gene.name)) {
          if (gene.name === 'ibpA' || gene.name === 'ibpB') foldChange = 52.0 * scaling;
          else if (gene.name === 'dnaK' || gene.name === 'groEL') foldChange = 26.0 * scaling;
          else if (gene.name === 'rpoH' || gene.name === 'clpB') foldChange = 18.0 * scaling;
          else if (gene.name === 'cspA') {
            foldChange = 0.2 / scaling;
            regulation = 'DOWNREGULATED';
            mechanism = 'Thermal repression (Cold shock gene)';
            break;
          } else foldChange = 14.0 * scaling;
          mechanism = 'σ32 (RpoH) RNA polymerase holoenzyme binding';
          regulation = 'UPREGULATED';
        }
        break;

      case 'acid_stress':
        if (['gadA', 'gadB', 'gadC', 'adiA'].includes(gene.name)) {
          const acidScale = Math.max(0.4, (7.0 - intensity) / 3.5);
          if (gene.name === 'gadA' || gene.name === 'gadB') foldChange = 48.0 * acidScale;
          else if (gene.name === 'gadC') foldChange = 32.0 * acidScale;
          else foldChange = 16.0 * acidScale;
          mechanism = 'GadX/GadW acid-dependent transcription induction';
          regulation = 'UPREGULATED';
        }
        break;

      case 'osmotic_shock':
        if (['proP', 'otsA', 'otsB', 'envZ'].includes(gene.name)) {
          if (gene.name === 'proP') foldChange = 28.0 * scaling;
          else if (gene.name === 'otsA' || gene.name === 'otsB') foldChange = 22.0 * scaling;
          else foldChange = 12.0 * scaling;
          mechanism = 'EnvZ/OmpR hyperosmotic signal transduction';
          regulation = 'UPREGULATED';
        }
        break;

      case 'carbon_shift':
        if (['lacZ', 'lacY', 'lacA', 'crp', 'malE', 'thrA'].includes(gene.name)) {
          const campScale = Math.max(0.5, (2.0 - intensity) * 1.5 + 0.5);
          if (gene.name === 'lacZ' || gene.name === 'lacY') foldChange = 55.0 * campScale;
          else if (gene.name === 'crp') foldChange = 18.0 * campScale;
          else foldChange = 14.0 * campScale;
          mechanism = 'cAMP-CRP catabolite derepression & lactose induction';
          regulation = 'UPREGULATED';
        }
        break;

      case 'amino_acid_starvation':
        if (['relA', 'spoT', 'rpoS', 'dps', 'thrA', 'thrL'].includes(gene.name)) {
          if (gene.name === 'relA' || gene.name === 'spoT') foldChange = 38.0 * scaling;
          else if (gene.name === 'rpoS' || gene.name === 'dps') foldChange = 26.0 * scaling;
          else foldChange = 18.0 * scaling;
          mechanism = '(p)ppGpp stringent response alarmone synthesis';
          regulation = 'UPREGULATED';
        }
        break;

      default:
        break;
    }

    if (foldChange > 1.2 && regulation === 'UNCHANGED') regulation = 'UPREGULATED';
    if (foldChange < 0.8 && regulation === 'UNCHANGED') regulation = 'DOWNREGULATED';

    return {
      ...gene,
      foldChange: Number(foldChange.toFixed(2)),
      regulation,
      mechanism
    };
  });

  // Calculate global summary stats
  const totalUpregulated = geneData.filter(g => g.regulation === 'UPREGULATED').length;
  const totalDownregulated = geneData.filter(g => g.regulation === 'DOWNREGULATED').length;
  const maxFoldGene = [...geneData].sort((a, b) => b.foldChange - a.foldChange)[0];

  return {
    condition,
    intensity,
    geneExpressions: geneData,
    summary: {
      totalUpregulated,
      totalDownregulated,
      maxFoldGene,
      regulonStatus: `${condition.primaryRegulon} Active (${Math.round(normFactor * 100)}% Induction)`
    }
  };
}
