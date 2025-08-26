import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import './MapCalculator.css';

const MapCalculator = ({ lang }) => {
  const [iconUrls, setIconUrls] = useState({});

  const initialMaps = [
    { name: 'Sanctuary', koName: '성역', price: 0, count: 0, iconKey: 'sanctuary' },
    { name: 'Fortress', koName: '요새', price: 0, count: 0, iconKey: 'fortress' },
    { name: 'Citadel', koName: '성채', price: 0, count: 0, iconKey: 'citadel' },
    { name: 'Ziggurat', koName: '지구라트', price: 0, count: 0, iconKey: 'ziggurat' },
    { name: 'Abomination', koName: '흉물', price: 0, count: 0, iconKey: 'abomination' },
  ];

  const [maps, setMaps] = useState(initialMaps);
  const [divineRate, setDivineRate] = useState(0);
  const [totalChaos, setTotalChaos] = useState(0);
  const [totalDivine, setTotalDivine] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wp-json/asura/v1/ui-icons`);
        if (!response.ok) throw new Error('Network response was not ok for icons');
        const data = await response.json();
        setIconUrls(data);
      } catch (error) {
        console.error("Failed to fetch icon URLs:", error);
      }
    };
    fetchIcons();
  }, []);

  useEffect(() => {
    const fetchMapPrices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wp-json/asura/v1/mapprices`);
        if (!response.ok) throw new Error('Network response was not ok');
        const mapPrices = await response.json();

        setMaps(prevMaps => prevMaps.map(map => ({
          ...map,
          price: Math.ceil(Number(mapPrices[map.name] || 0))
        })));
      } catch (error) {
        console.error("Failed to fetch map prices:", error);
      }
    };
    fetchMapPrices();
  }, []);

  useEffect(() => {
    const fetchDivineRate = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wp-json/asura/v1/divinerate`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data && data.chaosEquivalent) {
          setDivineRate(Math.round(data.chaosEquivalent));
        }
      } catch (error) {
        console.error("Failed to fetch Divine Rate:", error);
      }
    };
    fetchDivineRate();
  }, []);

  useEffect(() => {
    const newTotalChaos = maps.reduce((sum, map) => sum + (map.price * map.count), 0);
    setTotalChaos(newTotalChaos);
    if (divineRate > 0) {
      setTotalDivine(parseFloat((newTotalChaos / divineRate).toFixed(2)));
    }
  }, [maps, divineRate]);

  const handleMapChange = (index, field, value) => {
    const newMaps = [...maps];
    newMaps[index][field] = Number(value) || 0;
    setMaps(newMaps);
  };

  const handleCopy = () => {
    if (isCopied) return;

    const lines = maps
      .filter(map => map.count > 0 && map.price > 0)
      .map(map => {
        const name = lang === 'ko' ? map.koName : map.name;
        return `${name} (${map.price}c × ${map.count})`;
      });

    if (lines.length === 0) return;

    const safeDivineRate = divineRate > 0 ? divineRate : 1;
    const divValue = Math.floor(totalChaos / safeDivineRate);
    const chaosRemainder = Math.round(totalChaos % safeDivineRate);

    let postfix = '';
    if (divValue > 0 && chaosRemainder > 0) {
      postfix = `${divValue} div ${chaosRemainder}c`;
    } else if (divValue > 0) {
      postfix = `${divValue} div`;
    } else {
      postfix = `${chaosRemainder}c`;
    }

    const resultText = `WTS ${lines.join(' + ')} = ${postfix} (by Asura)`;

    navigator.clipboard.writeText(resultText).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    });
  };

  const copyButtonText = isCopied
    ? (lang === 'ko' ? '복사됨!' : 'Copied!')
    : (lang === 'ko' ? '판매 문구 복사' : 'Copy Summary');

  return (
    <div className="map-overlay">
      <Breadcrumbs lang={lang} />
      <h1>
        {lang === 'ko' ? 'Path of Exile\n17티어 지도 계산기' : 'Path of Exile\n17 Tier Map Calculator'}
      </h1>
      <p className="map-description">
        {lang === 'ko'
          ? '모든 가격은 POE.NINJA의 값으로 자동 설정됩니다\n원하신다면 가격을 직접 수정하실 수 있습니다'
          : 'All prices are automatically set from POE.NINJA\nYou can manually adjust them if you wish'
        }
      </p>
      <table>
        <thead>
          <tr>
            <th>{lang === 'ko' ? '지도 이름' : 'Map Name'}</th>
            <th>{iconUrls.chaos && <img src={iconUrls.chaos} alt="Chaos" className="currency-icon-small" />} {lang === 'ko' ? '가격' : 'Price'}</th>
            <th>{lang === 'ko' ? '수량' : 'Quantity'}</th>
            <th>{lang === 'ko' ? '총합' : 'Total'}</th>
          </tr>
        </thead>
        <tbody>
          {maps.map((map, index) => (
            <tr key={map.name}>
              <td className="map-name-cell">
                {iconUrls[map.iconKey] && <img src={iconUrls[map.iconKey]} alt={map.name} className="map-icon" />}
                {lang === 'ko' ? map.koName : map.name}
              </td>
              <td>
                <input
                  type="number"
                  value={map.price}
                  onChange={(e) => handleMapChange(index, 'price', e.target.value)}
                  className="price-input"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={map.count}
                  onChange={(e) => handleMapChange(index, 'count', e.target.value)}
                  className="count-input"
                />
              </td>
              <td className="total-cell">{(map.price * map.count).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="summary-cell">
              <div className="summary-row">
                <div className="summary-box">
                  <p className="divine-rate-box">
                    {iconUrls.divine && <img src={iconUrls.divine} alt="Divine Orb" className="currency-icon" />} 1 :
                    <input
                      id="divineRate"
                      type="number"
                      value={divineRate}
                      onChange={(e) => setDivineRate(Number(e.target.value) || 0)}
                    />
                    {iconUrls.chaos && <img src={iconUrls.chaos} alt="Chaos Orb" className="currency-icon" />}
                  </p>
                </div>
                <div className="summary-box center-box">
                  <button
                    id="copySummary"
                    onClick={handleCopy}
                    className={isCopied ? 'copied' : ''}
                  >
                    {copyButtonText}
                  </button>
                </div>
                <div className="summary-box">
                  <h3 className="total-summary-line">
                    {iconUrls.chaos && <img src={iconUrls.chaos} alt="Chaos Orb" className="currency-icon" />}
                    {lang === 'ko' ? '카오스 오브 기준' : 'Total (Chaos)'}:&nbsp;
                    <span className="total-numbers">{totalChaos.toLocaleString()}</span>
                  </h3>
                  <h3 className="total-summary-line">
                    {iconUrls.divine && <img src={iconUrls.divine} alt="Divine Orb" className="currency-icon" />}
                    {lang === 'ko' ? '신성한 오브 기준' : 'Total (Divine)'}:&nbsp;
                    <span className="total-numbers">{totalDivine.toLocaleString()}</span>
                  </h3>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MapCalculator;