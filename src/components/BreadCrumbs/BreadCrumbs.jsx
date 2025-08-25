import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BreadCrumbs.css';

const breadcrumbNameMap = {
    ko: {
        'home': '홈',
        'poe1': 'Path of Exile 1',
        'links': '팬 사이트 링크',
        'map': '17티어 지도 계산기',
        'vorici': '색채 계산기',
        'regex': '정규식 생성기',
        'poe2': 'Path of Exile 2',
        'act-guide': '캠페인 스피드런 네비게이터',
        'beginner-guides': '초보자 가이드',
        'content-guides': '콘텐츠 가이드',
    },
    en: {
        'home': 'Home',
        'poe1': 'Path of Exile 1',
        'links': 'Fan Site Links',
        'map': 'T17 Map Calculator',
        'vorici': 'Chromatic Calculator',
        'regex': 'Regex Generator',
        'poe2': 'Path of Exile 2',
        'act-guide': 'Campaign Speedrun Navigator',
        'beginner-guides': 'Beginner Guides',
        'content-guides': 'Content Guides',
    }
};

const guideTypeToListSlugMap = {
    'beginner_guide': 'beginner-guides',
    'content_guide': 'content-guides',
};

const Breadcrumbs = ({ lang = 'ko', currentPageTitle }) => {
    const location = useLocation();
    const t = breadcrumbNameMap[lang] || breadcrumbNameMap.en;
    
    const queryParams = new URLSearchParams(location.search);
    const postType = queryParams.get('type');
    
    let pathnames = location.pathname.split('/').filter(x => x);

    if (postType && guideTypeToListSlugMap[postType]) {
        pathnames = pathnames.map(p => p === 'guides' ? guideTypeToListSlugMap[postType] : p);
    }
    
    let crumbs = [<Link key="home" to="/">{t['home']}</Link>];

    pathnames.forEach((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = t[value] || value.replace(/-/g, ' ');

        crumbs.push(<span key={`separator-${index}`} className="separator"> &gt; </span>);

        if (isLast) {
            const finalDisplayName = currentPageTitle || displayName;
            crumbs.push(<span key={to} className="current-page">{finalDisplayName}</span>);
        } else {
            crumbs.push(<Link key={to} to={to}>{displayName}</Link>);
        }
    });

    return (
        <nav className="breadcrumbs-nav" aria-label="breadcrumb">
            {crumbs}
        </nav>
    );
};

export default Breadcrumbs;