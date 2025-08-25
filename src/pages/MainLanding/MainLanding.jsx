import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainLanding.css';

function MainLanding() {
  const [iconUrls, setIconUrls] = useState({});

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/wp-json/asura/v1/ui-icons`);
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

  return (
    <div className="section active" id="asura-main-landing">
      <div className="content-grid">
        <div className="left-column">
          <div className="content-box info-box">
            <h3 data-lang="ko">아수라(Asura)란?</h3>
            <h3 data-lang="en">What is Asura?</h3>
            <p data-lang="ko">레이클라스트와 유배자를 위한 공간입니다</p>
            <p data-lang="en">Place for Wraeclast and Exile</p>
          </div>
          <div className="content-box cat-box">
            <h3 data-lang="ko">이 고양이는 뭔가요?</h3>
            <h3 data-lang="en">What is this cat?</h3>
            {iconUrls.james_cat && <img src={iconUrls.james_cat} alt="A cute cat" />}
            <p data-lang="ko">제 고양이니까 보세요</p>
            <p data-lang="en">It's my cat, Just look at him</p>
          </div>
        </div>
        <div className="content-box selection-box">
          <h2 data-lang="ko">게임을 선택하세요</h2>
          <h2 data-lang="en">Select Your Game</h2>

          <div className="game-buttons">
            <Link to="/poe1" className="game-link">
              {iconUrls['poe1_logo'] && <img src={iconUrls['poe1_logo']} alt="Path of Exile 1" />}
            </Link>
            <Link to="/poe2" className="game-link">
              {iconUrls['poe2_logo'] && <img src={iconUrls['poe2_logo']} alt="Path of Exile 2" />}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MainLanding;