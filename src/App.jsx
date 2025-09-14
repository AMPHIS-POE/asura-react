import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingProvider, useLoading } from './Context/LoadingContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MainLanding from './pages/MainLanding/MainLanding';
import Poe1Landing from './pages/POE1/Poe1Landing';
import Poe2Landing from './pages/POE2/Poe2Landing';
import ContentGuidePage from './components/GuidePage/ContentGuidePage';
import BackToTopButton from './components/BackToTopButton';
import BaseItemTester from './pages/POE1/Feature/Build/BaseItemTester.jsx';
import './App.css';

const LoadingSpinner = () => {
  const { isLoading } = useLoading();
  return (
    <div id="loading-overlay" className={isLoading ? 'visible' : ''}>
      <div className="loading-spinner"></div>
    </div>
  );
};

function AppContent() {
  const [lang, setLang] = useState('ko');

  return (
    <BrowserRouter>
      <div className="app-container" data-lang={lang}>
        <Header lang={lang} setLang={setLang} />
        <main className="site-content">
          <Routes>
            <Route path="/" element={<MainLanding />} />
            <Route path="/poe1/*" element={<Poe1Landing lang={lang} />} />
            <Route path="/poe2/*" element={<Poe2Landing lang={lang} />} />
            <Route path="/poe1/guides/:slug" element={<ContentGuidePage lang={lang} />} />
            <Route path="/poe2/guides/:slug" element={<ContentGuidePage lang={lang} />} />
            <Route path="/poe1/build" element={<BaseItemTester />} />

          </Routes>
        </main>
        <Footer lang={lang} />
        <BackToTopButton />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <LoadingProvider>
      <LoadingSpinner />
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
