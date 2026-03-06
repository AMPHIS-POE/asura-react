import React, { useState, useEffect, useMemo } from 'react';
import disenchantSeed from './Disenchant.seed.json';
import './DisenchantCalculator.css';

const L10N = {
  ko: {
    minDustLabel: '최소 가루 획득량:',
    sliderTooltip: '거래 한 번당 얻고 싶은 최소 가루량을 설정합니다. 값이 높을수록 거래 횟수는 줄어들지만, 카오스당 효율은 다소 낮아질 수 있습니다.',
    infoBoxTitle: '💡 팁 & 정보',
    infoDisclaimer: '본 계산기는 poe.ninja의 시세에 기반하므로, 실시간 인게임 시세와는 약간 다를 수 있습니다.',
    infoQuality: '장비의 아이템 레벨과 퀄리티가 높을 수록 가루의 양이 크게 증가합니다. 이 계산기는 84레벨 20% 퀄리티를 기준으로 합니다.',
    colItem: '아이템',
    colPrice: '시장가',
    colDust: '가루',
    colEfficiency: '가루 (1카오스당)',
    warnTitle: '해당 아이템은 다른 아이템에 비해 효율이 비정상적으로 높게 계산되었습니다. 시세가 일시적으로 왜곡되었을 수 있으니 주의하세요.',
    loading: '데이터 불러오는 중...',
  },
  en: {
    minDustLabel: 'Min Dust Yield:',
    sliderTooltip: 'Sets the minimum amount of dust you want per trade. A higher value reduces the number of trades but may slightly lower the per-chaos efficiency.',
    infoBoxTitle: '💡 Tips & Info',
    infoDisclaimer: 'This calculator is based on price data from poe.ninja, so actual in-game prices may differ slightly.',
    infoQuality: 'The higher an item\'s level and quality, the more dust it yields. This calculator is based on ilv 84 and 20% quality.',
    colItem: 'Item',
    colPrice: 'Price',
    colDust: 'Dust',
    colEfficiency: 'Dust (per 1c)',
    warnTitle: 'This item\'s efficiency is abnormally high compared to others. The price may be distorted.',
    loading: 'Loading Data...',
  },
};

const CURRENT_LEAGUE = 'mirage';
const MIN_LISTING_COUNT = 10;
const OUTLIER_MULTIPLIER = 4;

const DisenchantCalculator = ({ lang = 'ko' }) => {
  const [priceData, setPriceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [minDust, setMinDust] = useState(1000000);

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/wp-json/asura/v1/poe-ninja-prices`);
        if (!res.ok) throw new Error('Price data fetch failed');
        const data = await res.json();
        setPriceData(data);
      } catch (error) {
        console.error("Failed to fetch poe.ninja prices:", error);
        setPriceData({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const finalData = useMemo(() => {
    if (!priceData) return [];

    const calculated = disenchantSeed.map(item => {
      const ninjaItem = priceData[item.key];
      const marketPrice = ninjaItem?.chaosValue;
      const listingCount = ninjaItem?.listingCount;

      if (!marketPrice || marketPrice < 0.1 || !listingCount || listingCount < MIN_LISTING_COUNT) {
        return null;
      }

      const dustValue = item['yield_ilvl84_q20'] || 0;
      const efficiency = dustValue / marketPrice;

      return {
        ...item,
        price: marketPrice,
        dust: dustValue,
        efficiency,
      };
    }).filter(Boolean);

    const filteredByDust = calculated.filter(item => item.dust >= minDust);

    if (filteredByDust.length === 0) return [];

    const efficiencies = filteredByDust.map(item => item.efficiency).sort((a, b) => a - b);
    
    const mid = Math.floor(efficiencies.length / 2);
    const medianEfficiency = efficiencies.length % 2 !== 0 ? efficiencies[mid] : (efficiencies[mid - 1] + efficiencies[mid]) / 2;

    const outlierThreshold = medianEfficiency * OUTLIER_MULTIPLIER;

    const flaggedData = filteredByDust.map(item => ({
      ...item,
      isOutlier: item.efficiency > outlierThreshold,
    }));

    flaggedData.sort((a, b) => b.efficiency - a.efficiency);

    return flaggedData;
  }, [priceData, minDust]);


  return (
    <div className="sc-section disenchant-calculator">
      <div className="dc-controls">
        <label htmlFor="min-dust-slider" className="dc-slider-label">
          {L10N[lang]?.minDustLabel || L10N.en.minDustLabel} {minDust.toLocaleString()}
          <span className="dc-help-icon" data-tooltip={L10N[lang]?.sliderTooltip || L10N.en.sliderTooltip}>?</span>
        </label>
        <input 
          type="range" 
          id="min-dust-slider"
          min="0"
          max="3000000"
          step="50000"
          value={minDust}
          onChange={e => setMinDust(Number(e.target.value))}
        />
      </div>

      <div className="dc-info-box">
        <strong>{L10N[lang]?.infoBoxTitle || L10N.en.infoBoxTitle}</strong>
        <ul>
          <li>{L10N[lang]?.infoDisclaimer || L10N.en.infoDisclaimer}</li>
          <li>{L10N[lang]?.infoQuality || L10N.en.infoQuality}</li>
        </ul>
      </div>

      {isLoading ? (
        <div className="sc-empty">{L10N[lang]?.loading || L10N.en.loading}</div>
      ) : (
        <div className="dc-table">
          <div className="dc-header">
            <div>{L10N[lang]?.colItem || L10N.en.colItem}</div>
            <div>{L10N[lang]?.colPrice || L10N.en.colPrice}</div>
            <div>{L10N[lang]?.colDust || L10N.en.colDust}</div>
            <div>{L10N[lang]?.colEfficiency || L10N.en.colEfficiency}</div>
          </div>
          <div className="dc-body">
            {finalData.map(item => (
              <div className="dc-row" key={item.key}>
                <div className="dc-item-name-cell">
                  {lang === 'ko' ? item.name : item.key}
                  {item.isOutlier && (
                    <span className="dc-warning-icon" data-tooltip={L10N[lang]?.warnTitle || L10N.en.warnTitle}>⚠️</span>
                  )}
                </div>
                <div>{item.price.toLocaleString()} c</div>
                <div>{item.dust.toLocaleString()}</div>
                <div>{Math.round(item.efficiency).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisenchantCalculator;