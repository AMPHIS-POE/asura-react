// src/components/Modal/HelpModal.jsx
import React from 'react';
import Modal from './Modal';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose, lang = 'ko', contentSource }) => {
  const content = (contentSource && contentSource[lang]) || (contentSource && contentSource.en) || { sections: [] };

  return (
    <Modal isOpen={isOpen} onClose={onClose} customClassName="modal--help">
      <div className="help-root">
        {content.sections.map((sec, idx) => (
          <section className="help-section" key={idx}>
            <header className="help-section-head">
              {sec.icon && <span className="help-icon" aria-hidden>{sec.icon}</span>}
              <h3 className="help-heading">{sec.heading}</h3>
            </header>

            {sec.body?.length > 0 && (
              <div className="help-paragraphs">
                {sec.body.map((t, i) => (<p className="help-p" key={i}>{t}</p>))}
              </div>
            )}

            {sec.list?.length > 0 && (
              <ul className="help-list">
                {sec.list.map((t, i) => (
                  <li className="help-li" key={i}>
                    <span className="bullet" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </Modal>
  );
};

export default HelpModal;
