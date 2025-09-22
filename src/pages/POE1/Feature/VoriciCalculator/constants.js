// /vorici/constants.js
export const voriciRecipes = [
  { key: 'Chromatic', label_ko: '색채 스팸', label_en: 'Chromatic Spam', chromCost: 1,  fix: { R: 0, G: 0, B: 0 } },

  { key: 'V1R',     label_ko: '작업대 빨강 1개',            label_en: 'Bench 1 Red',                 chromCost: 4,   fix: { R: 1, G: 0, B: 0 } },
  { key: 'V1G',     label_ko: '작업대 초록 1개',            label_en: 'Bench 1 Green',               chromCost: 4,   fix: { R: 0, G: 1, B: 0 } },
  { key: 'V1B',     label_ko: '작업대 파랑 1개',            label_en: 'Bench 1 Blue',                chromCost: 4,   fix: { R: 0, G: 0, B: 1 } },

  { key: 'V1R1G',   label_ko: '작업대 빨강 1·초록 1',       label_en: 'Bench 1 Red · 1 Green',       chromCost: 15,  fix: { R: 1, G: 1, B: 0 } },
  { key: 'V1G1B',   label_ko: '작업대 초록 1·파랑 1',       label_en: 'Bench 1 Green · 1 Blue',      chromCost: 15,  fix: { R: 0, G: 1, B: 1 } },
  { key: 'V1R1B',   label_ko: '작업대 빨강 1·파랑 1',       label_en: 'Bench 1 Red · 1 Blue',        chromCost: 15,  fix: { R: 1, G: 0, B: 1 } },

  { key: 'V2G',     label_ko: '작업대 초록 2개',            label_en: 'Bench 2 Green',               chromCost: 25,  fix: { R: 0, G: 2, B: 0 } },
  { key: 'V2B',     label_ko: '작업대 파랑 2개',            label_en: 'Bench 2 Blue',                chromCost: 25,  fix: { R: 0, G: 0, B: 2 } },

  { key: 'V2B1R',   label_ko: '작업대 파랑 2·빨강 1',       label_en: 'Bench 2 Blue · 1 Red',        chromCost: 100, fix: { R: 1, G: 0, B: 2 } },
  { key: 'V1G2B',   label_ko: '작업대 초록 1·파랑 2',       label_en: 'Bench 1 Green · 2 Blue',      chromCost: 100, fix: { R: 0, G: 1, B: 2 } },
  { key: 'V2G1R',   label_ko: '작업대 초록 2·빨강 1',       label_en: 'Bench 2 Green · 1 Red',       chromCost: 100, fix: { R: 1, G: 2, B: 0 } },

  { key: 'V3R',     label_ko: '작업대 빨강 3개',            label_en: 'Bench 3 Red',                 chromCost: 120, fix: { R: 3, G: 0, B: 0 } },
  { key: 'V3G',     label_ko: '작업대 초록 3개',            label_en: 'Bench 3 Green',               chromCost: 120, fix: { R: 0, G: 3, B: 0 } },
  { key: 'V3B',     label_ko: '작업대 파랑 3개',            label_en: 'Bench 3 Blue',                chromCost: 120, fix: { R: 0, G: 0, B: 3 } }
];

export const benchJewellerCosts = { 1: 0, 2: 1, 3: 3, 4: 10, 5: 70, 6: 350 };
