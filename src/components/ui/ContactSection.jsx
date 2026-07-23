import React, { useState, useEffect, useCallback } from 'react';

const ContactSection = ({ formSuccess, setFormSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors,   setErrors]   = useState({});
  const [status,   setStatus]   = useState('idle'); // idle | loading | success

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('contactDraft');
      if (saved) setFormData(JSON.parse(saved));
    } catch { /* ignore parse errors */ }
  }, []);

  const validate = useCallback(() => {
    const e = {};
    if (!formData.name.trim())    e.name    = 'Name is required';
    if (!formData.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Invalid email address';
    }
    if (!formData.message.trim()) e.message = 'Message cannot be empty';
    return e;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      try { localStorage.setItem('contactDraft', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    // Clear specific error on edit
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');

    // Mock API — resolves after 1.5s
    setTimeout(() => {
      setStatus('success');
      setFormSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      try { localStorage.removeItem('contactDraft'); } catch { /* ignore */ }

      // Reset success + explosion after 4s
      setTimeout(() => {
        setStatus('idle');
        setFormSuccess(false);
      }, 4000);
    }, 1500);
  }, [validate, setFormSuccess]);

  return (
    <section className="section-contact">
      <div className="glass-panel contact-card">
        <h2 className="contact-title neon-text-cyan">Let's Talk</h2>

        {status === 'success' ? (
          <div style={{ textAlign: 'center' }}>
            <p className="neon-text-magenta" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              ✦ Message Sent!
            </p>
            <p style={{ color: 'var(--text-muted)' }}>Protocol initialised — particle storm incoming.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                id="contact-name"
                className="form-field"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <input
                id="contact-email"
                className="form-field"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <textarea
                id="contact-message"
                className="form-field"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
              />
              {errors.message && <p className="form-error">{errors.message}</p>}
            </div>

            <button
              id="contact-submit-btn"
              type="submit"
              className="submit-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Transmitting…' : 'Transmit'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
