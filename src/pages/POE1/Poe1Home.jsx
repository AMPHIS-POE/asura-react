import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navigationData } from '../../navigationConfig.js';

// Header.jsx에서 번역 객체를 복사해옵니다.
const translations = {
  ko: {
    poe1_mapCalculator: '17T 지도 계산기',
    poe1_voriciCalculator: '색채 계산기',
    poe1_regexGenerator: '정규식 생성기',
    poe1_ShippingCalculator: '교역 계산기',
    poe1_act_guide: '캠페인 네비게이터',
    poe1_builds: '빌드',
  },
  en: {
    poe1_mapCalculator: '17T Map Calculator',
    poe1_voriciCalculator: 'Vorici Calculator',
    poe1_regexGenerator: 'Regex Generator',
    poe1_ShippingCalculator: 'Shipping Calculator',
    poe1_act_guide: 'Campaign Navigator',
    poe1_builds: 'Builds',
  },
};

const Poe1Home = ({ lang }) => {
  const [iconUrls, setIconUrls] = useState({});
  const t = translations[lang] || translations.en;

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch(`/wp-json/asura/v1/ui-icons`);
        if (!response.ok) {
          throw new Error('Network response was not ok for icons');
        }
        const data = await response.json();
        setIconUrls(data);
      } catch (error) {
        console.error("Failed to fetch icon URLs:", error);
      }
    };
    fetchIcons();
  }, []);

  const toolLinks = navigationData.poe1.navLinks.find(
    (link) => link.id === 'tools'
  )?.items || [];

  return (
    <div className="poe1-home-container">
      <div className="tool-card-grid">
        {toolLinks.map((tool) => {
          const imageUrl = tool.cardImageKey && iconUrls[tool.cardImageKey]
            ? `url(${iconUrls[tool.cardImageKey]})`
            : 'none';

          return (
            <Link 
              to={tool.path} 
              key={tool.textKey} 
              className="tool-card"
              style={{ backgroundImage: imageUrl }}
            >
              {/* POE2 가이드 카드와 동일한 구조로 변경 */}
              <div className="tool-card-content">
                <span className="tool-card-title">{t[tool.textKey]}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Poe1Home;