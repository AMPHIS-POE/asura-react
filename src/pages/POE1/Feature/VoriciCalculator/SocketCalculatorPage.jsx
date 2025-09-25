// src/pages/POE1/Feature/VoriciCalculator/SocketCalculatorPage.jsx
import React, { useState } from 'react';
import NewCalculator from './NewCalculator';
import OldCalculator from './OldCalculator';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import './SocketCalculatorPage.css';
import HelpModal from '../../../../components/Modal/HelpModal';
import { helpContent } from './HelpContent';


const SocketCalculatorPage = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('old');
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    return (
        <div className="asura-content-container">
            <div className="vorici-wrapper">
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

                <h1 className="vorici-title">
                    Path of Exile
                    <br />
                    {lang === 'ko' ? '색채 계산기' : 'Chromatic Calculator'}
                </h1>

                <div className="tab-container">
                    <button
                        className={`tab-button ${activeTab === 'old' ? 'active' : ''}`}
                        onClick={() => setActiveTab('old')}
                    >
                        {lang === 'ko' ? '단순 계산' : 'Basic'}
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
                        onClick={() => setActiveTab('new')}
                    >
                        {lang === 'ko' ? '고급 계산' : 'Advanced'}
                    </button>
                </div>

                <div className="calculator-content">
                    {activeTab === 'new' && (
                        <div className="calculator-instance-wrapper">
                            <NewCalculator lang={lang} />
                        </div>
                    )}
                    {activeTab === 'old' && (
                        <div className="calculator-instance-wrapper">
                            <OldCalculator lang={lang} />
                        </div>
                    )}
                </div>
            </div>

            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
                lang={lang}
                contentSource={helpContent}

            />
        </div>
    );
};

export default SocketCalculatorPage;
