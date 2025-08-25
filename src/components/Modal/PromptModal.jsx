import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const PromptModal = ({ isOpen, message, onConfirm, onCancel, confirmText = '확인', cancelText = '취소' }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue(''); 
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(inputValue);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <p className="modal__message">{message}</p>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        className="modal__input" 
        autoFocus 
      />
      <div className="modal__footer">
        <button onClick={onCancel} className="modal__btn modal__btn--secondary">{cancelText}</button>
        <button onClick={handleConfirm} className="modal__btn modal__btn--primary">{confirmText}</button>
      </div>
    </Modal>
  );
};

export default PromptModal;