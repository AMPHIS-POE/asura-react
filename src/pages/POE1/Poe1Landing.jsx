import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './Poe1Landing.css';
import MapCalculator from './Feature/MapCalculator/MapCalculator';
import VoriciCalculator from './Feature/VoriciCalculator/VoriciCalculator';
import RegexGenerator from './Feature/RegexGenerator/RegexGenerator';
import Poe1FansiteLinks from './Feature/FansiteLinks/Poe1FansiteLinks';



const translations = {
  ko: {
    welcome: '아수라에 오신 것을 환영합니다',
    selectTool: '상단 네비게이션 바에서 도구를 선택하세요.',
  },
  en: {
    welcome: 'Welcome to ASURA',
    selectTool: 'Select a tool from the navigation bar above.',
  },
};

const Poe1Landing = ({ lang }) => {
  const t = translations[lang] || translations.en;

  return (
    <div id="poe1-landing-page">

      <div id="poe1-sub-content-container">
        <Routes>
          <Route index element={
            <div className="tool-placeholder">
              <h2>{t.welcome}</h2>
              <p>{t.selectTool}</p>
            </div>
          } />
          <Route path="map" element={<MapCalculator lang={lang} />} />
          <Route path="vorici" element={<VoriciCalculator lang={lang} />} />
          <Route path="regex" element={<RegexGenerator lang={lang} />} />
          <Route path="links" element={<Poe1FansiteLinks lang={lang} />} />
          <Route path="build" element={<BaseItemTester />} />


        </Routes>
      </div>
    </div>
  );
};

export default Poe1Landing;
