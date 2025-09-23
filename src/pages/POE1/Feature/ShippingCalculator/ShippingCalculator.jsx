import React, { useMemo, useState } from 'react';

const translations = {
  ko: {
    pageTitle: '교역 계산기',
    pageDescription: '킹스마치 교역 가치와 보상을 계산합니다.',
    tabRewardFirst: '보상으로 찾기',
    tabResourceFirst: '자원→항구',
    pickReward: '얻고 싶은 보상',
    pickResource: '자원',
    pickForm: '형태',
    pickPort: '항구',
    bestRoute: '추천 경로',
    altRoutes: '대체 경로',
    shipValue: '가치',
    distance: '거리',
    bias: '바이어스',
    barRecommended: '주괴 권장',
    reason: '이유',
    none: '결과가 없습니다',
  },
  en: {
    pageTitle: 'Trade Calculator',
    pageDescription: 'Calculate Kingsmarch trade values and rewards.',
    tabRewardFirst: 'Find by Reward',
    tabResourceFirst: 'Resource → Port',
    pickReward: 'Target Reward',
    pickResource: 'Resource',
    pickForm: 'Form',
    pickPort: 'Port',
    bestRoute: 'Best Route',
    altRoutes: 'Alternatives',
    shipValue: 'Value',
    distance: 'Distance',
    bias: 'Bias',
    barRecommended: 'Bar Recommended',
    reason: 'Reason',
    none: 'No results',
  },
};

const ports = [
  { slug: 'kalgurr', name: { ko: '칼구르', en: 'Kalgurr' }, distanceKm: 2317, rewardTags: ['unique','ward','currency-divine'] },
  { slug: 'te-onui', name: { ko: '테 오누이', en: 'Te Onui' }, distanceKm: 939, rewardTags: ['dex-armour','jewels','unique'] },
  { slug: 'ngakanu', name: { ko: '응가카누', en: 'Ngakanu' }, distanceKm: 186, rewardTags: ['str-armour','str-weapons','quality-gems'] },
];

const resources = [
  {
    slug: 'blue-zanthinium',
    name: { ko: '푸른 잔티니움', en: 'Blue Zanthinium' },
    forms: [{ type: 'ore', value: 8 }, { type: 'bar', value: 24 }],
  },
  {
    slug: 'verisium',
    name: { ko: '베리시움', en: 'Verisium' },
    forms: [{ type: 'ore', value: 16 }, { type: 'bar', value: 64 }],
  },
  {
    slug: 'bismuth',
    name: { ko: '비스무트', en: 'Bismuth' },
    forms: [{ type: 'ore', value: 9 }, { type: 'bar', value: 37 }],
  },
  {
    slug: 'wheat',
    name: { ko: '밀', en: 'Wheat' },
    forms: [{ type: 'crop', value: 12 }],
  },
];

const rewards = [
  { slug: 'divine-orb', name: { ko: '신성한 오브', en: 'Divine Orb' }, category: 'currency' },
  { slug: 'exalted-orb', name: { ko: '엑잘티드 오브', en: 'Exalted Orb' }, category: 'currency' },
  { slug: 'orb-of-annulment', name: { ko: '소멸의 오브', en: 'Orb of Annulment' }, category: 'currency' },
  { slug: 'chaos-orb', name: { ko: '카오스 오브', en: 'Chaos Orb' }, category: 'currency' },
  { slug: 'stacked-decks', name: { ko: '카드 묶음', en: 'Stacked Decks' }, category: 'cards' },
];

const routes = [
  { reward: 'divine-orb', resource: 'blue-zanthinium', form: 'bar', port: 'kalgurr', distanceKm: 2317, shipmentValue: 24, bias: 'divine', notes: ['bar_recommended'] },
  { reward: 'exalted-orb', resource: 'blue-zanthinium', form: 'bar', port: 'te-onui', distanceKm: 939, shipmentValue: 24, bias: 'exalted', notes: ['bar_recommended'] },
  { reward: 'orb-of-annulment', resource: 'blue-zanthinium', form: 'bar', port: 'pondium', distanceKm: 870, shipmentValue: 24, bias: 'annul', notes: ['bar_recommended'] },
  { reward: 'chaos-orb', resource: 'verisium', form: 'bar', port: 'te-onui', distanceKm: 939, shipmentValue: 64, bias: 'chaos', notes: ['bar_recommended'] },
  { reward: 'stacked-decks', resource: 'verisium', form: 'bar', port: 'ngakanu', distanceKm: 186, shipmentValue: 64, bias: 'stacked-decks', notes: ['bar_recommended'] },
  { reward: 'quality-gems', resource: 'bismuth', form: 'bar', port: 'ngakanu', distanceKm: 186, shipmentValue: 37, bias: 'quality-gems', notes: ['bar_recommended'] },
];

function bySlug(list, slug) { return list.find(x => x.slug === slug); }
function tName(obj, lang) { return obj?.name?.[lang] || obj?.name?.en || ''; }
function labelBias(bias, lang) {
  const mapKo = { divine: '디바인', exalted: '엑잘티드', annul: '어널', chaos: '카오스', 'stacked-decks': '스택드덱', 'quality-gems': '품질 젬' };
  const mapEn = { divine: 'Divine', exalted: 'Exalted', annul: 'Annul', chaos: 'Chaos', 'stacked-decks': 'Stacked Decks', 'quality-gems': 'Quality Gems' };
  return lang === 'ko' ? (mapKo[bias] || bias) : (mapEn[bias] || bias);
}

function rankRoutesForReward(slug) {
  const list = routes.filter(r => r.reward === slug);
  return list.sort((a,b) => (b.shipmentValue - a.shipmentValue) || (a.distanceKm - b.distanceKm));
}

function rankRoutesForResource(resourceSlug, form, portSlug) {
  let list = routes.filter(r => r.resource === resourceSlug && (!form || r.form === form));
  if (portSlug) list = list.filter(r => r.port === portSlug);
  return list.sort((a,b) => (b.shipmentValue - a.shipmentValue) || (a.distanceKm - b.distanceKm));
}

const Pill = ({ children }) => (
  <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:999, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', fontSize:12, marginRight:6 }}>
    {children}
  </span>
);

const Card = ({ children }) => (
  <div style={{ border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:16, background:'rgba(0,0,0,0.35)', boxShadow:'0 6px 24px rgba(0,0,0,0.35)' }}>
    {children}
  </div>
);

const Row = ({ children }) => <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>{children}</div>;

const Field = ({ label, children }) => (
  <label style={{ display:'grid', gap:6 }}>
    <span style={{ fontSize:13, opacity:0.85 }}>{label}</span>
    {children}
  </label>
);

const Select = ({ value, onChange, options }) => (
  <select value={value} onChange={e=>onChange(e.target.value)} style={{ padding:'10px 12px', borderRadius:10, background:'#111', color:'#fff', border:'1px solid #333' }}>
    <option value="">{''}</option>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const TradeCalculator = ({ lang='ko' }) => {
  const L = translations[lang] || translations.en;

  const [tab, setTab] = useState('reward');
  const [rewardSel, setRewardSel] = useState('');
  const [resourceSel, setResourceSel] = useState('');
  const [formSel, setFormSel] = useState('');
  const [portSel, setPortSel] = useState('');

  const rewardOptions = useMemo(() => rewards.map(r => ({ value:r.slug, label:tName(r,lang) })), [lang]);
  const resourceOptions = useMemo(() => resources.map(r => ({ value:r.slug, label:tName(r,lang) })), [lang]);
  const formOptions = useMemo(() => {
    const r = bySlug(resources, resourceSel);
    return (r?.forms || []).map(f => ({ value:f.type, label:f.type.toUpperCase() }));
  }, [resourceSel]);

  const portOptions = useMemo(() => ports.map(p => ({ value:p.slug, label:tName(p,lang) })), [lang]);

  const rewardResults = useMemo(() => rewardSel ? rankRoutesForReward(rewardSel) : [], [rewardSel]);
  const resourceResults = useMemo(() => resourceSel ? rankRoutesForResource(resourceSel, formSel, portSel) : [], [resourceSel, formSel, portSel]);

  return (
    <div style={{ maxWidth:960, margin:'0 auto', padding:'32px 16px', color:'#fff' }}>
      <h2 style={{ fontSize:28, marginBottom:4 }}>{L.pageTitle}</h2>
      <p style={{ opacity:0.8, marginBottom:24 }}>{L.pageDescription}</p>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <button onClick={()=>setTab('reward')} style={{ padding:'10px 14px', borderRadius:10, border:'1px solid #333', background: tab==='reward' ? '#222' : '#111', color:'#fff' }}>{L.tabRewardFirst}</button>
        <button onClick={()=>setTab('resource')} style={{ padding:'10px 14px', borderRadius:10, border:'1px solid #333', background: tab==='resource' ? '#222' : '#111', color:'#fff' }}>{L.tabResourceFirst}</button>
      </div>

      {tab==='reward' ? (
        <Card>
          <Row>
            <Field label={L.pickReward}>
              <Select value={rewardSel} onChange={setRewardSel} options={rewardOptions} />
            </Field>
          </Row>

          <div style={{ height:12 }} />

          {rewardResults.length ? (
            <>
              <h3 style={{ margin:'8px 0 10px' }}>{L.bestRoute}</h3>
              <BestRouteList lang={lang} items={rewardResults.slice(0,1)} />

              {rewardResults.length > 1 && (
                <>
                  <h4 style={{ margin:'16px 0 8px', opacity:0.85 }}>{L.altRoutes}</h4>
                  <BestRouteList lang={lang} items={rewardResults.slice(1)} compact />
                </>
              )}
            </>
          ) : (
            <div style={{ opacity:0.7 }}>{L.none}</div>
          )}
        </Card>
      ) : (
        <Card>
          <Row>
            <Field label={L.pickResource}>
              <Select value={resourceSel} onChange={(v)=>{ setResourceSel(v); setFormSel(''); }} options={resourceOptions} />
            </Field>
            <Field label={L.pickForm}>
              <Select value={formSel} onChange={setFormSel} options={formOptions} />
            </Field>
          </Row>
          <div style={{ height:12 }} />
          <Row>
            <Field label={L.pickPort}>
              <Select value={portSel} onChange={setPortSel} options={portOptions} />
            </Field>
            <div />
          </Row>

          <div style={{ height:12 }} />

          {resourceResults.length ? (
            <>
              <h3 style={{ margin:'8px 0 10px' }}>{L.bestRoute}</h3>
              <BestRouteList lang={lang} items={resourceResults.slice(0,1)} />

              {resourceResults.length > 1 && (
                <>
                  <h4 style={{ margin:'16px 0 8px', opacity:0.85 }}>{L.altRoutes}</h4>
                  <BestRouteList lang={lang} items={resourceResults.slice(1)} compact />
                </>
              )}
            </>
          ) : (
            <div style={{ opacity:0.7 }}>{L.none}</div>
          )}
        </Card>
      )}
    </div>
  );
};

const BestRouteList = ({ items, compact=false, lang }) => {
  const L = translations[lang] || translations.en;
  return (
    <div style={{ display:'grid', gap:12 }}>
      {items.map((r,idx)=> {
        const res = bySlug(resources, r.resource);
        const port = bySlug(ports, r.port) || { name: { ko:r.port, en:r.port } };
        const reward = bySlug(rewards, r.reward) || { name: { ko:r.reward, en:r.reward } };
        const resName = tName(res, lang);
        const portName = tName(port, lang);
        const rewardName = tName(reward, lang);
        const bar = r.notes?.includes('bar_recommended');
        return (
          <div key={idx} style={{ display:'flex', flexDirection:'column', gap:8, border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:16 }}>
              <strong>{resName}</strong>
              <span>→</span>
              <strong>{portName}</strong>
              <Pill>{rewardName}</Pill>
              {bar && <Pill>{L.barRecommended}</Pill>}
            </div>
            {!compact && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <Pill>{L.shipValue}: {r.shipmentValue}</Pill>
                <Pill>{L.distance}: {r.distanceKm}km</Pill>
                <Pill>{L.bias}: {labelBias(r.bias, lang)}</Pill>
                <Pill>{L.reason}: Regular Currency</Pill>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TradeCalculator;
