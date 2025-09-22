// src/pages/POE1/Feature/RegexGenerator/RegexGenerator.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import './RegexGenerator.css';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import {
  MapModList, avoidModsSorted, includeModsSorted,
  darkRedIds, mediumRedIds, GoldIds,
  rarityMapping, advancedOptionsConfig,
} from './MapMods';

const RegexGenerator = ({ lang, embedded = false }) => {
  const [iconUrls, setIconUrls] = useState({});
  const [ruleGroups, setRuleGroups] = useState([{ id: Date.now(), conditions: [{ type: 'quantity', value: '' }] }]);
  const [excludedMods, setExcludedMods] = useState([]);
  const [includedMods, setIncludedMods] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    'filter-tier16': true, 'filter-tier17': true,
    'filter-rarity-normal': true, 'filter-rarity-magic': true, 'filter-rarity-rare': true,
    'filter-corrupted-yes': false, 'filter-corrupted-no': false,
  });
  const [searches, setSearches] = useState({ searchExclude: '', searchInclude: '' });
  const [openAccordions, setOpenAccordions] = useState({ basic: false, advanced: false });
  const [isCopied, setIsCopied] = useState(false);
  const advancedContentRef = useRef(null), basicContentRef = useRef(null);

  // icons
  useEffect(() => { fetch(`/wp-json/asura/v1/ui-icons`).then(r => r.json()).then(setIconUrls).catch(() => { }); }, []);
  // restore
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('regexGeneratorState'));
      if (saved) {
        setRuleGroups(saved.ruleGroups || [{ id: Date.now(), conditions: [] }]);
        setExcludedMods(saved.excludedMods || []); setIncludedMods(saved.includedMods || []);
        setCheckboxes(saved.checkboxes || {});
      }
    } catch { }
  }, []);
  // persist
  useEffect(() => {
    localStorage.setItem('regexGeneratorState', JSON.stringify({ ruleGroups, excludedMods, includedMods, checkboxes }));
  }, [ruleGroups, excludedMods, includedMods, checkboxes]);
  // accordion height
  useEffect(() => { if (openAccordions.advanced && advancedContentRef.current) advancedContentRef.current.style.maxHeight = `${advancedContentRef.current.scrollHeight}px`; }, [ruleGroups, openAccordions.advanced]);

  // handlers
  const handleCheckboxChange = (id) => setCheckboxes(p => {
    const n = { ...p, [id]: !p[id] };
    if (id === 'filter-corrupted-yes' && n[id]) n['filter-corrupted-no'] = false;
    if (id === 'filter-corrupted-no' && n[id]) n['filter-corrupted-yes'] = false;
    return n;
  });
  const handleModClick = (mod, type) => (type === 'excluded' ? setExcludedMods : setIncludedMods)(
    prev => prev.includes(mod.mod) ? prev.filter(m => m !== mod.mod) : [...prev, mod.mod]
  );
  const handleReset = () => {
    localStorage.removeItem('regexGeneratorState');
    setRuleGroups([{ id: Date.now(), conditions: [{ type: 'quantity', value: '' }] }]);
    setExcludedMods([]); setIncludedMods([]);
    setCheckboxes({
      'filter-tier16': true, 'filter-tier17': true,
      'filter-rarity-normal': true, 'filter-rarity-magic': true, 'filter-rarity-rare': true,
      'filter-corrupted-yes': false, 'filter-corrupted-no': false,
    });
    setSearches({ searchExclude: '', searchInclude: '' });
    setOpenAccordions({ basic: false, advanced: false });
  };

  // number ≥N regex
  const generateMinNumberRegex = (v) => {
    const num = Number(v); if (isNaN(num) || num < 10 || num >= 1000) return '';
    const s = String(num), len = s.length, parts = [];
    for (let i = 0; i < len; i++) {
      const pre = s.substring(0, i), d = parseInt(s[i], 10);
      if (i === len - 1) { parts.push(`${pre}[${d}-9]`); }
      else if (d < 9) parts.push(`${pre}[${d + 1}-9]\\d{${len - 1 - i}}`);
    }
    if (len === 2) parts.push(`\\d{3}`);
    return `(${parts.reverse().join('|')})`;
  };

  // build final regex
  const regexOutput = useMemo(() => {
    const isKo = lang === 'ko', parts = [];
    const getRegexText = (c) => {
      if (!c?.type || !c.value) return null;
      const cfg = advancedOptionsConfig.find(x => x.value === c.type);
      const num = generateMinNumberRegex(c.value);
      return (cfg && num) ? { text: `${isKo ? cfg.korKeyword : cfg.engKeyword}.*${num}%`, cond: c } : null;
    };
    const optimizeAndBuildClause = (conds) => {
      const map = new Map();
      for (const c of conds) if (!map.has(c.type) || Number(c.value) < Number(map.get(c.type).value)) map.set(c.type, c);
      return `"${Array.from(map.values()).map(c => getRegexText(c).text).join('|')}"`;
    };

    const excluded = excludedMods
      .map(t => MapModList.find(m => m.mod === t)?.[isKo ? 'regex' : 'engregex'])
      .filter(Boolean);
    if (excluded.length) parts.push(`"!${excluded.join('|')}"`);

    const included = includedMods
      .map(t => MapModList.find(m => m.mod === t)?.[isKo ? 'regex' : 'engregex'])
      .filter(Boolean).join(' ');
    if (included) parts.push(included);

    const groups = ruleGroups.map(g => g.conditions.map(getRegexText).filter(Boolean)).filter(g => g.length);
    let groupRegex = '';
    if (groups.length === 1) groupRegex = groups[0].map(i => `"${i.text}"`).join(' ');
    else if (groups.length > 1) {
      const ands = groups.filter(g => g.length > 1), ors = groups.filter(g => g.length === 1);
      if (ands.length > 1) groupRegex = isKo
        ? '"POE 검색 엔진의 한계로 인해, 2개 이상의 조건 그룹(AND)을 OR로 연결하는 복합 검색은 생성할 수 없습니다"'
        : '"Due to a limitation of the POE search engine, a complex query connecting more than one AND-group with an OR cannot be created."';
      else if (ands.length === 1) groupRegex = ands[0]
        .map(a => optimizeAndBuildClause([a.cond, ...ors.flat().map(o => o.cond)])).join(' ');
      else groupRegex = optimizeAndBuildClause(groups.flat().map(i => i.cond));
    }
    if (groupRegex) parts.push(groupRegex);

    const checked = rarityMapping.filter(r => checkboxes[r.id]);
    if (checked.length > 0 && checked.length < rarityMapping.length) {
      const v = checked.map(r => isKo ? r.ko : r.en).join('|');
      parts.push(isKo ? `"희귀도: ${v}"` : `"y:(${v})"`);
    }
    if (checkboxes['filter-corrupted-yes'] && !checkboxes['filter-corrupted-no']) parts.push(isKo ? '타락' : 'pte');
    else if (checkboxes['filter-corrupted-no'] && !checkboxes['filter-corrupted-yes']) parts.push(isKo ? '!타락' : '!pte');

    return parts.join(' ').trim();
  }, [excludedMods, includedMods, ruleGroups, checkboxes, lang]);

  const copyToClipboard = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(regexOutput).then(() => { setIsCopied(true); setTimeout(() => setIsCopied(false), 1500); })
      .catch(err => console.error('클립보드 복사 실패:', err));
  };
  const toggleAccordion = (id) => setOpenAccordions(p => ({ ...p, [id]: !p[id] }));
  const addRuleGroup = () => setRuleGroups(p => [...p, { id: Date.now(), conditions: [{ type: 'quantity', value: '' }] }]);
  const deleteRuleGroup = (id) => setRuleGroups(p => p.length > 1 ? p.filter(g => g.id !== id) : p);
  const addCondition = (id) => setRuleGroups(p => p.map(g => g.id === id ? { ...g, conditions: [...g.conditions, { type: 'quantity', value: '' }] } : g));
  const deleteCondition = (id, i) => setRuleGroups(p => p.map(g => g.id === id ? { ...g, conditions: g.conditions.filter((_, x) => x !== i) } : g));
  const updateCondition = (id, i, f, v) => setRuleGroups(p => p.map(g => g.id === id ? { ...g, conditions: g.conditions.map((c, x) => x === i ? { ...c, [f]: v } : c) } : g));

  const ModButton = ({ mod, type }) => {
    const sel = (type === 'excluded' ? excludedMods : includedMods).includes(mod.mod);
    const cls = ['mod-btn']; if (sel) cls.push('selected');
    if (mod.tier17) cls.push('mod-purple'); else if (darkRedIds.includes(mod.No)) cls.push('mod-dark-red'); else if (mediumRedIds.includes(mod.No)) cls.push('mod-medium-red'); else if (GoldIds.includes(mod.No)) cls.push('mod-gold');
    return (
      <button className={cls.join(' ')} onClick={() => handleModClick(mod, type)}>
        <span className="mod-text" dangerouslySetInnerHTML={{ __html: lang === 'ko' ? mod.mod : mod.engMod }} />
        {(mod.currency || mod.scarab || mod.map) && (
          <div className="icon-wrapper">
            {mod.currency && iconUrls.divine && <img src={iconUrls.divine} className="mod-icon" alt="화폐" />}
            {mod.scarab && iconUrls.Horned_Scarab_of_Awakening_inventory_icon &&
              <img src={iconUrls.Horned_Scarab_of_Awakening_inventory_icon} className="mod-icon" alt="갑충석" />}
            {mod.map && iconUrls.summit_map && <img src={iconUrls.summit_map} className="mod-icon" alt="지도" />}
          </div>
        )}
      </button>
    );
  };

  const createSortedModList = (base, selected, search) => {
    const f = base.filter(m =>
    (((checkboxes['filter-tier16'] && !m.tier17) || (checkboxes['filter-tier17'] && m.tier17)) &&
      (lang === 'ko' ? m.mod : m.engMod).toLowerCase().includes(search.toLowerCase())));
    return [...f.filter(m => selected.includes(m.mod)), ...f.filter(m => !selected.includes(m.mod))];
  };
  const filteredAvoidMods = useMemo(() => createSortedModList(avoidModsSorted, excludedMods, searches.searchExclude), [searches.searchExclude, checkboxes, lang, excludedMods]);
  const filteredIncludeMods = useMemo(() => createSortedModList(includeModsSorted, includedMods, searches.searchInclude), [searches.searchInclude, checkboxes, lang, includedMods]);

  const inner = (
    <div className={`rgx-component-wrapper ${embedded ? 'is-embedded' : 'is-standalone'}`}>
      {!embedded && (
        <>
          <Breadcrumbs lang={lang} />
          <h1>{lang === 'ko' ? 'Path of Exile\n정규식 생성기' : 'Path of Exile\nRegex Generator'}</h1>
          <p>{lang === 'ko' ? '맵 모드를 클릭해 정규식을 생성하세요' : 'Click map mods to generate a regex string'}</p>
        </>
      )}

      <div id="regex-fixed-container">
        <textarea id="regexOutputFinal" value={regexOutput} readOnly />
        <div className="regex-output-footer">
          <div id="regex-char-counter-container">
            <span id="regexCharCounter" style={{ color: regexOutput.length > 250 ? '#e53935' : 'inherit' }}>
              {regexOutput.length}/250
            </span>
          </div>
          <div className="regex-buttons-wrapper">
            <button id="copyRegexButton" onClick={copyToClipboard} className={isCopied ? 'copied' : ''}>
              {isCopied ? (lang === 'ko' ? '복사 완료!' : 'Copied!') : (lang === 'ko' ? '복사' : 'Copy')}
            </button>
            <button id="resetRegexButton" onClick={handleReset}>{lang === 'ko' ? '초기화' : 'Reset'}</button>
          </div>
        </div>

        {/* Accordions */}
        <div className="filter-accordions-wrapper">
          {/* Advanced Options */}
          <div className="accordion-container">
            <button className={`accordion-toggle ${openAccordions.advanced ? 'active' : ''}`} onClick={() => toggleAccordion('advanced')}>
              {lang === 'ko' ? '고급 옵션' : 'Advanced Options'}
            </button>
            <div ref={advancedContentRef} className="accordion-content" style={{ maxHeight: openAccordions.advanced ? `${advancedContentRef.current?.scrollHeight}px` : '0px' }}>
              <div id="rule-builder-area">
                {ruleGroups.map((g, gi) => (
                  <React.Fragment key={g.id}>
                    <div className="rule-group">
                      <div className="rule-group-header">
                        <strong className="rule-group-title">{lang === 'ko' ? `그룹 ${gi + 1}` : `Group ${gi + 1}`}</strong>
                        {ruleGroups.length > 1 && <button className="delete-group-button" onClick={() => deleteRuleGroup(g.id)}>{lang === 'ko' ? '삭제' : 'Del'}</button>}
                      </div>
                      {g.conditions.map((c, ci) => (
                        <div className="condition-row" key={ci}>
                          <select className="condition-type" value={c.type} onChange={e => updateCondition(g.id, ci, 'type', e.target.value)}>
                            {advancedOptionsConfig.map(o => <option key={o.value} value={o.value}>{lang === 'ko' ? o.ko : o.value.charAt(0).toUpperCase() + o.value.slice(1)}</option>)}
                          </select>
                          <input type="number" className="condition-value" placeholder="Minimum (%)" value={c.value} onChange={e => updateCondition(g.id, ci, 'value', e.target.value)} />
                          <button className="delete-condition-button" onClick={() => deleteCondition(g.id, ci)}>×</button>
                        </div>
                      ))}
                      <div className="rule-group-footer">
                        <button className="add-condition-button" onClick={() => addCondition(g.id)}>{lang === 'ko' ? '+ 조건 추가' : '+ Add Condition'}</button>
                      </div>
                    </div>
                    {gi < ruleGroups.length - 1 && <div className="rule-separator"><span>OR</span></div>}
                  </React.Fragment>
                ))}
              </div>
              <button id="add-rule-group-button" onClick={addRuleGroup}>{lang === 'ko' ? 'OR 조건 그룹 추가' : 'Add OR Condition Group'}</button>
            </div>
          </div>

          {/* Basic Options */}
          <div className="accordion-container">
            <button className={`accordion-toggle ${openAccordions.basic ? 'active' : ''}`} onClick={() => toggleAccordion('basic')}>
              {lang === 'ko' ? '기본 옵션' : 'Basic Options'}
            </button>
            <div ref={basicContentRef} className="accordion-content" style={{ maxHeight: openAccordions.basic ? `${basicContentRef.current?.scrollHeight}px` : '0px' }}>
              <div id="basic-options-content">
                <div className="filter-row">
                  <span className="filter-title">{lang === 'ko' ? '티어:' : 'Tier:'}</span>
                  <label className="filter-label"><input type="checkbox" checked={checkboxes['filter-tier16']} onChange={() => handleCheckboxChange('filter-tier16')} /><span className="label-text">{lang === 'ko' ? '16티어 모드' : 'T16 MOD'}</span></label>
                  <label className="filter-label"><input type="checkbox" checked={checkboxes['filter-tier17']} onChange={() => handleCheckboxChange('filter-tier17')} /><span className="label-text">{lang === 'ko' ? '17티어 모드' : 'T17 MOD'}</span></label>
                </div>
                <div className="filter-row">
                  <span className="filter-title">{lang === 'ko' ? '희귀도:' : 'Rarity:'}</span>
                  <label className="filter-label"><input type="checkbox" checked={checkboxes['filter-rarity-normal']} onChange={() => handleCheckboxChange('filter-rarity-normal')} /><span className="label-text">{lang === 'ko' ? '일반' : 'Normal'}</span></label>
                  <label className="filter-label"><input type="checkbox" checked={checkboxes['filter-rarity-magic']} onChange={() => handleCheckboxChange('filter-rarity-magic')} /><span className="label-text">{lang === 'ko' ? '마법' : 'Magic'}</span></label>
                  <label className="filter-label"><input type="checkbox" checked={checkboxes['filter-rarity-rare']} onChange={() => handleCheckboxChange('filter-rarity-rare')} /><span className="label-text">{lang === 'ko' ? '희귀' : 'Rare'}</span></label>
                </div>
                <div className="filter-row">
                  <span className="filter-title">{lang === 'ko' ? '타락:' : 'Corrupted:'}</span>
                  <label className="filter-label"><input type="checkbox" checked={checkboxes['filter-corrupted-yes']} onChange={() => handleCheckboxChange('filter-corrupted-yes')} /><span className="label-text">Yes</span></label>
                  <label className="filter-label"><input type="checkbox" checked={checkboxes['filter-corrupted-no']} onChange={() => handleCheckboxChange('filter-corrupted-no')} /><span className="label-text">No</span></label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mod pickers */}
        <div id="mod-area">
          <div className="option-group">
            <h3>{lang === 'ko' ? '❌제외할 모드' : '❌Mods to Exclude'}</h3>
            <input className="mod-search" placeholder="Search..." value={searches.searchExclude}
              onChange={e => setSearches({ ...searches, searchExclude: e.target.value })} />
            <div id="mod-list-bad">
              {filteredAvoidMods.map(mod => <ModButton key={`exclude-${mod.No}`} mod={mod} type="excluded" />)}
            </div>
          </div>
          <div className="option-group">
            <h3>{lang === 'ko' ? '✅포함할 모드' : '✅Mods to Include'}</h3>
            <input className="mod-search" placeholder="Search..." value={searches.searchInclude}
              onChange={e => setSearches({ ...searches, searchInclude: e.target.value })} />
            <div id="mod-list-good">
              {filteredIncludeMods.map(mod => <ModButton key={`include-${mod.No}`} mod={mod} type="included" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // embedded면 래퍼 제거, 아니면 기존 래퍼 유지
  return embedded ? inner : (
    <div id="regex" className="section">
      {inner}
    </div>
  );
};

export default RegexGenerator;
