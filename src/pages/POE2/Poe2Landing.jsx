import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './Poe2Landing.css';
import Poe2ActGuide from './Feature/Poe2ActGuide/Poe2ActGuide';
import Poe2ContentGuide from './Feature/ContentGuide/Poe2ContentGuide';
import Poe2BeginnerGuide from './Feature/ContentGuide/Poe2BeginnerGuide';


const translations = {
  ko: {
    welcome: 'Path of Exile 2 페이지에 오신 것을 환영합니다',
    comingSoon: '콘텐츠가 곧 공개됩니다. 기대해주세요!',
  },
  en: {
    welcome: 'Welcome to the Path of Exile 2 Page',
    comingSoon: 'Content is coming soon. Stay tuned!',
  },
};

const Poe2Landing = ({ lang }) => {
  const t = translations[lang] || translations.en;

  return (
    <div id="poe2-landing-page">
      <div id="poe2-sub-content-container">
        <Routes>
          <Route index element={
            <div className="tool-placeholder">
              <h2>{t.welcome}</h2>
              <p>{t.comingSoon}</p>
            </div>
          } />
          <Route path="act-guide" element={<Poe2ActGuide lang={lang} />} />
          <Route path="beginner-guides" element={<Poe2BeginnerGuide lang={lang} />} />
          <Route path="content-guides" element={<Poe2ContentGuide lang={lang} />} />

        </Routes>
      </div>
    </div>
  );
};

export default Poe2Landing;
