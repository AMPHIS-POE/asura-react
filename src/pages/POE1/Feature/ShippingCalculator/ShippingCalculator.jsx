import React, { useMemo, useState, useEffect } from 'react';
import seed from './kingsmarch.seed.json';
import './ShippingCalculator.css';

const tName = (obj, lang) => obj?.name?.[lang] || obj?.name?.en || '';
const bySlug = (list, slug) => list.find(x => x.slug === slug);

const L10N = {
  ko: {
    title: '교역 계산기',
    desc: '보상 유형 → 항구를 고르면 가장 효율적인 자원을 추천합니다.',
    step1: '보상 유형 선택',
    step2: '항구 선택',
    resultTitle: '추천 자원',
    value: v => `가치: ${v}`,
    reward: r => `보상: ${r}`,
  },
  en: {
    title: 'Trade (Shipping) Calculator',
    desc: 'Choose reward type → port to see the best resources.',
    step1: 'Select Reward Type',
    step2: 'Select Port',
    resultTitle: 'Recommended Resources',
    value: v => `Value: ${v}`,
    reward: r => `Reward: ${r}`,
  },
};

function useRewardTypeCatalog(data = seed) {
  return useMemo(() => {
    const ports = data.ports || [];
    return Array.from(new Set(ports.map(p => p.rewardType).filter(Boolean)));
  }, [data]);
}

function usePortsByRewardType(rewardType, data = seed) {
  return useMemo(() => {
    if (!rewardType) return [];
    return (data.ports || []).filter(p => p.rewardType === rewardType);
  }, [rewardType, data]);
}

function useBestResourcesForPort(portSlug, data = seed, lang = 'ko') {
  return useMemo(() => {
    if (!portSlug) return [];
    const routes = data.routes.filter(r => r.portSlug === portSlug);
    const list = [];
    for (const r of routes) {
      const res = bySlug(data.resources, r.resourceSlug);
      if (!res) continue;
      list.push({ resource: res, reward: r.reward, value: res.value ?? 0 });
    }
    list.sort((a, b) => {
      const d = (b.value || 0) - (a.value || 0);
      if (d) return d;
      return tName(a.resource, lang).localeCompare(tName(b.resource, lang));
    });
    return list;
  }, [portSlug, data, lang]);
}

const CategoryCard = ({ rewardType, active, onClick, lang = 'ko', iconUrls }) => {
  const icon = iconUrls?.rewardTypes?.[rewardType] || iconUrls?.genericReward;
  return (
    <button type="button" className={`sc-card sc-click ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="sc-card-head sc-between">
        <div className="sc-row">
          {icon && <img src={icon} alt="" className="sc-icon" />}
          <strong>{rewardType}</strong>
        </div>
      </div>
    </button>
  );
};

const PortCard = ({ port, active, onClick, lang = 'ko', iconUrls }) => {
  const icon = iconUrls?.ports?.[port.slug] || iconUrls?.genericPort;
  return (
    <button type="button" className={`sc-card sc-click ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="sc-card-head sc-between">
        <div className="sc-row">
          {icon && <img src={icon} alt="" className="sc-icon" />}
          <strong>{tName(port, lang)}</strong>
        </div>
        <div className="sc-badges">
          <span className="sc-pill">{port.rewardType}</span>
        </div>
      </div>
      {!!(port.specialties && port.specialties.length) && (
        <div className="sc-subtext">{port.specialties.join(' · ')}</div>
      )}
    </button>
  );
};

const ResultCard = ({ item, lang = 'ko', iconUrls }) => {
  const res = item.resource;
  const icon = iconUrls?.resources?.[res.slug] || iconUrls?.genericResource;
  return (
    <div className="sc-card sc-result">
      <div className="sc-card-head sc-between">
        <div className="sc-row">
          {icon && <img src={icon} alt="" className="sc-icon" />}
          <strong>{tName(res, lang)}</strong>
        </div>
        <div className="sc-badges">
          <span className="sc-pill">{L10N[lang].value(item.value)}</span>
        </div>
      </div>
      <div className="sc-badges">
        <span className="sc-pill">{L10N[lang].reward(item.reward)}</span>
      </div>
    </div>
  );
};

const LeftFlow = ({ lang = 'ko', iconUrls }) => {
  const rewardTypes = useRewardTypeCatalog(seed);

  const [rewardType, setRewardType] = useState(rewardTypes[0] || '');
  const ports = usePortsByRewardType(rewardType, seed);

  const [portSlug, setPortSlug] = useState(ports[0]?.slug || '');
  const results = useBestResourcesForPort(portSlug, seed, lang);

  useEffect(() => {
    // rewardTypes가 바뀌어 현재 rewardType이 유효하지 않으면 첫 번째로 보정
    if (!rewardTypes.includes(rewardType)) {
      setRewardType(rewardTypes[0] || '');
    }
  }, [rewardTypes, rewardType]);

  useEffect(() => {
    // 훅을 다시 호출하지 말고, 이미 계산된 ports를 사용해 첫 항구를 선택
    const first = ports[0]?.slug || '';
    setPortSlug(first);
  }, [ports]);

  return (
    <div className="sc-section">
      <h2 className="sc-section-title">{L10N[lang].title}</h2>
      <p className="sc-desc">{L10N[lang].desc}</p>

      <div className="sc-grid-3">
        <div className="sc-col">
          <div className="sc-block-title">{L10N[lang].step1}</div>
          <div className="sc-stack">
            {rewardTypes.map(rt => (
              <CategoryCard
                key={rt}
                rewardType={rt}
                active={rt === rewardType}
                onClick={() => setRewardType(rt)}
                lang={lang}
                iconUrls={iconUrls}
              />
            ))}
          </div>
        </div>

        <div className="sc-col">
          <div className="sc-block-title">{L10N[lang].step2}</div>
          <div className="sc-stack">
            {ports.map(p => (
              <PortCard
                key={p.slug}
                port={p}
                active={p.slug === portSlug}
                onClick={() => setPortSlug(p.slug)}
                lang={lang}
                iconUrls={iconUrls}
              />
            ))}
          </div>
        </div>

        <div className="sc-col">
          <div className="sc-block-title">{L10N[lang].resultTitle}</div>
          <div className="sc-grid">
            {results.map(it => (
              <ResultCard key={it.resource.slug} item={it} lang={lang} iconUrls={iconUrls} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShippingCalculator = ({ lang = 'ko', iconUrls }) => {
  return <LeftFlow lang={lang} iconUrls={iconUrls} />;
};

export default ShippingCalculator;
