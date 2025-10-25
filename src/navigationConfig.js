export const navigationData = {
  main: {
    bannerKey: 'banner_main',
    navLinks: []
  },
  poe1: {
    bannerKey: 'banner_poe1',
    navLinks: [
      { type: 'link', path: '/poe1', textKey: 'poe1_home', end: true },
      {
        type: 'dropdown',
        id: 'tools',
        textKey: 'poe1_tools',
        activeCheck: ['map', 'vorici', 'regex', 'act-guide'],
        items: [
          { path: '/poe1/vorici', textKey: 'poe1_voriciCalculator', iconKey: 'chromatic', cardImageKey: 'Chromatic_Calculator' },
          { path: '/poe1/regex', textKey: 'poe1_regexGenerator', iconKey: 'summit_map', cardImageKey: 'regex_card' },
          { path: '/poe1/shipping-calculator', textKey: 'poe1_ShippingCalculator', iconKey: 'Kingsmarch_Ore_Bar', cardImageKey: 'Kingsmarch_Nagivator' },
          { path: '/poe1/act-guide', textKey: 'poe1_act_guide', iconKey: 'Portal_Icon', cardImageKey: 'Campaign_Navigator' }
        ]
      },
      { type: 'link', path: '/poe1/build/base-items', textKey: 'poe1_builds' },

      {
        type: 'dropdown',
        id: 'starterBuilds',
        textKey: 'poe1_starterBuilds',
        activeCheck: ['starter-builds'],
        items: [
          {
            path: '/poe1/guides/keepersofflame?type=poe1_starter_build',
            textKey: 'poe1_keepersofflame'
          }
        ]
      },
      { type: 'link', path: '/poe1/links', textKey: 'poe1_fansiteLinks' }
    ]
  },

  poe2: {
    bannerKey: 'banner_poe2',
    navLinks: [
      { type: 'link', path: '/poe2', textKey: 'poe2_home', end: true },
      {
        type: 'dropdown',
        id: 'poe2_guides',
        textKey: 'poe2_guides',
        activeCheck: ['content-guides', 'beginner-guides'],
        items: [
          { path: '/poe2/beginner-guides', textKey: 'poe2_beginnerGuides' },
          { path: '/poe2/content-guides', textKey: 'poe2_contentGuides' },
        ]
      },
      {
        type: 'dropdown',
        id: 'poe2_tools',
        textKey: 'poe2_tools',
        activeCheck: ['act-guide'],
        items: [
          { path: '/poe2/act-guide', textKey: 'poe2_act_guide', iconKey: 'Portal_Icon' }
        ]
      }
    ]
  }
};
