// ShippingCalculatorPage.jsx
import React, { useEffect, useState } from 'react';
import ShippingCalculator from './ShippingCalculator';
import './ShippingCalculatorPage.css';

const L10N = {
  ko: {
    title: '교역 계산기',
    tabReward: '보상으로 찾기',
    tabReserved: 'DO NOT TOUCH',
    reservedHeadline: 'Reserved Area',
    reservedDesc:
      '이 영역은 교역 계산기와 무관한 별도 기능을 위해 예약되었습니다. 절대로 수정하지 마십시오.',
  },
  en: {
    title: 'Trade (Shipping) Calculator',
    tabReward: 'Find by Reward',
    tabReserved: 'DO NOT TOUCH',
    reservedHeadline: 'Reserved Area',
    reservedDesc:
      'This area is reserved for a feature unrelated to the trade calculator. Do not modify.',
  },
};

const ShippingCalculatorPage = ({ lang = 'ko' }) => {
  const [tab, setTab] = useState('reward'); // 'reward' | 'reserved'
  const [iconUrls, setIconUrls] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/wp-json/asura/v1/ui-icons', { credentials: 'same-origin' });
        if (!alive) return;
        if (!res.ok) {
          setIconUrls({});
          return;
        }
        const json = await res.json();
        setIconUrls(json || {});
      } catch {
        setIconUrls({});
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="asura-content-container sc-page">
      <header className="sc-header">
        <span className="sc-line" />
        <h1 className="sc-title">
          Path of Exile
          <br />
          {L10N[lang].title}
        </h1>
        <span className="sc-line" />
      </header>

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
          className={`sc-tab ${tab === 'reserved' ? 'active' : ''}`}
          onClick={() => setTab('reserved')}
        >
          {L10N[lang].tabReserved}
        </button>
      </nav>

      <section className="sc-body">
        {tab === 'reward' && <ShippingCalculator lang={lang} iconUrls={iconUrls} />}

        {tab === 'reserved' && (
          <>
            {/*
======================================================================
// @@@ 경고 (WARNING) @@@
// 이 탭과 관련된 모든 코드는 다른 기능을 위해 예약된 공간입니다.
// THIS TAB AND ALL RELATED CODE ARE RESERVED FOR A DIFFERENT FEATURE.
//
// 절대로 이 코드를 수정하거나 교역 계산기 관련 기능을 추가하지 마십시오.
// DO NOT EVER MODIFY THIS CODE OR ADD TRADE CALCULATOR FEATURES HERE.
======================================================================
*/}
            <div className="sc-card" style={{ padding: 20, textAlign: 'center' }}>
              <h2 style={{ marginBottom: 8 }}>{L10N[lang].reservedHeadline}</h2>
              <p className="sc-subtext">{L10N[lang].reservedDesc}</p>
            </div>
            {/*
======================================================================
// @@@ 경고 (WARNING) @@@
// 이 탭과 관련된 모든 코드는 다른 기능을 위해 예약된 공간입니다.
// THIS TAB AND ALL RELATED CODE ARE RESERVED FOR A DIFFERENT FEATURE.
//
// 절대로 이 코드를 수정하거나 교역 계산기 관련 기능을 추가하지 마십시오.
// DO NOT EVER MODIFY THIS CODE OR ADD TRADE CALCULATOR FEATURES HERE.
======================================================================
*/}
          </>
        )}
      </section>
    </div>
  );
};

export default ShippingCalculatorPage;
