import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './ContactForm.css';

function ContactForm({ lang = 'ko' }) {
  const [state, handleSubmit] = useForm("xldllnlj");

  const translations = {
    ko: {
      title: '문의하기',
      subtitle: '여러분의 각종 제안, 문의 사항 및 버그 제보는\n아수라의 발전에 큰 도움이 됩니다.\n감사합니다',
      emailLabel: '답변받을 이메일 주소',
      messageLabel: '메시지',
      submitButton: '보내기',
      submittingButton: '전송 중...',
      successMessage: '메시지가 성공적으로 전송되었습니다. 감사합니다!',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Your suggestions, inquiries, and bug reports \ngreatly contribute to the growth of Asura.\nThank you.',
      emailLabel: 'Your Email Address',
      messageLabel: 'Message',
      submitButton: 'Send',
      submittingButton: 'Sending...',
      successMessage: 'Your message has been sent successfully. Thank you!',
    }
  };

  const t = translations[lang] || translations.ko;

  if (state.succeeded) {
      return <p className="form-success-message">{t.successMessage}</p>;
  }

  return (
      <form onSubmit={handleSubmit} className="contact-form">
          <h2 className="form-title">{t.title}</h2>
          <p className="form-subtitle">{t.subtitle}</p>
          
          <label htmlFor="email">
              {t.emailLabel}
          </label>
          <input
              id="email"
              type="email" 
              name="email"
              required
          />
          <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
          />
          
          <label htmlFor="message">
              {t.messageLabel}
          </label>
          <textarea
              id="message"
              name="message"
              required
          />
          <ValidationError 
              prefix="Message" 
              field="message"
              errors={state.errors}
          />
          
          <button type="submit" disabled={state.submitting}>
              {state.submitting ? t.submittingButton : t.submitButton}
          </button>
      </form>
  );
}

export default ContactForm;