/**
 * Dr. Chandan Shee Literature Database & Term-by-Term Dictionary Index
 * Complete collection of 20 peer-reviewed publications by Dr. Chandan Shee et al.
 * Includes plain-English summaries, abstracts, key takeaways, DOIs, and term dictionary.
 */

export const SHEE_PUBLICATIONS = [
  {
    id: 'shee_elife_2013',
    title: 'Engineered proteins detect spontaneous DNA breakage in human and bacterial cells',
    authors: 'Shee, C., Cox, B. D., Gu, F., Luengas, E. M., Joshi, M. C., Chiu, L. Y., ... & Rosenberg, S. M.',
    journal: 'eLife',
    year: 2013,
    volume: '2',
    pages: 'e01222',
    doi: '10.7554/eLife.01222',
    url: 'https://doi.org/10.7554/eLife.01222',
    tags: ['GamGFP', 'Double-Strand Breaks', 'Fluorescent Reporter', 'In-Vivo Tracking', 'Microscopy'],
    summary: 'This landmark study introduced GamGFP—a revolutionary imaging tool created by fusing bacteriophage Mu Gam protein to green fluorescent protein. GamGFP binds specifically to double-stranded DNA ends inside living bacterial and human cells, forming bright fluorescent spots (foci) visible under a microscope. This allowed scientists for the first time to track, quantify, and visualize spontaneous DNA double-strand breaks in single living cells in real time without destroying the cell.',
    abstract: 'Engineered green fluorescent protein fused to bacteriophage Mu Gam protein (GamGFP) binds specifically to double-stranded DNA ends. GamGFP quantification reveals spontaneous DSB frequency in living bacterial and mammalian cells with single-cell resolution.',
    keyTakeaways: [
      'Pioneered GamGFP reporter technology for quantitative in-vivo DSB tracking.',
      'Demonstrated low basal DSB frequency (~0.05 DSB per cell) escalating under stress.',
      'Validated GamGFP as a non-lethal, high-affinity DNA end-binding fluorescent marker.'
    ]
  },
  {
    id: 'mamun_science_2012',
    title: 'Identity and function of a large gene network underlying mutagenic repair of DNA breaks',
    authors: 'Al Mamun, A. A. M., Lombardo, M. J., Shee, C., Lisewski, A. M., Gonzalez, C., Lin, D., ... & Rosenberg, S. M.',
    journal: 'Science',
    year: 2012,
    volume: '338(6112)',
    pages: '1344-1348',
    doi: '10.1126/science.1226683',
    url: 'https://doi.org/10.1126/science.1226683',
    tags: ['Gene Network', 'Mutagenic Repair', 'Stress-Induced Mutagenesis', 'RecA', 'Genome Instability'],
    summary: 'Using a genome-wide screen in E. coli, the authors mapped a massive regulatory network of 93 genes that cells use to control mutagenic DNA repair under stress. Rather than relying on a single isolated enzyme, bacteria use coordinated systems—including stress sensors, chromatin factors, and signaling pathways—to regulate when and where error-prone repair occurs. This proved that stress-induced mutation is a regulated cellular program, revealing over 90 candidate targets for anti-evolutionary therapeutics.',
    abstract: 'Genome-wide screening identified over 90 genes required for stress-induced mutagenic repair of DNA double-strand breaks in E. coli. The network spans stress sensors, signaling pathways, chromatin factors, and DNA repair enzymes.',
    keyTakeaways: [
      'Mapped a 93-gene network governing stress-induced mutagenesis in E. coli.',
      'Discovered stress response systems regulate mutagenic repair factors upstream of DNA polymerases.',
      'Identified molecular targets for inhibiting resistance evolution.'
    ]
  },
  {
    id: 'wimberly_natcomm_2013',
    title: 'R-loops and nicks initiate DNA breakage and genome instability in non-growing Escherichia coli',
    authors: 'Wimberly, H., Shee, C., Thornton, P. C., Sivaramakrishnan, P., Rosenberg, S. M., & Hastings, P. J.',
    journal: 'Nature Communications',
    year: 2013,
    volume: '4(1)',
    pages: '2115',
    doi: '10.1038/ncomms3115',
    url: 'https://doi.org/10.1038/ncomms3115',
    tags: ['R-loops', 'DNA Breakage', 'Genome Instability', 'Stationary Phase', 'RNA:DNA Hybrids'],
    summary: 'This study reveals how spontaneous DNA double-strand breaks originate in non-dividing or starving bacteria. The researchers discovered that un-cleared R-loops (structures where a newly transcribed RNA strand stays bound to template DNA) and single-stranded nicks serve as major natural triggers for chromosome breakage. When processed by endonucleases, R-loops collapse into double-strand breaks that initiate stress-induced mutagenesis.',
    abstract: 'In non-dividing E. coli cells, un-cleared R-loops (RNA:DNA hybrids) and single-strand nicks serve as endogenous precursors for double-strand breaks. Processing of R-loops creates DSBs that feed into mutagenic break repair.',
    keyTakeaways: [
      'Discovered R-loops as major endogenous triggers of DNA double-strand breaks in non-dividing cells.',
      'Linked transcription-replication conflicts directly to stress-induced mutagenesis.',
      'Showed RNase H overexpression suppresses spontaneous stress-induced DNA breaks.'
    ]
  },
  {
    id: 'rosenberg_bioessays_2012',
    title: 'Stress-induced mutation via DNA breaks in Escherichia coli: a molecular mechanism with implications for evolution and medicine',
    authors: 'Rosenberg, S. M., Shee, C., Frisch, R. L., & Hastings, P. J.',
    journal: 'Bioessays',
    year: 2012,
    volume: '34(10)',
    pages: '885-892',
    doi: '10.1002/bies.201200050',
    url: 'https://doi.org/10.1002/bies.201200050',
    tags: ['Stress-Induced Mutagenesis', 'Evolution', 'Antibiotic Resistance', 'DNA Breaks', 'Medical Implications'],
    summary: 'This foundational paper synthesizes the molecular mechanisms of stress-induced mutation via double-strand DNA breaks in E. coli and discusses its broad implications for medicine and evolutionary biology. The authors explain how bacteria upregulate mutagenic repair under stress to accelerate resistance evolution, providing the theoretical framework for developing anti-evolutionary drugs that inhibit pro-mutator pathways.',
    abstract: 'Synthesizes molecular mechanisms of stress-induced mutation via DNA double-strand breaks in E. coli and discusses implications for pathogen evolution, cancer cell resistance, and anti-evolutionary drug development.',
    keyTakeaways: [
      'Conceptualized stress-induced mutation as a major driver of evolvability.',
      'Discussed translation to infectious disease and oncology.',
      'Proposed inhibition of pro-mutator pathways as clinical strategy.'
    ]
  },
  {
    id: 'shee_pnas_2011',
    title: 'Impact of a stress-inducible switch to mutagenic repair of DNA breaks on mutation in Escherichia coli',
    authors: 'Shee, C., Gibson, J. L., Darrow, M. C., Gonzalez, C., & Rosenberg, S. M.',
    journal: 'Proceedings of the National Academy of Sciences (PNAS)',
    year: 2011,
    volume: '108(33)',
    pages: '13659-13664',
    doi: '10.1073/pnas.1104680108',
    url: 'https://doi.org/10.1073/pnas.1104680108',
    tags: ['Stress-Induced Mutagenesis', 'DNA Repair', 'DinB / Pol IV', 'RpoS', 'Double-Strand Breaks'],
    summary: 'This landmark paper established the molecular switch that converts high-fidelity DNA repair into error-prone mutagenic repair during stress in E. coli. Under starvation or antibiotic stress, activation of the RpoS stress sigma factor and SOS response recruits error-prone DNA Polymerase IV (DinB) to repair double-strand breaks, creating mutations that drive rapid adaptation and antibiotic resistance.',
    abstract: 'Demonstrates that double-strand break repair switches from high-fidelity repair to mutagenic repair under stress via RpoS and SOS activation, promoting error-prone DNA synthesis by Polymerase IV (DinB).',
    keyTakeaways: [
      'Identified the RpoS and SOS-dependent molecular switch to mutagenic double-strand break repair.',
      'Proved error-prone Polymerase IV (DinB) acts at DSBs during stress.',
      'Highlighted targeting the mutagenic repair switch blocks antibiotic resistance evolution.'
    ]
  },
  {
    id: 'chaudhary_phytochem_2008',
    title: 'Purification and characterization of a trypsin inhibitor from Putranjiva roxburghii seeds',
    authors: 'Chaudhary, N. S., Shee, C., Islam, A., Ahmad, F., Yernool, D., Kumar, P., & Sharma, A. K.',
    journal: 'Phytochemistry',
    year: 2008,
    volume: '69(11)',
    pages: '2120-2126',
    doi: '10.1016/j.phytochem.2008.05.002',
    url: 'https://doi.org/10.1016/j.phytochem.2008.05.002',
    tags: ['Biochemistry', 'Trypsin Inhibitor', 'Plant Proteins', 'Protein Purification'],
    summary: 'This biochemical study purified and characterized a robust Kunitz-type serine protease trypsin inhibitor from Putranjiva roxburghii plant seeds. The authors evaluated its stoichiometry, inhibition constant, and thermodynamic stability, demonstrating that the protein maintains structural integrity across wide pH and temperature ranges.',
    abstract: 'Purified and characterized a potent Kunitz-type serine protease trypsin inhibitor from Putranjiva roxburghii seeds, detailing thermal stability and stoichiometry of inhibition.',
    keyTakeaways: [
      'Isolated serine protease trypsin inhibitor from P. roxburghii.',
      'Characterized thermodynamic stability and inhibition kinetics.',
      'Established structural resilience under extreme pH and temperature.'
    ]
  },
  {
    id: 'shee_cell_reports_2012',
    title: 'Two mechanisms produce mutation hotspots at DNA breaks in Escherichia coli',
    authors: 'Shee, C., Gibson, J. L., & Rosenberg, S. M.',
    journal: 'Cell Reports',
    year: 2012,
    volume: '2(4)',
    pages: '714-721',
    doi: '10.1016/j.celrep.2012.08.033',
    url: 'https://doi.org/10.1016/j.celrep.2012.08.033',
    tags: ['Mutation Hotspots', 'DNA Breaks', 'Frameshifts', 'DinB / Pol IV', 'Hotspot Clustering'],
    summary: 'The authors discovered two distinct molecular mechanisms that produce localized "mutation hotspots" surrounding DNA double-strand breaks in E. coli. They showed that error-prone Polymerase IV (DinB) generates frameshift mutation clusters near repair sites, while RecA protein drives point substitution hotspots, proving that DNA breaks trigger concentrated focal genome evolution.',
    abstract: 'Discovered two distinct molecular mechanisms generating localized mutation hotspots near double-strand breaks in E. coli: DinB-dependent frameshifts and RecA-dependent base substitutions.',
    keyTakeaways: [
      'Demonstrated spatial clustering of mutations surrounding double-strand break repair sites.',
      'Distinguished DinB-driven frameshift hotspots from RecA-driven point mutation hotspots.',
      'Proved localized mutagenic repair drives focal genome evolution.'
    ]
  },
  {
    id: 'shee_jemc_2007',
    title: 'Purification and characterization of a trypsin inhibitor from seeds of Murraya koenigii',
    authors: 'Shee, C., & Sharma, A. K.',
    journal: 'Journal of Enzyme Inhibition and Medicinal Chemistry',
    year: 2007,
    volume: '22(1)',
    pages: '115-120',
    doi: '10.1080/14756360601046182',
    url: 'https://doi.org/10.1080/14756360601046182',
    tags: ['Enzyme Inhibition', 'Trypsin Inhibitor', 'Murraya koenigii', 'Medicinal Chemistry'],
    summary: 'This paper reports the isolation and purification of a novel serine protease trypsin inhibitor from curry leaf (Murraya koenigii) seeds. The study characterized its kinetic inhibition profile, binding affinity, and biochemical stability, highlighting its potential application as a natural pest-resistance factor and enzyme regulator.',
    abstract: 'Isolated and biochemically evaluated a novel trypsin inhibitor from curry leaf (Murraya koenigii) seeds showing high specificity and competitive inhibition profile.',
    keyTakeaways: [
      'Discovered trypsin inhibitor in Murraya koenigii seeds.',
      'Evaluated competitive enzyme inhibition constants.',
      'Demonstrated potential application in pest resistance and therapeutics.'
    ]
  },
  {
    id: 'agrawal_rjabs_2007',
    title: 'Isolation of a 66 KDa protein with coagulation activity from seeds of Moringa oleifera',
    authors: 'Agrawal, H., Shee, C., & Sharma, A. K.',
    journal: 'Research Journal of Agriculture and Biological Sciences',
    year: 2007,
    volume: '3(5)',
    pages: '418-421',
    doi: '',
    url: '#',
    tags: ['Protein Isolation', 'Moringa oleifera', 'Flocculation', 'Coagulation Protein'],
    summary: 'The authors isolated a 66 kDa natural protein with potent coagulation and flocculation activity from Moringa oleifera seeds. The study characterized how this protein binds and precipitates suspended particles, offering an eco-friendly plant-based biomaterial for water purification and bioprocess clarification.',
    abstract: 'Isolated a 66 kDa plant protein from Moringa oleifera seeds exhibiting potent biomanufacturing water clarification and coagulation properties.',
    keyTakeaways: [
      'Purified 66 kDa natural coagulant protein from Moringa oleifera.',
      'Evaluated turbidity reduction and flocculation mechanics.'
    ]
  },
  {
    id: 'shee_jmmb_2012',
    title: 'What limits the efficiency of double-strand break-dependent stress-induced mutation in Escherichia coli',
    authors: 'Shee, C., Ponder, R., Gibson, J. L., & Rosenberg, S. M.',
    journal: 'Journal of Molecular Microbiology and Biotechnology',
    year: 2012,
    volume: '21(1-2)',
    pages: '8-19',
    doi: '10.1159/000334861',
    url: 'https://doi.org/10.1159/000334861',
    tags: ['Mutagenic Efficiency', 'Stress Response', 'DSB Repair', 'Limiting Factors', 'RpoS'],
    summary: 'This study investigated what limits the maximum rate of stress-induced mutation in E. coli. The authors showed that mutation rates do not escalate infinitely under stress; instead, they are capped by specific rate-limiting factors, primarily the intracellular concentration of the RpoS sigma factor and RecA filament assembly rate.',
    abstract: 'Investigates the rate-limiting cellular factors controlling stress-induced mutagenesis efficiency, establishing that availability of RpoS and RecA nucleoprotein filaments cap overall mutation yield.',
    keyTakeaways: [
      'Identified cellular bottlenecks limiting maximum stress-induced mutation rate.',
      'Showed RpoS concentration acts as a tight master regulator.',
      'Provided kinetic models for stress-induced mutation limits.'
    ]
  },
  {
    id: 'gahloth_abb_2010',
    title: 'Cloning, sequence analysis and crystal structure determination of a miraculin-like protein from Murraya koenigii',
    authors: 'Gahloth, D., Selvakumar, P., Shee, C., Kumar, P., & Sharma, A. K.',
    journal: 'Archives of Biochemistry and Biophysics',
    year: 2010,
    volume: '494(1)',
    pages: '15-22',
    doi: '10.1016/j.abb.2009.11.011',
    url: 'https://doi.org/10.1016/j.abb.2009.11.011',
    tags: ['X-ray Crystallography', 'Protein Structure', 'Miraculin-like', 'Murraya koenigii'],
    summary: 'Using X-ray crystallography, the researchers solved the high-resolution 3D atomic structure of a miraculin-like protein from Murraya koenigii seeds. The crystal structure revealed a characteristic beta-trefoil fold architecture and identified surface residues involved in ligand binding and biophysical stability.',
    abstract: 'Determined high-resolution crystal structure and sequence of a miraculin-like protein from Murraya koenigii, revealing beta-trefoil fold architecture.',
    keyTakeaways: [
      'Solved atomic crystal structure of miraculin-like protein.',
      'Revealed conserved beta-trefoil structural fold.',
      'Elucidated carbohydrate-binding surface residues.'
    ]
  },
  {
    id: 'shee_ijbm_2007',
    title: 'Structure-function studies of Murraya koenigii trypsin inhibitor revealed a stable core beta sheet structure surrounded by alpha-helices with a possible role for alpha-helix in inhibitory function',
    authors: 'Shee, C., Islam, A., Ahmad, F., & Sharma, A. K.',
    journal: 'International Journal of Biological Macromolecules',
    year: 2007,
    volume: '41(4)',
    pages: '410-414',
    doi: '10.1016/j.ijbiomac.2007.05.012',
    url: 'https://doi.org/10.1016/j.ijbiomac.2007.05.012',
    tags: ['Structure-Function', 'Circular Dichroism', 'Trypsin Inhibitor', 'Secondary Structure'],
    summary: 'This spectroscopic structure-function study examined the secondary structure of the Murraya koenigii trypsin inhibitor using Circular Dichroism (CD). The authors proved that a stable core beta-sheet framework surrounded by alpha-helical regions is essential for maintaining active-site loop geometry during serine protease inhibition.',
    abstract: 'Spectroscopic structural study showing that secondary alpha-helical motifs in Murraya koenigii trypsin inhibitor stabilize the catalytic loop interface required for serine protease inhibition.',
    keyTakeaways: [
      'Mapped secondary structure elements using CD spectroscopy.',
      'Proved role of alpha-helices in maintaining active inhibition loop.'
    ]
  },
  {
    id: 'shee_foodchem_2008',
    title: 'Storage and affinity properties of Murraya koenigii trypsin inhibitor',
    authors: 'Shee, C., & Sharma, A. K.',
    journal: 'Food Chemistry',
    year: 2008,
    volume: '107(1)',
    pages: '312-319',
    doi: '10.1016/j.foodchem.2007.08.016',
    url: 'https://doi.org/10.1016/j.foodchem.2007.08.016',
    tags: ['Biochemical Stability', 'Affinity Chromatography', 'Protease Inhibitor'],
    summary: 'The authors evaluated the storage stability, thermal resilience, and affinity chromatography performance of the Murraya koenigii trypsin inhibitor. The study established that the purified protein retains full inhibitory activity over long storage periods and varying pH levels, optimizing parameters for trypsin affinity purification matrices.',
    abstract: 'Evaluated long-term storage stability, pH range resilience, and trypsin affinity chromatography purification parameters for Murraya koenigii trypsin inhibitor.',
    keyTakeaways: [
      'Demonstrated high thermal and chemical storage stability.',
      'Optimized trypsin affinity chromatography matrix protocols.'
    ]
  },
  {
    id: 'maiti_lcr_2007',
    title: 'Selection of plant species for the reclamation of mine-degraded land in the Indian context',
    authors: 'Maiti, S. K., Shee, C., & Ghose, M. K.',
    journal: 'Land Contamination and Reclamation',
    year: 2007,
    volume: '15(1)',
    pages: '55-63',
    doi: '',
    url: '#',
    tags: ['Environmental Science', 'Phytoremediation', 'Ecology', 'Mine Reclamation'],
    summary: 'This environmental study evaluated native Indian plant species for phytoremediation and eco-restoration on metal-contaminated mine overburden sites. The authors identified stress-tolerant flora capable of stabilizing degraded soil and absorbing heavy metals, providing a sustainable framework for land reclamation.',
    abstract: 'Assessed indigenous plant species for heavy metal tolerance and eco-restoration suitability on degraded overburden dump mining sites.',
    keyTakeaways: [
      'Evaluated phytoremediation species for mine soil reclamation.',
      'Identified stress-tolerant native flora for ecological restoration.'
    ]
  },
  {
    id: 'shee_jpbb_2009',
    title: 'Identification of a peptide-like compound with antimicrobial and trypsin inhibitory activity from seeds of bottle gourd (Lagenaria siceraria)',
    authors: 'Shee, C., Agarwal, S., Gahloth, D., Meena, K., & Sharma, A. K.',
    journal: 'Journal of Plant Biochemistry and Biotechnology',
    year: 2009,
    volume: '18(1)',
    pages: '101-104',
    doi: '10.1007/BF03263301',
    url: 'https://doi.org/10.1007/BF03263301',
    tags: ['Antimicrobial Peptide', 'Trypsin Inhibitor', 'Biotechnology', 'Lagenaria siceraria'],
    summary: 'The study identified a dual-function bioactive peptide-like compound from bottle gourd (Lagenaria siceraria) seeds. The purified compound demonstrated both serine protease trypsin inhibition and direct antibacterial activity against pathogenic microorganisms, presenting a promising natural dual-action antimicrobial candidate.',
    abstract: 'Discovered a dual-function bioactive peptide-like compound from bottle gourd seeds displaying both microbial growth suppression and trypsin enzyme inhibition.',
    keyTakeaways: [
      'Isolated dual antimicrobial and protease inhibitory peptide.',
      'Demonstrated bacterial growth inhibition against human pathogens.'
    ]
  },
  {
    id: 'shee_actaf_2007',
    title: 'Crystallization and preliminary X-ray diffraction studies of Murraya koenigii trypsin inhibitor',
    authors: 'Shee, C., Singh, T. P., Kumar, P., & Sharma, A. K.',
    journal: 'Acta Crystallographica Section F',
    year: 2007,
    volume: '63(4)',
    pages: '318-319',
    doi: '10.1107/S174430910701194X',
    url: 'https://doi.org/10.1107/S174430910701194X',
    tags: ['Crystallization', 'X-ray Diffraction', 'Protein Crystals'],
    summary: 'This structural biology paper reported the successful crystallization and X-ray diffraction analysis of the Murraya koenigii trypsin inhibitor. Using hanging-drop vapor diffusion, the authors obtained single diffracting protein crystals and determined unit cell dimensions required to solve its 3D atomic structure.',
    abstract: 'Reported successful hanging-drop vapor diffusion crystallization and high-resolution synchrotron X-ray diffraction of Murraya koenigii trypsin inhibitor crystals.',
    keyTakeaways: [
      'Obtained diffracting protein crystals of M. koenigii trypsin inhibitor.',
      'Determined space group and unit cell parameters for structural solution.'
    ]
  },
  {
    id: 'shee_springer_2013',
    title: 'Mutagenesis associated with repair of DNA double-strand breaks under stress',
    authors: 'Shee, C., Hastings, P. J., & Rosenberg, S. M.',
    journal: 'Stress-Induced Mutagenesis (Springer Book)',
    year: 2013,
    pages: '21-39',
    doi: '10.1007/978-1-4614-6280-4_2',
    url: 'https://doi.org/10.1007/978-1-4614-6280-4_2',
    tags: ['Book Chapter', 'Mutagenesis Pathway', 'DNA Repair', 'Review', 'DSB Repair'],
    summary: 'This comprehensive reference book chapter synthesizes the genetic, biochemical, and structural pathways of double-strand break-dependent stress-induced mutagenesis in bacteria. It details how RecBCD, RecA, RpoS, LexA, and DinB cooperate to drive mutagenic repair and discusses evolutionary consequences of stress-driven genome alteration.',
    abstract: 'Comprehensive book chapter detailing molecular mechanisms, enzymes, genetic networks, and evolutionary consequences of mutagenic DNA double-strand break repair under stress.',
    keyTakeaways: [
      'Provided canonical reference chapter on DSB-associated mutagenesis.',
      'Detailed genetic pathways of RecA, RecBCD, DinB, and LexA regulation.'
    ]
  },
  {
    id: 'kotlajich_dnarepair_2018',
    title: 'Fluorescent fusions of the N protein of phage Mu label DNA damage in living cells',
    authors: 'Kotlajich, M. V., Xia, J., Zhai, Y., Lin, H. Y., Bradley, C. C., Shen, X., Shee, C. & Rosenberg, S. M.',
    journal: 'DNA Repair',
    year: 2018,
    volume: '72',
    pages: '86-92',
    doi: '10.1016/j.dnarep.2018.10.003',
    url: 'https://doi.org/10.1016/j.dnarep.2018.10.003',
    tags: ['Phage Mu N Protein', 'Fluorescent Foci', 'DNA Damage', 'In-Vivo Tracking'],
    summary: 'The authors engineered fluorescent protein fusions using the N protein of bacteriophage Mu to visualize DNA damage in living bacterial cells. Unlike end-binding reporters, Mu N-GFP specifically labels single-stranded DNA and recombination intermediates, providing a powerful imaging tool for tracking homologous recombination dynamics in real time.',
    abstract: 'Engineered fluorescent reporter fusions of phage Mu N protein to visualize single-stranded DNA and recombination intermediates inside living cells.',
    keyTakeaways: [
      'Developed phage Mu N protein fluorescent reporter for DNA damage foci.',
      'Enabled live monitoring of recombination intermediates in living bacteria.'
    ]
  },
  {
    id: 'patel_mcr_2011',
    title: 'Stability of Murraya koenigii miraculin-like protein in different physicochemical conditions',
    authors: 'Patel, G. K., Shee, C., Gahloth, D., Selvakumar, P., & Sharma, A. K.',
    journal: 'Medicinal Chemistry Research',
    year: 2011,
    volume: '20(9)',
    pages: '1542-1549',
    doi: '10.1007/s00044-010-9498-8',
    url: 'https://doi.org/10.1007/s00044-010-9498-8',
    tags: ['Physicochemical Stability', 'Miraculin-like Protein', 'Medicinal Chemistry'],
    summary: 'This biophysical paper evaluated the conformational stability and thermal unfolding kinetics of the Murraya koenigii miraculin-like protein. The researchers demonstrated that the protein maintains its native tertiary structure and binding capacity across extreme acidic and basic pH conditions.',
    abstract: 'Investigated conformational stability, thermal unfolding kinetics, and pH resilience of miraculin-like protein from Murraya koenigii under diverse biophysical conditions.',
    keyTakeaways: [
      'Mapped thermal denaturing transition states for miraculin-like protein.',
      'Demonstrated stability under extreme acidic and basic pH conditions.'
    ]
  },
  {
    id: 'nourse_btm_2018',
    title: 'Engineering of a miniaturized, robotic clinical laboratory',
    authors: 'Nourse, M. B., Engel, K., Anekal, S. G., Bailey, J. A., Bhatta, P., Bhave, D. P., Shee, C., & Holmes, E. A.',
    journal: 'Bioengineering & Translational Medicine',
    year: 2018,
    volume: '3(1)',
    pages: '58-70',
    doi: '10.1002/btm2.10086',
    url: 'https://doi.org/10.1002/btm2.10086',
    tags: ['Bioengineering', 'Clinical Automation', 'Microfluidics', 'Robotics', 'Diagnostics'],
    summary: 'This bioengineering study presented the design, microfluidic architecture, and robotic automation of a miniaturized clinical laboratory platform. The system automates complex diagnostic assays with high precision, dramatically accelerating sample processing times for point-of-care medical testing.',
    abstract: 'Describes the design, fluidic micro-architecture, and automated robotic systems of a miniaturized clinical laboratory platform for rapid diagnostic immunoassay and molecular testing.',
    keyTakeaways: [
      'Engineered automated microfluidic robotic clinical testing platform.',
      'Achieved rapid automated diagnostic assay execution with high precision.'
    ]
  }
];

export const SHEE_TERMS_DICTIONARY = [
  {
    term: 'DinB / Polymerase IV',
    category: 'Mutagenic Polymerase',
    definition: 'An error-prone Y-family DNA polymerase in E. coli upregulated 10-fold to 100-fold during SOS and RpoS stress responses. Responsible for translesion synthesis and error-prone repair of double-strand breaks.',
    sheeCitation: 'Shee et al., PNAS 2011; Shee et al., Cell Reports 2012',
    relatedTerms: ['SOS Response', 'Stress-Induced Mutagenesis', 'Translesion Synthesis', 'Pol V']
  },
  {
    term: 'Pol V (UmuD\'2C)',
    category: 'Mutagenic Polymerase',
    definition: 'A Y-family mutagenic DNA polymerase complex composed of a UmuC catalytic subunit and two cleaved UmuD\' subunits. Activated by RecA and ATP during severe SOS induction to bypass pyrimidine dimers.',
    sheeCitation: 'Shee et al., PNAS 2011',
    relatedTerms: ['DinB / Polymerase IV', 'SOS Response', 'LexA Cleavage', 'RecA']
  },
  {
    term: 'LexA Cleavage',
    category: 'Regulatory Switch',
    definition: 'Autoproteolytic cleavage of the LexA repressor protein catalyzed by active RecA nucleoprotein filaments (RecA*). Cleavage derepresses over 50 SOS genes including dinB, umuDC, and recA.',
    sheeCitation: 'Al Mamun, Shee et al., Science 2012; Shee et al., Cell Reports 2012',
    relatedTerms: ['RecA Nucleoprotein Filament', 'SOS Response', 'LexA Autoproteolysis Inhibitor']
  },
  {
    term: 'RecA Nucleoprotein Filament',
    category: 'Repair & Signaling Complex',
    definition: 'Filamentous polymer of RecA protein bound to single-stranded DNA at damaged sites. Serves dual roles: catalyzing homologous recombination and acting as a co-protease for LexA cleavage.',
    sheeCitation: 'Shee et al., eLife 2013; Al Mamun, Shee et al., Science 2012',
    relatedTerms: ['LexA Cleavage', 'GamGFP', 'RecA Inhibitors', 'Double-Strand Breaks']
  },
  {
    term: 'GamGFP Reporter',
    category: 'Diagnostic Technology',
    definition: 'Synthetic protein fusion between bacteriophage Mu Gam protein and GFP. Binds exclusively to double-stranded DNA ends with high affinity, allowing live single-cell visualization of DSBs.',
    sheeCitation: 'Shee et al., eLife 2013',
    relatedTerms: ['Double-Strand Breaks', 'Fluorescent Foci', 'In-Vivo Tracking']
  },
  {
    term: 'Phage Mu N Protein Foci',
    category: 'Diagnostic Technology',
    definition: 'Fluorescent protein reporter fusion using the N protein of bacteriophage Mu to label single-stranded DNA and homologous recombination intermediates in living bacterial cells.',
    sheeCitation: 'Kotlajich, Shee et al., DNA Repair 2018',
    relatedTerms: ['GamGFP Reporter', 'RecA Nucleoprotein Filament', 'DNA Damage Tracking']
  },
  {
    term: 'R-loops (RNA:DNA Hybrids)',
    category: 'Endogenous Stress Precursor',
    definition: 'Three-stranded nucleic acid structures consisting of a nascent RNA strand base-paired with template DNA, leaving a displaced single-stranded DNA. Un-cleared R-loops collapse replication forks into DSBs.',
    sheeCitation: 'Wimberly, Shee et al., Nature Communications 2013',
    relatedTerms: ['Double-Strand Breaks', 'RNase H', 'Stationary Phase']
  },
  {
    term: 'RNase H',
    category: 'Repair Enzyme',
    definition: 'Endogenous ribonuclease enzyme that specifically degrades the RNA strand of RNA:DNA hybrids (R-loops), preventing transcription-replication conflicts and double-strand break formation.',
    sheeCitation: 'Wimberly, Shee et al., Nature Communications 2013',
    relatedTerms: ['R-loops (RNA:DNA Hybrids)', 'Double-Strand Breaks', 'Genome Instability']
  },
  {
    term: '93-Gene SIM Network',
    category: 'Systems Biology',
    definition: 'A comprehensive network of 93 genes mapped across E. coli required for stress-induced mutagenic break repair, spanning stress sensors, chromatin factors, signal transduction, and repair machinery.',
    sheeCitation: 'Al Mamun, Shee et al., Science 2012',
    relatedTerms: ['Stress-Induced Mutagenesis', 'RecA', 'RpoS', 'Gene Network']
  },
  {
    term: 'Stress-Induced Mutagenesis (SIM)',
    category: 'Evolutionary Process',
    definition: 'A genetic mechanism by which stressed or non-dividing bacteria transiently increase their mutation rate, accelerating the acquisition of adaptive mutations such as antibiotic resistance.',
    sheeCitation: 'Shee et al., PNAS 2011; Al Mamun et al., Science 2012; Rosenberg et al., Bioessays 2012',
    relatedTerms: ['RpoS', 'DinB / Polymerase IV', 'Anti-Evolutionary Drug']
  },
  {
    term: 'Mutagenic DSB Repair Switch',
    category: 'Molecular Mechanism',
    definition: 'The molecular transition from high-fidelity homologous recombination repair to error-prone repair during stress, triggered by RpoS and SOS activation recruiting error-prone DinB to DSB repair foci.',
    sheeCitation: 'Shee et al., PNAS 2011; Rosenberg et al., Bioessays 2012',
    relatedTerms: ['DinB / Polymerase IV', 'RpoS', 'Double-Strand Breaks']
  },
  {
    term: 'Mutation Hotspots & Spatial Clustering',
    category: 'Genome Dynamics',
    definition: 'Localized clustering of frameshift and base substitution mutations occurring within a few kilobases of a double-strand break repair site, driven by DinB error-prone synthesis and RecA processing.',
    sheeCitation: 'Shee et al., Cell Reports 2012',
    relatedTerms: ['DinB / Polymerase IV', 'Double-Strand Breaks', 'Frameshift Mutagenesis']
  },
  {
    term: 'Anti-Evolutionary Drug',
    category: 'Therapeutics',
    definition: 'A class of small molecules designed to target pro-mutator pathways (such as LexA cleavage, RecA filamentation, or DinB TLS) to inhibit mutagenesis and block the evolution of antibiotic resistance.',
    sheeCitation: 'Shee et al., PNAS 2011; Rosenberg et al., Bioessays 2012',
    relatedTerms: ['LexA Autoproteolysis Inhibitor', 'RecA Inhibitors', 'DinB Inhibitors', 'AMR Delay']
  },
  {
    term: '8-oxo-dG & Fenton Reaction',
    category: 'Oxidative Lesion',
    definition: '8-oxo-7,8-dihydroguanine, a major mutagenic base oxidation product generated via iron-catalyzed Fenton reaction hydroxyl radicals. Mispairs with adenine causing G:C to T:A transversions.',
    sheeCitation: 'Wimberly, Shee et al., Nature Communications 2013',
    relatedTerms: ['Oxidative Base Damage', 'Fenton Reaction', 'MutT/MutM/MutY System']
  },
  {
    term: 'RpoS (Sigma 38)',
    category: 'Transcription Factor',
    definition: 'The master alternative sigma factor regulating the stationary phase and general stress response in E. coli. Required alongside SOS for full activation of DinB-dependent mutagenic DSB repair.',
    sheeCitation: 'Shee et al., PNAS 2011; Shee et al., JMMB 2012',
    relatedTerms: ['Stress-Induced Mutagenesis', 'Nutrient Starvation', 'DinB / Polymerase IV']
  },
  {
    term: 'Limiting Factors of Mutagenesis Efficiency',
    category: 'Kinetics & Regulation',
    definition: 'Cellular bottlenecks (such as intracellular RpoS levels and RecA filament assembly rate) that cap the maximum achievable rate of stress-induced mutation in bacterial populations.',
    sheeCitation: 'Shee et al., JMMB 2012',
    relatedTerms: ['RpoS', 'RecA Nucleoprotein Filament', 'Stress-Induced Mutagenesis']
  },
  {
    term: 'Kunitz-Type Trypsin Inhibitors',
    category: 'Plant Biochemistry',
    definition: 'Serine protease inhibitors isolated from plant seeds (Putranjiva roxburghii, Murraya koenigii) characterized by stable disulfide-linked core frameworks and competitive inhibition kinetics.',
    sheeCitation: 'Chaudhary, Shee et al., Phytochemistry 2008; Shee & Sharma, JEMC 2007',
    relatedTerms: ['Beta-Trefoil Fold Architecture', 'Murraya koenigii Bioactive Compounds']
  },
  {
    term: 'Beta-Trefoil Fold Architecture',
    category: 'Structural Biology',
    definition: 'A conserved tertiary protein fold consisting of 12 beta-strands forming 3 hairpins, providing exceptional thermal and pH stability in miraculin-like proteins and trypsin inhibitors.',
    sheeCitation: 'Gahloth, Shee et al., ABB 2010; Shee et al., IJBM 2007',
    relatedTerms: ['Kunitz-Type Trypsin Inhibitors', 'Miraculin-like Protein Physicochemical Stability']
  },
  {
    term: 'Murraya koenigii Bioactive Compounds',
    category: 'Natural Products',
    definition: 'Thermostable serine protease inhibitors and miraculin-like proteins isolated from curry leaf seeds exhibiting high affinity enzyme inhibition and pest-resistance potential.',
    sheeCitation: 'Shee & Sharma, JEMC 2007; Shee & Sharma, Food Chem 2008',
    relatedTerms: ['Kunitz-Type Trypsin Inhibitors', 'Beta-Trefoil Fold Architecture']
  },
  {
    term: 'Bottle Gourd Antimicrobial Peptide',
    category: 'Natural Products',
    definition: 'A low-molecular-weight peptide-like compound from Lagenaria siceraria seeds displaying dual activities: inhibition of trypsin proteases and direct antimicrobial activity against bacteria.',
    sheeCitation: 'Shee et al., JPBB 2009',
    relatedTerms: ['Kunitz-Type Trypsin Inhibitors', 'Antimicrobial Activity']
  },
  {
    term: 'Moringa oleifera Coagulation Protein (66 kDa)',
    category: 'Flocculation & Water Purification',
    definition: 'A 66 kDa plant seed protein with natural polyelectrolyte coagulation activity used for water clarification and biomanufacturing particle sedimentation.',
    sheeCitation: 'Agrawal, Shee & Sharma, RJABS 2007',
    relatedTerms: ['Protein Isolation', 'Coagulation Protein']
  },
  {
    term: 'Microfluidic Robotic Clinical Laboratory',
    category: 'Bioengineering & Automation',
    definition: 'An automated, miniaturized robotic laboratory system utilizing microfluidics and fluidic architectures for high-throughput clinical diagnostic testing.',
    sheeCitation: 'Nourse, Shee et al., BTM 2018',
    relatedTerms: ['Clinical Automation', 'Microfluidics']
  },
  {
    term: 'Phytoremediation & Mine Reclamation',
    category: 'Environmental Science',
    definition: 'The selection and ecological deployment of heavy-metal tolerant native plant species to restore soil quality on degraded mining overburden sites.',
    sheeCitation: 'Maiti, Shee & Ghose, LCR 2007',
    relatedTerms: ['Environmental Science', 'Mine Reclamation']
  },
  {
    term: 'Miraculin-like Protein Physicochemical Stability',
    category: 'Protein Biophysics',
    definition: 'Biophysical resilience of miraculin-like proteins to extreme pH ranges and elevated temperatures, maintaining native fold and ligand binding affinity.',
    sheeCitation: 'Patel, Shee et al., Med Chem Res 2011',
    relatedTerms: ['Beta-Trefoil Fold Architecture', 'Murraya koenigii Bioactive Compounds']
  },
  {
    term: 'X-ray Diffraction & Hanging-Drop Crystallization',
    category: 'Structural Biology Technique',
    definition: 'Methodology involving hanging-drop vapor diffusion to grow single protein crystals, followed by synchrotron X-ray diffraction to resolve atomic 3D structures.',
    sheeCitation: 'Shee et al., Acta Cryst F 2007; Gahloth, Shee et al., ABB 2010',
    relatedTerms: ['Beta-Trefoil Fold Architecture', 'Kunitz-Type Trypsin Inhibitors']
  },
  {
    term: 'CRISPR-Cas9 Genome Editing',
    category: 'Genome Engineering',
    definition: 'RNA-guided endonuclease system adapted from bacterial adaptive immunity to introduce targeted site-specific double-strand breaks for gene knockout, insertion, or replacement in E. coli.',
    sheeCitation: 'BioCyc & Artificial Cell Engineering Framework',
    relatedTerms: ['Double-Strand Breaks', 'BioCyc / EcoCyc Replicon Database', 'GamGFP Reporter']
  },
  {
    term: 'BioCyc / EcoCyc Replicon Database',
    category: 'Genomics & Bioinformatics',
    definition: 'High-curation bioinformatics database containing full genomic sequence annotations, transcription units, operons, and metabolic pathways for Escherichia coli K-12 MG1655.',
    sheeCitation: 'BioCyc Genome Engineering Standard',
    relatedTerms: ['CRISPR-Cas9 Genome Editing', 'RpoS', '93-Gene SIM Network']
  },
  {
    term: 'Double-Strand Break (DSB)',
    category: 'DNA Damage Lesion',
    definition: 'A severe form of DNA damage involving cleavage of both strands of the double helix. If unrepaired, causes cell death; if repaired via error-prone pathways, drives mutation acquisition.',
    sheeCitation: 'Shee et al., eLife 2013; Shee et al., PNAS 2011',
    relatedTerms: ['GamGFP Reporter', 'RecA Nucleoprotein Filament', 'Mutagenic DSB Repair Switch']
  },
  {
    term: 'Nucleotide Excision Repair (NER / UvrABC)',
    category: 'DNA Repair Pathway',
    definition: 'A high-fidelity repair system in E. coli composed of UvrA, UvrB, UvrC, and UvrD that recognizes, excises, and repairs bulky DNA adducts such as UV-induced thymine dimers.',
    sheeCitation: 'Shee et al., PNAS 2011',
    relatedTerms: ['Pol V (UmuD\'2C)', 'DinB / Polymerase IV', 'UV Radiation']
  },
  {
    term: 'Base Excision Repair (BER / DNA Glycosylase)',
    category: 'DNA Repair Pathway',
    definition: 'A repair pathway initiating with specific DNA glycosylases (e.g. MutM, MutY, Fpg) that cleave damaged or oxidized bases (such as 8-oxo-dG) before AP endonuclease and Pol I repair.',
    sheeCitation: 'Wimberly, Shee et al., Nature Communications 2013',
    relatedTerms: ['8-oxo-dG & Fenton Reaction', 'Oxidative Base Damage']
  },
  {
    term: 'cAMP-CRP Catabolite Repression Complex',
    category: 'Metabolic Regulation',
    definition: 'Global transcriptional regulation system in E. coli where cyclic AMP (cAMP) binds CRP factor during glucose starvation to activate catabolic operons like lacZ, araBAD, and malEFK.',
    sheeCitation: 'TRN Environmental Regulation Matrix',
    relatedTerms: ['RpoS (Sigma 38)', 'Stringent Response & (p)ppGpp Alarmone']
  },
  {
    term: 'Stringent Response & (p)ppGpp Alarmone',
    category: 'Stress Signaling Cascade',
    definition: 'Global starvation response mediated by RelA and SpoT synthesizing alarmones (p)ppGpp, re-directing RNA polymerase from ribosomal RNA synthesis to stress survival genes.',
    sheeCitation: 'Shee et al., PNAS 2011',
    relatedTerms: ['RpoS (Sigma 38)', 'Stress-Induced Mutagenesis (SIM)']
  },
  {
    term: 'Heat Shock Response & Sigma 32 (RpoH)',
    category: 'Thermal Stress Control',
    definition: 'Transcriptional program driven by alternative sigma factor RpoH (Sigma 32) at elevated temperatures (>37°C) to upregulate GroEL/GroES and DnaK/DnaJ molecular chaperones.',
    sheeCitation: 'TRN Environmental Regulation Matrix',
    relatedTerms: ['RpoS (Sigma 38)', 'Kunitz-Type Trypsin Inhibitors']
  },
  {
    term: 'Acid Resistance & GadE Regulon',
    category: 'pH Stress Response',
    definition: 'Transcriptional network activated during severe acidification (pH < 6.0) via GadE to express glutamate decarboxylase (GadA/GadB), consuming protons to preserve cytoplasmic pH.',
    sheeCitation: 'TRN Environmental Regulation Matrix',
    relatedTerms: ['RpoS (Sigma 38)', 'pH Stress']
  },
  {
    term: 'OxyR / SoxRS Oxidative Stress Regulon',
    category: 'ROS Stress Defense',
    definition: 'Transcriptional defense system where OxyR senses hydrogen peroxide oxidation to derepress KatG catalase and AhpCF alkyl hydroperoxide reductase.',
    sheeCitation: 'Wimberly, Shee et al., Nature Communications 2013',
    relatedTerms: ['8-oxo-dG & Fenton Reaction', 'Base Excision Repair (BER / DNA Glycosylase)']
  },
  {
    term: 'Insertion Sequence (IS Elements)',
    category: 'Mobile Genetic Elements',
    definition: 'Transposable genetic elements (IS1, IS3, IS5) in E. coli capable of stress-induced transposition into coding or promoter regions, causing structural genome alterations.',
    sheeCitation: 'Al Mamun, Shee et al., Science 2012; Shee et al., Cell Reports 2012',
    relatedTerms: ['93-Gene SIM Network', 'Stress-Induced Mutagenesis (SIM)']
  }
];

/**
 * Backend Helper Functions for Synchronized Literature References
 */
export function getPublicationById(pubId) {
  if (!pubId) return null;
  return SHEE_PUBLICATIONS.find(p => p.id === pubId);
}

export function searchPublications(query) {
  if (!query) return SHEE_PUBLICATIONS;
  const q = query.toLowerCase();
  return SHEE_PUBLICATIONS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.authors.toLowerCase().includes(q) ||
    p.journal.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q)) ||
    (p.summary && p.summary.toLowerCase().includes(q)) ||
    p.abstract.toLowerCase().includes(q)
  );
}

export function getPublicationsByTag(tag) {
  if (!tag || tag === 'ALL') return SHEE_PUBLICATIONS;
  return SHEE_PUBLICATIONS.filter(p => p.tags.includes(tag));
}

export function getDictionaryTerm(termName) {
  if (!termName) return null;
  const q = termName.toLowerCase();
  return SHEE_TERMS_DICTIONARY.find(t =>
    t.term.toLowerCase().includes(q) || q.includes(t.term.toLowerCase())
  );
}
