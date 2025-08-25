import React from 'react';
import './Modal.css';

const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    return (
        <div className="image-modal__overlay" onClick={onClose}>
            <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
                <button className="image-modal__close-btn" onClick={onClose}>&times;</button>
                <img src={imageUrl} alt="Popup Image" />
            </div>
        </div>
    );
};

export default ImageModal;