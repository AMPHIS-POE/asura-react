import React, { useEffect, useState } from "react";
import "./BaseItemTester.css";

export default function BaseItemTester() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlyAxes, setOnlyAxes] = useState(true); 

  useEffect(() => {
    const url =
      window.location.origin +
      "/wp-json/wp/v2/poe1_item?per_page=100&_fields=id,title,acf";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const clean = Array.isArray(data) ? data.filter((p) => p.acf) : [];
        setItems(clean);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const id = parseInt(e.target.value, 10);
    const item = items.find((i) => i.id === id) || null;
    setSelected(item);
  };

  const displayItems = items.filter((i) => {
    if (!onlyAxes) return true;

    const name = i?.title?.rendered?.toLowerCase() || "";
    return name.includes("axe");
  });

  const A = selected?.acf || {};
  const aps = A.poe1_weapon_attacks_per_second ?? A.attacks_per_second ?? "";
  const crit = A.poe1_weapon_critical_strike_chance ?? A.critical_chance ?? "";
  const min = A.poe1_weapon_physical_damage_min ?? A.min_physical_damage ?? "";
  const max = A.poe1_weapon_physical_damage_max ?? A.max_physical_damage ?? "";
  const rangeRaw = A.poe1_weapon_range ?? A.range ?? "";
  const rangeMeters = rangeRaw !== "" && rangeRaw != null ? (Number(rangeRaw) / 10).toFixed(1) : "";

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

      {selected && (
        <div className="item-card">
          <h3 className="name">{selected.title?.rendered}</h3>

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
        </div>
      )}
    </div>
  );
}
