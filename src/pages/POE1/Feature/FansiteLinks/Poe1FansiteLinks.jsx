import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import './Poe1FansiteLinks.css';

const fansiteLinksData = [
  {
    href: 'https://poe.ninja/',
    iconKey: 'icon-poe-ninja',
    title: { ko: 'POE NINJA', en: 'POE NINJA' },
    description: { ko: '경제 시세, 빌드 메타 통계', en: 'Economy, builds, and item data' },
  },
  {
    href: 'https://poedb.tw/kr/',
    iconKey: 'icon-poe-db',
    title: { ko: 'POE DB', en: 'POE DB' },
    description: { ko: '각종 데이터 검색', en: 'Various data search' },
  },
  {
    href: 'https://www.poewiki.net/wiki/Path_of_Exile_Wiki',
    iconKey: 'icon-poe-wiki',
    title: { ko: 'POE WIKI', en: 'POE WIKI' },
    description: { ko: '종합 정보', en: 'Comprehensive information' },
  },
  {
    href: 'https://www.poelab.com/',
    iconKey: 'icon-poe-labyrinth',
    title: { ko: 'POE LAB', en: 'POE LAB' },
    description: { ko: '전직 및 미궁 정보', en: 'Ascendancy and Labyrinth info' },
  },
  {
    href: 'https://www.poeplanner.com/',
    iconKey: 'icon-poe-planner',
    title: { ko: 'POE PLANNER', en: 'POE PLANNER' },
    description: { ko: '각종 스킬트리 설계 도구', en: 'Various skill tree planner' },
  },
  {
    href: 'https://www.maxroll.gg/poe/',
    iconKey: 'icon-poe-maxroll',
    title: { ko: 'MAXROLL', en: 'MAXROLL' },
    description: { ko: '빌드 가이드 및 각종 공략', en: 'Build guides and strategies' },
  },
  {
    href: 'https://www.filterblade.xyz/',
    iconKey: 'icon-poe-filterblade',
    title: { ko: 'FILTERBLADE', en: 'FILTERBLADE' },
    description: { ko: '아이템필터 커스터마이징', en: 'Item filter customization' },
  },
  {
    href: 'https://pathofbuilding.community/',
    iconKey: 'icon-poe-pob',
    title: { ko: 'Path of Building', en: 'Path of Building' },
    description: { ko: '강력한 빌드 시뮬레이터', en: 'Powerful build simulator' },
  },
  {
    href: 'https://www.craftofexile.com/',
    iconKey: 'icon-poe-craftofexile',
    title: { ko: 'Craft of Exile', en: 'Craft of Exile' },
    description: { ko: '크래프팅 시뮬레이터', en: 'Crafting simulator' },
  },
];

const Poe1FansiteLinks = ({ lang }) => {
  const [iconUrls, setIconUrls] = useState({});

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch('/wp-json/asura/v1/ui-icons');

        if (!response.ok) {
          throw new Error(`Network response was not ok for icons at /wp-json/asura/v1/ui-icons`);
        }
        const data = await response.json();
        setIconUrls(data);
      } catch (error) {
        console.error("Failed to fetch icon URLs:", error);
      }
    };
    fetchIcons();
  }, []);


  return (
    <div className="guide-list-main-container">
      <Breadcrumbs lang={lang} />
      <section className="section">
        <h1>
          {lang === 'ko' ? '팬 사이트 링크' : 'Fan Site Links'}
        </h1>
        <div className="card-grid">
          {fansiteLinksData.map((link, index) => (
            <a href={link.href} key={index} className="link-card" target="_blank" rel="noopener noreferrer">
              <div className="card-icon">
                {iconUrls[link.iconKey] && (
                  <img src={iconUrls[link.iconKey]} alt={link.title.en} />
                )}
              </div>
              <div className="card-body">
                <div className="card-title">{link.title[lang]}</div>
                <div className="card-desc">{link.description[lang]}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};


export default Poe1FansiteLinks;