export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  ribbon: {
    kvic: string;
    mission: string;
    dbLive: string;
    cacheMode: string;
  };
  nav: {
    brand: string;
    subtitle: string;
    tag: string;
    home: string;
    verify: string;
    beekeeper: string;
    mandi: string;
    processing: string;
    admin: string;
    generateQr: string;
    scanJar: string;
    mobileHub: string;
    printCert: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    placeholder: string;
    verifyBtn: string;
    verifying: string;
    scanBtn: string;
    genQrBtn: string;
    testBatchLabel: string;
    sampleJamun: string;
    mobileTestBtn: string;
  };
  batchCard: {
    sectionTitle: string;
    subTitle: string;
    verifiedBadge: string;
    unverifiedBadge: string;
    batchLabel: string;
    listenAudio: string;
    printCertBtn: string;
    moistureLabel: string;
    moistureSub: string;
    purityLabel: string;
    puritySub: string;
    freshnessLabel: string;
    freshnessSub: string;
    trustLabel: string;
    trustSub: string;
    beekeeperLabel: string;
    locationLabel: string;
    fairPriceLabel: string;
    directPay: string;
    hiveIdLabel: string;
    floralSourceLabel: string;
    dbtVerified: string;
    beekeeperSectionTitle: string;
    beekeeperSectionSub: string;
  };
  viewer3d: {
    tag: string;
    title: string;
    subtitle: string;
    hint: string;
    jamun: string;
    acacia: string;
    mangrove: string;
    glassSpec: string;
    tamperSeal: string;
    coldSettled: string;
    autoRotate: string;
    diastasePurity: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    custodyBadge: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    verifiedStamp: string;
  };
  generator: {
    modalTitle: string;
    modalSubtitle: string;
    selectHoney: string;
    jamunHoney: string;
    acaciaHoney: string;
    mangroveHoney: string;
    batchCodeLabel: string;
    stickerPreviewTitle: string;
    scanPrompt: string;
    printBtn: string;
    testScanBtn: string;
    officialSeal: string;
    guaranteedPurity: string;
  };
  puritySim: {
    title: string;
    subtitle: string;
    tag: string;
    badge: string;
    waterTest: string;
    flameTest: string;
    selectSamplePrompt: string;
    pureSampleTitle: string;
    pureSampleStats: string;
    adulteratedSampleTitle: string;
    adulteratedSampleStats: string;
    waterScienceTitle: string;
    waterScienceDesc: string;
    flameScienceTitle: string;
    flameScienceDesc: string;
    runWaterBtn: string;
    runFlameBtn: string;
    runningSim: string;
    vesselWaterTitle: string;
    vesselFlameTitle: string;
    pureVesselBadge: string;
    adulteratedVesselBadge: string;
    waterPureResult: string;
    waterAdulteratedResult: string;
    flamePureResult: string;
    flameAdulteratedResult: string;
    clickPrompt: string;
    verdictPurePassed: string;
    verdictPureWaterDesc: string;
    verdictPureFlameDesc: string;
    verdictAdulteratedFailed: string;
    verdictAdulteratedWaterDesc: string;
    verdictAdulteratedFlameDesc: string;
    pureVerdict: string;
    adulteratedVerdict: string;
  };
  gallery: {
    tag: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card1Badge: string;
    card2Title: string;
    card2Desc: string;
    card2Badge: string;
    card3Title: string;
    card3Desc: string;
    card3Badge: string;
    card4Title: string;
    card4Desc: string;
    card4Badge: string;
  };
  terminals: {
    tag: string;
    title: string;
    subtitle: string;
    launchBtn: string;
    dbStatus: string;
    beekeeperTitle: string;
    beekeeperDesc: string;
    mandiTitle: string;
    mandiDesc: string;
    labTitle: string;
    labDesc: string;
    auditTitle: string;
    auditDesc: string;
  };
  stages: {
    stageLabel: string;
    stageOf: string;
    consumerTitle: string;
    consumerRole: string;
    consumerDesc: string;
    consumerStandard: string;
    beekeeperTitle: string;
    beekeeperRole: string;
    beekeeperDesc: string;
    beekeeperStandard: string;
    mandiTitle: string;
    mandiRole: string;
    mandiDesc: string;
    mandiStandard: string;
    labTitle: string;
    labRole: string;
    labDesc: string;
    labStandard: string;
    auditTitle: string;
    auditRole: string;
    auditDesc: string;
    auditStandard: string;
    prevBtn: string;
    nextBtn: string;
  };
  footer: {
    desc: string;
    stationsTitle: string;
    complianceTitle: string;
    copyright: string;
    tagline: string;
    standard1: string;
    standard2: string;
    standard3: string;
    standard4: string;
    hackathonTitle: string;
    hackathonDesc: string;
    builtFor: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    ribbon: {
      kvic: 'Khadi & Village Industries Commission (KVIC)',
      mission: 'National Honey Mission • FSSAI Standards Gazette 2020',
      dbLive: 'PostgreSQL DB Live',
      cacheMode: 'Local Cache Mode',
    },
    nav: {
      brand: 'HoneyChain',
      subtitle: 'AI & Blockchain Traceability Platform',
      tag: 'National Protocol',
      home: 'Home',
      verify: 'Verify Honey',
      beekeeper: 'Beekeeper Log',
      mandi: 'Mandi Scale',
      processing: 'Processing & Lab',
      admin: 'Audit Dashboard',
      generateQr: 'Generate Jar QR',
      scanJar: 'Scan Jar QR',
      mobileHub: '📱 Phone Access / QR',
      printCert: 'Print NABL Cert',
    },
    hero: {
      badge: 'National Honey Mission • KVIC & FSSAI Certified',
      title: 'Trace Pure Indian Honey From Beehive to Breakfast Table',
      subtitle: 'Scan any jar QR to inspect authentic beekeepers, cold extraction (<45°C), and NABL isotope purity tests. Zero synthetic syrups.',
      placeholder: 'Enter Jar Batch Code (e.g. PKG-MAHA-042-2697)',
      verifyBtn: 'Verify Jar',
      verifying: 'Verifying...',
      scanBtn: 'Scan Camera QR',
      genQrBtn: 'Generate Customer QR',
      testBatchLabel: 'Quick test certified honey:',
      sampleJamun: 'PKG-MAHA-042 (Jamun Honey)',
      mobileTestBtn: '📱 Show on Mobile Phone',
    },
    batchCard: {
      sectionTitle: 'Official Provenance Record',
      subTitle: 'Cryptographic Authenticity & Origin Journey',
      verifiedBadge: 'FSSAI & Agmark Special Grade • 100% Raw Forest Honey',
      unverifiedBadge: '⚠️ Critical Alert • Unverified Commercial Brand',
      batchLabel: 'Batch Code',
      listenAudio: '🔊 Listen Report (Audio)',
      printCertBtn: 'Print Official NABL Certificate',
      moistureLabel: 'Moisture Content',
      moistureSub: 'FSSAI Max 20% (Passed)',
      purityLabel: 'Purity Score',
      puritySub: 'Zero C4 Invert Cane Sugar',
      freshnessLabel: 'Enzyme Freshness',
      freshnessSub: 'Cold Processed (<45°C)',
      trustLabel: 'Blockchain Ledger',
      trustSub: 'SHA-256 Merkle Valid',
      beekeeperLabel: 'Lead Beekeeper',
      locationLabel: 'Origin Apiary',
      fairPriceLabel: 'Guaranteed Fair Price',
      directPay: 'Direct Bank Transfer to Farmer',
      hiveIdLabel: 'Registered Hive ID',
      floralSourceLabel: 'Botanical Nectar Source',
      dbtVerified: 'Direct Benefit Transfer (DBT) Verified',
      beekeeperSectionTitle: 'Grassroots Producer Attribution',
      beekeeperSectionSub: 'Meet the Beekeeper Behind This Honey',
    },
    viewer3d: {
      tag: 'Interactive 3D Digital Twin',
      title: 'Interactive 3D Honey Jar Inspection',
      subtitle: 'Drag with mouse or swipe on touch screen to inspect 360° transparent glass, warm amber honey density, and cryptographic tamper seal.',
      hint: '🖱️ Drag to rotate 360° • 🔄 Auto-orbit enabled',
      jamun: 'Mahabaleshwar Jamun Honey',
      acacia: 'Kashmir White Acacia',
      mangrove: 'Sunderbans Mangrove',
      glassSpec: 'Food-Grade Soda-Lime (Lead-Free)',
      tamperSeal: 'Laser QR Tamper-Proof Seal',
      coldSettled: 'Cold-Settled Raw Honey (<45°C)',
      autoRotate: 'Auto-Rotate',
      diastasePurity: 'Active Diastase Enzymes (14.5 DN)',
    },
    timeline: {
      title: 'Verified 5-Stage Physical Journey',
      subtitle: 'Immutable record from smallholder forest hives to your dining table',
      custodyBadge: '5 Anchored Milestones',
      step1Title: '1. Beehive Harvest Declaration',
      step1Desc: 'Harvested cold by registered tribal beekeeper using hygienic food-grade extractors.',
      step2Title: '2. Mandi Weight & Tare Reconciliation',
      step2Desc: 'Calibrated digital mandi scale records physical weight with zero tare tampering.',
      step3Title: '3. Agro-Processing & Micro-Filtering',
      step3Desc: 'Gravity-fed micro-mesh filtering below 45°C preserves live diastase enzymes.',
      step4Title: '4. NABL Chemical & Isotope Assay',
      step4Desc: 'EA-IRMS Carbon-13 isotope test confirms 0.0% exogenous C4 sugar syrups.',
      step5Title: '5. Serialized Jar & Public QR Stamp',
      step5Desc: 'Tamper-evident food-grade glass jar sealed with unique cryptographic QR identity.',
      verifiedStamp: 'Digitally Verified by Chief Chemist',
    },
    generator: {
      modalTitle: 'Customer Honey Jar QR Generator',
      modalSubtitle: 'Create and print official serialized jar stickers with scannable QR verification',
      selectHoney: 'Select Honey Variety:',
      jamunHoney: 'Mahabaleshwar Jamun Honey (Maharashtra)',
      acaciaHoney: 'Kashmir Valley White Acacia Honey (J&K)',
      mangroveHoney: 'Sunderbans Wild Mangrove Honey (West Bengal)',
      batchCodeLabel: 'Batch Number:',
      stickerPreviewTitle: 'Printable Customer Jar Label Sticker',
      scanPrompt: 'Scan with any phone camera to view complete beekeeper story & NABL lab report',
      printBtn: '🖨️ Print Label Sticker',
      testScanBtn: '📲 Test Customer Scan View',
      officialSeal: 'KVIC & FSSAI Authenticated',
      guaranteedPurity: '100% Pure Raw Honey • Zero Invert Sugar',
    },
    puritySim: {
      title: 'Ghar-Ghar Parakh: Household Purity Simulator',
      subtitle: 'Compare 100% pure raw honey vs. adulterated market syrup using authentic kitchen science',
      tag: 'Traditional Indian Purity Science',
      badge: 'घर-घर परख सिम्युलेटर',
      waterTest: 'Water Dispersion Test',
      flameTest: 'Cotton Flame Test',
      selectSamplePrompt: '1. Select Honey Sample to Test:',
      pureSampleTitle: '100% Raw Forest Honey',
      pureSampleStats: 'Moisture: 17.8% • 0% Added Sugar',
      adulteratedSampleTitle: 'Adulterated Sugar Syrup',
      adulteratedSampleStats: 'C4 Cane Sugar + Corn Syrup (42%)',
      waterScienceTitle: 'The Science of Water Density & Specific Gravity',
      waterScienceDesc: 'Pure honey has high specific gravity (~1.42) and dense surface tension. In water, it drops straight to the bottom without dispersing. Industrial sugar syrups dissolve instantly, clouding the water.',
      flameScienceTitle: 'The Science of Flammability & Moisture Ratio',
      flameScienceDesc: 'Pure honey contains less than 18% moisture. When a dipped cotton wick is struck with flame, it burns cleanly. Diluted syrups with added water cause sputtering and extinguish the wick.',
      runWaterBtn: 'Run Water Dispersion Test',
      runFlameBtn: 'Run Cotton Flame Test',
      runningSim: 'Executing Physical Simulation...',
      vesselWaterTitle: 'SIMULATION VESSEL • WATER TEST',
      vesselFlameTitle: 'SIMULATION VESSEL • FLAME TEST',
      pureVesselBadge: 'SAMPLE: 100% PURE RAW',
      adulteratedVesselBadge: 'SAMPLE: C4 ADULTERATED',
      waterPureResult: 'Intact Honey Layer (High Gravity)',
      waterAdulteratedResult: 'Clouded Solution (Instant Syrup Dissolution)',
      flamePureResult: 'Clean Golden Flame',
      flameAdulteratedResult: 'Sputtered & Extinguished',
      clickPrompt: 'Click "Run Test" to dispense honey sample',
      verdictPurePassed: 'VERDICT: 100% PURE BOTANICAL HONEY (PASSED)',
      verdictPureWaterDesc: 'The droplet settled cohesively at the bottom without dispersion, proving natural 17.8% moisture and zero water-soluble cane syrups.',
      verdictPureFlameDesc: 'The wick burned smoothly with a steady golden flame, verifying moisture strictly under the FSSAI 20% regulatory limit.',
      verdictAdulteratedFailed: 'VERDICT: ARTIFICIAL SYRUP ADULTERATION DETECTED',
      verdictAdulteratedWaterDesc: 'Immediate dissolution and hazy cloudiness occurred, a classic indicator of inverted rice syrup or high-fructose corn syrup adulteration.',
      verdictAdulteratedFlameDesc: 'Excess moisture and artificial invert sugars caused sputtering and prevented sustained combustion.',
      pureVerdict: 'Pure honey settles at the bottom like a golden bead without dissolving.',
      adulteratedVerdict: 'Syrup dissolves immediately, turning water cloudy and hazy.',
    },
    gallery: {
      tag: 'Sensory & Physical Profiling',
      title: 'Physical Honey Authenticity & Botanical Gallery',
      subtitle: 'Raw honey exhibits unmistakable physical markers—high surface tension, live pollen suspension, and natural cold crystallization.',
      card1Title: 'Natural Nectar Viscosity',
      card1Desc: 'High surface tension and slow helical folding indicating 17.8% moisture. Zero water dilution or corn syrup.',
      card1Badge: 'Slow Helical Fold',
      card2Title: 'Cold-Extracted Raw Comb',
      card2Desc: 'Uncapped and cold spun under 40°C. Retains live diastase enzymes and natural floral propolis.',
      card2Badge: 'Capped Comb Wax',
      card3Title: 'Indigenous Foraging',
      card3Desc: 'Native Indian honeybees foraging wild blooms across the Western Ghats and Sahyadri mountain biosphere.',
      card3Badge: 'Apis cerana indica',
      card4Title: 'Tamper-Evident QR Tag',
      card4Desc: 'Bottled in food-grade glass jars sealed with a tamper-evident cryptographic QR code linked to blockchain.',
      card4Badge: '500g Glass Packaging',
    },
    terminals: {
      tag: 'Operational Terminals',
      title: 'Stakeholder Portals & Hardware Simulations',
      subtitle: 'Inspectors and evaluators can explore the live operational modules powering HoneyChain:',
      launchBtn: 'Launch Terminal',
      dbStatus: 'PostgreSQL DB Connected',
      beekeeperTitle: 'Beekeeper Terminal',
      beekeeperDesc: 'Voice harvest declaration (EN/HI/MR), live IoT hive cards, and XGBoost AI yield prediction.',
      mandiTitle: 'Mandi Collection Scale',
      mandiDesc: 'Avery Berkel scale simulator, tare canisters, and real-time physical weight reconciliation.',
      labTitle: 'Processing & NABL Lab',
      labDesc: 'Mass-balance calculator to block syrup dilution, 5-parameter chemical assay, and jar serialization.',
      auditTitle: 'Central Regulatory Audit',
      auditDesc: 'Batch genealogy DAG explorer, discrepancy investigation modal, and SHA-256 event ledger.',
    },
    stages: {
      stageLabel: 'Stage',
      stageOf: 'of',
      consumerTitle: 'Consumer Verification & Botanical Provenance',
      consumerRole: 'Public Verification Portal',
      consumerDesc: 'End-consumer authenticity portal. Scan jar QR tags, verify Ramesh Patil\'s apiary location, inspect NABL laboratory isotope certificates, and track the complete cryptographic custody chain.',
      consumerStandard: 'Consumer Protection (E-Commerce) Rules 2020 • FSSAI Food Safety Standards',
      beekeeperTitle: 'Beekeeper Field Harvest Log & IoT Apiary Telemetry',
      beekeeperRole: 'Grassroots Production Station',
      beekeeperDesc: 'Decentralized apiary console empowering rural beekeepers. Log harvests using voice commands in English, Hindi, or Marathi, monitor real-time Hive #17 IoT telemetry (temp, humidity, acoustics), and forecast yield with XGBoost.',
      beekeeperStandard: 'National Honey Mission Guidelines • KVIC Smart Kisan Passbook Protocol',
      mandiTitle: 'Mandi Weighment Scale & Tare Reconciliation',
      mandiRole: 'Aggregation & APMC Mandi Station',
      mandiDesc: 'Industrial weighment terminal at the APMC Mandi. Integrates with Avery Berkel digital scales, computes automatic tare deductions for SS canisters and drums, and flags mass discrepancies to prevent syrup adulteration.',
      mandiStandard: 'Legal Metrology (Packaged Commodities) Rules 2011 • APMC Honey Intake Norms',
      labTitle: 'Agro-Processing, NABL Isotope Lab & Serialization',
      labRole: 'Industrial Processing & Testing Station',
      labDesc: 'NABL laboratory purity testing and serialization plant. Performs EA-IRMS Carbon-13 isotope analysis to catch C4 synthetic sugars, calculates mass-balance conservation, and assigns unique cryptographically signed QR codes.',
      labStandard: 'FSSAI Gazette Honey Standards (Section 2.8.2) • EA-IRMS Carbon-13 Protocol',
      auditTitle: 'Central Regulatory Surveillance & Merkle DAG Console',
      auditRole: 'National Governance & Audit Console',
      auditDesc: 'Central surveillance console for FSSAI and KVIC enforcement teams. Visualizes multi-stage Merkle DAG batch genealogy, audits SHA-256 block ledger integrity, and manages discrepancy investigations with legal signoff.',
      auditStandard: 'FSSAI Surveillance Cell • National Digital Traceability Architecture (NDTA)',
      prevBtn: 'Previous Stage',
      nextBtn: 'Next Stage',
    },
    footer: {
      desc: 'National Honey Mission Authenticity & Provenance Protocol. Empowering rural beekeepers across the Western Ghats, Sunderbans, and Kashmir through cryptographic origin tracking.',
      stationsTitle: 'Physical Journey Stations',
      complianceTitle: 'Compliance & Standards',
      copyright: '© 2026 HoneyChain National Initiative • Government of India Collaboration',
      tagline: 'Zero Synthetic Sweeteners • 100% Verifiable Botanical Origin',
      standard1: 'FSSAI Gazette (Honey Standards 2020)',
      standard2: 'Agmark Honey Grading Rules (Special Grade)',
      standard3: 'National Honey Mission (KVIC, MoMSME)',
      standard4: 'EA-IRMS Carbon-13 Sugar Isotope Testing',
      hackathonTitle: 'National Hackathon 2026',
      hackathonDesc: 'Smart India Hackathon Innovation Track. Built with FastAPI, PostgreSQL, XGBoost ML, React 18, and SHA-256 Ledger.',
      builtFor: 'Built for Indian Beekeepers & Consumers',
    },
  },

  hi: {
    ribbon: {
      kvic: 'खादी एवं ग्रामोद्योग आयोग (KVIC)',
      mission: 'राष्ट्रीय मधुमक्खी पालन मिशन • FSSAI खाद्य सुरक्षा मानक 2020',
      dbLive: 'PostgreSQL डेटाबेस सक्रिय',
      cacheMode: 'लोकल कैश मोड',
    },
    nav: {
      brand: 'हनीचेन',
      subtitle: 'एआई एवं ब्लॉकचेन शुद्धता प्रमाणन प्रणाली',
      tag: 'राष्ट्रीय प्रोटोकॉल',
      home: 'मुख्य पृष्ठ',
      verify: 'शहद जांचें',
      beekeeper: 'किसान लॉग',
      mandi: 'मंडी डिजिटल कांटा',
      processing: 'प्रसंस्करण एवं लैब',
      admin: 'ऑडिट डैशबोर्ड',
      generateQr: 'जार QR बनाएं',
      scanJar: 'QR स्कैन करें',
      mobileHub: '📱 फोन में खोलें / QR',
      printCert: 'NABL सर्टिफिकेट',
    },
    hero: {
      badge: 'राष्ट्रीय मधुमक्खी मिशन • KVIC एवं FSSAI द्वारा प्रमाणित',
      title: 'मधुमक्खी के छत्ते से आपकी थाली तक शुद्ध भारतीय शहद',
      subtitle: 'किसी भी शहद जार का QR स्कैन करें और असली किसान, प्राकृतिक निष्कर्षण (<45°C) और NABL लैब की शुद्धता रिपोर्ट देखें। शून्य प्रतिशत मिलावट।',
      placeholder: 'जार का बैच कोड दर्ज करें (उदा. PKG-MAHA-042-2697)',
      verifyBtn: 'शहद सत्यापित करें',
      verifying: 'जांच जारी है...',
      scanBtn: 'कैमरा से QR स्कैन करें',
      genQrBtn: 'ग्राहक QR स्टिकर बनाएं',
      testBatchLabel: 'प्रमाणित शहद की त्वरित जांच:',
      sampleJamun: 'PKG-MAHA-042 (जामुन शहद)',
      mobileTestBtn: '📱 मोबाइल फोन पर देखें',
    },
    batchCard: {
      sectionTitle: 'आधिकारिक उत्पत्ति एवं शुद्धता प्रमाण',
      subTitle: 'ब्लॉकचेन समर्थित अखंडता एवं किसान से जार तक का सफर',
      verifiedBadge: 'FSSAI एवं एगमार्क स्पेशल ग्रेड • 100% प्राकृतिक वन शहद',
      unverifiedBadge: '⚠️ चेतावनी • मिलावटी / अप्रमाणित व्यावसायिक शहद',
      batchLabel: 'बैच कोड',
      listenAudio: '🔊 रिपोर्ट सुनें (आवाज)',
      printCertBtn: 'NABL सरकारी प्रमाण पत्र प्रिंट करें',
      moistureLabel: 'नमी का स्तर',
      moistureSub: 'मानक 20% से कम (उत्तीर्ण)',
      purityLabel: 'शुद्धता स्कोर',
      puritySub: 'शून्य C4 कृत्रिम चीनी',
      freshnessLabel: 'प्राकृतिक एंजाइम',
      freshnessSub: 'शीत निष्कर्षण (<45°C)',
      trustLabel: 'ब्लॉकचेन सत्यापन',
      trustSub: 'SHA-256 सुरक्षित डिजिटल मुहर',
      beekeeperLabel: 'पंजीकृत किसान',
      locationLabel: 'मधुमक्खी पालन क्षेत्र',
      fairPriceLabel: 'न्यूनतम समर्थन मूल्य (MSP)',
      directPay: 'किसान के बैंक खाते में सीधा भुगतान',
      hiveIdLabel: 'छत्ता क्रमांक (Hive ID)',
      floralSourceLabel: 'वानस्पतिक पराग स्रोत',
      dbtVerified: 'सीधा बैंक खाता हस्तांतरण (DBT) सत्यापित',
      beekeeperSectionTitle: 'पंजीकृत मधुमक्खी पालक',
      beekeeperSectionSub: 'इस शहद के पीछे परिश्रमी किसान',
    },
    viewer3d: {
      tag: 'इंटरएक्टिव 3D डिजिटल मॉडल',
      title: '3D शहद जार का 360° डिजिटल परीक्षण',
      subtitle: 'माउस से ड्रैग करें या स्क्रीन पर स्वाइप करके पारदर्शी कांच, सुनहरे शहद के गाढ़ेपन और डिजिटल सुरक्षा सील की 360° जांच करें।',
      hint: '🖱️ घुमाने के लिए ड्रैग करें • 🔄 360° दृश्य सक्रिय',
      jamun: 'महाबलेश्वर जामुन शहद',
      acacia: 'कश्मीर सफेद बबूल शहद',
      mangrove: 'सुंदरबन मैंग्रोव शहद',
      glassSpec: 'खाद्य-ग्रेड सुरक्षित कांच (सीसा-मुक्त)',
      tamperSeal: 'लेजर डिजिटल मुहर (टैम्पर-प्रूफ QR)',
      coldSettled: 'प्राकृतिक शीत निष्कर्षित शहद (<45°C)',
      autoRotate: 'स्वचालित घुमाव',
      diastasePurity: 'सक्रिय प्राकृतिक एंजाइम (14.5 DN)',
    },
    timeline: {
      title: 'सत्यापित 5-चरणीय भौतिक यात्रा',
      subtitle: 'जंगल के छत्तों से आपकी मेज तक पारदर्शी और सुरक्षित रिकॉर्ड',
      custodyBadge: '५ सत्यापित मील के पत्थर',
      step1Title: '१. छत्ता शहद निष्कर्षण',
      step1Desc: 'पारंपरिक किसानों द्वारा स्वच्छ स्टील निष्पादक से कम तापमान पर निकाला गया।',
      step2Title: '२. मंडी डिजिटल तौल एवं जांच',
      step2Desc: 'सरकारी प्रमाणित कांटे पर वजन दर्ज, बिचौलियों द्वारा मिलावट असंभव।',
      step3Title: '३. शीत निस्पंदन एवं प्रसंस्करण',
      step3Desc: '४५ डिग्री से कम तापमान पर छनाई ताकि प्राकृतिक एंजाइम जीवित रहें।',
      step4Title: '४. NABL रासायनिक एवं आइसोटोप टेस्ट',
      step4Desc: 'C-13 कार्बन आइसोटोप जांच में ०.०% बाहरी चीनी, पूर्णतः शुद्ध।',
      step5Title: '५. सीलबंद जार एवं डिजिटल QR मुहर',
      step5Desc: 'अपरिवर्तनीय डिजिटल QR कोड के साथ कांच के सुरक्षित जार में पैक।',
      verifiedStamp: 'मुख्य रसायनज्ञ द्वारा डिजिटल प्रमाणित',
    },
    generator: {
      modalTitle: 'ग्राहक हनी जार QR कोड जनरेटर',
      modalSubtitle: 'शहद जार के लिए आधिकारिक प्रिंट करने योग्य QR स्टिकर बनाएं',
      selectHoney: 'शहद की किस्म चुनें:',
      jamunHoney: 'महाबलेश्वर जामुन शहद (महाराष्ट्र)',
      acaciaHoney: 'कश्मीर घाटी सफेद बबूल शहद (J&K)',
      mangroveHoney: 'सुंदरबन प्राकृतिक मैंग्रोव शहद (पश्चिम बंगाल)',
      batchCodeLabel: 'बैच नंबर:',
      stickerPreviewTitle: 'प्रिंट करने योग्य जार स्टिकर लेबल',
      scanPrompt: 'फोन कैमरे से स्कैन कर किसान की कहानी व सरकारी लैब रिपोर्ट देखें',
      printBtn: '🖨️ जार स्टिकर प्रिंट करें',
      testScanBtn: '📲 ग्राहक दृश्य में टेस्ट करें',
      officialSeal: 'KVIC एवं FSSAI अधिकृत',
      guaranteedPurity: '१००% शुद्ध प्राकृतिक शहद • शून्य कृत्रिम चाशनी',
    },
    puritySim: {
      title: 'घर-घर परख: घरेलू शुद्धता सिम्युलेटर',
      subtitle: 'असली कच्चे शहद और मिलावटी चाशनी की पारंपरिक घरेलू रसोई जांच देखें',
      tag: 'पारंपरिक भारतीय शुद्धता विज्ञान',
      badge: 'घर-घर परख सिम्युलेटर',
      waterTest: 'पानी में विलेयता परीक्षण',
      flameTest: 'सूती बत्ती अग्नि परीक्षण',
      selectSamplePrompt: '१. जांच हेतु शहद का नमूना चुनें:',
      pureSampleTitle: '१००% प्राकृतिक जंगली शहद',
      pureSampleStats: 'नमी: १७.८% • ०% कृत्रिम चीनी',
      adulteratedSampleTitle: 'मिलावटी चाशनी का नमूना',
      adulteratedSampleStats: 'C4 गन्ने की चीनी + कॉर्न सिरप (४२%)',
      waterScienceTitle: 'पानी के घनत्व एवं विशिष्ट गुरुत्व का विज्ञान',
      waterScienceDesc: 'शुद्ध शहद का विशिष्ट गुरुत्व उच्च (~१.४२) और पृष्ठ तनाव अधिक होता है। पानी में डालने पर यह बिना घुले सीधे तली में मोती की तरह बैठ जाता है। औद्योगिक चाशनी तुरंत घुलकर पानी को धुंधला कर देती है।',
      flameScienceTitle: 'ज्वलनशीलता एवं प्राकृतिक नमी का विज्ञान',
      flameScienceDesc: 'शुद्ध शहद में १८% से कम नमी होती है। शहद में डूबी सूती बत्ती जलाने पर वह शांत सुनहरी लौ के साथ जलती है। पानी मिली चाशनी में बत्ती तड़तड़ाकर बुझ जाती है।',
      runWaterBtn: 'पानी में विलेयता जांच शुरू करें',
      runFlameBtn: 'सूती बत्ती अग्नि जांच शुरू करें',
      runningSim: 'भौतिक रासायनिक जांच जारी है...',
      vesselWaterTitle: 'सिम्युलेशन फ्लास्क • पानी परीक्षण',
      vesselFlameTitle: 'सिम्युलेशन फ्लास्क • अग्नि परीक्षण',
      pureVesselBadge: 'नमूना: १००% शुद्ध कच्चा शहद',
      adulteratedVesselBadge: 'नमूना: मिलावटी चाशनी',
      waterPureResult: 'अखंड शहद की परत (उच्च घनत्व)',
      waterAdulteratedResult: 'धुंधला घोल (तुरंत घुलनशील चाशनी)',
      flamePureResult: 'स्वच्छ सुनहरी लौ',
      flameAdulteratedResult: 'तड़तड़ाकर बुझ गई',
      clickPrompt: 'शहद की बूंद गिराने के लिए "जांच शुरू करें" पर क्लिक करें',
      verdictPurePassed: 'निष्कर्ष: १००% शुद्ध प्राकृतिक शहद (उत्तीर्ण)',
      verdictPureWaterDesc: 'शहद की बूंद बिना घुले तली में सुरक्षित बैठ गई, जिससे १७.८% प्राकृतिक नमी और शून्य बाहरी चाशनी प्रमाणित होती है।',
      verdictPureFlameDesc: 'बत्ती बिना किसी बाधा के सुनहरी लौ के साथ जली, जिससे FSSAI मानक २०% से कम नमी की पुष्टि होती है।',
      verdictAdulteratedFailed: 'निष्कर्ष: कृत्रिम चाशनी की मिलावट पाई गई',
      verdictAdulteratedWaterDesc: 'पानी में तुरंत घुलकर धुंधलापन उत्पन्न हुआ, जो इनवर्ट राइस सिरप या कॉर्न सिरप की मिलावट का सीधा प्रमाण है।',
      verdictAdulteratedFlameDesc: 'अत्यधिक नमी और कृत्रिम चीनी के कारण बत्ती तड़तड़ाकर बुझ गई।',
      pureVerdict: 'शुद्ध शहद पानी में नीचे मोती की तरह बैठ जाता है, तुरंत घुलता नहीं।',
      adulteratedVerdict: 'चीनी चाशनी तुरंत घुलकर पानी को धुंधला कर देती है।',
    },
    gallery: {
      tag: 'भौतिक एवं संवेदी प्रोफाइलिंग',
      title: 'प्राकृतिक शहद की भौतिक पहचान एवं वानस्पतिक दीर्घा',
      subtitle: 'कच्चे शहद की अचूक भौतिक पहचान—उच्च पृष्ठ तनाव, जीवित परागकण और प्राकृतिक जमाव।',
      card1Title: 'प्राकृतिक गाढ़ापन एवं घनत्व',
      card1Desc: 'धीमी घुमावदार धार जो 17.8% नमी दर्शाती है। शून्य पानी या मक्का चाशनी की मिलावट।',
      card1Badge: 'धीमी सर्पिलाकार धार',
      card2Title: 'शीत निष्कर्षित कच्चा छत्ता',
      card2Desc: '40 डिग्री से कम पर निकाला गया छत्ता। जीवित पाचक एंजाइम और पराग सुरक्षित।',
      card2Badge: 'मोम से ढका छत्ता',
      card3Title: 'भारतीय देशी मधुमक्खियां',
      card3Desc: 'सह्याद्री और पश्चिमी घाट के जंगलों में जामुन व बबूल के फूलों पर विचरण करती देशी मक्खियां।',
      card3Badge: 'एपिस सेराना इंडिका',
      card4Title: 'सुरक्षित डिजिटल QR सील',
      card4Desc: 'कांच के जार पर चिपकाया गया अपरिवर्तनीय डिजिटल QR कोड जो सीधे ब्लॉकचेन से जुड़ा है।',
      card4Badge: '500 ग्राम सुरक्षित जार',
    },
    terminals: {
      tag: 'कार्यकारी टर्मिनल',
      title: 'हितधारक पोर्टल एवं हार्डवेयर सिमुलेशन',
      subtitle: 'मूल्यांकनकर्ता और अधिकारी हनीचेन के लाइव फील्ड मॉड्यूल का प्रत्यक्ष संचालन देख सकते हैं:',
      launchBtn: 'टर्मिनल खोलें',
      dbStatus: 'PostgreSQL डेटाबेस कनेक्टेड',
      beekeeperTitle: 'मधुमक्खी पालक टर्मिनल',
      beekeeperDesc: 'आवाज द्वारा फसल घोषणा (हिंदी/मराठी), लाइव IoT छत्ता सेंसर, और XGBoost AI उत्पादन पूर्वानुमान।',
      mandiTitle: 'मंडी डिजिटल कांटा',
      mandiDesc: 'डिजिटल वजन पैमाना, कनस्तर वजन कटौती (टारे), और वास्तविक समय भौतिक वजन मिलान।',
      labTitle: 'प्रसंस्करण एवं NABL प्रयोगशाला',
      labDesc: 'सिरप मिलावट रोकने वाला द्रव्यमान संतुलन गणक, 5-पैरामीटर रासायनिक जांच, और जार क्रमांकन।',
      auditTitle: 'केंद्रीय नियामक ऑडिट',
      auditDesc: 'बैच वंशावली DAG अन्वेषक, विसंगति जांच एवं निवारण, और SHA-256 ब्लॉकचेन लेजर।',
    },
    stages: {
      stageLabel: 'चरण',
      stageOf: 'का',
      consumerTitle: 'उपभोक्ता सत्यापन एवं वानस्पतिक उत्पत्ति',
      consumerRole: 'सार्वजनिक सत्यापन पोर्टल',
      consumerDesc: 'शहद जार का QR कोड स्कैन करें, रमेश पाटिल के छत्तों का स्थान देखें, NABL प्रयोगशाला का आइसोटोप प्रमाण पत्र जांचें और संपूर्ण ब्लॉकचेन सुरक्षा देखें।',
      consumerStandard: 'उपभोक्ता संरक्षण (ई-कॉमर्स) नियम २०२० • FSSAI खाद्य सुरक्षा मानक',
      beekeeperTitle: 'मधुमक्खी पालक फील्ड लॉग एवं IoT छत्ता टेलीमेट्री',
      beekeeperRole: 'उत्पादक किसान केंद्र',
      beekeeperDesc: 'ग्रामीण किसानों हेतु आवाज आधारित फसल घोषणा (हिंदी/मराठी/अंग्रेजी), लाइव छत्ता तापमान व ध्वनि सेंसर, और XGBoost AI उत्पादन पूर्वानुमान।',
      beekeeperStandard: 'राष्ट्रीय मधुमक्खी मिशन दिशा-निर्देश • KVIC स्मार्ट किसान पासबुक',
      mandiTitle: 'मंडी डिजिटल वजन कांटा एवं टारे कटौती',
      mandiRole: 'कृषि उपज मंडी समिति (APMC)',
      mandiDesc: 'डिजिटल कांटे से वजन का सीधा मिलान, खाली कनस्तर का सटीक वजन घटाव और बिचौलियों द्वारा मिलावट रोकने हेतु सख्त सत्यापन।',
      mandiStandard: 'विधिक मापविज्ञान नियम २०११ • APMC शहद आवक मानक',
      labTitle: 'प्रसंस्करण, NABL आइसोटोप प्रयोगशाला एवं क्रमांकन',
      labRole: 'औद्योगिक प्रसंस्करण एवं गुणवत्ता जांच',
      labDesc: 'C-13 कार्बन आइसोटोप विश्लेषण से चीनी सिरप की पहचान, द्रव्यमान संतुलन गणना और प्रत्येक जार पर विशिष्ट डिजिटल QR कोड आवंटन।',
      labStandard: 'FSSAI राजपत्र शहद मानक (धारा २.८.२) • EA-IRMS कार्बन-13 प्रोटोकॉल',
      auditTitle: 'केंद्रीय नियामक निगरानी एवं ब्लॉकचेन Merkle DAG',
      auditRole: 'राष्ट्रीय प्रशासनिक ऑडिट कंसोल',
      auditDesc: 'FSSAI व KVIC जांच अधिकारियों हेतु Merkle DAG वंशावली वृक्ष, SHA-256 ब्लॉकचेन लेजर और संदिग्ध बैचों की कानूनी जांच प्रणाली।',
      auditStandard: 'FSSAI निगरानी प्रकोष्ठ • राष्ट्रीय डिजिटल ट्रेसिबिलिटी आर्किटेक्चर',
      prevBtn: 'पिछला चरण',
      nextBtn: 'अगला चरण',
    },
    footer: {
      desc: 'राष्ट्रीय मधुमक्खी मिशन प्रामाणिकता एवं मूल स्रोत प्रोटोकॉल। पश्चिमी घाट, सुंदरबन और कश्मीर के ग्रामीण मधुमक्खी पालकों को सीधे पारदर्शी मूल्य दिलाने का सरकारी प्रयास।',
      stationsTitle: 'भौतिक यात्रा के पड़ाव',
      complianceTitle: 'मानक एवं प्रमाणन',
      copyright: '© २०२६ हनीचेन राष्ट्रीय पहल • भारत सरकार का सहयोग',
      tagline: 'शून्य कृत्रिम मिठास • १००% सत्यापन योग्य प्राकृतिक शहद',
      standard1: 'FSSAI राजपत्र (शहद मानक 2020)',
      standard2: 'एगमार्क शहद ग्रेडिंग नियम (स्पेशल ग्रेड)',
      standard3: 'राष्ट्रीय मधुमक्खी पालन मिशन (KVIC, MoMSME)',
      standard4: 'EA-IRMS कार्बन-13 चीनी आइसोटोप परीक्षण',
      hackathonTitle: 'राष्ट्रीय हैकथॉन 2026',
      hackathonDesc: 'स्मार्ट इंडिया हैकथॉन नवाचार ट्रैक। FastAPI, PostgreSQL, XGBoost AI, React 18 और SHA-256 ब्लॉकचेन से निर्मित।',
      builtFor: 'भारतीय किसानों एवं उपभोक्ताओं के लिए समर्पित',
    },
  },

  mr: {
    ribbon: {
      kvic: 'खादी आणि ग्रामोद्योग आयोग (KVIC)',
      mission: 'राष्ट्रीय मधमाशी पालन मोहीम • FSSAI अन्न सुरक्षा मानक २०२०',
      dbLive: 'PostgreSQL डेटाबेस लाइव्ह',
      cacheMode: 'स्थानिक कॅश मोड',
    },
    nav: {
      brand: 'हनीचेन',
      subtitle: 'एआय आणि ब्लॉकचेन मध शुद्धता प्रणाली',
      tag: 'राष्ट्रीय प्रोटोकॉल',
      home: 'मुख्य पान',
      verify: 'मध तपासा',
      beekeeper: 'शेतकरी नोंद',
      mandi: 'मंडी डिजिटल काटा',
      processing: 'प्रक्रिया आणि लॅब',
      admin: 'ऑडिट डॅशबोर्ड',
      generateQr: 'जार QR बनवा',
      scanJar: 'QR स्कॅन करा',
      mobileHub: '📱 फोनमध्ये उघडा / QR',
      printCert: 'NABL प्रमाणपत्र',
    },
    hero: {
      badge: 'राष्ट्रीय मध मोहीम • KVIC आणि FSSAI प्रमाणित',
      title: 'पोळ्यापासून आपल्या ताटापर्यंत १००% अस्सल भारतीय मध',
      subtitle: 'मध बाटलीचा QR कोड स्कॅन करा आणि कष्टकरी शेतकरी, नैसर्गिक शीत प्रक्रिया (<४५°C) व NABL लॅबची खरी चाचणी पहा. शून्य भेसळ.',
      placeholder: 'मध बाटलीचा बॅच कोड टाका (उदा. PKG-MAHA-042-2697)',
      verifyBtn: 'मध तपासा',
      verifying: 'तपासत आहे...',
      scanBtn: 'कॅमेऱ्याने QR स्कॅन करा',
      genQrBtn: 'ग्राहक QR स्टिकर बनवा',
      testBatchLabel: 'प्रमाणित मधाची त्वरित चाचणी:',
      sampleJamun: 'PKG-MAHA-042 (जांभूळ मध)',
      mobileTestBtn: '📱 मोबाईलवर पहा',
    },
    batchCard: {
      sectionTitle: 'अधिकृत मूळ स्रोत आणि शुद्धता नोंद',
      subTitle: 'ब्लॉकचेन तंत्रज्ञानाने सुरक्षित शेतकरी ते बाटलीचा खरा प्रवास',
      verifiedBadge: 'FSSAI आणि अ‍ॅगमार्क स्पेशल ग्रेड • १००% अस्सल वन मध',
      unverifiedBadge: '⚠️ सतर्कतेचा इशारा • भेसळयुक्त व्यावसायिक मध',
      batchLabel: 'बॅच कोड',
      listenAudio: '🔊 अहवाल ऐका (ऑडिओ)',
      printCertBtn: 'NABL अधिकृत प्रमाणपत्र प्रिंट करा',
      moistureLabel: 'ओलाव्याचे प्रमाण',
      moistureSub: 'मानक २०% पेक्षा कमी (उत्तीर्ण)',
      purityLabel: 'शुद्धता टक्केवारी',
      puritySub: 'शून्य C4 ऊसाची साखर',
      freshnessLabel: 'नैसर्गिक एन्झाईम्स',
      freshnessSub: 'शीत प्रक्रिया (<४५°C)',
      trustLabel: 'ब्लॉकचेन विश्वास',
      trustSub: 'SHA-256 सुरक्षित डिजिटल शिक्का',
      beekeeperLabel: 'नोंदणीकृत शेतकरी',
      locationLabel: 'मधमाशी पालन परिसर',
      fairPriceLabel: 'हमीभाव (रास्त भाव)',
      directPay: 'शेतकऱ्याच्या बँक खात्यात थेट जमा',
      hiveIdLabel: 'पोळ्याचा क्रमांक (Hive ID)',
      floralSourceLabel: 'नैसर्गिक फुलांचा पराग स्रोत',
      dbtVerified: 'थेट बँक खात्यात हमीभाव (DBT) पडताळणी',
      beekeeperSectionTitle: 'कष्टकरी मधपाळ शेतकरी',
      beekeeperSectionSub: 'या मधामागील परिश्रमी शेतकरी',
    },
    viewer3d: {
      tag: 'परस्परसंवादी 3D डिजिटल मॉडेल',
      title: '3D मध बाटलीची ३६०° डिजिटल पाहणी',
      subtitle: 'माऊसने ड्रॅग करा किंवा स्क्रीनवर स्वाइप करून पारदर्शक काच, अस्सल मधाचा दाटपणा आणि डिजिटल सुरक्षा सील ३६० अंशात तपासा.',
      hint: '🖱️ फिरवण्यासाठी ड्रॅग करा • 🔄 ३६०° दृश्य सुरू',
      jamun: 'महाबळेश्वर जांभूळ मध',
      acacia: 'काश्मीर पांढरा बाभूळ मध',
      mangrove: 'सुंदरबन खारफुटी मध',
      glassSpec: 'अन्न-सुरक्षित काच (शून्य शिसे)',
      tamperSeal: 'लेझर डिजिटल शिक्का (फोडता न येणारा QR)',
      coldSettled: 'नैसर्गिक शीत प्रक्रिया मध (<४५°C)',
      autoRotate: 'आपोआप फिरवणे',
      diastasePurity: 'जिवंत पाचक एन्झाईम्स (14.5 DN)',
    },
    timeline: {
      title: 'प्रमाणित ५-टप्प्यांचा प्रत्यक्ष प्रवास',
      subtitle: 'सह्याद्रीच्या रानापासून आपल्या घरापर्यंत पारदर्शक आणि सुरक्षित नोंद',
      custodyBadge: '५ प्रमाणित टप्पे',
      step1Title: '१. पोळ्यातून मध काढणे',
      step1Desc: 'स्थानिक शेतकऱ्याने स्वच्छ स्टेनलेस स्टील यंत्राने नैसर्गिकरित्या मध काढला.',
      step2Title: '२. कृषी उत्पन्न बाजार समिती डिजिटल वजन',
      step2Desc: 'सरकारी प्रमाणित वजन काट्यावर वजन नोंदवले, मध्यस्थांची भेसळ रोखली.',
      step3Title: '३. शीत गाळणी आणि प्रक्रिया',
      step3Desc: '४५ अंश तापमानाखाली गाळणी करून मधातील जिवंत पाचकद्रव्ये टिकवली.',
      step4Title: '४. NABL रासायनिक आणि आयसोटोप चाचणी',
      step4Desc: 'C-13 कार्बन चाचणीत ०.०% कृत्रिम साखर, १००% अस्सल नैसर्गिक मध.',
      step5Title: '५. सीलबंद बाटली आणि डिजिटल QR शिक्का',
      step5Desc: 'फोडता न येणाऱ्या अद्वितीय QR कोडसह काचेच्या सुरक्षित बाटलीत पॅक.',
      verifiedStamp: 'मुख्य रसायनतज्ज्ञांनी डिजिटल प्रमाणित केले',
    },
    generator: {
      modalTitle: 'ग्राहक मध बाटली QR कोड जनरेटर',
      modalSubtitle: 'मध बाटलीवर लावण्यासाठी अधिकृत प्रिंट करण्यायोग्य QR स्टिकर तयार करा',
      selectHoney: 'मधाचा प्रकार निवडा:',
      jamunHoney: 'महाबळेश्वर जांभूळ मध (महाराष्ट्र)',
      acaciaHoney: 'काश्मीर खोरे पांढरा बाभूळ मध (J&K)',
      mangroveHoney: 'सुंदरबन नैसर्गिक खारफुटी मध (पश्चिम बंगाल)',
      batchCodeLabel: 'बॅच क्रमांक:',
      stickerPreviewTitle: 'प्रिंट करण्यायोग्य बाटली स्टिकर लेबल',
      scanPrompt: 'मोबाईल कॅमेऱ्याने स्कॅन करून शेतकऱ्याची माहिती व सरकारी लॅब अहवाल पहा',
      printBtn: '🖨️ स्टिकर लेबल प्रिंट करा',
      testScanBtn: '📲 ग्राहक दृश्यात तपासा',
      officialSeal: 'KVIC आणि FSSAI अधिकृत',
      guaranteedPurity: '१००% अस्सल नैसर्गिक मध • साखर पाक विरहित',
    },
    puritySim: {
      title: 'घर-घर पारख: घरगुती शुद्धता सिम्युलेटर',
      subtitle: 'अस्सल मध आणि भेसळयुक्त साखरेच्या पाकाची सोपी पारंपारिक घरगुती चाचणी पहा',
      tag: 'पारंपारिक भारतीय शुद्धता विज्ञान',
      badge: 'घर-घर पारख सिम्युलेटर',
      waterTest: 'पाण्यातील विरघळण्याची चाचणी',
      flameTest: 'सुती वातीची अग्नी चाचणी',
      selectSamplePrompt: '१. तपासणीसाठी मधाचा नमुना निवडा:',
      pureSampleTitle: '१००% अस्सल रानमध',
      pureSampleStats: 'ओलावा: १७.८% • ०% कृत्रिम साखर',
      adulteratedSampleTitle: 'भेसळयुक्त साखरेचा पाक',
      adulteratedSampleStats: 'C4 ऊसाची साखर + कॉर्न सिरप (४२%)',
      waterScienceTitle: 'पाण्याची घनता आणि विशिष्ट गुरुत्वाचे विज्ञान',
      waterScienceDesc: 'अस्सल मधाचे विशिष्ट गुरुत्व उच्च (~१.४२) आणि पृष्ठताण जास्त असते. पाण्यात टाकल्यास तो न विरघळता तळाशी मोत्यासारखा घट्ट बसतो. व्यावसायिक साखर पाक पाण्यात लगेच विरघळून पाणी गढूळ करतो.',
      flameScienceTitle: 'ज्वलनशीलता आणि नैसर्गिक ओलाव्याचे विज्ञान',
      flameScienceDesc: 'अस्सल मधात १८% पेक्षा कमी ओलावा असतो. मधात बुडवलेली सुती वात पेटवल्यास ती शांत सोन्यासारख्या ज्योतीने जळते. पाणी मिसळलेल्या साखरेच्या पाकात वात तडतडून विझून जाते.',
      runWaterBtn: 'पाण्यातील विरघळण्याची चाचणी करा',
      runFlameBtn: 'सुती वातीची अग्नी चाचणी करा',
      runningSim: 'भौतिक रासायनिक चाचणी सुरू आहे...',
      vesselWaterTitle: 'सिम्युलेशन फ्लास्क • पाणी चाचणी',
      vesselFlameTitle: 'सिम्युलेशन फ्लास्क • अग्नी चाचणी',
      pureVesselBadge: 'नमुना: १००% अस्सल रानमध',
      adulteratedVesselBadge: 'नमुना: भेसळयुक्त साखर पाक',
      waterPureResult: 'अखंड मधाचा थर (उच्च घनता)',
      waterAdulteratedResult: 'गढूळ द्रावण (लगेच विरघळणारा पाक)',
      flamePureResult: 'स्वच्छ सोनेरी ज्योत',
      flameAdulteratedResult: 'तडतडून विझली',
      clickPrompt: 'मधाचा थेंब टाकण्यासाठी "चाचणी करा" बटणावर क्लिक करा',
      verdictPurePassed: 'निष्कर्ष: १००% अस्सल नैसर्गिक मध (उत्तीर्ण)',
      verdictPureWaterDesc: 'मधाचा थेंब न विरघळता तळाशी घट्ट बसला, ज्यावरून १७.८% नैसर्गिक ओलावा व शून्य टक्के कृत्रिम साखर सिद्ध होते.',
      verdictPureFlameDesc: 'वात अडथळ्याविना सोनेरी ज्योतीने जळाली, ज्यामुळे FSSAI २०% पेक्षा कमी ओलावा सिद्ध होतो.',
      verdictAdulteratedFailed: 'निष्कर्ष: कृत्रिम साखरेच्या पाकाची भेसळ आढळली',
      verdictAdulteratedWaterDesc: 'पाण्यात लगेच विरघळून गढूळपणा आला, जे इनव्हर्ट राइस सिरप किंवा कॉर्न सिरप भेसळीचे स्पष्ट लक्षण आहे.',
      verdictAdulteratedFlameDesc: 'अतिरिक्त पाणी आणि कृत्रिम साखरेमुळे वात तडतडून विझून गेली.',
      pureVerdict: 'अस्सल मध पाण्यात न विरघळता तळाशी मोत्यासारखा घट्ट बसतो.',
      adulteratedVerdict: 'साखरेचा पाक पाण्यात लगेच विरघळून पाणी गढूळ करतो.',
    },
    gallery: {
      tag: 'भौतिक आणि संवेदी वैशिष्ट्ये',
      title: 'अस्सल मधाची खरी ओळख आणि छायाचित्र दालन',
      subtitle: 'कच्च्या मधाची अचूक ओळख—उच्च पृष्ठताण, जिवंत परागकण आणि नैसर्गिक स्फटिकीकरण.',
      card1Title: 'नैसर्गिक मधाची घट्ट धार',
      card1Desc: 'संतुलित घट्टपणा जो १७.८% नैसर्गिक ओलावा दर्शवतो. शून्य पाणी किंवा कॉर्न सिरप.',
      card1Badge: 'संतुलित मंद धार',
      card2Title: 'शीत यंत्राने काढलेला कच्चा पोळा',
      card2Desc: '४० अंशाखाली काढलेला पोळा. जिवंत पाचकद्रव्ये आणि नैसर्गिक प्रोपोलिस सुरक्षित.',
      card2Badge: 'मेणाचे बंद पोळे',
      card3Title: 'स्थानिक भारतीय मधमाश्या',
      card3Desc: 'सह्याद्रीच्या डोंगररांगांमध्ये जांभूळ व रानफुलांमधून मध गोळा करणाऱ्या देशी मधमाश्या.',
      card3Badge: 'एपिस सेराना इंडिका',
      card4Title: 'सुरक्षित डिजिटल QR शिक्का',
      card4Desc: 'अन्न-सुरक्षित काचेच्या बाटलीवर लावलेला अद्वितीय QR कोड जो थेट ब्लॉकचेनशी जोडलेला आहे.',
      card4Badge: '५०० ग्रॅम काचेची बाटली',
    },
    terminals: {
      tag: 'कार्यकारी टर्मिनल्स',
      title: 'हितधारक पोर्टल्स आणि हार्डवेअर प्रणाली',
      subtitle: 'तपासणी अधिकारी आणि परीक्षक हनीचेनच्या सर्व कार्यरत मॉड्यूल्सची थेट पाहणी करू शकतात:',
      launchBtn: 'टर्मिनल उघडा',
      dbStatus: 'PostgreSQL डेटाबेस जोडलेला',
      beekeeperTitle: 'शेतकरी पोर्टल (मधपाळ)',
      beekeeperDesc: 'आवाजाद्वारे मध नोंदणी (मराठी/हिंदी), थेट IoT पोळे सेन्सर्स आणि XGBoost AI उत्पादन अंदाज.',
      mandiTitle: 'मंडी डिजिटल वजन काटा',
      mandiDesc: 'डिजिटल वजन काटा सिम्युलेटर, डब्याचे वजन वजावट आणि भेसळ रोखणारी वजन पडताळणी.',
      labTitle: 'प्रक्रिया केंद्र आणि NABL लॅब',
      labDesc: 'साखर पाक भेसळ रोखणारे वस्तुमान संतुलन, ५-घटकांची रासायनिक चाचणी आणि बाटली अनुक्रमांक.',
      auditTitle: 'केंद्रीय नियामक ऑडिट',
      auditDesc: 'बॅच प्रवास DAG आलेख, संशयास्पद नोंदींची चौकशी आणि SHA-256 ब्लॉकचेन लेजर.',
    },
    stages: {
      stageLabel: 'टप्पा',
      stageOf: 'पैकी',
      consumerTitle: 'ग्राहक पडताळणी आणि वनस्पती मूळ स्रोत',
      consumerRole: 'सार्वजनिक पडताळणी पोर्टल',
      consumerDesc: 'मध बाटलीचा QR कोड स्कॅन करा, रमेश पाटिल यांच्या पोळ्यांचे स्थान तपासा, NABL लॅबचे सरकारी प्रमाणपत्र पहा आणि संपूर्ण ब्लॉकचेन नोंद तपासा.',
      consumerStandard: 'ग्राहक संरक्षण (ई-कॉमर्स) नियम २०२० • FSSAI अन्न सुरक्षा मानके',
      beekeeperTitle: 'शेतकरी शेत नोंद आणि IoT पोळे सेन्सर',
      beekeeperRole: 'उत्पादक शेतकरी केंद्र',
      beekeeperDesc: 'ग्रामीण मधपाळांसाठी आवाजाद्वारे नोंदणी (मराठी/हिंदी/इंग्रजी), थेट पोळे तापमान व आवाज सेन्सर आणि XGBoost AI उत्पादन अंदाज.',
      beekeeperStandard: 'राष्ट्रीय मध मोहीम मार्गदर्शक तत्त्वे • KVIC स्मार्ट किसान पासबुक',
      mandiTitle: 'मंडी डिजिटल वजन काटा आणि डबा वजन वजावट',
      mandiRole: 'कृषी उत्पन्न बाजार समिती (APMC)',
      mandiDesc: 'डिजिटल वजन काट्याशी थेट जोडणी, डब्याचे वजन अचूक वजा करून मध भेसळ रोखणारी डिजिटल पडताळणी.',
      mandiStandard: 'वजन व मापे नियम २०११ • APMC मध आवक मानके',
      labTitle: 'प्रक्रिया, NABL आयसोटोप लॅब आणि बाटली अनुक्रमांक',
      labRole: 'औद्योगिक प्रक्रिया आणि रासायनिक चाचणी',
      labDesc: 'C-13 कार्बन चाचणीद्वारे साखर पाक ओळखणे, वस्तुमान संतुलन आणि प्रत्येक बाटलीला अद्वितीय डिजिटल QR कोड देणे.',
      labStandard: 'FSSAI राजपत्रीय मध मानके (कलम २.८.२) • EA-IRMS कार्बन-13 प्रोटोकॉल',
      auditTitle: 'केंद्रीय नियामक तपासणी आणि ब्लॉकचेन Merkle DAG',
      auditRole: 'राष्ट्रीय प्रशासकीय ऑडिट केंद्र',
      auditDesc: 'FSSAI आणि KVIC अधिकाऱ्यांसाठी Merkle DAG आलेख, SHA-256 लेजर आणि संशयास्पद नोंदींची कायदेशीर चौकशी प्रणाली.',
      auditStandard: 'FSSAI दक्षता विभाग • राष्ट्रीय डिजिटल शोधक्षमता प्रणाली',
      prevBtn: 'मागील टप्पा',
      nextBtn: 'पुढील टप्पा',
    },
    footer: {
      desc: 'राष्ट्रीय मध मोहीम सत्यता आणि मूळ स्रोत प्रणाली. सह्याद्री, सुंदरबन आणि काश्मीरमधील कष्टकरी मधपाळ शेतकऱ्यांना थेट रास्त भाव मिळवून देणारा शासकीय उपक्रम.',
      stationsTitle: 'प्रत्यक्ष प्रवासाचे टप्पे',
      complianceTitle: 'मानके आणि कायदेशीर नोंदणी',
      copyright: '© २०२६ हनीचेन राष्ट्रीय उपक्रम • भारत सरकार सहकार्य',
      tagline: 'शून्य कृत्रिम गोडवा • १००% पडताळणीयोग्य नैसर्गिक मध',
      standard1: 'FSSAI राजपत्र (मध मानके २०२०)',
      standard2: 'अ‍ॅगमार्क मध प्रतवारी नियम (स्पेशल ग्रेड)',
      standard3: 'राष्ट्रीय मधमाशी पालन मोहीम (KVIC, MoMSME)',
      standard4: 'EA-IRMS कार्बन-13 साखर आयसोटोप चाचणी',
      hackathonTitle: 'राष्ट्रीय हॅकाथॉन २०२६',
      hackathonDesc: 'स्मार्ट इंडिया हॅकाथॉन नाविन्यता ट्रॅक. FastAPI, PostgreSQL, XGBoost AI, React 18 आणि SHA-256 ब्लॉकचेनद्वारे निर्मित.',
      builtFor: 'भारतीय मधपाळ शेतकरी आणि ग्राहकांसाठी समर्पित',
    },
  },
};
