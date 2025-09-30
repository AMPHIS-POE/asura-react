import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import parse from 'html-react-parser';
import './ItemToolTip.css';
import SecondaryTooltip from './SecondaryTooltip';

const ItemTooltip = ({
  item,
  glossaryData,
  currentLang = 'ko',
  rarityStyle,
  raritySlug: rSlug,
  children
}) => {
  const hasItem = !!item;
  const hasAcf = !!item?.acf;

  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const wrapperRef = useRef(null);
  const popupRef = useRef(null);

  const [secondaryTooltipData, setSecondaryTooltipData] = useState(null);
  const [secondaryTooltipPosition, setSecondaryTooltipPosition] = useState({ x: 0, y: 0 });
  const [isSecondaryTooltipVisible, setIsSecondaryTooltipVisible] = useState(false);

  const normalizedRarityAcf = useMemo(() => {
    if (!rarityStyle) return null;
    return rarityStyle?.acf ? rarityStyle.acf : rarityStyle;
  }, [rarityStyle]);

  const itemRarityFromItemRarity = useMemo(() => {
    return Array.isArray(item?.item_rarity) && item.item_rarity.length > 0
      ? (item.item_rarity[0] || null)
      : null;
  }, [item]);

  const itemRarityFromEmbedded = useMemo(() => {
    const groups = item?._embedded?.['wp:term'] || [];
    for (const g of groups) {
      for (const t of (g || [])) {
        if (t?.taxonomy === 'item_rarity') return t;
      }
    }
    return null;
  }, [item]);

  const raritySlug = useMemo(() => {
    const raw =
      rSlug ||
      itemRarityFromEmbedded?.slug ||
      itemRarityFromItemRarity?.slug ||
      'normal';
    return (raw || 'normal').replace(/-ko$|-en$/, '');
  }, [rSlug, itemRarityFromEmbedded, itemRarityFromItemRarity]);

  const {
    headerLeftUrl,
    headerMidUrl,
    headerRightUrl,
    dividerUrl,
    headerHeightPx
  } = useMemo(() => {
    const leftB   = normalizedRarityAcf?.header_left_image || null;
    const midB    = normalizedRarityAcf?.header_middle_image || null;
    const rightB  = normalizedRarityAcf?.header_right_image || null;
    const divB    = normalizedRarityAcf?.divider || null;
    const heightB = normalizedRarityAcf?.header_height || null;

    const acfA    = itemRarityFromItemRarity?.acf || null;
    const leftA   = acfA?.header_left_image?.url || null;
    const midA    = acfA?.header_middle_image?.url || null;
    const rightA  = acfA?.header_right_image?.url || null;
    const divA    = acfA?.divider?.url || null;
    const heightA = acfA?.header_height || null;

    return {
      headerLeftUrl:  leftB  ?? leftA,
      headerMidUrl:   midB   ?? midA,
      headerRightUrl: rightB ?? rightA,
      dividerUrl:     divB   ?? divA,
      headerHeightPx: (heightB ?? heightA) ? `${heightB ?? heightA}px` : '40px',
    };
  }, [normalizedRarityAcf, itemRarityFromItemRarity]);

  const iconUrl = useMemo(() => {
    const u = (v) => {
      if (!v) return null;
      if (typeof v === 'string') return v;
      if (typeof v === 'object') return v.url || null;
      return null;
    };
    const acfIcon =
      u(item?.acf?.item_icon) ||
      u(item?.acf?.inventory_icon) ||
      null;

    const featured =
      item?._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      null;

    const featured2 = item?.featured_media_url || null;

    return acfIcon || featured || featured2 || null;
  }, [item]);

  const handleKeywordMouseEnter = (e, keywordId) => {
    if (glossaryData && glossaryData[keywordId]) {
      setSecondaryTooltipData(glossaryData[keywordId]);
      setSecondaryTooltipPosition({ x: e.clientX, y: e.clientY - 15 });
      setIsSecondaryTooltipVisible(true);
    }
  };
  const handleKeywordMouseLeave = () => setIsSecondaryTooltipVisible(false);

  useEffect(() => {
    const onKey = (e) => {
      if (isVisible && e.key === 'Alt') {
        e.preventDefault();
        setIsPinned((v) => !v);
      }
    };
    const onDown = (e) => {
      if (isPinned && popupRef.current && !popupRef.current.contains(e.target)) setIsPinned(false);
      if (isSecondaryTooltipVisible) setIsSecondaryTooltipVisible(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [isVisible, isPinned, isSecondaryTooltipVisible]);

  const handleMouseEnter = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition({ top: rect.top - 10, left: rect.left + rect.width / 2 });
      setIsVisible(true);
    }
  };
  const handleMouseLeave = () => setIsVisible(false);

  const PropertyRenderer = ({ textContent, defaultStyle }) => {
    if (!textContent || typeof textContent !== 'string') return null;

    const tooltipRegex = /\{\{([^|]+)\|([^}]+)\}\}/gi;
    const colorRegex = /(`.*?`)/g;

    const parseTooltipsInPart = (part, partKey) => {
      const elements = [];
      let lastIndex = 0;
      let match;
      const localTooltipRegex = new RegExp(tooltipRegex);
      while ((match = localTooltipRegex.exec(part)) !== null) {
        if (match.index > lastIndex) elements.push(part.substring(lastIndex, match.index));
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
      if (lastIndex < part.length) elements.push(part.substring(lastIndex));
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
              const cleaned = part.slice(1, -1);
              const [colorCode, ...textParts] = cleaned.split(':');
              const text = textParts.join(':').trim();
              if (colorCode && text) {
                return <span key={partKey} className={`stat--${colorCode}`}>{parseTooltipsInPart(text, partKey)}</span>;
              }
            }
            return parseTooltipsInPart(part, partKey);
          })}
        </p>
      );
    });
  };

  const allFields = useMemo(() => (hasAcf ? [
    { id: 'base_properties', textContent: item.acf.base_properties,  defaultStyle: item.acf.base_properties_style },
    { id: 'requirements',    textContent: item.acf.requirements,     defaultStyle: item.acf.requirements_style },
    { id: 'implicit_mods',   textContent: item.acf.implicit_mods,    defaultStyle: item.acf.implicit_mods_style },
    { id: 'explicit_mods',   textContent: item.acf.explicit_mods,    defaultStyle: item.acf.explicit_mods_style },
    { id: 'flavor_text',     textContent: item.acf.flavor_text,      defaultStyle: item.acf.flavor_text_style },
  ] : []), [hasAcf, item?.acf]);

  const visibleFields = useMemo(
    () => allFields.filter(f => typeof f.textContent === 'string' && f.textContent.trim() !== ''),
    [allFields]
  );

  const pinInfo = {
    ko: { pin: '[Alt] 키를 눌러 고정', unpin: '[Alt] 키를 눌러 고정 해제' },
    en: { pin: 'Press [Alt] to pin',   unpin: 'Press [Alt] to unpin' }
  };

  const TooltipPopup = hasItem ? (
    <div
      ref={popupRef}
      className={`item-tooltip-popup rarity-${raritySlug}`}
      style={{
        display: (isVisible || isPinned) ? 'block' : 'none',
        position: 'fixed',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="tooltip-header" style={{
        '--header-left-image':  headerLeftUrl  ? `url(${headerLeftUrl})`   : 'none',
        '--header-bg-image':    headerMidUrl   ? `url(${headerMidUrl})`    : 'none',
        '--header-right-image': headerRightUrl ? `url(${headerRightUrl})`  : 'none',
        '--header-height':      headerHeightPx,
      }}>
        <h3 className="tooltip-title">
          {parse((hasAcf && item.acf?.tooltip_display_title) || item?.title?.rendered || '')}
        </h3>
      </div>

      <div className="tooltip-body">
        {visibleFields.map((field, index) => {
          const showDivider = index > 0 && !!dividerUrl;
          return (
            <React.Fragment key={field.id}>
              {showDivider && (
                <div className="tooltip-divider" style={{ backgroundImage: `url(${dividerUrl})` }} />
              )}
              <div className="tooltip-property-block" data-field-type={field.id}>
                <PropertyRenderer textContent={field.textContent} defaultStyle={field.defaultStyle || 'ww'} />
              </div>
            </React.Fragment>
          );
        })}
        <div className="tooltip-pin-info">
          {isPinned ? pinInfo[currentLang]?.unpin : pinInfo[currentLang]?.pin}
        </div>
      </div>
    </div>
  ) : null;

  const TriggerContent = children ? (
    <span className="item-tooltip-trigger">
      {iconUrl && (
        <img
          src={iconUrl}
          alt={item?.title?.rendered || '아이템 아이콘'}
          className="item-icon-inline"
          style={{ verticalAlign: 'middle', marginRight: 6 }}
        />
      )}
      <span>{children}</span>
    </span>
  ) : (
    <>
      {iconUrl && (
        <img
          src={iconUrl}
          alt={item?.title?.rendered || '아이템 아이콘'}
          className="item-icon-inline"
        />
      )}
      <span>{parse((hasAcf && item.acf?.tooltip_display_title) || item?.title?.rendered || '')}</span>
    </>
  );

  return (
    <>
      <span
        className={`item-tooltip-wrapper rarity-${raritySlug}`}
        ref={wrapperRef}
        onMouseEnter={hasItem ? handleMouseEnter : undefined}
        onMouseLeave={hasItem ? handleMouseLeave : undefined}
      >
        {TriggerContent}
        {TooltipPopup && ReactDOM.createPortal(TooltipPopup, document.body)}
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
