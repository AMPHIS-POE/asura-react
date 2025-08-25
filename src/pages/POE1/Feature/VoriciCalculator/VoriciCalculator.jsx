import React, { useState } from 'react';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';
import './VoriciCalculator.css';
import Modal from '../../../../components/Modal/Modal';

function fact(n) {
    if (n > 170) return Infinity;
    return n <= 1 ? 1 : n * fact(n - 1);
}

function getDistribution(R, G, B) {
    const stats = [R, G, B].filter(x => x > 0);
    const total = R + G + B;
    if (total === 0) return [1 / 3, 1 / 3, 1 / 3];

    if (stats.length === 1) {
        const cnt = R || G || B;
        const on = 0.9 * (cnt + 10) / (cnt + 20);
        const off = 0.05 + 4.5 / (cnt + 20);
        return [R ? on : off, G ? on : off, B ? on : off];
    } else if (stats.length === 2) {
        return [
            R ? 0.9 * R / total : 0.1,
            G ? 0.9 * G / total : 0.1,
            B ? 0.9 * B / total : 0.1
        ];
    } else {
        return [R / total, G / total, B / total];
    }
}

function multProb(r, g, b, pR, pG, pB) {
    if (r < 0 || g < 0 || b < 0) return 0;
    const total = r + g + b;
    const comb = fact(total) / (fact(r) * fact(g) * fact(b));
    return comb * Math.pow(pR, r) * Math.pow(pG, g) * Math.pow(pB, b);
}

const nameMap = {
    'Chromatic Orb': '색채의 오브', 'Vorici 1R': '1빨', 'Vorici 1G': '1초', 'Vorici 1B': '1파',
    'Vorici 1R1G': '1빨1초', 'Vorici 1G1B': '1초1파', 'Vorici 1R1B': '1빨1파', 'Vorici 2G': '2초',
    'Vorici 2B': '2파', 'Vorici 2B1R': '2파1빨', 'Vorici 1G2B': '1초2파', 'Vorici 2G1R': '2초1빨',
    'Vorici 3R': '3빨', 'Vorici 3G': '3초', 'Vorici 3B': '3파'
};

const recipes = [
    ['Chromatic Orb', 1, 0, 0, 0], ['Vorici 1R', 4, 1, 0, 0], ['Vorici 1G', 4, 0, 1, 0],
    ['Vorici 1B', 4, 0, 0, 1], ['Vorici 1R1G', 15, 1, 1, 0], ['Vorici 1G1B', 15, 0, 1, 1],
    ['Vorici 1R1B', 15, 1, 0, 1], ['Vorici 2G', 25, 0, 2, 0], ['Vorici 2B', 25, 0, 0, 2],
    ['Vorici 2B1R', 100, 1, 0, 2], ['Vorici 1G2B', 100, 0, 1, 2], ['Vorici 2G1R', 100, 1, 2, 0],
    ['Vorici 3R', 120, 3, 0, 0], ['Vorici 3G', 120, 0, 3, 0], ['Vorici 3B', 120, 0, 0, 3]
];

const InputGroup = ({ label, children }) => (
    <>
        <label>{label}</label>
        <div className="vorici-input-group">{children}</div>
    </>
);

const ColorInput = ({ lang, color, value, setter }) => (
    <div className="vorici-input-wrapper">
        <label htmlFor={`des_${color.slice(0, 1).toLowerCase()}`}>{lang === 'ko' ? { red: '빨강', green: '초록', blue: '파랑' }[color] : color.charAt(0).toUpperCase() + color.slice(1)}</label>
        <input id={`des_${color.slice(0, 1).toLowerCase()}`} className={`vorici-input vorici-${color}`} type="number" value={value} onChange={e => setter(Number(e.target.value) || 0)} />
    </div>
);

const ReqInput = ({ lang, type, value, setter }) => (
    <div className="vorici-input-wrapper">
        <label htmlFor={`req_${type.toLowerCase()}`}>{lang === 'ko' ? { str: '힘', dex: '민첩', int: '지능' }[type.toLowerCase()] : type.toUpperCase()}</label>
        <input id={`req_${type.toLowerCase()}`} className={`vorici-input vorici-${{ str: 'red', dex: 'green', int: 'blue' }[type.toLowerCase()]}`} type="number" value={value} onChange={e => setter(Number(e.target.value) || 0)} />
    </div>
);

const VoriciCalculator = ({ lang }) => {
    const [sockets, setSockets] = useState(6);
    const [reqStr, setReqStr] = useState(0);
    const [reqDex, setReqDex] = useState(0);
    const [reqInt, setReqInt] = useState(0);
    const [desR, setDesR] = useState(0);
    const [desG, setDesG] = useState(0);
    const [desB, setDesB] = useState(0);
    const [results, setResults] = useState([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleCalculate = () => {
        if (desR + desG + desB !== sockets) {
            const message = lang === 'ko'
                ? '원하는 소켓 수 합이 총 소켓 수와 일치해야 합니다'
                : 'Desired sockets must sum to total sockets';
            setAlertMessage(message);
            setIsAlertOpen(true);
            return;
        }

        const [pR, pG, pB] = getDistribution(reqStr, reqDex, reqInt);

        const calculatedResults = recipes.map(([name, cost, rFix, gFix, bFix]) => {
            const rLeft = desR - rFix;
            const gLeft = desG - gFix;
            const bLeft = desB - bFix;
            const free = sockets - (rFix + gFix + bFix);

            if (rLeft < 0 || gLeft < 0 || bLeft < 0 || rLeft + gLeft + bLeft !== free) {
                return null;
            }

            const success = name === 'Chromatic Orb'
                ? multProb(desR, desG, desB, pR, pG, pB)
                : multProb(rLeft, gLeft, bLeft, pR, pG, pB);

            if (success === 0 || !isFinite(success)) return null;

            const avgCost = cost / success;
            if (!isFinite(avgCost)) return null;

            return {
                name,
                avgCost: avgCost,
                success,
                attempts: 1 / success
            };
        }).filter(Boolean);

        if (calculatedResults.length > 0) {
            const minCost = Math.min(...calculatedResults.map(r => r.avgCost));
            calculatedResults.forEach(r => r.isBest = r.avgCost === minCost);
        }

        setResults(calculatedResults);
    };

    return (
        <div className="vorici-wrapper">
            <Breadcrumbs lang={lang} />
            <h1 className="vorici-title">
                {lang === 'ko' ? 'Path of Exile\n색채 계산기' : 'Path of Exile\nChromatic Calculator'}
            </h1>
            <div className="vorici-calculator">
                <div className="vorici-form">
                    <label>{lang === 'ko' ? '총 소켓 수' : 'Total Sockets'}</label>
                    <input id="socket" type="number" value={sockets} onChange={e => setSockets(Number(e.target.value) || 0)} className="vorici-input" />

                    <InputGroup label={lang === 'ko' ? '장비 요구 능력치' : 'Requirements'}>
                        <ReqInput lang={lang} type="str" value={reqStr} setter={setReqStr} />
                        <ReqInput lang={lang} type="dex" value={reqDex} setter={setReqDex} />
                        <ReqInput lang={lang} type="int" value={reqInt} setter={setReqInt} />
                    </InputGroup>

                    <InputGroup label={lang === 'ko' ? '원하는 홈 색깔' : 'Desired Colors'}>
                        <ColorInput lang={lang} color="red" value={desR} setter={setDesR} />
                        <ColorInput lang={lang} color="green" value={desG} setter={setDesG} />
                        <ColorInput lang={lang} color="blue" value={desB} setter={setDesB} />
                    </InputGroup>
                </div>
                <div className="vorici-button-container">
                    <button className="vorici-btn" onClick={handleCalculate}>
                        {lang === 'ko' ? '계산' : 'Calc'}
                    </button>
                </div>
            </div>
            <table className="vorici-table">
                <thead>
                    <tr>
                        <th>{lang === 'ko' ? '제작 유형' : 'Craft Type'}</th>
                        <th>{lang === 'ko' ? '평균 비용' : 'Avg Cost'}</th>
                        <th>{lang === 'ko' ? '성공률' : 'Success %'}</th>
                        <th>{lang === 'ko' ? '평균 시도' : 'Avg Attempt'}</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map(row => (
                        <tr key={row.name} className={row.isBest ? 'highlight' : ''}>
                            <td>{lang === 'ko' ? (nameMap[row.name] || row.name) : row.name}</td>
                            <td>{Math.round(row.avgCost).toLocaleString()}</td>
                            <td>{(row.success * 100).toFixed(5)}%</td>
                            <td>{row.attempts.toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)}>
                <p className="modal__message">{alertMessage}</p>
                <div className="modal__footer">
                    <button
                        onClick={() => setIsAlertOpen(false)}
                        className="modal__btn modal__btn--primary"
                    >
                        {lang === 'ko' ? '확인' : 'OK'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default VoriciCalculator;