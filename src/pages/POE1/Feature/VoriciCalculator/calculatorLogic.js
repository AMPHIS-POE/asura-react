// /vorici/calculatorLogic.js
import { voriciRecipes, benchJewellerCosts } from './constants';

export function fact(n) {
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
export function multinomial(r, g, b, pR, pG, pB) {
  if (r < 0 || g < 0 || b < 0) return 0;
  const n = r + g + b;
  const comb = fact(n) / (fact(r) * (fact(g) * fact(b)));
  return comb * Math.pow(pR, r) * Math.pow(pG, g) * Math.pow(pB, b);
}
export function getDistribution(R, G, I) {
  const stats = [R, G, I].filter(x => x > 0);
  const total = R + G + I;
  if (total === 0) return [1 / 3, 1 / 3, 1 / 3];
  if (stats.length === 1) {
    const cnt = R || G || I;
    const on = 0.9 * (cnt + 10) / (cnt + 20);
    const off = 0.05 + 4.5 / (cnt + 20);
    return [R ? on : off, G ? on : off, I ? on : off];
  } else if (stats.length === 2) {
    return [
      R ? 0.9 * R / total : 0.1,
      G ? 0.9 * G / total : 0.1,
      I ? 0.9 * I / total : 0.1
    ];
  } else {
    return [R / total, G / total, I / total];
  }
}

export const benchCostForSockets = (n, jewChaos) =>
  ((benchJewellerCosts[n] || 0) * jewChaos);

function displayRecipeLabel(key, lang) {
  const ko = {
    Chromatic: '색채 스팸',
    V1R: '빨강 1개',
    V1G: '초록 1개',
    V1B: '파랑 1개',
    V1R1G: '빨강 1개·초록 1개',
    V1G1B: '초록 1개·파랑 1개',
    V1R1B: '빨강 1개·파랑 1개',
    V2G: '초록 2개',
    V2B: '파랑 2개',
    V2B1R: '파랑 2개·빨강 1개',
    V1G2B: '초록 1개·파랑 2개',
    V2G1R: '초록 2개·빨강 1개',
    V3R: '빨강 3개',
    V3G: '초록 3개',
    V3B: '파랑 3개'
  };
  const en = {
    Chromatic: 'Chromatic Spam',
    V1R: '1 Red',
    V1G: '1 Green',
    V1B: '1 Blue',
    V1R1G: '1 Red · 1 Green',
    V1G1B: '1 Green · 1 Blue',
    V1R1B: '1 Red · 1 Blue',
    V2G: '2 Green',
    V2B: '2 Blue',
    V2B1R: '2 Blue · 1 Red',
    V1G2B: '1 Green · 2 Blue',
    V2G1R: '2 Green · 1 Red',
    V3R: '3 Red',
    V3G: '3 Green',
    V3B: '3 Blue'
  };
  return (lang === 'ko' ? ko[key] : en[key]) || key;
}

export function computeColoringOptionsFor(lang, totalCount, counts, pR, pG, pB, chromChaos) {
  if ((counts.R + counts.G + counts.B) !== totalCount) return [];
  const rows = [];

  const pExact = multinomial(counts.R, counts.G, counts.B, pR, pG, pB);
  if (pExact > 0 && isFinite(pExact)) {
    const attempts = 1 / pExact;
    rows.push({
      key: 'ChromaticOnly',
      label: displayRecipeLabel('Chromatic', lang),
      attempts,
      detail: lang === 'ko' ? "색채의 오브 단순 반복 사용" : "Spam Chromatic Orbs",
      detailLines: lang === 'ko'
        ? ["색채의 오브를 반복해 색상을 굴립니다."]
        : ["Use Chromatic Orbs repeatedly."],
      chaos: attempts * chromChaos,
      chromEq: attempts,
      tooltip: lang === 'ko' ? '색상만 변경, 소켓 수 유지' : 'Color-only; sockets unchanged'
    });
  }

  voriciRecipes.forEach(r => {
    if (r.key === 'Chromatic') return;
    const fixTotal = r.fix.R + r.fix.G + r.fix.B;
    if (fixTotal > totalCount) return;
    const free = totalCount - fixTotal;
    const rLeft = counts.R - r.fix.R;
    const gLeft = counts.G - r.fix.G;
    const bLeft = counts.B - r.fix.B;
    if (rLeft < 0 || gLeft < 0 || bLeft < 0) return;
    if (rLeft + gLeft + bLeft !== free) return;
    const p = multinomial(rLeft, gLeft, bLeft, pR, pG, pB);
    if (p <= 0 || !isFinite(p)) return;
    const attempts = 1 / p;
    const label = displayRecipeLabel(r.key, lang);
    rows.push({
      key: r.key,
      label,
      attempts,
      detail: lang === 'ko' ? `작업대에서 '${label}' 레시피 사용` : `Use '${label}' on Crafting Bench`,
      detailLines: lang === 'ko'
        ? [`작업대에서 '${label}' 적용`]
        : [`apply '${label}' on the crafting bench.`],
      chaos: attempts * r.chromCost * chromChaos,
      chromEq: attempts * r.chromCost,
      tooltip: lang === 'ko' ? '작업대/색채로 색상 변경, 소켓 수 유지' : 'Bench/Chromatic recolor; sockets unchanged'
    });
  });

  return rows.sort((a, b) => a.chaos - b.chaos);
}
export const computeColoringOptions = (lang, tgtCount, tgtCounts, pR, pG, pB, chromChaos) =>
  computeColoringOptionsFor(lang, tgtCount, tgtCounts, pR, pG, pB, chromChaos);

export function bestColoringCost(lang, tgtCount, tgtCounts, pR, pG, pB, chromChaos) {
  const options = computeColoringOptionsFor(lang, tgtCount, tgtCounts, pR, pG, pB, chromChaos);
  return options[0] || {
    key: 'ColoringImpossible',
    label: lang === 'ko' ? '색상 불가' : 'Coloring Impossible',
    attempts: Infinity, detail: '-', chaos: Infinity, chromEq: Infinity,
    detailLines: [],
    tooltip: lang === 'ko' ? '해당 색상 조합 불가' : 'Target coloring impossible'
  };
}

export function hardestSubsetCounts(k, tgtCounts, pR, pG, pB) {
  if (k <= 0) return { R: 0, G: 0, B: 0 };
  const pool = [
    { c: 'R', p: pR, max: tgtCounts.R },
    { c: 'G', p: pG, max: tgtCounts.G },
    { c: 'B', p: pB, max: tgtCounts.B }
  ].sort((a, b) => a.p - b.p);
  let rem = k;
  const res = { R: 0, G: 0, B: 0 };
  for (const item of pool) {
    if (rem <= 0) break;
    const take = Math.min(item.max, rem);
    if (take > 0) res[item.c] += take;
    rem -= take;
  }
  return res;
}

export function bestColoringCostForK(lang, k, tgtCounts, pR, pG, pB, chromChaos) {
  if (k <= 0) {
    return {
      key: 'ColoringKZero',
      label: lang === 'ko' ? '색상 작업 없음' : 'No coloring',
      attempts: 0, detail: '-', chaos: 0, chromEq: 0,
      locked: { R: 0, G: 0, B: 0 },
      detailLines: [],
      tooltip: lang === 'ko' ? '색상 작업 없음' : 'No recolor'
    };
  }
  const lockedTarget = hardestSubsetCounts(k, tgtCounts, pR, pG, pB);
  const options = computeColoringOptionsFor(lang, k, lockedTarget, pR, pG, pB, chromChaos);
  const best = options[0] || {
    key: 'ColoringImpossibleK',
    label: lang === 'ko' ? '색상 불가(k)' : 'Coloring Impossible (k)',
    attempts: Infinity, detail: '-', chaos: Infinity, chromEq: Infinity,
    detailLines: [],
    tooltip: lang === 'ko' ? '해당 k에서 색상 불가' : 'Coloring impossible at k'
  };
  return { ...best, locked: lockedTarget };
}

export function jewellerSequentialIncremental(lang, startCount, endCount, remainingCounts, pR, pG, pB, jewChaos, chromChaos) {
  if (startCount >= endCount) {
    return {
      key: 'JewellerSequential',
      label: lang === 'ko' ? '오프컬러 제작' : 'Off-color',
      attempts: 0, detail: lang === 'ko' ? '단계 없음' : 'No steps',
      chaos: 0, chromEq: 0,
      tooltip: lang === 'ko' ? '소켓 수 변화 없음' : 'No socket change',
      steps: [],
      detailLines: []
    };
  }

  const toAdd = endCount - startCount;
  const needTotal =
    Math.max(0, remainingCounts.R || 0) +
    Math.max(0, remainingCounts.G || 0) +
    Math.max(0, remainingCounts.B || 0);

  if (needTotal > toAdd) {
    return {
      key: 'JewellerSequential',
      label: lang === 'ko' ? '오프컬러 제작' : 'Off-color',
      attempts: Infinity,
      detail: lang === 'ko' ? '필요 색이 새 소켓 수를 초과' : 'Needed colors exceed new sockets',
      chaos: Infinity, chromEq: Infinity,
      tooltip: lang === 'ko' ? '불가능 경로' : 'Impossible path',
      steps: [],
      detailLines: []
    };
  }

  let rRem = Math.max(0, remainingCounts.R || 0);
  let gRem = Math.max(0, remainingCounts.G || 0);
  let bRem = Math.max(0, remainingCounts.B || 0);

  let totalAttempts = 0;
  let i = startCount;
  const steps = [];

  for (let s = 0; s < toAdd; s++) {
    const needRemaining = rRem + gRem + bRem;

    let pNeed = 0;
    let attemptsForStep = 1;

    if (needRemaining > 0) {
      pNeed = (rRem > 0 ? pR : 0) + (gRem > 0 ? pG : 0) + (bRem > 0 ? pB : 0);
      if (!(pNeed > 0) || !isFinite(pNeed)) {
        return {
          key: 'JewellerSequential',
          label: lang === 'ko' ? '오프컬러 제작' : 'Off-color',
          attempts: Infinity,
          detail: lang === 'ko' ? `${startCount}→${endCount} 중 색 확률 0 단계 존재` : `Zero-probability step in ${startCount}→${endCount}`,
          chaos: Infinity, chromEq: Infinity,
          tooltip: lang === 'ko' ? '불가능 경로' : 'Impossible path',
          steps: [],
          detailLines: []
        };
      }
      attemptsForStep = 1 / pNeed;
    }

    const unitCostChaos = (needRemaining > 0)
      ? (benchCostForSockets(i, jewChaos) + benchCostForSockets(i + 1, jewChaos))
      : benchCostForSockets(i + 1, jewChaos);

    const chaosForStep = attemptsForStep * unitCostChaos;

    steps.push({
      from: i, to: i + 1,
      needRemaining,
      pNeed: needRemaining > 0 ? pNeed : null,
      attempts: attemptsForStep,
      chaos: chaosForStep,
      mode: needRemaining > 0 ? 'roll-missing' : 'add-only'
    });

    totalAttempts += attemptsForStep;

    if (needRemaining > 0) {
      const candidates = [];
      if (rRem > 0) candidates.push({ c: 'R', p: pR });
      if (gRem > 0) candidates.push({ c: 'G', p: pG });
      if (bRem > 0) candidates.push({ c: 'B', p: pB });
      candidates.sort((a, b) => b.p - a.p);
      const chosen = candidates[0]?.c;
      if (chosen === 'R') rRem -= 1;
      else if (chosen === 'G') gRem -= 1;
      else if (chosen === 'B') bRem -= 1;
    }

    i += 1;
  }

  const cumulativeChaosCost = steps.reduce((acc, x) => acc + x.chaos, 0);

  const detail = lang === 'ko'
    ? `${startCount}→${endCount} 단계별 기대비용 합산`
    : `Sum of step-by-step costs from ${startCount}→${endCount} Sockets`;

  const detailLines = lang === 'ko'
    ? [
      "필요한 색이 나올때 까지 제작대에서 홈 갯수를 늘리고 줄이기를 반복",
      "무슨 말인지 모르겠다면, 우측 상단의 ?를 눌러보세요",
      "(팁) 제작대에서 '요구 능력치 감소'를 붙이면 확률 상승"

    ]
    : [
      "If you're unsure what Off-color means, press the '?' button in the top-right corner.",
    ];

  return {
    key: 'JewellerSequential',
    label: lang === 'ko' ? '오프컬러 제작' : 'Off-color',
    attempts: totalAttempts,
    detail,
    chaos: cumulativeChaosCost,
    chromEq: chromChaos > 0 ? cumulativeChaosCost / chromChaos : Infinity,
    tooltip: lang === 'ko' ? '소켓 수를 늘리면서 오프컬러를 채우는 방식' : 'Grow sockets while filling off-colors',
    steps,
    detailLines
  };
}

export function calculateBridgeViaK(lang, startCount, endCount, k, tgtCounts, pR, pG, pB, jewChaos, chromChaos) {
  const allowed = Object.keys(benchJewellerCosts).map(Number).filter(x => x >= 2 && x < endCount);
  const kLabel = lang === 'ko' ? `${k}홈 전략` : `${k}-Socket Method`;
  if (!allowed.includes(k)) {
    return {
      key: 'BridgeViaK',
      label: kLabel,
      attempts: Infinity, detail: '-', chaos: Infinity, chromEq: Infinity,
      detailLines: [],
      tooltip: lang === 'ko' ? '불가능한 k' : 'Invalid k'
    };
  }

  const costStartToK = (startCount === k) ? 0 : benchCostForSockets(k, jewChaos);

  const colorAtK = bestColoringCostForK(lang, k, tgtCounts, pR, pG, pB, chromChaos);
  if (!isFinite(colorAtK.chaos)) {
    return {
      key: 'BridgeViaK',
      label: kLabel,
      attempts: Infinity, detail: '-', chaos: Infinity, chromEq: Infinity,
      detailLines: [],
      tooltip: lang === 'ko' ? 'k에서 색상 작업 불가' : 'Coloring at k is impossible'
    };
  }

  const costColorAtK = colorAtK.chaos;
  const lockedColors = colorAtK.locked || { R: 0, G: 0, B: 0 };

  const remainingNeededColors = {
    R: Math.max(0, tgtCounts.R - lockedColors.R),
    G: Math.max(0, tgtCounts.G - lockedColors.G),
    B: Math.max(0, tgtCounts.B - lockedColors.B),
  };

  const finalStepResult = jewellerSequentialIncremental(
    lang, k, endCount, remainingNeededColors, pR, pG, pB, jewChaos, chromChaos
  );
  if (!isFinite(finalStepResult.chaos)) {
    return {
      key: 'BridgeViaK',
      label: kLabel,
      attempts: Infinity, detail: '-', chaos: Infinity, chromEq: Infinity,
      detailLines: [],
      tooltip: lang === 'ko' ? '확장 중 색상 완성 불가' : 'Cannot finish colors while growing'
    };
  }

  const costGrowAndFinishColoring = finalStepResult.chaos;
  const totalChaos = costStartToK + costColorAtK + costGrowAndFinishColoring;
  const totalAttempts = (colorAtK.attempts || 0) + (finalStepResult.attempts || 0);
  const colorAtKLabel = colorAtK.label || (lang === 'ko' ? '색상 작업' : 'Coloring');

  const detail = lang === 'ko'
    ? `1) ${startCount}→${k} 소켓 설정 → 2) '${colorAtKLabel}' 실행 → 3) ${k}→${endCount} 소켓을 하나씩 늘리고 줄이며 부족한 색 채우기`
    : `1) Set ${startCount}→${k} sockets → 2) use '${colorAtKLabel}' → 3) ${k}→${endCount} add sockets one by one to fill missing colors`;

  const detailLines = lang === 'ko'
    ? [
      `[1단계] ${startCount}→${k} 소켓으로 변경`,
      `[2단계] '${colorAtKLabel}'`,
      `[3단계] ${k}→${endCount} 오프컬러 작업`
    ]
    : [
      `[Step 1] Change to ${k} sockets on the bench`,
      `[Step 2] '${colorAtKLabel}'`,
      `[Step 3] Do off-color process on the bench`
    ];

  return {
    key: 'BridgeViaK',
    label: kLabel,
    attempts: totalAttempts,
    detail,
    chaos: totalChaos,
    chromEq: chromChaos > 0 ? totalChaos / chromChaos : Infinity,
    tooltip: lang === 'ko' ? 'k에서 어려운 색 잠금 후, 확장하면서 나머지 색을 완성' : 'Lock hard colors at k, then expand and finish remaining colors',
    detailLines,
    breakdown: {
      startToK: { from: startCount, to: k, chaos: costStartToK },
      colorAtK: { recipeKey: colorAtK.key, label: colorAtKLabel, chaos: costColorAtK, locked: lockedColors },
      growAndFinish: finalStepResult
    }
  };
}
