// src/pages/POE1/Feature/RegexGenerator/RegexGeneratorPage.jsx
import React, { useState } from 'react';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import HelpModal from '../../../../components/Modal/HelpModal';
import RegexGenerator from './RegexGenerator';
import './RegexGeneratorPage.css';
import VendorRegexGenerator from './VendorRegexGenerator';


const RegexGeneratorPage = ({ lang = 'ko' }) => {
    const [activeTab, setActiveTab] = useState('map');
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    return (
        <div className="asura-content-container regex-page">
            <button
                className="help-button"
                onClick={() => setIsHelpModalOpen(true)}
                type="button"
            >
                <span>{lang === 'ko' ? '가이드' : 'Guide'}</span>
                <img
                    src="https://asura.design/wp-content/uploads/2025/09/exclamation.png"
                    alt="Guide"
                />
            </button>

            <Breadcrumbs lang={lang} />

            <div className="rgx-header">
                <h1 className="rgx-title">
                    Path of Exile
                    <br />
                    {lang === 'ko' ? '정규식 생성기' : 'Regex Generator'}
                </h1>
            </div>

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

            <div className="rgx-content">
                {activeTab === 'map' && (
                    <div className="rgx-section">
                        <RegexGenerator lang={lang} embedded />
                    </div>
                )}
                {activeTab === 'vendor' && (
                    <div className="rgx-section">
                        <VendorRegexGenerator lang={lang} />
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
