import React, { useEffect, useState } from "react";
import "./BaseItemTester.css";

export default function BaseItemTester({ lang = "ko" }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlyAxes, setOnlyAxes] = useState(true);
  const [error, setError] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mods, setMods] = useState([]);
  const [applied, setApplied] = useState({ prefix: [], suffix: [] });

  const api = (path, params) => {
    const qs = new URLSearchParams(params || {}).toString();
    return qs ? `${path}?${qs}` : path;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          api("/wp-json/wp/v2/poe1_item", {
            per_page: 100,
            _fields: "id,title,acf,featured_media,_embedded",
            _embed: 1,
            lang,
          })
        );
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || !ct.includes("application/json")) {
          setError(`REST 응답 오류 (${res.status})`);
          setItems([]);
        } else {
          const data = await res.json();
          const clean = Array.isArray(data) ? data.filter((p) => p.acf) : [];
          setItems(clean);
        }
      } catch (e) {
        setError(String(e));
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [lang]);

  const handleChange = (e) => {
    const id = parseInt(e.target.value, 10);
    const item = items.find((i) => i.id === id) || null;
    setSelected(item);
    setApplied({ prefix: [], suffix: [] });
  };

  const isAxe = (name) => /(?:axe|도끼)/i.test(name || "");

  const displayItems = items.filter((i) => {
    if (!onlyAxes) return true;
    const name = i?.title?.rendered || "";
    return isAxe(name);
  });

  const A = selected?.acf || {};
  const aps = A.poe1_weapon_attacks_per_second ?? A.attacks_per_second ?? "";
  const crit = A.poe1_weapon_critical_strike_chance ?? A.critical_chance ?? "";
  const min = A.poe1_weapon_physical_damage_min ?? A.min_physical_damage ?? "";
  const max = A.poe1_weapon_physical_damage_max ?? A.max_physical_damage ?? "";
  const rangeRaw = A.poe1_weapon_range ?? A.range ?? "";
  const rangeMeters =
    rangeRaw !== "" && rangeRaw != null ? (Number(rangeRaw) / 10).toFixed(1) : "";

  const acfIconUrl =
    (typeof A.icon === "string" && A.icon) ||
    (A.icon && A.icon.url) ||
    A.icon_url ||
    A.poe1_icon_url ||
    (A.poe1_icon && A.poe1_icon.url) ||
    (A.poe1_item_icon && A.poe1_item_icon.url) ||
    A.poe1_item_icon_url ||
    "";

  const embeddedUrl =
    selected?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  const imgUrl = acfIconUrl || mediaUrl || embeddedUrl;

  useEffect(() => {
    setMediaUrl("");
    if (!selected) return;
    const idFromAcf =
      (typeof A.icon === "number" && A.icon) ||
      (typeof A.icon === "string" && /^\d+$/.test(A.icon) && Number(A.icon)) ||
      A.icon_id ||
      A.poe1_icon_id ||
      A.poe1_item_icon_id ||
      (typeof A.poe1_item_icon === "number" && A.poe1_item_icon) ||
      null;
    if (idFromAcf && !acfIconUrl && !embeddedUrl) {
      fetch(`/wp-json/wp/v2/media/${idFromAcf}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => setMediaUrl(j?.source_url || ""))
        .catch(() => setMediaUrl(""));
    }
  }, [selected]);

  useEffect(() => {
    setMods([]);
    if (!selected) return;
    const load = async () => {
      try {
        const params = new URLSearchParams({
          base: selected.id,
          ilvl: 86,
          lang,
          per_page: 500,
        }).toString();
        const r = await fetch(`/wp-json/asura/v1/poe1/applicable-mods?${params}`);
        if (!r.ok) throw new Error(`mods ${r.status}`);
        const j = await r.json();
        const normalized = (j.mods || []).map((m) => {
          const raw = String(m.type ?? m.generation_type ?? "").toLowerCase();
          const type = raw.includes("prefix") ? "prefix" : raw.includes("suffix") ? "suffix" : "";
          return { ...m, type };
        });
        setMods(normalized);
      } catch (e) {
        setMods([]);
      }
    };
    load();
  }, [selected, lang]);

  const toggleMod = (m) => {
    const bucket = m.type === "prefix" ? "prefix" : "suffix";
    setApplied((prev) => {
      const exists = prev[bucket].some((x) => x.id === m.id);
      if (exists) {
        return { ...prev, [bucket]: prev[bucket].filter((x) => x.id !== m.id) };
      }
      const cap = 3;
      if (prev[bucket].length >= cap) return prev;
      return { ...prev, [bucket]: [...prev[bucket], m] };
    });
  };

  return (
    <div className="baseitem-tester">
      <h2>베이스 아이템 테스트(POE1)</h2>

      <div className="controls">
        <label className="chk">
          <input
            type="checkbox"
            checked={onlyAxes}
            onChange={(e) => setOnlyAxes(e.target.checked)}
          />
          도끼만 보기
        </label>

        <select onChange={handleChange} defaultValue="">
          <option value="" disabled>
            아이템 선택
          </option>
          {displayItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title?.rendered}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="hint">불러오는 중…</div>}
      {!!error && <div className="hint">오류: {error}</div>}
      {!loading && displayItems.length === 0 && (
        <div className="hint">표시할 아이템이 없습니다.</div>
      )}

      {selected && (
        <div className="item-card">
          <h3 className="name">{selected.title?.rendered}</h3>
          {imgUrl && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={imgUrl}
                alt={selected.title?.rendered || "icon"}
                style={{ width: 64, height: 64, objectFit: "contain" }}
              />
            </div>
          )}
          <ul className="stats">
            {min !== "" && max !== "" && (
              <li>
                물리 피해: <b>{min}</b> – <b>{max}</b>
              </li>
            )}
            {crit !== "" && (
              <li>
                치명타 확률: <b>{crit}</b>%
              </li>
            )}
            {aps !== "" && (
              <li>
                초당 공격 횟수: <b>{aps}</b>
              </li>
            )}
            {rangeMeters !== "" && (
              <li>
                무기 범위: <b>{rangeMeters}</b> m
              </li>
            )}
          </ul>

          <div style={{ marginTop: 16 }}>
            <h4>Prefixes</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {mods.filter((m) => m.type === "prefix").map((m) => {
                const active = applied.prefix.some((x) => x.id === m.id);
                return (
                  <button
                    key={`p-${m.id}`}
                    onClick={() => toggleMod(m)}
                    className={active ? "btn-active" : "btn"}
                  >
                    {m.name || m.group || m.id}
                  </button>
                );
              })}
            </div>

            <h4 style={{ marginTop: 12 }}>Suffixes</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {mods.filter((m) => m.type === "suffix").map((m) => {
                const active = applied.suffix.some((x) => x.id === m.id);
                return (
                  <button
                    key={`s-${m.id}`}
                    onClick={() => toggleMod(m)}
                    className={active ? "btn-active" : "btn"}
                  >
                    {m.name || m.group || m.id}
                  </button>
                );
              })}
            </div>

            {mods.length === 0 && (
              <div className="hint" style={{ marginTop: 8 }}>
                적용 가능한 속성이 없습니다.
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <h4>선택된 속성</h4>
              <ul>
                {applied.prefix.map((m) => (
                  <li key={`ap-${m.id}`}>접두어: {m.name || m.group || m.id}</li>
                ))}
                {applied.suffix.map((m) => (
                  <li key={`as-${m.id}`}>접미어: {m.name || m.group || m.id}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
