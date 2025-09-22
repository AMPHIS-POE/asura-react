import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './NewCalculator.css';
import Modal from '../../../../components/Modal/Modal';
import { getDistribution, computeColoringOptions, bestColoringCost, bestColoringCostForK, jewellerSequentialIncremental, calculateBridgeViaK } from './calculatorLogic';
import { benchJewellerCosts } from './constants';

const MAX_SOCKETS = 6;
const COLORS = [null, 'R', 'G', 'B'];

const SocketDot = ({ value, onClick, icons }) => {
  const keyMap = { R: 'Red_Socket', G: 'Green_Socket', B: 'Blue_Socket', default: 'Null_Socket' };
  const socketKey = keyMap[value] || keyMap.default;
  const imageUrl = icons[socketKey] || '';
  const style = { backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' };
  return <button className={`vc-socket vc-${value ? value.toLowerCase() : 'n'}`} style={style} onClick={onClick} />;
};

const NumberField = ({ label, value, onChange, min = 0, max = 9999, className }) => (
  <div className={`vc-field ${className || ''}`}>
    <label>{label}</label>
    <input type="number" value={value} min={min} max={max} onChange={e => onChange(Number(e.target.value) || 0)} />
  </div>
);

const Panel = ({ title, sockets, count, setCount, onSocketClick, icons, className }) => (
  <div className={`vc-panel ${className || ''}`}>
    <div className="vc-panel-head">
      <h3>{title}</h3>
      <div className="vc-socket-count">
        <span>Sockets</span>
        <input
          type="number"
          min={0}
          max={MAX_SOCKETS}
          value={count}
          onChange={e => setCount(Math.max(0, Math.min(MAX_SOCKETS, Number(e.target.value) || 0)))}
        />
      </div>
    </div>
    <div className="vc-socket-row">
      {Array.from({ length: count }).map((_, i) => (
        <SocketDot key={i} value={sockets[i]} onClick={() => onSocketClick(i)} icons={icons} />
      ))}
    </div>
  </div>
);

const NewCalculator = ({ lang = 'ko' }) => {
  const [reqStr, setReqStr] = useState(0);
  const [reqDex, setReqDex] = useState(0);
  const [reqInt, setReqInt] = useState(0);

  const [curCount, setCurCount] = useState(4);
  const [tgtCount, setTgtCount] = useState(6);

  const [currentSockets, setCurrentSockets] = useState(['R', null, null, null, null, null]);
  const [targetSockets, setTargetSockets] = useState(Array(MAX_SOCKETS).fill(null));

  const [chromChaos, setChromChaos] = useState(0);
  const [jewChaos, setJewChaos] = useState(0);
  const [loadingRates, setLoadingRates] = useState(false);
  const [rateError, setRateError] = useState('');

  const [uiIcons, setUiIcons] = useState({});
  const [results, setResults] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [isTargetModified, setIsTargetModified] = useState(false);
  const skipMirrorRef = useRef(false);
  const prevCurCountRef = useRef(curCount);
  const prevCurSigRef = useRef(JSON.stringify(currentSockets.slice(0, curCount)));

  useEffect(() => {
    setLoadingRates(true);
    setRateError('');
    const fetchRates = fetch('/wp-json/asura/v1/currencyrates')
      .then(r => r.json())
      .then(data => {
        if (data['Chromatic Orb']) setChromChaos(Number(data['Chromatic Orb']));
        if (data["Jeweller's Orb"]) setJewChaos(Number(data["Jeweller's Orb"]));
      });
    const fetchIcons = fetch('/wp-json/asura/v1/ui-icons')
      .then(r => r.json())
      .then(data => setUiIcons(data));
    Promise.all([fetchRates, fetchIcons])
      .catch(() =>
        setRateError(lang === 'ko' ? '데이터를 불러오지 못했습니다. 수동 입력을 사용하세요.' : 'Failed to fetch data. Please override manually.')
      )
      .finally(() => setLoadingRates(false));
  }, [lang]);

  const tgtCounts = useMemo(() => {
    const slice = targetSockets.slice(0, tgtCount);
    return {
      R: slice.filter(c => c === 'R').length,
      G: slice.filter(c => c === 'G').length,
      B: slice.filter(c => c === 'B').length,
      N: slice.filter(c => c == null).length
    };
  }, [targetSockets, tgtCount]);

  const curCounts = useMemo(() => {
    const slice = currentSockets.slice(0, curCount);
    return {
      R: slice.filter(c => c === 'R').length,
      G: slice.filter(c => c === 'G').length,
      B: slice.filter(c => c === 'B').length
    };
  }, [currentSockets, curCount]);

  const [pR, pG, pB] = useMemo(() => getDistribution(reqStr, reqDex, reqInt), [reqStr, reqDex, reqInt]);

  const benchCostForSockets = (n) => ((benchJewellerCosts[n] || 0) * jewChaos);

  useEffect(() => {
    const curSlice = currentSockets.slice(0, curCount);
    const curSig = JSON.stringify(curSlice);
    const hasChanged = prevCurCountRef.current !== curCount || prevCurSigRef.current !== curSig;
    prevCurCountRef.current = curCount;
    prevCurSigRef.current = curSig;
    if (!hasChanged) return;
    if (isTargetModified) return;
    if (skipMirrorRef.current) {
      skipMirrorRef.current = false;
      return;
    }
    setTgtCount(curCount);
    const padded = [...curSlice, ...Array(MAX_SOCKETS - curCount).fill(null)];
    setTargetSockets(padded);
  }, [currentSockets, curCount, isTargetModified]);

  const handleCalculate = useCallback(() => {
    if (reqStr + reqDex + reqInt === 0) {
      setAlertMessage(lang === 'ko' ? '능력치가 입력되지 않았습니다.' : 'Attributes are missing. Please enter STR/DEX/INT.');
      setIsAlertOpen(true);
      return;
    }
    if (!(chromChaos > 0) || !(jewChaos > 0)) {
      setAlertMessage(lang === 'ko' ? '환율을 먼저 입력하거나 불러와 주세요.' : 'Please enter or fetch currency rates first.');
      setIsAlertOpen(true);
      return;
    }
    if (tgtCounts.R + tgtCounts.G + tgtCounts.B !== tgtCount) {
      setAlertMessage(lang === 'ko' ? '목표 소켓 수와 색상 합이 일치해야 합니다.' : 'Target socket count must equal sum of target colors.');
      setIsAlertOpen(true);
      return;
    }
    const rows = [];
    if (curCount === tgtCount) {
      const alreadyMatches = curCounts.R === tgtCounts.R && curCounts.G === tgtCounts.G && curCounts.B === tgtCounts.B;
      if (alreadyMatches) {
        rows.push({
          key: 'NoOp',
          label: lang === 'ko' ? '이미 목표 달성' : 'Already Matching',
          attempts: 0,
          detail: lang === 'ko' ? '추가 비용 없음' : 'No additional cost',
          chaos: 0,
          chromEq: 0,
          tooltip: lang === 'ko' ? '변경 불필요' : 'No action needed',
          isBest: true
        });
        setResults(rows);
        return;
      }
      const colorOptions = computeColoringOptions(lang, tgtCount, tgtCounts, pR, pG, pB, chromChaos);
      rows.push(...colorOptions);
      const allowedKs = Object.keys(benchJewellerCosts).map(Number).filter(k => k >= 2 && k < tgtCount);
      let bestBridge = null;
      for (const k of allowedKs) {
        const bridge = calculateBridgeViaK(lang, tgtCount, tgtCount, k, tgtCounts, pR, pG, pB, jewChaos, chromChaos);
        if (isFinite(bridge.chaos) && (!bestBridge || bridge.chaos < bestBridge.chaos)) bestBridge = bridge;
      }
      if (bestBridge && isFinite(bestBridge.chaos)) rows.push(bestBridge);
    } else if (curCount < tgtCount) {
      const needInNew = {
        R: Math.max(0, tgtCounts.R - curCounts.R),
        G: Math.max(0, tgtCounts.G - curCounts.G),
        B: Math.max(0, tgtCounts.B - curCounts.B)
      };
      const pathA = jewellerSequentialIncremental(lang, curCount, tgtCount, needInNew, pR, pG, pB, jewChaos, chromChaos);
      const socketingCost = benchCostForSockets(tgtCount);
      const bestColor = bestColoringCost(lang, tgtCount, tgtCounts, pR, pG, pB, chromChaos);
      const pathB = {
        key: 'BenchThenBestColor',
        label: lang === 'ko' ? `${tgtCount}홈 + ${bestColor.label}` : `${tgtCount}S + ${bestColor.label}`,
        attempts: bestColor.attempts,
        detailLines: lang === 'ko'
          ? [`[1단계] 제작대에서 ${tgtCount}홈으로 설정`, `[2단계] '${bestColor.label}'`]
          : [`[Step 1] Craft to ${tgtCount} sockets on the bench`, `[Step 2]  '${bestColor.label}' craft`],
        chaos: socketingCost + bestColor.chaos,
        chromEq: chromChaos > 0 ? (socketingCost + bestColor.chaos) / chromChaos : Infinity,
        tooltip: lang === 'ko' ? '홈 수 설정 후 색상 작업' : 'Set sockets, then recolor'
      };
      const allowedKs = Object.keys(benchJewellerCosts).map(Number).filter(k => k >= 2 && k < tgtCount);
      let bestBridge = null;
      for (const k of allowedKs) {
        const bridge = calculateBridgeViaK(lang, curCount, tgtCount, k, tgtCounts, pR, pG, pB, jewChaos, chromChaos);
        if (isFinite(bridge.chaos) && (!bestBridge || bridge.chaos < bestBridge.chaos)) bestBridge = bridge;
      }
      const candidates = [];
      if (isFinite(pathA.chaos)) candidates.push(pathA);
      candidates.push(pathB);
      if (bestBridge && isFinite(bestBridge.chaos)) candidates.push(bestBridge);
      const best = candidates.reduce((m, r) => (r.chaos < m.chaos ? r : m), candidates[0] || { chaos: Infinity });
      const finalized = candidates.map(r => ({ ...r, isBest: r.chaos === best.chaos })).sort((a, b) => a.chaos - b.chaos);
      setResults(finalized);
      return;
    } else {
      const socketingCost = benchCostForSockets(tgtCount);
      const bestColor = bestColoringCost(lang, tgtCount, tgtCounts, pR, pG, pB, chromChaos);
      rows.push({
        key: 'ReduceThenColor',
        label: lang === 'ko' ? `${tgtCount}홈(감소) + ${bestColor.label}` : `${tgtCount}S (reduce) + ${bestColor.label}`,
        attempts: bestColor.attempts,
        detailLines: lang === 'ko'
          ? [`[1단계] 제작대에서 ${tgtCount}홈으로 감소`, `[2단계] '${bestColor.label}' 제작 실행`]
          : [`[Step 1] Reduce to ${tgtCount} sockets on the bench`, `[Step 2]  '${bestColor.label}' craft`],
        chaos: socketingCost + bestColor.chaos,
        chromEq: chromChaos > 0 ? (socketingCost + bestColor.chaos) / chromChaos : Infinity,
        tooltip: lang === 'ко' ? '홈 수 감소 후 색상 작업' : 'Reduce sockets, then recolor'
      });
    }
    if (rows.length === 0) {
      setResults([]);
      return;
    }
    const best = rows.reduce((m, r) => (r.chaos < m.chaos ? r : m), { chaos: Infinity });
    const finalized = rows.map(r => ({ ...r, isBest: r.chaos === best.chaos && isFinite(r.chaos) })).sort((a, b) => a.chaos - b.chaos);
    setResults(finalized);
  }, [
    lang,
    curCount,
    tgtCount,
    curCounts,
    tgtCounts,
    chromChaos,
    jewChaos,
    pR,
    pG,
    pB,
    reqStr,
    reqDex,
    reqInt
  ]);

  const handleReset = () => {
    setReqStr(0);
    setReqDex(0);
    setReqInt(0);
    setCurCount(4);
    setTgtCount(6);
    setCurrentSockets(['R', null, null, null, null, null]);
    setTargetSockets(Array(MAX_SOCKETS).fill(null));
    setResults([]);
    setIsTargetModified(false);
    skipMirrorRef.current = true;
  };

  const handleCurrentSocketClick = (index) => {
    const idx = COLORS.indexOf(currentSockets[index]);
    const nextColor = COLORS[(idx + 1) % COLORS.length];
    const newCurrent = [...currentSockets];
    newCurrent[index] = nextColor;
    setCurrentSockets(newCurrent);
  };

  const handleTargetSocketClick = (index) => {
    setIsTargetModified(true);
    const idx = COLORS.indexOf(targetSockets[index]);
    const nextColor = COLORS[(idx + 1) % COLORS.length];
    const newTarget = [...targetSockets];
    newTarget[index] = nextColor;
    setTargetSockets(newTarget);
  };

  return (
    <>
      <div className="vc-top">
        <div className="vc-req vc-main-panel vc-input-panel step-1">
          <h4 className="vc-box-header">{lang === 'ko' ? '능력치 요구치' : 'Requirement'}</h4>
          <div className="vc-req-grid">
            <NumberField className="req-str" label={lang === 'ko' ? '힘' : 'STR'} value={reqStr} onChange={setReqStr} />
            <NumberField className="req-dex" label={lang === 'ko' ? '민첩' : 'DEX'} value={reqDex} onChange={setReqDex} />
            <NumberField className="req-int" label={lang === 'ko' ? '지능' : 'INT'} value={reqInt} onChange={setReqInt} />
          </div>
        </div>
        <div className="vc-rates vc-main-panel">
          <div className="vc-rate-head">
            <span className="vc-box-header-title">{lang === 'ko' ? '화폐 환율' : 'Currency Rate'}</span>
            {loadingRates && <span className="vc-badge">{lang === 'ko' ? '불러오는 중' : 'Loading'}</span>}
            {!!rateError && <span className="vc-warn">{rateError}</span>}
            {!loadingRates && !rateError && (chromChaos > 0 || jewChaos > 0) && <span className="vc-done">{lang === 'ko' ? '로드 완료' : 'Loaded'}</span>}
          </div>
          <div className="vc-rate-grid">
            <div className="vc-rate-card">
              <div className="vc-rate-row">
                <img src={uiIcons.Chromatic_Orb_inventory_icon} alt="Chromatic Orb" className="vc-currency-icon" />
                <span className="vc-times">×</span>
                <input
                  type="number"
                  step="0.1"
                  value={chromChaos > 0 ? (1 / chromChaos).toFixed(2) : ''}
                  onChange={(e) => {
                    const perChaosValue = Number(e.target.value);
                    setChromChaos(perChaosValue > 0 ? 1 / perChaosValue : 0);
                  }}
                />
                <span className="vc-slash">/</span>
                <img src={uiIcons.Chaos_Orb_inventory_icon} alt="Chaos Orb" className="vc-currency-icon" />
              </div>
            </div>
            <div className="vc-rate-card">
              <div className="vc-rate-row">
                <img src={uiIcons.Jewellers_Orb_inventory_icon} alt="Jeweller's Orb" className="vc-currency-icon" />
                <span className="vc-times">×</span>
                <input
                  type="number"
                  step="0.1"
                  value={jewChaos > 0 ? (1 / jewChaos).toFixed(2) : ''}
                  onChange={(e) => {
                    const perChaosValue = Number(e.target.value);
                    setJewChaos(perChaosValue > 0 ? 1 / perChaosValue : 0);
                  }}
                />
                <span className="vc-slash">/</span>
                <img src={uiIcons.Chaos_Orb_inventory_icon} alt="Chaos Orb" className="vc-currency-icon" />
              </div>
            </div>
          </div>
          <p className="vc-rate-footer">{lang === 'ko' ? '(직접 가격을 수정할 수 있습니다.)' : '(You can edit the prices directly.)'}</p>
        </div>
      </div>
      <div className="vc-bridge">
        <Panel
          title={lang === 'ko' ? '현재 상태' : 'Current'}
          sockets={currentSockets}
          count={curCount}
          setCount={setCurCount}
          onSocketClick={handleCurrentSocketClick}
          icons={uiIcons}
          className="vc-main-panel vc-input-panel step-2"
        />
        <Panel
          title={lang === 'ko' ? '목표 상태' : 'Target'}
          sockets={targetSockets}
          count={tgtCount}
          setCount={(n) => { setIsTargetModified(true); setTgtCount(n); }}
          onSocketClick={handleTargetSocketClick}
          icons={uiIcons}
          className="vc-main-panel vc-input-panel step-3"
        />
      </div>
      <div className="vorici-calculator">
        <div className="vorici-button-container">
          <button className="vorici-btn vorici-btn--primary" onClick={handleCalculate}>
            {lang === 'ko' ? '계산' : 'Calculate'}
          </button>
          <button className="vorici-btn" onClick={handleReset}>
            {lang === 'ko' ? '초기화' : 'Reset'}
          </button>
        </div>
      </div>
      {/* 결과 테이블 (Chromatic Eq 컬럼 제거 버전) */}
      <table className="vorici-table">
        <thead>
          <tr>
            <th>{lang === 'ko' ? '전략' : 'Strategy'}</th>
            <th>{lang === 'ko' ? '세부' : 'Detail'}</th>
            <th>{lang === 'ko' ? '평균 시도' : 'Avg Attempts'}</th>
            <th>{lang === 'ko' ? '총 비용(카오스)' : 'Total (Chaos)'}</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.key + (r.label || '')} className={r.isBest ? 'highlight' : ''} title={r.tooltip || ''}>
              <td>{r.label}</td>
              <td>
                {r.detailLines && r.detailLines.length > 0 ? (
                  r.detailLines.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < r.detailLines.length - 1 && <br />}
                    </React.Fragment>
                  ))
                ) : (
                  r.detail
                )}
              </td>
              <td>{!isFinite(r.attempts) ? '∞' : r.attempts.toFixed(2)}</td>
              <td>{isFinite(r.chaos) ? Math.round(r.chaos).toLocaleString() : '∞'}</td>
            </tr>
          ))}
          {results.length === 0 && (
            <tr>
              <td colSpan={4} className="vc-empty">
                {lang === 'ko' ? '계산 결과가 없습니다. 상단에서 값을 설정한 뒤 계산을 눌러주세요.' : 'No results. Configure inputs and press Calculate.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)}>
        <p className="modal__message">{alertMessage}</p>
        <div className="modal__footer">
          <button onClick={() => setIsAlertOpen(false)} className="modal__btn modal__btn--primary">
            {lang === 'ko' ? '확인' : 'OK'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default NewCalculator;
