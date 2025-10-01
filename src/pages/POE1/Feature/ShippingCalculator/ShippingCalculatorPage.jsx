import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import HelpModal from '../../../../components/Modal/HelpModal';
import ShippingCalculator from './ShippingCalculator';
import './ShippingCalculatorPage.css';
import { helpContent } from './HelpContent';
import DisenchantCalculator from './DisenchantCalculator';

const L10N = {
  ko: {
    title: '교역 계산기',
    tabReward: '보상 네비게이터',
    tabRewardImage: '보상 네비게이터 (이미지)',
    tabReserved: '가루 계산기',
    guide: '가이드',
  },
  en: {
    title: 'Shipping Calculator',
    tabReward: 'Reward Navigator',
    tabRewardImage: 'Reward Navigator (Image)',
    tabReserved: 'Dust Calculator',
    guide: 'Guide',
  },
};

const ShippingCalculatorPage = ({ lang = 'ko' }) => {
  const [tab, setTab] = useState('reward');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [iconUrls, setIconUrls] = useState(null);
  const [rarityData, setRarityData] = useState(null);
  const [currencyData, setCurrencyData] = useState(null);

  useEffect(() => {
    const fetchIconUrls = async () => {
      try {
        const response = await fetch('/wp-json/asura/v1/ui-icons');
        if (!response.ok) throw new Error('Icon URLs fetch failed');
        const data = await response.json();
        setIconUrls(data || {});
      } catch (error) {
        console.error('Failed to fetch icon URLs:', error);
        setIconUrls({});
      }
    };

    const fetchRarities = async () => {
      try {
        const res = await fetch('/wp-json/asura/v1/item-rarities');
        if (!res.ok) throw new Error('Rarity fetch failed');
        const list = await res.json();
        const map = new Map();
        (list || []).forEach(r => {
          if (r?.slug) map.set(r.slug, r);
        });
        setRarityData(map);
      } catch (e) {
        console.error('Failed to fetch item rarities:', e);
        setRarityData(new Map());
      }
    };

    const fetchCurrencyData = async () => {
      try {
        const response = await fetch('/wp-json/wp/v2/poe1_currency?per_page=100&_embed=1');
        if (!response.ok) throw new Error('Currency data fetch failed');
        const data = await response.json();

        const getRaritySlug = (item) => {
          const embedded = item?._embedded?.['wp:term'] || [];
          for (const group of embedded) {
            for (const term of group) {
              if (term?.taxonomy === 'item_rarity') {
                return term.slug || null;
              }
            }
          }
          return null;
        };

        const dataMap = new Map();
        (data || []).forEach(item => {
          const name = item?.title?.rendered;
          if (!name) return;
          const raritySlug = getRaritySlug(item);
          dataMap.set(name, { item, raritySlug });
        });
        setCurrencyData(dataMap);
      } catch (error) {
        console.error('Failed to fetch currency tooltip data:', error);
        setCurrencyData(new Map());
      }
    };

    fetchIconUrls();
    fetchRarities();
    fetchCurrencyData();
  }, []);

  return (
    <div className="asura-content-container sc-page">
      <button
        className="sc-help-button"
        onClick={() => setIsHelpModalOpen(true)}
        type="button"
      >
        <span>{L10N[lang].guide}</span>
        <img
          src="https://asura.design/wp-content/uploads/2025/09/exclamation.png"
          alt="Guide"
        />
      </button>

      <Breadcrumbs lang={lang} />

      <h1 className="sc-title">
        Path of Exile
        <br />
        {L10N[lang].title}
      </h1>

      <nav className="sc-tabs">
        <button
          type="button"
          className={`sc-tab ${tab === 'reward' ? 'active' : ''}`}
          onClick={() => setTab('reward')}
        >
          {L10N[lang].tabReward}
        </button>
        <button
          type="button"
          className={`sc-tab ${tab === 'reward-image' ? 'active' : ''}`}
          onClick={() => setTab('reward-image')}
        >
          {L10N[lang].tabRewardImage}
        </button>
        <button
          type="button"
          className={`sc-tab ${tab === 'reserved' ? 'active' : ''}`}
          onClick={() => setTab('reserved')}
        >
          {L10N[lang].tabReserved}
        </button>
      </nav>

      <section className="sc-body">
        {tab === 'reward' && (
          <ShippingCalculator
            lang={lang}
            iconUrls={iconUrls}
            currencyData={currencyData}
            rarityData={rarityData}
          />
        )}

        {tab === 'reward-image' && (
          <div>
            {!iconUrls ? (
              <div className="sc-empty">Loading Image...</div>
            ) : (
              <img 
                src={iconUrls.kingsmarch_cheatsheet} 
                alt="Reward Navigator Map" 
                style={{ width: '100%', display: 'block' }} 
              />
            )}
          </div>
        )}

        {tab === 'reserved' && (
          <DisenchantCalculator lang={lang} />
        )}
      </section>

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        lang={lang}
        contentSource={helpContent}
      />
    </div>
  );
};

export default ShippingCalculatorPage;