import React, { useState } from 'react';
import './OldCalculator.css';
import Modal from '../../../../components/Modal/Modal';

function fact(n) {
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function getDistribution(R, G, B) {
  const stats = [R, G, B].filter(x => x > 0);
  const total = R + G + B;
  if (total === 0) return [1 / 3, 1 / 3, 1 / 3];
  if (stats.length === 1) {
    const cnt = R || G || B;
    const on = 0.9 * (cnt + 10) / (cnt + 20);
    const off = 0.05 + 4.5 / (cnt + 20);
    return [R ? on : off, G ? on : off, B ? on : off];
  } else if (stats.length === 2) {
    return [
      R ? 0.9 * R / total : 0.1,
      G ? 0.9 * G / total : 0.1,
      B ? 0.9 * B / total : 0.1
    ];
  } else {
    return [R / total, G / total, B / total];
  }
}

function multProb(r, g, b, pR, pG, pB) {
  if (r < 0 || g < 0 || b < 0) return 0;
  const total = r + g + b;
  const comb = fact(total) / (fact(r) * fact(g) * fact(b));
  return comb * Math.pow(pR, r) * Math.pow(pG, g) * Math.pow(pB, b);
}

function getP(sockets, R, G, B) {
  if ([R, G, B].some(x => x < 0 || x % 1 !== 0) || R + G + B !== sockets) {
    return 0;
  }
  return fact(sockets) / fact(R) / fact(G) / fact(B);
}

const nameMap = {
  ko: {
    'Chromatic Orb': '색채의 오브',
    'Vorici 1R': '1빨',
    'Vorici 1G': '1초',
    'Vorici 1B': '1파',
    'Vorici 1R1G': '1빨1초',
    'Vorici 1G1B': '1초1파',
    'Vorici 1R1B': '1빨1파',
    'Vorici 2G': '2초',
    'Vorici 2B': '2파',
    'Vorici 2B1R': '2파1빨',
    'Vorici 1G2B': '1초2파',
    'Vorici 2G1R': '2초1빨',
    'Vorici 3R': '3빨',
    'Vorici 3G': '3초',
    'Vorici 3B': '3파'
  },
  en: {
    'Chromatic Orb': 'Chromatic Orb',
    'Vorici 1R': '1 Red',
    'Vorici 1G': '1 Green',
    'Vorici 1B': '1 Blue',
    'Vorici 1R1G': '1 Red 1 Green',
    'Vorici 1G1B': '1 Green 1 Blue',
    'Vorici 1R1B': '1 Red 1 Blue',
    'Vorici 2G': '2 Green',
    'Vorici 2B': '2 Blue',
    'Vorici 2B1R': '2 Blue 1 Red',
    'Vorici 1G2B': '1 Green 2 Blue',
    'Vorici 2G1R': '2 Green 1 Red',
    'Vorici 3R': '3 Red',
    'Vorici 3G': '3 Green',
    'Vorici 3B': '3 Blue'
  }
};

const recipes = [
  ['Chromatic Orb', 1, 0, 0, 0],
  ['Vorici 1R', 4, 1, 0, 0],
  ['Vorici 1G', 4, 0, 1, 0],
  ['Vorici 1B', 4, 0, 0, 1],
  ['Vorici 1R1G', 15, 1, 1, 0],
  ['Vorici 1G1B', 15, 0, 1, 1],
  ['Vorici 1R1B', 15, 1, 0, 1],
  ['Vorici 2G', 25, 0, 2, 0],
  ['Vorici 2B', 25, 0, 0, 2],
  ['Vorici 2B1R', 100, 1, 0, 2],
  ['Vorici 1G2B', 100, 0, 1, 2],
  ['Vorici 2G1R', 100, 1, 2, 0],
  ['Vorici 3R', 120, 3, 0, 0],
  ['Vorici 3G', 120, 0, 3, 0],
  ['Vorici 3B', 120, 0, 0, 3]
];

const OldCalculator = ({ lang }) => {
  const [sockets, setSockets] = useState(6);
  const [req, setReq] = useState({ r: 0, g: 0, b: 0 });
  const [des, setDes] = useState({ r: 0, g: 0, b: 0 });
  const [results, setResults] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
  };

  const handleCalculate = () => {
    const totalDes = des.r + des.g + des.b;
    if (!Number.isFinite(sockets) || sockets < 1 || sockets > 6) {
      showAlert(lang === 'ko' ? '소켓 수가 올바르지 않습니다. 1~6 사이로 입력하세요.' : 'Invalid sockets. Enter 1–6.');
      return;
    }
    if (totalDes !== sockets) {
      showAlert(lang === 'ko' ? '아이템 소켓 수와 원하는 색상의 총합이 일치해야 합니다.' : 'Total sockets must equal the sum of desired colors.');
      return;
    }

    const [pR, pG, pB] = getDistribution(req.r, req.g, req.b);

    const calculated = recipes.map(([name, cost, rFix, gFix, bFix]) => {
      const rLeft = des.r - rFix;
      const gLeft = des.g - gFix;
      const bLeft = des.b - bFix;
      const free = sockets - (rFix + gFix + bFix);
      if (rLeft < 0 || gLeft < 0 || bLeft < 0 || rLeft + gLeft + bLeft !== free) return null;
      const success = name === 'Chromatic Orb'
        ? multProb(des.r, des.g, des.b, pR, pG, pB)
        : multProb(rLeft, gLeft, bLeft, pR, pG, pB);
      if (!isFinite(success) || success <= 0) return null;
      const avgCost = cost / success;
      if (!isFinite(avgCost) || avgCost <= 0) return null;
      return { name, avgCost, success, attempts: 1 / success };
    }).filter(Boolean);

    if (calculated.length > 0) {
      const minCost = Math.min(...calculated.map(r => r.avgCost));
      calculated.forEach(r => r.isBest = r.avgCost === minCost);
    }

    setResults(calculated);
  };

  const handleReset = () => {
    setSockets(6);
    setReq({ r: 0, g: 0, b: 0 });
    setDes({ r: 0, g: 0, b: 0 });
    setResults([]);
  };

  return (
    <div className="old-calc-compact-wrapper">
      <div className="oldc-toolbar">
        <div className="oldc-left-col">
          <div className="oldc-row">
            <div className="oldc-left-label">{lang === 'ko' ? '아이템 소켓' : 'Item Sockets'}</div>
            <div className="oldc-right-block">
              <div className="oldc-input-single">
                <input
                  className="oldc-input"
                  type="number"
                  min="1"
                  max="6"
                  value={sockets}
                  onChange={(e) => setSockets(parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          </div>
          <div className="oldc-row">
            <div className="oldc-left-label">{lang === 'ko' ? '요구 능력치' : 'Requirements'}</div>
            <div className="oldc-right-block">
              <div className="oldc-sublabels">
                <span>{lang === 'ko' ? '힘' : 'STR'}</span>
                <span>{lang === 'ko' ? '민첩' : 'DEX'}</span>
                <span>{lang === 'ko' ? '지능' : 'INT'}</span>
              </div>
              <div className="oldc-input-row">
                <input className="oldc-input c-str" type="number" value={req.r} onChange={(e) => setReq({ ...req, r: parseInt(e.target.value, 10) || 0 })} />
                <input className="oldc-input c-dex" type="number" value={req.g} onChange={(e) => setReq({ ...req, g: parseInt(e.target.value, 10) || 0 })} />
                <input className="oldc-input c-int" type="number" value={req.b} onChange={(e) => setReq({ ...req, b: parseInt(e.target.value, 10) || 0 })} />
              </div>
            </div>
          </div>
          <div className="oldc-row">
            <div className="oldc-left-label">{lang === 'ko' ? '원하는 색상' : 'Desired Colors'}</div>
            <div className="oldc-right-block">
              <div className="oldc-sublabels">
                <span>{lang === 'ko' ? '빨강' : 'Red'}</span>
                <span>{lang === 'ko' ? '초록' : 'Green'}</span>
                <span>{lang === 'ko' ? '파랑' : 'Blue'}</span>
              </div>
              <div className="oldc-input-row">
                <input className="oldc-input c-str" type="number" value={des.r} onChange={(e) => setDes({ ...des, r: parseInt(e.target.value, 10) || 0 })} />
                <input className="oldc-input c-dex" type="number" value={des.g} onChange={(e) => setDes({ ...des, g: parseInt(e.target.value, 10) || 0 })} />
                <input className="oldc-input c-int" type="number" value={des.b} onChange={(e) => setDes({ ...des, b: parseInt(e.target.value, 10) || 0 })} />
              </div>
            </div>
          </div>
        </div>
        <div className="oldc-buttons">
          <button className="oldc-btn oldc-btn--primary" onClick={handleCalculate}>
            {lang === 'ko' ? '계산' : 'Calculate'}
          </button>
          <button className="oldc-btn oldc-btn--secondary" onClick={handleReset}>
            {lang === 'ko' ? '초기화' : 'Reset'}
          </button>
        </div>
      </div>
      <table className="oldc-table">
        <thead>
          <tr>
            <th>{lang === 'ko' ? '제작 유형' : 'Craft Type'}</th>
            <th>{lang === 'ko' ? '평균 비용(색채)' : 'Avg Cost'}</th>
            <th>{lang === 'ko' ? '성공률' : 'Success'}</th>
            <th>{lang === 'ko' ? '평균 시도' : 'Attempts'}</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td className="empty" colSpan={4}>
                {lang === 'ko' ? '계산 결과가 없습니다. 상단에서 값을 설정한 뒤 계산을 눌러주세요.' : 'No results. Set values above and press Calculate.'}
              </td>
            </tr>
          ) : (
            results.map((r, i) => (
              <tr key={i} className={r.isBest ? 'highlight' : ''}>
                <td>{nameMap[lang][r.name] || r.name}</td>
                <td>{isFinite(r.avgCost) ? Math.ceil(r.avgCost).toLocaleString() : '-'}</td>
                <td>{isFinite(r.success) ? (r.success * 100).toFixed(2) + '%' : '-'}</td>
                <td>{isFinite(r.attempts) ? r.attempts.toFixed(2) : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} title={lang === 'ko' ? '알림' : 'Alert'}>
        <p>{alertMessage}</p>
      </Modal>
    </div>
  );
};

export default OldCalculator;
