import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ isOpen, onClose, children, customClassName }) => {
    if (!isOpen) return null;

    const contentClassName = `modal__content ${customClassName || ''}`.trim();

    return ReactDOM.createPortal(
        <div className="modal__overlay" onClick={onClose}>
            <div className={contentClassName} onClick={(e) => e.stopPropagation()}>
                <button className="modal__close-btn" onClick={onClose}>&times;</button>
                <div className="modal__decorator-bar" />
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;