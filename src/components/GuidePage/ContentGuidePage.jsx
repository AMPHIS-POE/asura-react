import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { useLoading } from '../../Context/LoadingContext';
import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import AuthorCard from '../../components/AuthorCard/AuthorCard';
import ItemTooltip from '../../components/ItemToolTip/ItemToolTip';
import './ContentGuidePage.css';

const ContentGuidePage = ({ lang }) => {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoading();
    const [post, setPost] = useState(null);
    const [enrichedItems, setEnrichedItems] = useState([]);
    const [tocItems, setTocItems] = useState([]);
    const [activeTocId, setActiveTocId] = useState('');
    const [error, setError] = useState(null);
    const [glossaryData, setGlossaryData] = useState({});
    const contentRef = useRef(null);
    const isFirstLoad = useRef(true);

    const translations = {
        ko: { tocTitle: '목차' },
        en: { tocTitle: 'Table of Contents' }
    };
    const t = translations[lang] || translations.en;

    useEffect(() => {
        const fetchGlossary = async () => {
            try {
                const response = await fetch(`/wp-json/wp/v2/glossary?lang=${lang}&per_page=100`);
                if (!response.ok) throw new Error('용어 사전 데이터 로딩 실패');
                const glossaryItems = await response.json();
                const glossaryMap = glossaryItems.reduce((acc, item) => {
                    acc[item.slug] = {
                        title: item.title.rendered,
                        content: item.content.rendered
                    };
                    return acc;
                }, {});
                setGlossaryData(glossaryMap);
            } catch (e) {
                console.error(e);
            }
        };
        fetchGlossary();
    }, [lang]);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            showLoader();
            setError(null);
            setPost(null);
            setTocItems([]);
            const queryParams = new URLSearchParams(location.search);
            const postType = queryParams.get('type') || 'content_guide';
            try {
                const response = await fetch(`/wp-json/wp/v2/${postType}?slug=${slug}&lang=${lang}&_embed`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch the guide.');
                }
                const data = await response.json();
                if (data.length === 0) {
                    throw new Error('Guide not found.');
                }
                const fetchedPost = data[0];
                const content = fetchedPost.content.rendered;
                const domParser = new DOMParser();
                const doc = domParser.parseFromString(content, 'text/html');
                const headings = doc.querySelectorAll('h2');
                const newTocItems = [];
                headings.forEach((heading, index) => {
                    const id = `section-${index}`;
                    heading.setAttribute('id', id);
                    newTocItems.push({ id, title: heading.textContent, level: 2 });
                });
                fetchedPost.content.rendered = doc.body.innerHTML;
                setPost(fetchedPost);
                setTocItems(newTocItems);
                if (newTocItems.length > 0) {
                    setActiveTocId(newTocItems[0].id);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                hideLoader();
                isFirstLoad.current = false;
            }
        };
        fetchPost();
    }, [slug, lang, location.search, showLoader, hideLoader]);

    useEffect(() => {
        const fetchEnrichedItems = async () => {
            if (!post || !post.acf || !post.acf.global_item_field || post.acf.global_item_field.length === 0) {
                setEnrichedItems([]);
                return;
            }
            const itemIds = post.acf.global_item_field.map(row => row.linked_item.ID);
            if (itemIds.length === 0) return;
            try {
                const response = await fetch(`/wp-json/wp/v2/item?lang=${lang}&include=${itemIds.join(',')}&per_page=100&_embed`);
                if (!response.ok) throw new Error('Failed to fetch item details');
                const itemsData = await response.json();
                const processedItems = itemsData.map(item => {
                    const finalItem = { ...item };
                    if (item._embedded && item._embedded['wp:term']) {
                        item._embedded['wp:term'].forEach(taxonomyList => {
                            if (taxonomyList.length > 0) {
                                finalItem[taxonomyList[0].taxonomy] = taxonomyList;
                            }
                        });
                    }
                    return finalItem;
                });
                const itemMap = new Map(processedItems.map(item => [item.id, item]));
                const sortedItems = itemIds.map(id => itemMap.get(id)).filter(Boolean);
                setEnrichedItems(sortedItems);
            } catch (e) {
                console.error("Error fetching item details:", e);
                setEnrichedItems([]);
            }
        };
        fetchEnrichedItems();
    }, [post, lang]);

    useEffect(() => {
        if (isFirstLoad.current || !post || !post.pll_translations) {
            return;
        }
        const currentLangOnPost = post.lang;
        const targetLang = lang;
        if (currentLangOnPost !== targetLang) {
            const translatedPostId = post.pll_translations[targetLang];
            if (translatedPostId) {
                const queryParams = new URLSearchParams(location.search);
                const postType = queryParams.get('type') || 'content_guide';
                const fetchTranslatedSlugAndNavigate = async () => {
                    try {
                        const response = await fetch(`/wp-json/wp/v2/${postType}/${translatedPostId}`);
                        const translatedPost = await response.json();
                        if (translatedPost.slug) {
                            navigate(`/poe2/guides/${translatedPost.slug}?type=${postType}`);
                        }
                    } catch (e) {
                        console.error("Failed to fetch translated slug and navigate", e);
                    }
                };
                fetchTranslatedSlugAndNavigate();
            }
        }
    }, [lang, post, navigate, location.search]);

    useEffect(() => {
        const handleScroll = () => {
            let currentActiveId = '';
            tocItems.forEach(item => {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 120) {
                        currentActiveId = item.id;
                    }
                }
            });
            if (currentActiveId) {
                setActiveTocId(currentActiveId);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tocItems]);

    const handleTocClick = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const renderContentWithItems = (content, items) => {
        if (!content || !items) return parse(content || '');
        let itemIndex = 0;
        const options = {
            replace: domNode => {
                if (domNode.type === 'text' && domNode.data.includes('#ITEM#')) {
                    const parts = domNode.data.split(/(#ITEM#)/g);
                    return <>{parts.map((part, index) => {
                        if (part === '#ITEM#' && itemIndex < items.length) {
                            const item = items[itemIndex++];
                            return item ? <ItemTooltip key={`${item.id}-${index}`} item={item} glossaryData={glossaryData} currentLang={lang} /> : '#ITEM#';
                        }
                        return part;
                    })}</>;
                }
                if (domNode.name === 'h2' && domNode.attribs.id) {
                    return <h2 id={domNode.attribs.id}>{domNode.children.map(child => child.data || '').join('')}</h2>;
                }
            }
        };
        return parse(content, options);
    };

    if (error) return <div className="guide-detail-container error-message">Error: {error}</div>;
    if (!post) return null;

    const authorData = post?._embedded?.author?.[0];
    const guideTags = post?._embedded?.['wp:term']?.flat().filter(term => term.taxonomy === 'guide_tag');

    return (
        <div className="guide-detail-container">
            <Breadcrumbs lang={lang} currentPageTitle={post?.title.rendered} />
            <div className="guide-main-layout">
                <aside className="guide-sidebar">
                    {authorData && <AuthorCard author={authorData} lang={lang} />}
                    <div className="table-of-contents">
                        <h3>{t.tocTitle}</h3>
                        <ul>
                            {tocItems.map(item => (
                                <li key={item.id} className={item.id === activeTocId ? 'active' : ''}>
                                    <a href={`#${item.id}`} onClick={(e) => handleTocClick(e, item.id)}>
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
                <main className="guide-content" ref={contentRef}>
                    <div className="guide-header">
                        <h1 className="guide-title">{parse(post.title.rendered)}</h1>
                        <div className="guide-meta-bar">
                            <div className="guide-tags">
                                {guideTags && guideTags.map(tag => (
                                    <span
                                        key={tag.id}
                                        className="guide-tag"
                                        style={tag.acf && tag.acf.tag_color ? { backgroundColor: tag.acf.tag_color } : {}}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                            <div className="guide-meta">
                                {lang === 'ko' ? '최종 업데이트:' : 'Last Updated:'}
                                {new Date(post.modified).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                    {renderContentWithItems(post.content.rendered, enrichedItems)}
                </main>
            </div>
        </div>
    );
};

export default ContentGuidePage;