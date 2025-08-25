import React from 'react';
import parse from 'html-react-parser';
import './AuthorCard.css';

const AuthorCard = ({ author, lang = 'ko' }) => {
    if (!author) return null;

    const translations = {
        ko: {
            authorRole: '작성자',
        },
        en: {
            authorRole: 'Author',
        }
    };
    const t = translations[lang] || translations.en;

    const { name, acf } = author;
    const avatarUrl = acf?.user_avatar?.url || '/img/default-avatar.png';

    return (
        <div className="author-card">
            <div className="author-header">
                <img src={avatarUrl} alt={name} className="author-avatar" />
                <div className="author-info">
                    <span className="author-role">{t.authorRole}</span>
                    <h4 className="author-name">{name}</h4>
                    <div className="social-links">
                        {acf?.user_streaming_url && (
                            <a href={acf.user_streaming_url} target="_blank" rel="noopener noreferrer" title="Live Stream">
                                <i className="fa-solid fa-video"></i>
                            </a>
                        )}
                        {acf?.user_ytube && (
                            <a href={acf.user_ytube} target="_blank" rel="noopener noreferrer" title="YouTube">
                                <i className="fa-brands fa-youtube"></i>
                            </a>
                        )}
                        {acf?.user_discord && (
                            <a href={acf.user_discord} target="_blank" rel="noopener noreferrer" title="Discord">
                                <i className="fa-brands fa-discord"></i>
                            </a>
                        )}
                        {acf?.user_instagram && (
                            <a href={acf.user_instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        )}
                    </div>
                </div>
            </div>
            {acf?.user_memo && (
                <div className="author-memo">
                    {parse(acf.user_memo)}
                </div>
            )}
        </div>
    );
};

export default AuthorCard;