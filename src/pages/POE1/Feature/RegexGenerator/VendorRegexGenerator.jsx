// VendorRegexGenerator.jsx
import React, { useState, useMemo, useEffect } from 'react';
import './VendorRegexGenerator.css';

const VENDOR_REGEX_DATA = [
  {
    id: 'link_colors_3l',
    title: { ko: '3링크', en: '3-Links' },
    options: [
      { id: '3l_rrr', label: 'rrr', regex: 'r-r-r', images: ['Red_Socket', 'Red_Socket', 'Red_Socket'] },
      { id: '3l_rrg', label: 'rrg', regex: 'r-r-g|r-g-r|g-r-r', images: ['Red_Socket', 'Red_Socket', 'Green_Socket'] },
      { id: '3l_rrb', label: 'rrb', regex: 'r-r-b|r-b-r|b-r-r', images: ['Red_Socket', 'Red_Socket', 'Blue_Socket'] },
      { id: '3l_ggg', label: 'ggg', regex: 'g-g-g', images: ['Green_Socket', 'Green_Socket', 'Green_Socket'] },
      { id: '3l_ggr', label: 'ggr', regex: 'g-g-r|g-r-g|r-g-g', images: ['Green_Socket', 'Green_Socket', 'Red_Socket'] },
      { id: '3l_ggb', label: 'ggb', regex: 'g-g-b|g-b-g|b-g-g', images: ['Green_Socket', 'Green_Socket', 'Blue_Socket'] },
      { id: '3l_bbb', label: 'bbb', regex: 'b-b-b', images: ['Blue_Socket', 'Blue_Socket', 'Blue_Socket'] },
      { id: '3l_bbr', label: 'bbr', regex: 'b-b-r|b-r-b|r-b-b', images: ['Blue_Socket', 'Blue_Socket', 'Red_Socket'] },
      { id: '3l_bbg', label: 'bbg', regex: 'b-b-g|b-g-b|g-b-b', images: ['Blue_Socket', 'Blue_Socket', 'Green_Socket'] },
      { id: '3l_rgb', label: 'rgb', regex: 'r-g-b|r-b-g|g-r-b|g-b-r|b-r-g|b-g-r', images: ['Red_Socket', 'Green_Socket', 'Blue_Socket'] },
    ]
  },
  {
    id: 'link_colors_2l',
    title: { ko: '2링크', en: '2-Links' },
    options: [
      { id: '2l_rr', label: 'rr', regex: 'r-r', images: ['Red_Socket', 'Red_Socket'] },
      { id: '2l_gg', label: 'gg', regex: 'g-g', images: ['Green_Socket', 'Green_Socket'] },
      { id: '2l_bb', label: 'bb', regex: 'b-b', images: ['Blue_Socket', 'Blue_Socket'] },
      { id: '2l_rb', label: 'rb', regex: 'r-b|b-r', images: ['Red_Socket', 'Blue_Socket'] },
      { id: '2l_gr', label: 'gr', regex: 'g-r|r-g', images: ['Green_Socket', 'Red_Socket'] },
      { id: '2l_bg', label: 'bg', regex: 'b-g|g-b', images: ['Blue_Socket', 'Green_Socket'] },
    ]
  },
  {
    id: 'modifiers',
    title: { ko: '속성', en: 'Modifier' },
    options: [
      { id: 'ms_10', label: { ko: '이동 속도 (10%)', en: 'Movement speed (10%)' }, regex: { en: 'runn', ko: '주자' } },
      { id: 'ms_15', label: { ko: '이동 속도 (15%)', en: 'Movement speed (15%)' }, regex: { en: 'rint', ko: '단거리' } },
      { id: 'wgl_any', label: { ko: '+1 모든 주문 젬렙', en: '+1 wand lvl (any)' }, regex: { en: 'll g', ko: '달인의' } },
      { id: 'wgl_light', label: { ko: '+1 번개 주문 젬렙', en: '+1 lightning lvl' }, regex: { en: 'derha', ko: '둥손의' } },
      { id: 'wgl_fire', label: { ko: '+1 화염 주문 젬렙', en: '+1 fire lvl' }, regex: { en: 'me Sh', ko: '염 형성' } },
      { id: 'wgl_cold', label: { ko: '+1 냉기 주문 젬렙', en: '+1 cold lvl' }, regex: { en: 'singe', ko: '가창자' } },
      { id: 'wgl_phys', label: { ko: '+1 물리 주문 젬렙', en: '+1 phys lvl' }, regex: { en: 'Litho', ko: '석마술' } },
      { id: 'wgl_chaos', label: { ko: '+1 카오스 주문 젬렙', en: '+1 chaos lvl' }, regex: { en: 'Lord', ko: '친 군' } },
      { id: 'atkadd_phys', label: { ko: '물리 피해 (공격)', en: 'phys dmg (attack)' }, regex: { ko: '무거운|미광', en: 'glint|heav' } },
      { id: 'atkadd_light', label: { ko: '번개 피해 (공격)', en: 'lightning dmg (attack)' }, regex: { ko: '윙윙', en: 'Humm' } },
      { id: 'atkadd_cold', label: { ko: '냉기 피해 (공격)', en: 'cold dmg (attack)' }, regex: { ko: '내린', en: 'Frosted' } },
      { id: 'atkadd_fire', label: { ko: '화염 피해 (공격)', en: 'fire dmg (attack)' }, regex: { ko: '달궈진', en: 'Heated' } },
    ]
  },
  {
    id: 'weapon_bases',
    title: { ko: '무기 베이스', en: 'Weapon Bases' },
    options: [
      { id: 'base_axe', label: { ko: '도끼', en: 'Axe' }, regex: 'Ax' },
      { id: 'base_staff', label: { ko: '지팡이', en: 'Staff' }, regex: 'Staf' },
      { id: 'base_bow', label: { ko: '활', en: 'Bow' }, regex: 'Bow' },
      { id: 'base_mace', label: { ko: '철퇴', en: 'Mace' }, regex: 'Mac' },
      { id: 'base_sceptre', label: { ko: '셉터', en: 'Sceptre' }, regex: 'Sc' },
      { id: 'base_wand', label: { ko: '마법봉', en: 'Wand' }, regex: 'Wa' },
      { id: 'base_2h_sword', label: { ko: '양손 검', en: 'Two-Handed Sword' }, regex: { ko: '양손 검', en: 'Two' } },
      { id: 'base_1h_sword', label: { ko: '한손 검', en: 'One-Handed Sword' }, regex: { ko: '한손 검', en: 'One' } },
      { id: 'base_claw', label: { ko: '클로', en: 'Claw' }, regex: 'Cl' },
      { id: 'base_dagger', label: { ko: '단검', en: 'Dagger' }, regex: 'Da' },
      { id: 'base_shield', label: { ko: '방패', en: 'Shield' }, regex: 'Shie' },
      { id: 'base_quiver', label: { ko: '화살통', en: 'Quiver' }, regex: 'Qui' },

    ]
  }
];

function normalize3L(arr) {
  return Array.isArray(arr)
    ? arr.map(s => String(s).trim().toLowerCase()).filter(s => /^[rgb]{3}$/.test(s))
    : [];
}
function normalize2L(arr) {
  return Array.isArray(arr)
    ? arr.map(s => String(s).trim().toLowerCase()).filter(s => /^[rgb]{2}$/.test(s))
    : [];
}
function famKey(s) {
  return s.split('').sort().join('');
}
function hasFam(norm, t) {
  const k = famKey(t);
  return norm.some(x => famKey(x) === k);
}
function seq3(c, x) {
  return `${c}-${c}-${x}|${c}-${x}-${c}|${x}-${c}-${c}`;
}
function cls3(c, xs) {
  const cls = `[${xs.join('')}]`;
  return `${c}-${c}-${cls}|${c}-${cls}-${c}|${cls}-${c}-${c}`;
}
function collectOrderForCCX(norm, c, cand) {
  const res = [];
  for (const s of norm) {
    if (s[0] === c && s[1] === c && cand.includes(s[2]) && !res.includes(s[2])) res.push(s[2]);
    if (s[1] === c && s[2] === c && cand.includes(s[0]) && !res.includes(s[0])) res.push(s[0]);
    if (s[0] === c && s[2] === c && cand.includes(s[1]) && !res.includes(s[1])) res.push(s[1]);
  }
  return res;
}
function orderRGFrom(norm) {
  const order = [];
  for (const s of norm) {
    if (famKey(s) === famKey('bbr')) {
      for (const ch of s) if ((ch === 'r' || ch === 'g') && !order.includes(ch)) order.push(ch);
    }
  }
  if (!order.length) return ['r', 'g'];
  if (order.length === 1) return order[0] === 'r' ? ['r', 'g'] : ['g', 'r'];
  return order;
}
function pushDedupParts(buf, s) {
  if (!s) return;
  const parts = String(s).split('|').filter(Boolean);
  for (const p of parts) if (!buf.includes(p)) buf.push(p);
}

function generatePoeReRegex(selectedCombos) {
  const norm = normalize3L(selectedCombos);
  if (!norm.length) return '';

  const out = [];
  const fullRG =
    hasFam(norm, 'rrr') && hasFam(norm, 'rrg') && hasFam(norm, 'rgg') && hasFam(norm, 'ggg');

  if (fullRG) {
    if (hasFam(norm, 'bbb')) pushDedupParts(out, 'b-b-b');
    if (hasFam(norm, 'rgb')) pushDedupParts(out, ':.*(?=\\S*r)(?=\\S*g)(?=\\S*b)');
    if (hasFam(norm, 'rrb')) pushDedupParts(out, 'r-r-b|r-b-r|b-r-r');
    if (hasFam(norm, 'ggb')) pushDedupParts(out, 'g-g-b|g-b-g|b-g-g');
    const hasBbr = hasFam(norm, 'bbr');
    const hasBbg = hasFam(norm, 'bbg');
    if (hasBbr && hasBbg) {
      const rg = orderRGFrom(norm).join('');
      pushDedupParts(out, `b-b-[${rg}]|b-[${rg}]-b|[${rg}]-b-b`);
    } else if (hasBbr) {
      pushDedupParts(out, 'b-b-r|b-r-b|r-b-b');
    } else if (hasBbg) {
      pushDedupParts(out, 'b-b-g|b-g-b|g-b-b');
    }
    pushDedupParts(out, '[gr]-[gr]-[gr]');
    return out.join('|');
  }

  for (const c of ['r', 'g', 'b']) {
    const hasCCC = hasFam(norm, c + c + c);

    if (c === 'b') {
      if (hasCCC) pushDedupParts(out, 'b-b-b');
      const hasBbr = hasFam(norm, 'bbr');
      const hasBbg = hasFam(norm, 'bbg');
      if (hasBbr && hasBbg) {
        const rg = orderRGFrom(norm).join('');
        pushDedupParts(out, `b-b-[${rg}]|b-[${rg}]-b|[${rg}]-b-b`);
      } else {
        if (hasBbr) pushDedupParts(out, seq3('b', 'r'));
        if (hasBbg) pushDedupParts(out, seq3('b', 'g'));
      }
      continue;
    }

    const others = c === 'r' ? ['g', 'b'] : c === 'g' ? ['r', 'b'] : ['r', 'g'];
    const xs = others.filter(x => hasFam(norm, c + c + x));

    if (xs.length === 1 && hasCCC) {
      const x = xs[0];
      pushDedupParts(out, `${c}-[${c}${x}]-${c}|${c}-${c}-${x}|${x}-${c}-${c}`);
    } else {
      if (hasCCC) pushDedupParts(out, `${c}-${c}-${c}`);
      if (xs.length === 1) pushDedupParts(out, seq3(c, xs[0]));
      else if (xs.length >= 2) pushDedupParts(out, cls3(c, xs));
    }
  }

  if (hasFam(norm, 'rgb')) pushDedupParts(out, ':.*(?=\\S*r)(?=\\S*g)(?=\\S*b)');

  return out.join('|');
}

function buildPoeRe2L(selected) {
  const set = new Set(normalize2L(selected));
  const out = [];
  if (set.has('rr')) pushDedupParts(out, 'r-r');
  if (set.has('gg')) pushDedupParts(out, 'g-g');
  if (set.has('bb')) pushDedupParts(out, 'b-b');
  if (set.has('rb')) pushDedupParts(out, 'r-b|b-r');
  if (set.has('gr')) pushDedupParts(out, 'g-r|r-g');
  if (set.has('bg')) pushDedupParts(out, 'b-g|g-b');
  return out.join('|');
}

function joinAlternations(parts) {
  return (Array.isArray(parts) ? parts : []).filter(Boolean).join('|');
}

const stripOuterQuotesOnce = (s) =>
  typeof s === 'string' ? s.replace(/^"(.*)"$/, '$1') : '';

const quoteWholeIfHasSpace = (s) => {
  const raw = stripOuterQuotesOnce(String(s || ''));
  return /\s/.test(raw) ? `"${raw}"` : raw;
};

const BASE_ABBR_EN = {
  Axe: 'ax',
  Staff: 'staf',
  Bow: 'bow',
  Mace: 'mac',
  Sceptre: 'sc',
  Wand: 'wa',
  Sword: 'sw',
  Claw: 'cl',
  Dagger: 'da',
  Shield: 'shi',
  Quiver: 'qiv',
};

function buildWeaponBaseRegex(selectedBaseOptions, lang = 'en') {
  if (!Array.isArray(selectedBaseOptions) || selectedBaseOptions.length === 0) return '';
  const prefix = lang === 'ko' ? '종류:.+' : 's:.+';
  const toks = [];
  for (const opt of selectedBaseOptions) {
    if (lang === 'ko') {
      const ko = opt?.label?.ko;
      if (ko && !toks.includes(ko)) toks.push(ko);
    } else {
      const en = opt?.label?.en;
      const abbr = BASE_ABBR_EN[en] || (en || '').toLowerCase();
      if (abbr && !toks.includes(abbr)) toks.push(abbr);
    }
  }
  if (toks.length === 0) return '';
  if (toks.length === 1) return `${prefix}${toks[0]}`;
  return `${prefix}(${toks.join('|')})`;
}

function getLangRegex(opt, lang) {
  if (typeof opt?.regex === 'string') return opt.regex;
  if (opt?.regex && (opt.regex[lang] || opt.regex.en)) return opt.regex[lang] || opt.regex.en || '';
  return '';
}

function buildWandGemRegex(selectedWandOpts, lang = 'en') {
  if (!Array.isArray(selectedWandOpts) || selectedWandOpts.length === 0) return '';
  const byId = new Set(selectedWandOpts.map(o => o.id));
  const anyOpt = selectedWandOpts.find(o => o.id === 'wgl_any');
  const anyRegexRaw = anyOpt ? getLangRegex(anyOpt, lang) : (lang === 'ko' ? '달인의' : 'll g');
  const anyRegex = stripOuterQuotesOnce(anyRegexRaw);
  if (byId.has('wgl_any')) return anyRegex;
  const allTypedSelected = ['wgl_light', 'wgl_fire', 'wgl_cold', 'wgl_phys', 'wgl_chaos'].every(id => byId.has(id));
  if (allTypedSelected) return anyRegex;
  const parts = selectedWandOpts
    .filter(o => o.id !== 'wgl_any')
    .map(o => stripOuterQuotesOnce(getLangRegex(o, lang)))
    .filter(Boolean);

  return parts.join('|');
}

const I18N = {
  ko: { copy: '복사', copied: '복사됨!', reset: '초기화', placeholder: '아래 옵션을 선택해 정규식을 생성하세요.', limit: 250 },
  en: { copy: 'Copy', copied: 'Copied!', reset: 'Reset', placeholder: 'Select options below to generate regex.', limit: 250 }
};

const get3LGroupKey = (opt) => (opt.label === 'rgb' ? 'rgb' : opt.label[0]);
const get2LGroupKey = (opt) => (/^([rgb])\1$/.test(opt.label) ? 'same' : 'mix');

function buildOtherLinksRegex(enabled, counts) {
  if (!enabled || !counts) return '';
  const order = ['r', 'g', 'b'].filter(c => Number(counts[c]) > 0);
  if (order.length === 0) return '';
  const head = 'ts:.+';
  if (order.length === 1) {
    const c = order[0];
    return `${head}(\\S*${c}){${counts[c]}}`;
  }
  if (order.length === 2) {
    const parts = order.map(c => `(?=(\\S*${c}){${counts[c]}})`);
    return head + parts.join('');
  }
  const look1 = `(?=(\\S*${order[0]}){${counts[order[0]]}})`;
  const look2 = `(?=(\\S*${order[1]}){${counts[order[1]]}})`;
  const body = `(\\S*${order[2]}){${counts[order[2]]}}`;
  return head + look1 + look2 + body;
}

const VendorRegexGenerator = ({ lang = 'ko' }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [iconUrls, setIconUrls] = useState({});
  const [otherCounts, setOtherCounts] = useState({ r: 0, g: 0, b: 0 });
  const t = I18N[lang] || I18N.en;

  useEffect(() => {
    fetch('/wp-json/asura/v1/ui-icons')
      .then(r => r.json())
      .then(data => setIconUrls(data))
      .catch(() => { });
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const stripAllQuotes = (s) => (typeof s === 'string' ? s.replace(/"/g, '') : '');

  const finalRegex = useMemo(() => {
    const allOptions = new Map(VENDOR_REGEX_DATA.flatMap(g => g.options).map(o => [o.id, o]));
    const selectedOptions = selectedIds.map(id => allOptions.get(id)).filter(Boolean);

    const labels2L = [];
    const labels3L = [];
    const others = [];
    const baseOptions = [];
    const wandGemOptions = [];

    for (const opt of selectedOptions) {
      if (opt.id.startsWith('2l_')) labels2L.push(opt.label);
      else if (opt.id.startsWith('3l_')) labels3L.push(opt.label);
      else if (opt.id.startsWith('base_')) baseOptions.push(opt);
      else if (opt.id.startsWith('wgl_')) wandGemOptions.push(opt);
      else others.push(getLangRegex(opt, lang));
    }

    const three = labels3L.length ? generatePoeReRegex(labels3L) : '';
    const two = labels2L.length ? buildPoeRe2L(labels2L) : '';

    const restRaw = others.filter(Boolean).map(stripAllQuotes).join('|');
    const baseRegex = buildWeaponBaseRegex(baseOptions, lang);
    const wandGemRegexRaw = buildWandGemRegex(wandGemOptions, lang);
    const otherLinksRegex = buildOtherLinksRegex(true, otherCounts);
    const finalRaw = joinAlternations([
      three,
      two,
      restRaw,
      baseRegex,
      wandGemRegexRaw,
      otherLinksRegex,
    ]);
    return quoteWholeIfHasSpace(finalRaw);
  }, [selectedIds, lang, otherCounts]);

  const charCount = finalRegex.length;

  const copyToClipboard = () => {
    if (!finalRegex || isCopied) return;
    navigator.clipboard.writeText(finalRegex).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    });
  };

  const handleReset = () => {
    setSelectedIds([]);
    setOtherCounts({ r: 0, g: 0, b: 0 });
  };

  return (
    <div className="vendor-regex-wrapper">
      <div className="vendor-output-container">
        <textarea value={finalRegex} readOnly placeholder={t.placeholder} />
      </div>

      <div className="vendor-output-meta">
        <div className="vendor-char-count">{charCount}/{t.limit}</div>
        <div className="vendor-output-actions">
          <button onClick={copyToClipboard} className={`copy-btn ${isCopied ? 'copied' : ''}`}>
            {isCopied ? t.copied : t.copy}
          </button>
          <button onClick={handleReset} className="reset-btn">
            {t.reset}
          </button>
        </div>
      </div>

      <div className="vendor-cards-container">
        {VENDOR_REGEX_DATA.map(group => (
          <div key={group.id} className={`vendor-option-card ${group.id}`}>
            <h3>{group.title[lang] || group.title.en}</h3>
            <div className="vendor-options-list">
              {group.options.map((option, index) => {
                let addSep = false;
                if (group.id === 'link_colors_3l') {
                  const prev = group.options[index - 1];
                  if (index > 0 && get3LGroupKey(option) !== get3LGroupKey(prev)) addSep = true;
                } else if (group.id === 'link_colors_2l') {
                  const prev = group.options[index - 1];
                  if (index > 0 && get2LGroupKey(option) !== get2LGroupKey(prev)) addSep = true;
                }
                return (
                  <label key={option.id} className={`vendor-option-label ${addSep ? 'group-sep' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(option.id)}
                      onChange={() => toggleSelection(option.id)}
                    />
                    <span className="custom-checkbox"></span>
                    <div className="option-display-content">
                      {option.images && iconUrls && (
                        <div className="vendor-socket-images">
                          {option.images.map((imageKey, i) => (
                            <React.Fragment key={i}>
                              {iconUrls[imageKey] && (
                                <img src={iconUrls[imageKey]} alt={imageKey} className="vendor-socket-image" />
                              )}
                              {i < option.images.length - 1 && iconUrls['Link'] && (
                                <img src={iconUrls['Link']} alt="Link" className="vendor-socket-link" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                      {!option.images && (
                        <span>{option.label?.[lang] ?? option.label?.en ?? option.label}</span>
                      )}
                    </div>
                  </label>
                );
              })}

              {group.id === 'link_colors_2l' && (
                <div className="subcard other-links-subcard">
                  <div className="subcard-header">
                    <span className="subcard-title-text">{lang === 'ko' ? '자유 링크' : 'Other Links'}</span>
                  </div>
                  <div className="subcard-body subcard-body--center">
                    <div className="other-links-grid">
                      <div className="other-col">
                        {iconUrls.Red_Socket && <img src={iconUrls.Red_Socket} alt="" aria-label="red" className="other-socket" />}
                        <input
                          type="number" min="0" max="6"
                          value={otherCounts.r}
                          onChange={(e) => setOtherCounts(c => ({ ...c, r: Math.max(0, Number(e.target.value || 0)) }))}
                          className="other-count-input"
                        />
                      </div>
                      <div className="other-col">
                        {iconUrls.Green_Socket && <img src={iconUrls.Green_Socket} alt="" aria-label="green" className="other-socket" />}
                        <input
                          type="number" min="0" max="6"
                          value={otherCounts.g}
                          onChange={(e) => setOtherCounts(c => ({ ...c, g: Math.max(0, Number(e.target.value || 0)) }))}
                          className="other-count-input"
                        />
                      </div>
                      <div className="other-col">
                        {iconUrls.Blue_Socket && <img src={iconUrls.Blue_Socket} alt="" aria-label="blue" className="other-socket" />}
                        <input
                          type="number" min="0" max="6"
                          value={otherCounts.b}
                          onChange={(e) => setOtherCounts(c => ({ ...c, b: Math.max(0, Number(e.target.value || 0)) }))}
                          className="other-count-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorRegexGenerator;
