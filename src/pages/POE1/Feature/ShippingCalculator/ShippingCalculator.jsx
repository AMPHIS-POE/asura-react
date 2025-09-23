// src/pages/POE1/Feature/ShippingCalculator/ShippingCalculator.jsx
import React, { useMemo, useState } from 'react';
import seed from './kingsmarch.seed.json';

const L10N = {
  ko: {
    title: '교역 계산기',
    desc: '킹스마치 교역 가치와 보상을 계산합니다.',
    pickReward: '얻고 싶은 보상',
    bestRoute: '추천 경로',
    altRoutes: '대체 경로',
    value: '가치',
    distance: '거리',
    bias: '바이어스',
    bar: '주괴 권장',
    none: '결과가 없습니다',
    canvasHelp: '이미지 업데이트',
  },
  en: {
    title: 'Trade Calculator',
    desc: 'Calculate Kingsmarch trade values and rewards.',
    pickReward: 'Target Reward',
    bestRoute: 'Best Route',
    altRoutes: 'Alternatives',
    value: 'Value',
    distance: 'Distance',
    bias: 'Bias',
    bar: 'Bar Recommended',
    none: 'No results',
    canvasHelp: 'Right tab is for your image-based guide. Replace image and add hotspots.',
  },
};

const biasLabel = (bias, lang) => {
  const ko = { divine: '디바인', exalted: '엑잘티드', annul: '어널', chaos: '카오스', 'stacked-decks': '스택드 덱', 'quality-gems': '품질 젬' };
  const en = { divine: 'Divine', exalted: 'Exalted', annul: 'Annul', chaos: 'Chaos', 'stacked-decks': 'Stacked Decks', 'quality-gems': 'Quality Gems' };
  return (lang === 'ko' ? ko[bias] : en[bias]) || bias;
};
const tName = (obj, lang) => obj?.name?.[lang] || obj?.name?.en || '';
const bySlug = (list, slug) => list.find(x => x.slug === slug);

function rankRoutesForReward(allRoutes, rewardSlug) {
  const list = allRoutes.filter(r => r.reward === rewardSlug);
  return list.sort((a, b) => (b.shipmentValue - a.shipmentValue) || (a.distanceKm - b.distanceKm));
}

function OneLineGuide({ r, data, lang }) {
  const reward = bySlug(data.rewards, r.reward);
  const res = bySlug(data.resources, r.resource);
  const port = bySlug(data.ports, r.port) || { name:{ ko:r.port, en:r.port } };
  const formKo = r.form === 'bar' ? '주괴' : r.form === 'ore' ? '광석' : r.form?.toUpperCase();
  const sentence = lang === 'ko'
    ? `${tName(reward, lang)}를 얻고 싶다면 ${tName(port, lang)} 항구에 ${tName(res, lang)}(${formKo})를 보내세요. 이유: ${biasLabel(r.bias, lang)} 바이어스.`
    : `To get ${tName(reward, lang)}, send ${tName(res, lang)} (${r.form?.toUpperCase()}) to ${tName(port, lang)}. Reason: ${biasLabel(r.bias, lang)} bias.`;
  return <p className="sc-oneline">{sentence}</p>;
}

const Pill = ({ children }) => <span className="sc-pill">{children}</span>;

const RouteCard = ({ r, data, lang, compact=false }) => {
  const res = bySlug(data.resources, r.resource);
  const port = bySlug(data.ports, r.port) || { name:{ ko:r.port, en:r.port } };
  const reward = bySlug(data.rewards, r.reward) || { name:{ ko:r.reward, en:r.reward } };
  return (
    <div className="sc-card">
      <div className="sc-card-head">
        <strong>{tName(res, lang)}</strong>
        <span>→</span>
        <strong>{tName(port, lang)}</strong>
        <Pill>{tName(reward, lang)}</Pill>
        {r.notes?.includes('bar_recommended') && <Pill>{L10N[lang].bar}</Pill>}
      </div>
      {!compact && (
        <div className="sc-badges">
          <Pill>{L10N[lang].value}: {r.shipmentValue}</Pill>
          <Pill>{L10N[lang].distance}: {r.distanceKm}km</Pill>
          <Pill>{L10N[lang].bias}: {biasLabel(r.bias, lang)}</Pill>
        </div>
      )}
    </div>
  );
};

function RewardFinder({ lang }) {
  const data = seed;
  const rewardOptions = data.rewards.map(r => ({ value:r.slug, label:tName(r, lang) }));
  const [sel, setSel] = useState('');

  const [rankMode, setRankMode] = useState('value'); 
  const [maxDist, setMaxDist] = useState('any');     

  const sorters = {
    value: (a,b) => (b.shipmentValue - a.shipmentValue) || (a.distanceKm - b.distanceKm),
    distance: (a,b) => (a.distanceKm - b.distanceKm) || (b.shipmentValue - a.shipmentValue),
  };

  const listRaw = useMemo(() => (sel ? data.routes.filter(r => r.reward === sel) : []), [sel]);

  const list = useMemo(() => {
    let x = [...listRaw];
    if (maxDist !== 'any') {
      const cap = Number(maxDist);
      x = x.filter(r => r.distanceKm <= cap);
    }
    x.sort(sorters[rankMode]);
    return x;
  }, [listRaw, rankMode, maxDist]);

  const best = list[0];

  return (
    <div className="sc-section">
      <h2 className="sc-section-title">{L10N[lang].title}</h2>
      <p className="sc-section-desc">{L10N[lang].desc}</p>

      <label className="sc-field">
        <span>{L10N[lang].pickReward}</span>
        <select
          value={sel}
          onChange={e=>setSel(e.target.value)}
          className="sc-select"
        >
          <option value="" />
          {rewardOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>

      {sel && (
        <div className="sc-controls">
          <div className="sc-control">
            <span className="sc-ctl-label">{lang==='ko' ? '정렬 기준' : 'Sort by'}</span>
            <div className="sc-seg">
              <button
                type="button"
                className={`sc-seg-btn ${rankMode==='value'?'active':''}`}
                onClick={()=>setRankMode('value')}
              >{lang==='ko'?'가치 우선':'Value first'}</button>
              <button
                type="button"
                className={`sc-seg-btn ${rankMode==='distance'?'active':''}`}
                onClick={()=>setRankMode('distance')}
              >{lang==='ko'?'거리 우선':'Distance first'}</button>
            </div>
          </div>

          <div className="sc-control">
            <span className="sc-ctl-label">{lang==='ko' ? '최대 거리' : 'Max distance'}</span>
            <select
              className="sc-ctl-select"
              value={maxDist}
              onChange={e=>setMaxDist(e.target.value)}
            >
              <option value="200">{lang==='ko'?'200km 이하':'≤ 200km'}</option>
              <option value="1000">{lang==='ko'?'1000km 이하':'≤ 1000km'}</option>
              <option value="any">{lang==='ko'?'제한 없음':'Any'}</option>
            </select>
          </div>
        </div>
      )}

      {!best ? (
        <div className="sc-empty">{L10N[lang].none}</div>
      ) : (
        <>
          <div className="sc-block">
            <div className="sc-block-title">{L10N[lang].bestRoute}</div>
            <OneLineGuide r={best} data={data} lang={lang} />
            <RouteCard r={best} data={data} lang={lang} />
          </div>

          {list.length > 1 && (
            <div className="sc-block">
              <div className="sc-block-title">{L10N[lang].altRoutes}</div>
              <div className="sc-grid">
                {list.slice(1, 4).map((x, i) => (
                  <RouteCard key={i} r={x} data={data} lang={lang} compact />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


function PortAtlas({ lang }) {
  return (
    <div className="sc-atlas">
      <div className="sc-atlas-toolbar">
        <span className="sc-note">{L10N[lang].canvasHelp}</span>
      </div>
      <div className="sc-atlas-canvas">
        <img
          src="/assets/kingsmarch/map-sample.png"
          alt="Kingsmarch ports"
          className="sc-atlas-img"
        />
      </div>
    </div>
  );
}

const ShippingCalculator = ({ lang='ko', mode='reward' }) => {
  return mode === 'reward' ? <RewardFinder lang={lang} /> : <PortAtlas lang={lang} />;
};

export default ShippingCalculator;
