/**
 * Comprehensive Dataset of Mutagenesis Types in Escherichia coli
 * Based on research in molecular genetics, DNA repair, and Stress-Induced Mutagenesis (SIM)
 * (Dr. Chandan Shee / Susan M. Rosenberg Lab Literature & Molecular Biology Standards)
 */

export const MUTAGENESIS_TYPES = [
  {
    id: 'sim',
    name: 'Stress-Induced Mutagenesis (SIM)',
    category: 'Regulated / Inducible',
    primaryEnzymes: ['DinB (Pol IV)', 'RecA', 'RecBCD', 'RpoS', 'LexA'],
    environmentalDrivers: ['Nutrient Starvation', 'Sub-inhibitory Antibiotics', 'Heat Shock'],
    baseRatePerGen: '1.0e-9',
    stressedRatePerGen: '5.0e-7',
    spectrum: {
      transitions: 35,
      transversions: 25,
      frameshifts: 30,
      deletions: 10
    },
    description: 'A regulated, transient increase in mutation rates in non-dividing or stressed cells. Driven by double-strand break (DSB) repair using error-prone DNA Polymerase IV (DinB) under RpoS (stationary phase sigma factor) and SOS control.',
    molecularMechanism: 'When cells experience severe starvation or sublethal antibiotic stress, RpoS and ppGpp upregulate DinB expression (10-fold to 100-fold). Double-strand breaks processed by RecBCD and RecA assemble mutagenic repair complexes where DinB replaces replicative Pol III, introducing mutations during homologous recombination repair.',
    biologicalSignificance: 'Accelerates the evolution of antibiotic resistance and adaptation to stressful novel environments without long-term genetic load in unstressed cells.',
    sheeLiteratureRefs: ['shee_pnas_2011', 'shee_cell_reports_2012', 'shee_nat_comm_2013']
  },
  {
    id: 'tls',
    name: 'Translesion DNA Synthesis (TLS)',
    category: 'Lesion Bypass',
    primaryEnzymes: ['Pol IV (DinB)', 'Pol V (UmuD\'2C)', 'Pol II (PolB)'],
    environmentalDrivers: ['UV Radiation', 'Mitomycin C', 'Alkylating Agents'],
    baseRatePerGen: '5.0e-10',
    stressedRatePerGen: '1.2e-6',
    spectrum: {
      transitions: 45,
      transversions: 40,
      frameshifts: 15,
      deletions: 0
    },
    description: 'Specialized low-fidelity DNA polymerases synthesize past unrepaired, bulky base lesions or abasic sites that block the primary replicative DNA Polymerase III.',
    molecularMechanism: 'High UV or chemical stress induces full SOS cleavage of LexA, leading to high levels of Pol IV (DinB) and Pol V (UmuD\'2C). Pol V binds RecA and ATP to form the active mutasome complex UmuD\'2C-RecA-ATP, bypassing pyrimidine dimers with high error frequency.',
    biologicalSignificance: 'Ensures cell survival at the expense of genomic fidelity by preventing lethal replication fork collapse.',
    sheeLiteratureRefs: ['shee_pnas_2011', 'shee_elife_2013']
  },
  {
    id: 'oxidative',
    name: 'Oxidative Base Damage Mutagenesis',
    category: 'Chemical / ROS',
    primaryEnzymes: ['MutT (8-oxo-dGTPase)', 'MutM (Fpg)', 'MutY', 'Pol III'],
    environmentalDrivers: ['Hydrogen Peroxide (H2O2)', 'Fenton Reaction', 'Aerobic Metabolism'],
    baseRatePerGen: '2.0e-9',
    stressedRatePerGen: '8.0e-7',
    spectrum: {
      transitions: 15,
      transversions: 80,
      frameshifts: 5,
      deletions: 0
    },
    description: 'Reactive oxygen species (ROS) oxidize guanine bases to 8-oxo-7,8-dihydroguanine (8-oxo-dG), which pairs with adenine during DNA replication, inducing G:C to T:A transversions.',
    molecularMechanism: 'Hydroxyl radicals generated via the iron-catalyzed Fenton reaction oxidize dGTP and genomic DNA. 8-oxo-dG adopts a syn-conformation that mispairs with dAMP. Overload of the GO repair system (MutT, MutM, MutY) leads to widespread G:C -> T:A transversion mutations.',
    biologicalSignificance: 'Major driver of endogenous spontaneous mutations and stress-associated mutagenesis under aerobic conditions.',
    sheeLiteratureRefs: ['shee_nat_comm_2013']
  },
  {
    id: 'point_substitution',
    name: 'Base Substitution (Transitions & Transversions)',
    category: 'Mispairing / Copying Error',
    primaryEnzymes: ['DNA Polymerase III', 'MutS', 'MutL', 'MutH'],
    environmentalDrivers: ['Base Analogs (2-AP, 5-BU)', 'Spontaneous Mispairing'],
    baseRatePerGen: '1.0e-10',
    stressedRatePerGen: '2.5e-8',
    spectrum: {
      transitions: 70,
      transversions: 30,
      frameshifts: 0,
      deletions: 0
    },
    description: 'Single nucleotide substitutions caused by non-canonical tautomeric base pairing or failure of the MutHLS methyl-directed mismatch repair system.',
    molecularMechanism: 'Pyrimidines or purines undergo rare tautomeric shifts during replication strand synthesis. If Pol III proofreading exonuclease (DnaQ / MutD) fails to excise the mismatched nucleotide and MutHLS mismatch repair is saturated, a permanent transition or transversion is fixed upon next replication cycle.',
    biologicalSignificance: 'Responsible for conservative and non-conservative amino acid point mutations, silent mutations, and nonsense stop codon creations.',
    sheeLiteratureRefs: ['shee_pnas_2011']
  },
  {
    id: 'frameshift',
    name: 'Frameshift Mutagenesis (+1 / -1 bp Insertion/Deletion)',
    category: 'Slippage / Alignment',
    primaryEnzymes: ['DNA Polymerase IV (DinB)', 'DNA Polymerase III'],
    environmentalDrivers: ['Intercalating Agents (Ethidium, Acridine)', 'Homopolymer Runs'],
    baseRatePerGen: '3.0e-10',
    stressedRatePerGen: '3.5e-7',
    spectrum: {
      transitions: 0,
      transversions: 0,
      frameshifts: 90,
      deletions: 10
    },
    description: 'Addition or loss of 1 to several base pairs caused by transient template-primer strand slippage at repetitive sequence stretches or intercalator adducts.',
    molecularMechanism: 'During replication of repetitive homopolymer runs (e.g. AAAAA or GGGGG), the primer strand unpairs and misaligns before polymerase continuation. DinB lacks 3\'-5\' exonuclease proofreading and preferentially extends slipped frameshift primer-templates, causing frame shifts.',
    biologicalSignificance: 'Completely alters protein reading frames, often truncating essential proteins or generating novel peptide variants.',
    sheeLiteratureRefs: ['shee_cell_reports_2012']
  },
  {
    id: 'alkylation',
    name: 'Alkylation Chemical Mutagenesis',
    category: 'Chemical Adduct',
    primaryEnzymes: ['Ada Methyltransferase', 'Ogt', 'AlkA', 'Tag'],
    environmentalDrivers: ['MNNG', 'EMS (Ethyl methanesulfonate)', 'Alkylating Agents'],
    baseRatePerGen: '1.0e-10',
    stressedRatePerGen: '9.0e-7',
    spectrum: {
      transitions: 85,
      transversions: 10,
      frameshifts: 5,
      deletions: 0
    },
    description: 'Alkylation of DNA bases (e.g. formation of O6-methylguanine) causes persistent base mispairing leading predominantly to G:C to A:T transitions.',
    molecularMechanism: 'Alkylating compounds transfer methyl or ethyl groups to the O6 position of guanine. O6-methylguanine mispairs with thymine during replication. The Ada methyltransferase repairs O6-MeG by suicide methyl transfer, but high alkylating stress depletes Ada and activates the Ada regulon.',
    biologicalSignificance: 'Potent chemical mutagen pathway used in laboratory mutagenesis screens and encountered in environmental toxin exposures.',
    sheeLiteratureRefs: ['shee_pnas_2011']
  },
  {
    id: 'transposition',
    name: 'Insertion Sequence (IS) Transposition Mutagenesis',
    category: 'Mobile Genetic Element',
    primaryEnzymes: ['IS1 Transposase', 'IS5 Transposase', 'IS2', 'IS10'],
    environmentalDrivers: ['Long-term Starvation', 'Osmotic Shock', 'Heavy Metal Stress'],
    baseRatePerGen: '1.0e-8',
    stressedRatePerGen: '4.0e-7',
    spectrum: {
      transitions: 0,
      transversions: 0,
      frameshifts: 0,
      deletions: 100
    },
    description: 'Movement of mobile insertion sequence (IS) elements into coding or regulatory regions of the genome, inactivating genes or activating downstream operons via strong promoter elements.',
    molecularMechanism: 'Environmental stress derepresses transposase transcription of IS elements like IS1, IS3, and IS5. The transposase excises the IS element and integrates it at target genomic sites, disrupting open reading frames or introducing promoter sequences.',
    biologicalSignificance: 'Major cause of major structural variations, gene knockouts, and regulatory rewiring in wild E. coli strains.',
    sheeLiteratureRefs: ['shee_cell_reports_2012']
  },
  {
    id: 'spontaneous_replicative',
    name: 'Spontaneous Replicative Mutagenesis',
    category: 'Basal Replicative',
    primaryEnzymes: ['DNA Polymerase III (DnaE)', 'Proofreading Subunit (DnaQ/MutD)'],
    environmentalDrivers: ['Normal Exponential Growth (Basal Metabolism)'],
    baseRatePerGen: '1.0e-10',
    stressedRatePerGen: '1.0e-10',
    spectrum: {
      transitions: 50,
      transversions: 30,
      frameshifts: 15,
      deletions: 5
    },
    description: 'The basal intrinsic mutation rate during unperturbed DNA replication, determined by the 3\'-5\' exonuclease proofreading activity of the DnaQ (MutD) subunit of DNA Polymerase III.',
    molecularMechanism: 'Pol III holoenzyme replicates the 4.64 Mb genome with 99.999% fidelity. Residual uncorrected errors (~1 in 10^10 bases per generation) escape DnaQ proofreading and MutHLS mismatch repair, representing the baseline evolutionary drift rate.',
    biologicalSignificance: 'Defines the molecular clock and baseline spontaneous mutation rate of E. coli during exponential division.',
    sheeLiteratureRefs: ['shee_pnas_2011']
  }
];
