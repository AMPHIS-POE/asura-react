// src/pages/POE1/Feature/RegexGenerator/RegexGeneratorPage.jsx
import React, { useState } from 'react';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import HelpModal from '../../../../components/Modal/HelpModal';
import RegexGenerator from './RegexGenerator';
import './RegexGeneratorPage.css';

const RegexGeneratorPage = ({ lang = 'ko' }) => {
  const [activeTab, setActiveTab] = useState('map');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div className="asura-content-container regex-page">
      {/* Help (same spot as other tools) */}
      <button
        className="help-button"
        onClick={() => setIsHelpModalOpen(true)}
        type="button"
      >
        <span>{lang === 'ko' ? '가이드' : 'Guide'}</span>
        <img
          src="http://localhost/wp-content/uploads/2025/09/exclamation.png"
          alt="Guide"
        />
      </button>

      {/* Breadcrumbs */}
      <Breadcrumbs lang={lang} />

      {/* Title with top/bottom rules (matches calculator vibe) */}
      <div className="rgx-header">
        <h1 className="rgx-title">
          Path of Exile
          <br />
          {lang === 'ko' ? '정규식 생성기' : 'Regex Generator'}
        </h1>
      </div>

      {/* Calculator-style tabs (yellow baseline + raised active) */}
      <div className="rgx-tabsbar">
        <button
          className={`rgx-tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
          type="button"
        >
          {lang === 'ko' ? '맵 모드' : 'Map Mods'}
        </button>
        <button
          className={`rgx-tab ${activeTab === 'vendor' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendor')}
          type="button"
        >
          {lang === 'ko' ? '벤더' : 'Vendor'}
        </button>
      </div>

      {/* Body */}
      <div className="rgx-content">
        {activeTab === 'map' && (
          <div className="rgx-section">
            <RegexGenerator lang={lang} embedded />
          </div>
        )}
        {activeTab === 'vendor' && (
          <div className="rgx-section rgx-section--empty">
            <div className="vendor-placeholder">
              {lang === 'ko'
                ? '벤더 정규식 생성기는 준비 중입니다.'
                : 'Vendor regex generator is coming soon.'}
            </div>
          </div>
        )}
      </div>

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};

export default RegexGeneratorPage;
