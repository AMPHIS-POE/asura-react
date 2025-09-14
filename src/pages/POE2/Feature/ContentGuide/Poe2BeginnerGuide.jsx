import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '../../../../Context/LoadingContext';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import './ContentGuide.css';

const Poe2BeginnerGuide = ({ lang }) => {
    const { isLoading, showLoader, hideLoader } = useLoading();
    const [guides, setGuides] = useState([]);
    const [error, setError] = useState(null);

    const translations = {
        ko: {
            title: 'Path of Exile 2\n초보자 가이드'
        },
        en: {
            title: 'Path of Exile 2\nBeginner Guides'
        }
    };
    const t = translations[lang] || translations.en;

    useEffect(() => {
        const fetchGuides = async () => {
            showLoader();
            setError(null);
            setGuides([]);
            try {
                const response = await fetch(`/wp-json/wp/v2/beginner_guide?lang=${lang}&_embed`); if (!response.ok) {
                    throw new Error('Failed to fetch guides.');
                }
                const data = await response.json();
                const filteredGuides = data.filter(guide => guide.lang === lang);
                setGuides(filteredGuides);
            } catch (err) {
                setError(err.message);
            } finally {
                hideLoader();
            }
        };
        fetchGuides();
    }, [lang, showLoader, hideLoader]);

    if (error) return <div className="guide-list-main-container error-message">Error: {error}</div>;

    return (
        <div className="guide-list-main-container">
            <Breadcrumbs lang={lang} />
            <div className="guides-list-container-poe2">
                <h1 className="guides-list-title-poe2">{t.title}</h1>
                <div className="guides-grid-poe2">
                    {!isLoading && guides.length > 0 && (
                        guides.map(guide => {
                            const imageUrl = guide._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                            return (
                                <Link
                                    to={`/poe2/guides/${guide.slug}?type=beginner_guide`}
                                    key={guide.id}
                                    className="guide-card-poe2"
                                    style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
                                >
                                    <div className="guide-card-content-poe2">
                                        <h2 className="guide-card-title-poe2">{guide.title.rendered}</h2>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                    {!isLoading && guides.length === 0 && (
                        <p>아직 작성된 가이드가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Poe2BeginnerGuide;