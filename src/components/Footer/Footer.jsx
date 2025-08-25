import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import ContactForm from './ContactForm';
import './Footer.css';

function Footer({ lang }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openContactModal = () => setIsModalOpen(true);
  const closeContactModal = () => setIsModalOpen(false);

  return (
    <footer className="custom-site-footer">
      <div className="footer-container">
        <div className="footer-disclaimer">
          <p></p>
        </div>
        <div className="footer-social-icons">
          <a href="https://www.youtube.com/@amphis8954" target="_blank" rel="noopener noreferrer" title="YouTube"><i className="fa-brands fa-youtube"></i></a>
          <a href="https://discord.gg/invite/7FBPtyhjBx" target="_blank" rel="noopener noreferrer" title="Discord"><i className="fa-brands fa-discord"></i></a>
          <a href="https://www.instagram.com/heinejjw" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
          <a href="#contact" title="Email" onClick={(e) => { e.preventDefault(); openContactModal(); }}>
            <i className="fa-solid fa-envelope"></i>
          </a>
        </div>
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} Asura</p>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeContactModal}>
        <ContactForm lang={lang} />
      </Modal>
    </footer>
  );
}

export default Footer;