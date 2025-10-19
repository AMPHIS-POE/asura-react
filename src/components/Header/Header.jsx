import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navigationData } from "../../navigationConfig.js";
import LiveNotifier from './LiveNotifier/LiveNotifier.jsx';
import './Header.css';

const translations = {
  ko: {
    browseGames: '게임 둘러보기', language_select: '언어', lang_ko: '한글', lang_en: 'English',
    poe1_title: '패스 오브 엑자일', poe2_title: '패스 오브 엑자일 2',
    poe1_home: '홈', poe1_tools: '도구', poe1_mapCalculator: '17T 지도 계산기', poe1_voriciCalculator: '색채 계산기', poe1_regexGenerator: '정규식 생성기', poe1_ShippingCalculator: '교역 계산기', poe1_act_guide: '캠페인 네비게이터', poe1_builds: '빌드', poe1_fansiteLinks: '팬사이트 링크', poe1_buildsComingSoon: '빌드 페이지는 준비 중입니다!',
    poe2_home: '홈', poe2_guides: '가이드', poe2_tools: '도구', poe2_act_guide: '캠페인 네비게이터', poe2_contentGuides: '콘텐츠 가이드',
    poe2_beginnerGuides: '초보자 가이드',
    poe2_comingSoon: '콘텐츠 준비 중입니다.',
  },
  en: {
    browseGames: 'Browse Games', language_select: 'Language', lang_ko: '한글', lang_en: 'English',
    poe1_title: 'Path of Exile', poe2_title: 'Path of Exile 2',
    poe1_home: 'Home', poe1_tools: 'Tools', poe1_mapCalculator: '17T Map Calculator', poe1_voriciCalculator: 'Vorici Calculator', poe1_regexGenerator: 'Regex Generator', poe1_ShippingCalculator: 'Shipping Calculator', poe1_act_guide: 'Campaign Navigator', poe1_builds: 'Builds', poe1_fansiteLinks: 'Fansite Links', poe1_buildsComingSoon: 'Builds page coming soon!',
    poe2_home: 'Home', poe2_guides: 'Guides', poe2_tools: 'Tools', poe2_act_guide: 'Campaign Navigator', poe2_contentGuides: 'Content Guides',
    poe2_beginnerGuides: 'Beginner Guides',
    poe2_comingSoon: 'Content coming soon.',
  },
};

const Header = ({ lang, setLang }) => {
  const location = useLocation();
  const t = translations[lang] || translations.en;

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  const [iconUrls, setIconUrls] = useState({});

  const pathParts = location.pathname.split('/');
  const mainPath = pathParts[1] || 'main';
  const subPath = pathParts[2] || '';
  const config = navigationData[mainPath] || {};

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs.current[openDropdown] && !dropdownRefs.current[openDropdown].contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    setOpenDropdown(null);
  }, [location]);

  const handleDropdownToggle = (dropdownId) => {
    setOpenDropdown(prev => (prev === dropdownId ? null : dropdownId));
  };

  const isLandingPage = subPath === '' && (mainPath === 'main' || mainPath === 'poe1' || mainPath === 'poe2');
  const headerClassName = `asura-custom-main-header ${isLandingPage ? 'with-margin-bottom' : ''}`;

  return (
    <header className={headerClassName}>
      <div className="asura-header-inner-content">
        <div className="header-left-section">
          <div className="site-branding">
            <Link to="/" className="asura-logo-link">
              <img src="/img/asura-logo-2.png" alt="아수라 아이콘" className="asura-icon-logo" />
              <img src="/img/asura-logo.png" alt="아수라 로고" className="asura-logo-image" />
            </Link>
          </div>
        </div>

        <div className="header-center-section">
          <LiveNotifier />
        </div>

        <div className="header-right-section">
          <nav className="header-navigation-elements">
            <div className="dropdown-container" ref={el => dropdownRefs.current['browseGames'] = el}>
              <button className={`dropdown-button ${openDropdown === 'browseGames' ? 'open' : ''}`} onClick={() => handleDropdownToggle('browseGames')}>
                <span>{t.browseGames}</span>
                <svg className="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              {openDropdown === 'browseGames' && (
                <div className="dropdown-menu">
                  <NavLink to="/poe1" className="dropdown-menu-item">
                    {iconUrls['poe1_logo'] && <img src={iconUrls['poe1_logo']} alt="Path of Exile 1 Logo" className="dropdown-menu-item-icon large-icon" />}
                    <span>{t.poe1_title}</span>
                  </NavLink>
                  <NavLink to="/poe2" className="dropdown-menu-item">
                    {iconUrls['poe2_logo'] && <img src={iconUrls['poe2_logo']} alt="Path of Exile 2 Logo" className="dropdown-menu-item-icon large-icon" />}
                    <span>{t.poe2_title}</span>
                  </NavLink>
                </div>
              )}
            </div>
            <div className="dropdown-container" ref={el => dropdownRefs.current['lang'] = el}>
              <button className={`dropdown-button ${openDropdown === 'lang' ? 'open' : ''}`} onClick={() => handleDropdownToggle('lang')}>
                <span>{t.language_select}</span>
                <svg className="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              {openDropdown === 'lang' && (
                <div className="dropdown-menu">
                  <button className={`dropdown-menu-item ${lang === 'ko' ? 'active' : ''}`} onClick={() => { setLang('ko'); setOpenDropdown(null); }}>
                    {iconUrls.flag_ko && <img src={iconUrls.flag_ko} alt="Korean flag" className="lang-flag-icon" />}
                    <span>{t.lang_ko}</span>
                  </button>
                  <button className={`dropdown-menu-item ${lang === 'en' ? 'active' : ''}`} onClick={() => { setLang('en'); setOpenDropdown(null); }}>
                    {iconUrls.flag_us && <img src={iconUrls.flag_us} alt="USA flag" className="lang-flag-icon" />}
                    <span>{t.lang_en}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {config.bannerKey && iconUrls[config.bannerKey] && (
        <div className={mainPath === 'main' ? 'main-landing-banner' : `${mainPath}-banner`}>
          <img src={iconUrls[config.bannerKey]} alt={`${config.title || 'Asura'} Banner`} />
          {iconUrls[`${mainPath}_logo`] && (
            <img
              src={iconUrls[`${mainPath}_logo`]}
              alt={`${config.title} Logo`}
              className="banner-logo-overlay"
            />
          )}
        </div>
      )}

      {config.navLinks && config.navLinks.length > 0 && (
        <div className="poe-header-extension">
          <nav className={`${mainPath}-navigation-bar`}>
            <div className="tabs">
              {config.navLinks.map(link => {
                if (link.type === 'link') {
                  return <NavLink key={link.textKey} to={link.path} className="tab-link" end={link.end}>{t[link.textKey]}</NavLink>;
                }
                if (link.type === 'button') {
                  return <button key={link.textKey} className="tab-link" onClick={() => alert(t[link.alertKey])}>{t[link.textKey]}</button>;
                }
                if (link.type === 'dropdown') {
                  const isActive = link.activeCheck.includes(subPath);
                  return (
                    <div key={link.textKey} className="dropdown-container" ref={el => dropdownRefs.current[link.id] = el}>
                      <button className={`dropdown-button ${openDropdown === link.id ? 'open' : ''} ${isActive ? 'active' : ''}`} onClick={() => handleDropdownToggle(link.id)}>
                        <span>{t[link.textKey]}</span>
                        <svg className="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                      {openDropdown === link.id && (
                        <div className="dropdown-menu">
                          {link.items.map(item => (
                            <NavLink key={item.textKey} to={item.path} className="dropdown-menu-item">
                              {item.iconKey && iconUrls[item.iconKey] && (
                                <img src={iconUrls[item.iconKey]} alt="" className="dropdown-menu-item-icon" />
                              )}
                              <span>{t[item.textKey]}</span>
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;