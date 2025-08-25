import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import parse from 'html-react-parser';
import './ItemTooltip.css';
import SecondaryTooltip from './SecondaryTooltip';

const ItemTooltip = ({ item, glossaryData, currentLang = 'ko' }) => {
    if (!item || !item.acf) return null;

    const [isVisible, setIsVisible] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef(null);
    const popupRef = useRef(null);

    const [secondaryTooltipData, setSecondaryTooltipData] = useState(null);
    const [secondaryTooltipPosition, setSecondaryTooltipPosition] = useState({ x: 0, y: 0 });
    const [isSecondaryTooltipVisible, setIsSecondaryTooltipVisible] = useState(false);

    const handleKeywordMouseEnter = (e, keywordId) => {
        if (glossaryData && glossaryData[keywordId]) {
            const data = glossaryData[keywordId];
            setSecondaryTooltipData(data);
            setSecondaryTooltipPosition({ x: e.clientX, y: e.clientY - 15 });
            setIsSecondaryTooltipVisible(true);
        }
    };

    const handleKeywordMouseLeave = () => {
        setIsSecondaryTooltipVisible(false);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isVisible && event.key === 'Alt') {
                event.preventDefault();
                setIsPinned(prev => !prev);
            }
        };
        const handleMouseDown = (event) => {
            if (isPinned && popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPinned(false);
            }
            if (isSecondaryTooltipVisible) {
                setIsSecondaryTooltipVisible(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, [isVisible, isPinned, isSecondaryTooltipVisible]);

    const handleMouseEnter = () => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setPosition({ top: rect.top - 10, left: rect.left + rect.width / 2 });
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    const PropertyRenderer = ({ textContent, defaultStyle }) => {
        if (!textContent) return null;

        const tooltipRegex = /\{\{([^|]+)\|([^}]+)\}\}/gi;
        const colorRegex = /(`.*?`)/g;

        const parseTooltipsInPart = (part, partKey) => {
            const elements = [];
            let lastIndex = 0;
            let match;

            const localTooltipRegex = new RegExp(tooltipRegex);

            while ((match = localTooltipRegex.exec(part)) !== null) {
                if (match.index > lastIndex) {
                    elements.push(part.substring(lastIndex, match.index));
                }
                const keywordId = match[1];
                const keywordText = match[2];
                elements.push(
                    <span
                        key={`${partKey}-t-${elements.length}`}
                        className="keyword-link"
                        onMouseEnter={(e) => handleKeywordMouseEnter(e, keywordId)}
                        onMouseLeave={handleKeywordMouseLeave}
                    >
                        {keywordText}
                    </span>
                );
                lastIndex = localTooltipRegex.lastIndex;
            }
            if (lastIndex < part.length) {
                elements.push(part.substring(lastIndex));
            }
            return elements;
        };

        const lines = textContent.split('\n');

        return lines.map((line, lineIndex) => {
            const parts = line.split(colorRegex).filter(Boolean);

            return (
                <p key={lineIndex} className={`stat--line stat--${defaultStyle || 'gg'}`}>
                    {parts.map((part, partIndex) => {
                        const partKey = `l${lineIndex}-p${partIndex}`;

                        if (part.startsWith('`') && part.endsWith('`')) {
                            const cleanedPart = part.slice(1, -1);
                            const [colorCode, ...textParts] = cleanedPart.split(':');
                            const text = textParts.join(':').trim();

                            if (colorCode && text) {
                                return (
                                    <span key={partKey} className={`stat--${colorCode}`}>
                                        {parseTooltipsInPart(text, partKey)}
                                    </span>
                                );
                            }
                        }

                        return parseTooltipsInPart(part, partKey);
                    })}
                </p>
            );
        });
    };

    const itemRarityInfo = item.item_rarity && item.item_rarity.length > 0 ? item.item_rarity[0] : null;
    const rawSlug = itemRarityInfo ? itemRarityInfo.slug : 'normal';
    const itemRaritySlug = rawSlug.replace(/-ko$|-en$/, '');
    const leftImgUrl = itemRarityInfo?.acf?.header_left_image?.url;
    const middleImgUrl = itemRarityInfo?.acf?.header_middle_image?.url;
    const rightImgUrl = itemRarityInfo?.acf?.header_right_image?.url;
    const headerHeight = itemRarityInfo?.acf?.header_height;
    const dividerImgUrl = itemRarityInfo?.acf?.divider?.url;

    const headerDynamicStyles = {
        '--header-left-image': leftImgUrl ? `url(${leftImgUrl})` : 'none',
        '--header-bg-image': middleImgUrl ? `url(${middleImgUrl})` : 'none',
        '--header-right-image': rightImgUrl ? `url(${rightImgUrl})` : 'none',
        '--header-height': headerHeight ? `${headerHeight}px` : '40px',
    };

    const allFields = [
        { id: 'base_properties', textContent: item.acf.base_properties, defaultStyle: item.acf.base_properties_style },
        { id: 'requirements', textContent: item.acf.requirements, defaultStyle: item.acf.requirements_style },
        { id: 'implicit_mods', textContent: item.acf.implicit_mods, defaultStyle: item.acf.implicit_mods_style },
        { id: 'explicit_mods', textContent: item.acf.explicit_mods, defaultStyle: item.acf.explicit_mods_style },
        { id: 'flavor_text', textContent: item.acf.flavor_text, defaultStyle: item.acf.flavor_text_style }
    ];

    const visibleFields = allFields.filter(field => field.textContent && field.textContent.trim() !== '');

    const pinInfoTranslations = {
        ko: {
            pin: "[Alt] 키를 눌러 고정",
            unpin: "[Alt] 키를 눌러 고정 해제"
        },
        en: {
            pin: "Press [Alt] to pin",
            unpin: "Press [Alt] to unpin"
        }
    };

    const TooltipPopup = (
        <div
            ref={popupRef}
            className={`item-tooltip-popup rarity-${itemRaritySlug}`}
            style={{ display: (isVisible || isPinned) ? 'block' : 'none', position: 'fixed', top: position.top, left: position.left, transform: 'translate(-50%, -100%)', bottom: 'auto', opacity: 1 }}
        >
            <div className="tooltip-header" style={headerDynamicStyles}>
                <h3 className="tooltip-title">{parse(item.title.rendered)}</h3>
            </div>
            <div className="tooltip-body">
                {visibleFields.map((field, index) => {
                    const showDivider = index > 0;
                    return (
                        <React.Fragment key={field.id}>
                            {showDivider && dividerImgUrl && (
                                <div
                                    className="tooltip-divider"
                                    style={{ backgroundImage: `url(${dividerImgUrl})` }}
                                ></div>
                            )}
                            <div className="tooltip-property-block" data-field-type={field.id}>
                                <PropertyRenderer textContent={field.textContent} defaultStyle={field.defaultStyle || 'ww'} />
                            </div>
                        </React.Fragment>
                    );
                })}
                <div className="tooltip-pin-info">
                    {isPinned
                        ? pinInfoTranslations[currentLang]?.unpin
                        : pinInfoTranslations[currentLang]?.pin
                    }
                </div>
            </div>
        </div>
    );

    return (
        <>
            <span
                className={`item-tooltip-wrapper rarity-${itemRaritySlug}`}
                ref={wrapperRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img src={item.acf?.item_icon?.url} alt={item.title.rendered || '아이템 아이콘'} className="item-icon-inline" />
                <span>{parse(item.title.rendered)}</span>
                {ReactDOM.createPortal(TooltipPopup, document.body)}
            </span>
            <SecondaryTooltip
                data={secondaryTooltipData}
                position={secondaryTooltipPosition}
                isVisible={isSecondaryTooltipVisible}
            />
        </>
    );
};

export default ItemTooltip;