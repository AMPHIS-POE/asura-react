import React, { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import './Poe1ActGuide.css';
import ItemTooltip from '../../../../components/ItemToolTip/ItemToolTip';
import { useLoading } from '../../../../Context/LoadingContext';
import RecordsChart from './RecordsChart';
import Modal from '../../../../components/Modal/Modal';
import ConfirmModal from '../../../../components/Modal/ConfirmModal';
import PromptModal from '../../../../components/Modal/PromptModal';
import ImageModal from '../../../../components/Modal/ImageModal';
import Breadcrumbs from '../../../../components/BreadCrumbs/BreadCrumbs';

const Poe1ActGuide = ({ lang }) => {
    const { showLoader, hideLoader } = useLoading();
    const [currentAct, setCurrentAct] = useState('act1');
    const [quests, setQuests] = useState([]);
    const [closedQuestIds, setClosedQuestIds] = useState([]);
    const [error, setError] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const intervalRef = useRef(null);
    const [records, setRecords] = useState([]);
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [memoInput, setMemoInput] = useState('');
    const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', onConfirm: () => { }, onCancel: () => { } });
    const [promptState, setPromptState] = useState({ isOpen: false, message: '', onConfirm: () => { }, onCancel: () => { } });
    const [glossaryData, setGlossaryData] = useState({});
    const [uiIcons, setUiIcons] = useState({});
    const [imageModalUrl, setImageModalUrl] = useState(null);
    const [isTimerAccordionOpen, setIsTimerAccordionOpen] = useState(false);

    useEffect(() => {
        const handleContentClick = (e) => {
            const link = e.target.closest('a.image-popup-trigger');
            if (link) {
                e.preventDefault();
                setImageModalUrl(link.href);
            }
        };
        const contentArea = document.querySelector('.details-content-wrapper');
        if (contentArea) {
            contentArea.addEventListener('click', handleContentClick);
        }
        return () => {
            if (contentArea) {
                contentArea.removeEventListener('click', handleContentClick);
            }
        };
    }, [quests]);

    const askForConfirmation = (message) => {
        return new Promise((resolve) => {
            setConfirmState({
                isOpen: true,
                message: message,
                onConfirm: () => { setConfirmState({ isOpen: false }); resolve(true); },
                onCancel: () => { setConfirmState({ isOpen: false }); resolve(false); }
            });
        });
    };

    const askForPrompt = (message) => {
        return new Promise((resolve) => {
            setPromptState({
                isOpen: true,
                message: message,
                onConfirm: (value) => { setPromptState({ isOpen: false }); resolve(value); },
                onCancel: () => { setPromptState({ isOpen: false }); resolve(null); }
            });
        });
    };

    const openRecordModal = () => setIsRecordModalOpen(true);
    const closeRecordModal = () => setIsRecordModalOpen(false);

    useEffect(() => {
        try {
            const savedRecords = JSON.parse(localStorage.getItem('poe1_speedrun_records')) || [];
            setRecords(savedRecords);
        } catch (e) {
            console.error("Failed to parse records from localStorage", e);
            setRecords([]);
        }
    }, []);

    useEffect(() => {
        const fetchUiIcons = async () => {
            try {
                const response = await fetch(`/wp-json/asura/v1/ui-icons`);
                if (!response.ok) throw new Error('UI Icons fetch failed');
                const data = await response.json();
                setUiIcons(data);
            } catch (error) {
                console.error("Failed to fetch UI Icons:", error);
            }
        };
        fetchUiIcons();
    }, []);

    const saveRecordsToLocalStorage = (newRecords) => {
        try {
            localStorage.setItem('poe1_speedrun_records', JSON.stringify(newRecords));
        } catch (e) {
            console.error("Failed to save records to localStorage", e);
        }
    };

    const handleMemoClick = (record) => {
        setEditingRecordId(record.id);
        setMemoInput(record.memo);
    };
    const handleMemoChange = (e) => setMemoInput(e.target.value);
    const handleMemoSave = (recordId) => {
        const updatedRecords = records.map(r => r.id === recordId ? { ...r, memo: memoInput } : r);
        setRecords(updatedRecords);
        saveRecordsToLocalStorage(updatedRecords);
        setEditingRecordId(null);
    };

    useEffect(() => {
        if (isTimerRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isTimerRunning]);

    const handleTimerStartStop = () => setIsTimerRunning(!isTimerRunning);
    const handleTimerReset = async () => {
        const confirmed = await askForConfirmation(t.confirmResetTimer);
        if (confirmed) {
            setIsTimerRunning(false);
            setElapsedTime(0);
        }
    };

    const handleSaveRecord = async () => {
        const memo = await askForPrompt(t.promptMemo);
        if (memo === null) return;
        const actName = availableActs.find(act => act.id === currentAct)?.name || currentAct;
        const newRecord = { id: Date.now(), date: new Date().toLocaleDateString(), act: actName, time: formatTime(elapsedTime), seconds: elapsedTime, memo: memo || "" };
        const updatedRecords = [...records, newRecord].sort((a, b) => a.seconds - b.seconds);
        setRecords(updatedRecords);
        saveRecordsToLocalStorage(updatedRecords);
        alert(t.alertRecordSaved);
    };

    const handleDeleteRecord = async (recordId) => {
        const confirmed = await askForConfirmation(t.confirmDeleteRecord);
        if (confirmed) {
            const updatedRecords = records.filter(record => record.id !== recordId);
            setRecords(updatedRecords);
            saveRecordsToLocalStorage(updatedRecords);
        }
    };
    const handleDeleteAllRecords = async () => {
        const confirmed = await askForConfirmation(t.confirmDeleteAllRecords);
        if (confirmed) {
            setRecords([]);
            saveRecordsToLocalStorage([]);
        }
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds].map(val => val.toString().padStart(2, '0')).join(':');
    };

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function fetchAllPaginatedData(url) {
            let allData = [];
            let page = 1;
            let totalPages = 1;

            while (page <= totalPages) {
                const response = await fetch(`${url}&page=${page}`, { signal });
                if (!response.ok) throw new Error(`데이터 로딩 실패 (페이지: ${page})`);

                if (page === 1) {
                    totalPages = parseInt(response.headers.get('X-WP-TotalPages'), 10) || 1;
                }

                const data = await response.json();
                allData = allData.concat(data);
                page++;
            }
            return allData;
        }

        async function fetchAllData() {
            showLoader();
            setError(null);
            try {
                const guideStepsUrl = `/wp-json/wp/v2/poe1_guide_step?lang=${lang}&acf_format=standard&per_page=100&_embed`; 
                const allStepsFromWP = await fetchAllPaginatedData(guideStepsUrl);
                const glossaryResponse = await fetch(`/wp-json/wp/v2/glossary?lang=${lang}&per_page=100`, { signal });
                if (!glossaryResponse.ok) throw new Error('용어 설명 데이터 로딩 실패');
                const glossaryItems = await glossaryResponse.json();
                const glossaryMap = glossaryItems.reduce((acc, item) => {
                    acc[item.slug] = {
                        title: item.title.rendered,
                        content: item.content.rendered
                    };
                    return acc;
                }, {});
                setGlossaryData(glossaryMap);

                const filteredSteps = allStepsFromWP.filter(step => step.acf.act_number === currentAct && step.lang === lang);
                filteredSteps.sort((a, b) => a.acf.step_order - b.acf.step_order);
                const initialQuests = filteredSteps.map(step => ({ id: step.id, title: step.title.rendered, summaryTitle: step.acf.summary_title, details: step.content.rendered, noteItems: step.acf.note_items || [] }));
                const allItemIds = new Set(initialQuests.flatMap(q => q.noteItems?.map(item => item.id).filter(Boolean)));
                let enrichedItemsMap = new Map();
            if (allItemIds.size > 0) {
                const itemIdsArray = Array.from(allItemIds);
                let allEnrichedItems = [];

                try {
const itemsResponse = await fetch(`/wp-json/wp/v2/poe1_item?lang=${lang}&include=${itemIdsArray.join(',')}&per_page=100&_embed&acf_format=standard`, { signal });                    if (itemsResponse.ok) {
                        const enrichedItems = await itemsResponse.json();
                        allEnrichedItems = allEnrichedItems.concat(enrichedItems);
                    } else {
                        console.error('POE1 아이템 상세 정보 로딩 실패');
                    }
                } catch (e) {
                    console.error('Fetching poe1_item failed', e);
                }

                try {
const currencyResponse = await fetch(`/wp-json/wp/v2/poe1_currency?lang=${lang}&include=${itemIdsArray.join(',')}&per_page=100&_embed&acf_format=standard`, { signal });                    if (currencyResponse.ok) {
                        const enrichedCurrency = await currencyResponse.json();
                        allEnrichedItems = allEnrichedItems.concat(enrichedCurrency);
                    } else {
                        console.error('POE1 화폐 정보 로딩 실패');
                    }
                } catch (e) {
                    console.error('Fetching poe1_currency failed', e);
                }

                allEnrichedItems.forEach(item => {
                    const finalItem = { ...item };
                    if (item._embedded && item._embedded['wp:term']) {
                        item._embedded['wp:term'].forEach(taxonomy => {
                            if (taxonomy.length > 0) finalItem[taxonomy[0].taxonomy] = taxonomy;
                        });
                    }
                    enrichedItemsMap.set(item.id, finalItem);
                });
            }
                const finalQuests = initialQuests.map(quest => ({ ...quest, noteItems: quest.noteItems.map(item => enrichedItemsMap.get(item.id) || item) }));
                setQuests(finalQuests);
                setClosedQuestIds([]);

            } catch (e) {
                if (e.name !== 'AbortError') setError(e.message);
            } finally {
                hideLoader();
            }
        }

        fetchAllData();

        return () => controller.abort();
    }, [currentAct, lang, showLoader, hideLoader]);

    const handleActChange = (actId) => setCurrentAct(actId);
    const handleResetProgress = async () => {
        const confirmed = await askForConfirmation(t.confirmResetProgress);
        if (confirmed) setClosedQuestIds([]);
    };
    const handleAccordionClick = (clickedQuestId) => {
        setClosedQuestIds(prevClosed => prevClosed.includes(clickedQuestId) ? prevClosed.filter(id => id !== clickedQuestId) : [...prevClosed, clickedQuestId]);
    };
    const handleSummaryItemClick = (clickedQuestId) => {
        const questIndex = quests.findIndex(q => q.id === clickedQuestId);
        if (questIndex === -1) return;
        const idsToClose = quests.slice(0, questIndex + 1).map(q => q.id);
        setClosedQuestIds(idsToClose);
    };

    const renderDetailsWithTooltips = (quest, glossaryData) => {
        if (!quest.details) return null;
        let itemIndex = 0;
        const itemsToRender = quest.noteItems || [];
        const options = {
            replace: domNode => {
                if (domNode.type === 'text' && domNode.data.includes('#ITEM#')) {
                    const parts = domNode.data.split(/(#ITEM#)/g);
                    return <>{parts.map((part, index) => {
                        if (part === '#ITEM#' && itemIndex < itemsToRender.length) {
                            const item = itemsToRender[itemIndex++];
                            return <ItemTooltip key={`${item.id}-${index}`} item={item} glossaryData={glossaryData} currentLang={lang} />;
                        }
                        return part;
                    })}</>;
                }
            }
        };
        return <div>{parse(quest.details, options)}</div>;
    };

    const translations = {
        ko: { mainTitle: 'Path of Exile <br />캠페인 스피드런 네비게이터', timer: '타이머', start: '시작', stop: '중지', reset: '초기화', save: '기록 저장', checkRecords: '기록 확인', summaryTitle: '진행 요약', resetProgress: '진행도 초기화', detailsTitle: '상세 공략', act1: '1막', act2: '2막', act3: '3막', act4: '4막', act5: '5막', act6: '6막', act7: '7막', act8: '8막', act9: '9막', act10: '10막', error: '에러 발생:', error_guide: 'Local WP가 켜져 있는지, 주소가 정확한지, CORS 문제가 없는지 확인하세요.', recordBoard: 'My Speedrun Records', noRecordsTitle: '저장된 기록이 없습니다', noRecordsText: '아직 기록이 없네요? 아래처럼 당신만의 기록을 완성하세요!', date: '날짜', act: '액트', time: '시간', delete: '삭제', deleteAll: '전체 삭제', ok: '확인', cancel: '취소', confirmResetTimer: '타이머를 초기화하시겠습니까?', confirmResetProgress: '정말로 진행 상황을 초기화하시겠습니까?', confirmDeleteRecord: '이 기록을 삭제하시겠습니까?', confirmDeleteAllRecords: '정말로 모든 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.', promptMemo: '기록에 대한 메모를 남겨주세요 (선택 사항):', alertRecordSaved: '기록이 저장되었습니다.' },
        en: { mainTitle: 'Path of Exile <br />Campaign Speedrun Navigator', timer: 'Timer', start: 'Start', stop: 'Stop', reset: 'Reset', save: 'Save Record', checkRecords: 'Check Records', summaryTitle: 'Progress Summary', resetProgress: 'Reset Progress', detailsTitle: 'Detailed Guide', act1: 'Act 1', act2: 'Act 2', act3: 'Act 3', act4: 'Act 4', act5: 'Act 5', act6: 'Act 6', act7: 'Act 7', act8: 'Act8', act9: 'Act9', act10: 'Act 10', error: 'An error occurred:', error_guide: 'Please check if Local WP is running, the address is correct, and there are no CORS issues.', recordBoard: 'My Speedrun Records', noRecordsTitle: 'No Records Saved', noRecordsText: 'You dont have any record! Make your own record like below!', date: 'Date', act: 'Act', time: 'Time', delete: 'Delete', deleteAll: 'Delete All', ok: 'OK', cancel: 'Cancel', confirmResetTimer: 'Are you sure you want to reset the timer?', confirmResetProgress: 'Are you sure you want to reset your progress?', confirmDeleteRecord: 'Are you sure you want to delete this record?', confirmDeleteAllRecords: 'Are you sure you want to delete all records?\nThis action cannot be undone.', promptMemo: 'Enter a memo for this record (optional):', alertRecordSaved: 'Record saved.' }
    };

    const t = translations[lang] || translations.en;
    const progressPercent = quests.length > 0 ? (closedQuestIds.length / quests.length) * 100 : 0;
    const availableActs = [
        { id: 'act1', name: t.act1 }, { id: 'act2', name: t.act2 }, { id: 'act3', name: t.act3 },
        { id: 'act4', name: t.act4 }, { id: 'act5', name: t.act5 }, { id: 'act6', name: t.act6 },
        { id: 'act7', name: t.act7 }, { id: 'act8', name: t.act8 }, { id: 'act9', name: t.act9 },
        { id: 'act10', name: t.act10 }
    ];
    if (error) return <div className="act-guide-container"><h1>{t.error} {error}</h1><p>{t.error_guide}</p></div>;

    return (
        <div className="act-guide-container">
            <Breadcrumbs lang={lang} />
            <header className="guide-header"><h1>{parse(t.mainTitle)}</h1></header>
            <main className="guide-main-content">
                <div className="left-sidebar">
                    <div className="timer-accordion-wrapper">
                        <button className={`accordion-header ${isTimerAccordionOpen ? '' : 'closed'}`} onClick={() => setIsTimerAccordionOpen(!isTimerAccordionOpen)}>
                            <h3>{t.timer}</h3>
                            <svg className={`chevron-icon ${isTimerAccordionOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                        <div className={`accordion-content ${isTimerAccordionOpen ? 'open' : ''}`}>
                            <div className="timer-content-grid">
                                <span className="timer-display">{formatTime(elapsedTime)}</span>
                                <div className="timer-start-reset-buttons">
                                    <button onClick={handleTimerStartStop} className="start-button">{isTimerRunning ? t.stop : t.start}</button>
                                    <button onClick={handleTimerReset} className="reset-timer-button">{t.reset}</button>
                                </div>
                            </div>
                            <div className="timer-record-buttons">
                                <button onClick={handleSaveRecord} disabled={isTimerRunning || elapsedTime === 0}>{t.save}</button>
                                <button onClick={openRecordModal}>{t.checkRecords}</button>
                            </div>
                        </div>
                    </div>
                    <aside className="summary-box">
                        <h2>{t.summaryTitle}</h2>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                            <span className="progress-bar-text">{`${closedQuestIds.length} / ${quests.length}`}</span>
                        </div>
                        <button onClick={handleResetProgress} className="reset-button">{t.resetProgress}</button>
                        <ul>{quests.map(quest => {
                            const isCompleted = closedQuestIds.includes(quest.id);
                            return (<li key={quest.id} onClick={() => handleSummaryItemClick(quest.id)}>
                                <input type="checkbox" checked={isCompleted} readOnly />
                                <span>{parse(quest.summaryTitle || quest.title)}</span>
                            </li>);
                        })}</ul>
                    </aside>
                </div>
                <section className="details-section">
                    <div className="act-tabs-container">{availableActs.map(act => (
                        <button
                            key={act.id}
                            className={`act-tab-button ${currentAct === act.id ? 'active' : ''}`}
                            onClick={() => handleActChange(act.id)}
                        >
                            {act.name}
                        </button>
                    ))}</div>
                    <div className="details-content-wrapper">
                        <h2>{t.detailsTitle}</h2>
                        <div className="accordion-container">{quests.map(quest => {
                            const isOpen = !closedQuestIds.includes(quest.id);
                            return (<div key={quest.id} className="accordion-item">
                                <button className={`accordion-header ${!isOpen ? 'closed' : ''}`} onClick={() => handleAccordionClick(quest.id)}>
                                    <h3>{parse(quest.title)}</h3>
                                    <svg className={`chevron-icon ${isOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                                <div className={`accordion-content ${isOpen ? 'open' : ''}`}>{renderDetailsWithTooltips(quest, glossaryData)}</div>
                            </div>);
                        })}</div>
                    </div>
                </section>
            </main>
            <Modal isOpen={isRecordModalOpen} onClose={closeRecordModal} customClassName="modal--records">
                {records.length > 0 ? (
                    <div className="record-board">
                        <div className="record-board-header">
                            <h2>My Speedrun Records</h2>
                            <button onClick={handleDeleteAllRecords} className="delete-all-btn">{t.deleteAll}</button>
                        </div>
                        <RecordsChart records={records} />
                        <table>
                            <thead><tr><th>Rank</th><th>Time</th><th>Memo</th><th>Delete</th></tr></thead>
                            <tbody>{records.map((record, index) => (<tr key={record.id} className={index === 0 ? 'is-first-place' : ''}>
                                <td># {index + 1}</td>
                                <td>{record.time}</td>
                                <td onClick={() => handleMemoClick(record)}>
                                    {editingRecordId === record.id ? (
                                        <input type="text" value={memoInput} onChange={handleMemoChange} onBlur={() => handleMemoSave(record.id)} onKeyDown={(e) => e.key === 'Enter' && handleMemoSave(record.id)} autoFocus className="memo-input" />
                                    ) : (
                                        <span>{record.memo || '-'}</span>
                                    )}
                                </td>
                                <td><button onClick={() => handleDeleteRecord(record.id)} className="delete-record-btn">X</button></td>
                            </tr>))}</tbody>
                        </table>
                    </div>
                ) : (
                    <div className="record-board-placeholder">
                        <h2 style={{ textAlign: 'center' }}>{t.recordBoard}</h2>
                        <p style={{ textAlign: 'center' }}>{t.noRecordsText}</p>
                        {uiIcons.Speedrun_Example && (
                            <img src={uiIcons.Speedrun_Example} alt="Example Records Chart" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                        )}
                    </div>
                )}
            </Modal>
            <ConfirmModal
                isOpen={confirmState.isOpen}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
                onCancel={confirmState.onCancel}
                confirmText={t.ok}
                cancelText={t.cancel}
            />
            <PromptModal
                isOpen={promptState.isOpen}
                message={promptState.message}
                onConfirm={promptState.onConfirm}
                onCancel={promptState.onCancel}
                confirmText={t.ok}
                cancelText={t.cancel}
            />
            <ImageModal
                imageUrl={imageModalUrl}
                onClose={() => setImageModalUrl(null)}
            />
        </div>
    );
};

export default Poe1ActGuide;