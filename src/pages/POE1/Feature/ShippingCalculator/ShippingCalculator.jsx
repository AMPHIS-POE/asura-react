import React, { useMemo, useState, useEffect } from 'react';
import seed from './kingsmarch.seed.json';
import './ShippingCalculator.css';
import ItemToolTip from '../../../../components/ItemToolTip/ItemToolTip';

const tName = (obj, lang) => obj?.name?.[lang] || obj?.name?.en || '';
const bySlug = (list, slug) => list.find(x => x.slug === slug);

const L10N = {
  ko: {
    title: '교역 계산기',
    selectReward: '보상을 선택하세요.',
    rune: '룬',
    tattoo: '문신',
    rewardsHeader: '보상 목록',
    minerals: '광물',
    crops: '작물',
    currencyLabel: '화폐',
    tipsHeading: '핵심 팁',
    tips: [
      '모든 작물은 기본적으로 모든 화폐를 교역 보상으로 제공하지만 작물별, 지역별로 일정한 경향성이 있습니다. 물론 어디까지나 ‘경향성’이라는 점 체크하시길 바랍니다.',
      '고급 화폐가 주 타겟이라면 광물을 포함하지 않는 것이 좋습니다. 전체 수송 가치에서 작물 비중이 높을수록 고급 화폐 확률이 상승합니다.',
      '마석학 가루는 고급 화폐의 등장 확률과는 상관 없으며, 오직 기존 보상을 증폭시키는 역할만 수행합니다. 더불어 수송 가치를 초과해서 넣을수록 효율이 빠르게 감소하므로 수송 가치가 2배가 되도록 해주는 것이 가장 효율적입니다.',
      '선호 자원 퀘스트는 기본적으로 수행해주는 것이 좋습니다. 할당량을 모두 만족하면 주로 고유 아이템 등을 추가 보상을 받을 수 있으며, 모든 항구의 할당량 등급이 전역적으로 상승해 보상의 질이 점점 좋아집니다.',
      '각종 광물은 주괴로 제련 시 효율이 5배 상승합니다.',
      '수송 가치가 70만일 때 신성한 오브가 50% 확률로, 5000만일 때 평균 2.5개의 거울 파편이 등장합니다.'
    ]
  },
  en: {
    title: 'Trade (Shipping) Calculator',
    selectReward: 'Select a Reward',
    rune: 'Rune',
    tattoo: 'Tattoo',
    rewardsHeader: 'Rewards',
    minerals: 'Ore',
    crops: 'Crops',
    currencyLabel: 'Currency',
    tipsHeading: 'Key Tips',
    tips: [
      'All crops can reward any currency, but each crop/port shows certain tendencies. But, just treat it as tendencies, not guarantees.',
      'If your target is high-tier currency, avoid mixing in Ore. A higher crop share in total shipping value increases the chance.',
      'Thaumaturgic Dust does not affect high-tier currency chance; it only amplifies existing rewards. Efficiency drops past the shipping value; aiming around 2× shipping value is most efficient.',
      'Preferred-resource quests are generally worth doing. Meeting the quota often grants extra rewards (e.g., uniques). Completing a quota raises quota ranks globally, improving overall reward quality.',
      'Smelting ores into bars yields about 5× efficiency.',
      'Around 700k shipping value, Divine Orb appears ~50%; around 50M, you see an average of ~2.5 Mirror Shards.'
    ]
  }
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
      list.push({ resource: res, reward: r.reward });
    }
    list.sort((a, b) => (a.resource.value || 0) - (b.resource.value || 0));
    return list;
  }, [portSlug, data, lang]);
}

const CategoryCard = ({ rewardType, active, onClick, lang = 'ko', iconUrls }) => {
  const imageKey = rewardType === 'rune'
    ? 'Power_Rune_inventory_icon'
    : 'Tattoo_strength_1_inventory_icon';
  const imageUrl = iconUrls ? iconUrls[imageKey] : null;
  return (
    <button
      type="button"
      className={`sc-card sc-click sc-category-image-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="sc-category-content">
        {imageUrl ? (
          <img src={imageUrl} alt={rewardType} className="sc-category-image" />
        ) : (
          <strong>{L10N[lang][rewardType]}</strong>
        )}
      </div>
    </button>
  );
};

const PortCard = ({ port, active, onClick, lang = 'ko', iconUrls }) => {
  const flagKey = port.rewardType === 'rune' ? 'kalguur_flag' : 'karui_flag';
  const flagUrl = iconUrls ? iconUrls[flagKey] : null;

  const specialties = Array.isArray(port.specialties)
    ? port.specialties
    : ((port.specialties && (port.specialties[lang] || port.specialties.en)) || []);

  return (
    <button type="button" className={`sc-card sc-click ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="sc-card-head sc-between">
        <div className="sc-row">
          {flagUrl && <img src={flagUrl} alt="" className="sc-icon" />}
          <strong>{tName(port, lang)}</strong>
        </div>
        <div className="sc-badges">
          <span className="sc-pill">{port.rewardType}</span>
        </div>
      </div>
      {!!specialties.length && (
        <div className="sc-subtext">{specialties.join(' · ')}</div>
      )}
    </button>
  );
};

const RewardTable = ({ items, lang, iconUrls, currencyData, rarityData }) => {
  const { minerals, crops } = items;

  const TableRow = ({ item, lang, iconUrls, currencyData, rarityData }) => {
    const resourceKey = item.resource.key;
    const iconPath = (iconUrls && resourceKey) ? iconUrls[resourceKey] : null;

    const fullName = tName(item.resource, lang);
    const displayName = item.resource.type === 'bar'
      ? fullName.replace(lang === 'ko' ? ' 주괴' : ' Bar', '')
      : fullName;

    const rewardObj = item.reward || null;
    const rewardKind = rewardObj?.kind || 'text';
    const rewardName = rewardObj?.name ? (rewardObj.name[lang] || rewardObj.name.en || '') : '';








const rewardLabel = (rewardName || '').replace(/'/g, '’');

const normalize = (s) =>
  (s || '')
    .replace(/&(?:apos|#39|#x27|#8217);/gi, "'")
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const eachKey = (store, cb) => {
  if (!store) return;
  if (store instanceof Map) {
    for (const [k, v] of store.entries()) cb(k, v);
  } else if (typeof store.keys === 'function') {
    for (const k of store.keys()) cb(k, store.get(k));
  } else {
    for (const k of Object.keys(store)) cb(k, store[k]);
  }
};

const getByKeys = (keys) => {
  if (!currencyData) return null;

  for (const k of keys) {
    const v = currencyData.get ? currencyData.get(k) : currencyData[k];
    if (v) return v;
  }

  const targets = keys.map(normalize);
  let found = null;
  eachKey(currencyData, (key, val) => {
    if (!found && targets.includes(normalize(key))) found = val;
  });
  return found;
};

const curRaw = rewardObj?.name?.[lang] || '';
const keysCurrentVariants = [
  curRaw,
  curRaw.replace(/’/g, "'"),
  curRaw.replace(/'/g, '’')
].filter(Boolean);

const otherLang = lang === 'ko' ? 'en' : 'ko';
const othRaw = rewardObj?.name?.[otherLang] || '';
const keysOtherVariants = [
  othRaw,
  othRaw.replace(/’/g, "'"),
  othRaw.replace(/'/g, '’')
].filter(Boolean);

let tooltipItem = null;
let raritySlug = null;
let rarityStyle = null;

if (rewardKind === 'currency' && rewardName) {
  const currencyBundle =
    getByKeys(keysCurrentVariants) ||
    getByKeys(keysOtherVariants) ||
    null;

  tooltipItem = currencyBundle?.item || null;
  raritySlug = currencyBundle?.raritySlug || null;
  rarityStyle = raritySlug && rarityData ? (rarityData.get(raritySlug)?.acf || null) : null;
}

    return (
      <div className="reward-table-item">
        <div className="reward-table-resource">
          {iconPath && <img src={iconPath} alt={fullName} className="sc-icon" />}
          <span>{displayName}</span>
        </div>

        <div className="reward-table-reward">
          {tooltipItem ? (
            <ItemToolTip
              item={tooltipItem}
              currentLang={lang}
              rarityStyle={rarityStyle}
              raritySlug={raritySlug}
            >
              {rewardLabel}
            </ItemToolTip>
          ) : (
            <span>{rewardLabel}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="reward-table">
      <div className="reward-table-header">{L10N[lang].rewardsHeader}</div>
      <div className="reward-table-body">
        <div className="reward-table-column">
          <div className="reward-table-subheader">{L10N[lang].minerals}</div>
          <div className="reward-table-rows">
            {minerals.map(item => (
              <TableRow
                key={item.resource.slug}
                item={item}
                lang={lang}
                iconUrls={iconUrls}
                currencyData={currencyData}
                rarityData={rarityData}
              />
            ))}
          </div>
        </div>

        <div className="reward-table-column">
          <div className="reward-table-subheader">{L10N[lang].crops}</div>
          <div className="reward-table-rows">
            {crops.map(item => (
              <TableRow
                key={item.resource.slug}
                item={item}
                lang={lang}
                iconUrls={iconUrls}
                currencyData={currencyData}
                rarityData={rarityData}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="reward-table-tip">
        <span className="tip-heading">** {L10N[lang]?.tipsHeading || L10N.en.tipsHeading} **</span>
        <span>
          {(L10N[lang]?.tips || L10N.en.tips).map((line, idx) => (
            <span key={idx} className="tip-line">
              <span className="num">[{idx + 1}]</span>
              {line}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

const LeftFlow = ({ lang = 'ko', iconUrls, currencyData, rarityData }) => {
  const rewardTypes = useRewardTypeCatalog(seed);
  const [rewardType, setRewardType] = useState(rewardTypes[0] || null);
  const ports = usePortsByRewardType(rewardType, seed);
  const [portSlug, setPortSlug] = useState(null);
  const results = useBestResourcesForPort(portSlug, seed, lang);

  const groupedResults = useMemo(() => {
    const minerals = [];
    const crops = [];
    results.forEach(item => {
      if (item.resource.type === 'crop') {
        crops.push(item);
      } else if (item.resource.type === 'bar') {
        minerals.push(item);
      }
    });
    return { minerals, crops };
  }, [results]);

  useEffect(() => {
    const first = ports[0]?.slug || null;
    setPortSlug(first);
  }, [ports]);

  return (
    <div className="sc-section">
      <div className="sc-block-title">{L10N[lang].selectReward}</div>
      <div className="sc-category-selection">
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
      {rewardType && (
        <>
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
          {portSlug && (
            <div className="sc-block">
              {results.length > 0 ? (
                <RewardTable
                  items={groupedResults}
                  lang={lang}
                  iconUrls={iconUrls}
                  currencyData={currencyData}
                  rarityData={rarityData}
                />
              ) : (
                <div className="sc-empty">결과가 없습니다.</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ShippingCalculator = ({ lang = 'ko', iconUrls, currencyData, rarityData }) => {
  if (!iconUrls || !currencyData || !rarityData) {
    return <div className="sc-empty">Loading Data...</div>;
  }
  return <LeftFlow lang={lang} iconUrls={iconUrls} currencyData={currencyData} rarityData={rarityData} />;
};

export default ShippingCalculator;
