// src/data/schemesData.js (Example - Create this file or put directly in component)

// NOTE: Replace '#' with actual official government URLs when known.
export const schemes = [
    {
      id: 'pmkisan',
      name: 'Pradhan Mantri Kisan Samman Nidhi',
      shortName: 'PM-KISAN',
      category: 'Income Support',
      description: 'Provides direct income support of ₹6,000 per year in three equal installments to eligible landholding farmer families.',
      keyBenefits: [
        'Direct financial assistance.',
        'Supports small and marginal farmers.',
        'Aids in meeting farm input costs.'
      ],
      link: 'https://pmkisan.gov.in/'
    },
    {
      id: 'pmkmy',
      name: 'Pradhan Mantri Kisan Maan Dhan Yojana',
      shortName: 'PM-KMY',
      category: 'Social Security',
      description: 'A voluntary pension scheme for small and marginal farmers (SMFs) ensuring social security upon reaching 60 years of age.',
      keyBenefits: [
        'Provides old-age pension.',
        'Voluntary and contributory.',
        'Government matching contribution.'
      ],
      link: 'https://maandhan.in/auth/login' // Login page, might need a better landing page if available
    },
    {
      id: 'pmfby',
      name: 'Pradhan Mantri Fasal Bima Yojana',
      shortName: 'PMFBY',
      category: 'Crop Insurance',
      description: 'Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest stages.',
      keyBenefits: [
        'Low uniform premium rates.',
        'Covers yield losses.',
        'Use of technology for assessment.'
      ],
      link: 'https://pmfby.gov.in/'
    },
    {
      id: 'kcc',
      name: 'Kisan Credit Card Scheme',
      shortName: 'KCC',
      category: 'Credit & Finance',
      description: 'Provides timely credit support for cultivation needs, non-farm activities, and consumption requirements.',
      keyBenefits: [
        'Simplified credit access.',
        'Often includes concessional interest rates.',
        'Flexible repayment.',
        'Covers various farming needs.'
      ],
      link: 'https://www.nabard.org/content1.aspx?id=591&catid=8&mid=488' // NABARD info page
    },
    {
      id: 'pmksy',
      name: 'Pradhan Mantri Krishi Sinchayee Yojana',
      shortName: 'PMKSY',
      category: 'Irrigation',
      description: 'Aims to enhance farm water access and expand cultivable area under assured irrigation ("Har Khet Ko Pani", "Per Drop More Crop").',
      keyBenefits: [
        'Improves water availability.',
        'Promotes efficient water use (micro-irrigation).',
        'Supports watershed development.',
        'Increases irrigated land area.'
      ],
      link: 'https://pmksy.gov.in/'
    },
     {
      id: 'shc',
      name: 'Soil Health Card Scheme',
      shortName: 'SHC',
      category: 'Soil & Inputs',
      description: 'Provides farmers with soil nutrient status reports and recommendations for balanced fertilizer use.',
      keyBenefits: [
          'Promotes balanced nutrient application.',
          'Improves soil health long-term.',
          'Can optimize fertilizer costs.',
          'Increases crop productivity.'
      ],
      link: 'https://soilhealth.dac.gov.in/'
    },
     {
      id: 'enam',
      name: 'e-National Agriculture Market',
      shortName: 'e-NAM',
      category: 'Market Access',
      description: 'A pan-India electronic trading portal networking APMC mandis to create a unified national market.',
      keyBenefits: [
          'Better price discovery.',
          'Increased market access for farmers.',
          'Transparent transactions.',
          'Online payment facility.'
      ],
      link: 'https://www.enam.gov.in/web/'
    },
     {
      id: 'aif',
      name: 'Agriculture Infrastructure Fund',
      shortName: 'AIF',
      category: 'Infrastructure',
      description: 'Provides financing for post-harvest management infrastructure and community farming assets.',
      keyBenefits: [
          'Supports creation of warehouses, cold storage etc.',
          'Reduces post-harvest losses.',
          'Improves value chain efficiency.',
          'Interest subvention & credit guarantee.'
      ],
      link: 'https://agriinfra.dac.gov.in/'
    },
     {
      id: 'smam',
      name: 'Sub-Mission on Agricultural Mechanization',
      shortName: 'SMAM',
      category: 'Mechanization',
      description: 'Promotes farm mechanization by providing subsidies for machinery purchase and establishing custom hiring centers.',
      keyBenefits: [
          'Increases farm efficiency.',
          'Reduces labor dependency.',
          'Promotes precision farming.',
          'Makes machinery affordable.'
      ],
      link: 'https://farmech.dac.gov.in/'
    },
    // Add more schemes following this structure...
  ];
  
  // Extract unique categories for filtering dropdown
  export const schemeCategories = ['All', ...new Set(schemes.map(scheme => scheme.category))];