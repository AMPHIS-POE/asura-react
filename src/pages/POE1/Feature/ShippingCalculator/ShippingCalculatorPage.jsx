import React, { useState } from 'react';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import HelpModal from '../../../../components/Modal/HelpModal';
import ShippingCalculator from './ShippingCalculator';
import './ShippingCalculatorPage.css';

const ShippingCalculatorPage = ({ lang = 'ko' }) => {
  const [tab, setTab] = useState('reward'); // 'reward' | 'resource'
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="asura-content-container sc-page">
      <button type="button" className="sc-help" onClick={() => setHelpOpen(true)}>
        {lang === 'ko' ? '가이드' : 'Guide'}
        <span className="sc-help-icon">ℹ︎</span>
      </button>

      <Breadcrumbs lang={lang} />

      <header className="sc-header">
        <span className="sc-line" />
        <h1 className="sc-title">
          Path of Exile
          <br />
          {lang === 'ko' ? '교역 계산기' : 'Trade (Shipping) Calculator'}
        </h1>
        <span className="sc-line" />
      </header>

      <nav className="sc-tabs">
        <button
          type="button"
          className={`sc-tab ${tab === 'reward' ? 'active' : ''}`}
          onClick={() => setTab('reward')}
        >
          {lang === 'ko' ? '보상으로 찾기' : 'Find by Reward'}
        </button>
        <button
          type="button"
          className={`sc-tab ${tab === 'resource' ? 'active' : ''}`}
          onClick={() => setTab('resource')}
        >
          {lang === 'ko' ? '자원 → 항구' : 'Resource → Port'}
        </button>
      </nav>

      <section className="sc-body">
        {/* 기능은 기존 본체가 처리. 모드만 내려줌 */}
        <ShippingCalculator lang={lang} mode={tab} />
      </section>

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} lang={lang} />
    </div>
  );
};

export default ShippingCalculatorPage;
