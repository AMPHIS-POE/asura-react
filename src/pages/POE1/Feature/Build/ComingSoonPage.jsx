import React from 'react';
import './ComingSoonPage.css';

const translations = {
  ko: {
    title: '페이지 준비 중',
    message: '현재 페이지를 개발하고 있습니다. 곧 멋진 기능으로 찾아뵙겠습니다!'
  },
  en: {
    title: 'Page Under Construction',
    message: 'This page is currently under development. We will be back soon with great features!'
  }
};

const ComingSoonPage = ({ lang }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className="coming-soon-container">
      <h1>{t.title}</h1>
      <p>{t.message}</p>
    </div>
  );
};

export default ComingSoonPage;