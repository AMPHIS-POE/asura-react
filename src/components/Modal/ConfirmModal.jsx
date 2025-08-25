import React from 'react';
import Modal from '../Modal/Modal';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, confirmText, cancelText }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <p className="modal__message">{message}</p>
            <div className="modal__footer">
                <button onClick={onCancel} className="modal__btn modal__btn--secondary">{cancelText || 'Cancel'}</button>
                <button onClick={onConfirm} className="modal__btn modal__btn--primary">{confirmText || 'OK'}</button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;