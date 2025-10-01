import React, { useMemo, useState, useEffect } from 'react';
import seed from './kingsmarch.seed.json';
import './ShippingCalculator.css';
import ItemToolTip from '../../../../components/ItemToolTip/ItemToolTip';

const tName = (obj, lang) => obj?.name?.[lang] || obj?.name?.en || '';
const bySlug = (list, slug) => list.find(x => x.slug === slug);

const L10N = {
  ko: {
    title: '교역 계산기',
    selectReward: '룬? 문신?',
    rune: '룬',
    tattoo: '문신',
    rewardsHeader: '보상 목록',
    minerals: '광물',
    crops: '작물',
    currencyLabel: '화폐',
    tipsHeading: '우측 상단의 가이드에 여러 중요한 팁이 있으니 참고하세요',
    tips: [
    ]
  },
  en: {
    title: 'Trade (Shipping) Calculator',
    selectReward: 'Rune? Tattoo?',
    rune: 'Rune',
    tattoo: 'Tattoo',
    rewardsHeader: 'Rewards',
    minerals: 'Ore',
    crops: 'Crops',
    currencyLabel: 'Currency',
    tipsHeading: 'Please check the guide at the top right for several key tips',
    tips: [
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
