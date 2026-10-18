import '../../i18n'; // ensure initializer is loaded
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'zh', label: '中文', name: '中文' },
  { code: 'ar', label: 'ع', name: 'العربية' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = (i18n?.language || localStorage.getItem('i18nextLng') || 'en').split('-')[0];

  useEffect(() => {
    // auto-detect device language only if user hasn't chosen a language yet
    const saved = localStorage.getItem('i18nextLng');
    if (!saved) {
      const nav = (navigator.language || navigator.userLanguage || 'en').split('-')[0];
      const match = LANGS.find(l => l.code === nav);
      if (match) {
        if (i18n && typeof i18n.changeLanguage === 'function') {
          i18n.changeLanguage(match.code);
        } else {
          // fallback: import the initialized i18n instance and change
          import('../../i18n').then(mod => mod.default?.changeLanguage?.(match.code)).catch(() => {});
        }
      }
    }
  }, [i18n]);

  const change = (code) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(code);
      localStorage.setItem('i18nextLng', code);
      setOpen(false);
      return;
    }
    // fallback: try to use the initialized i18n module directly
    import('../../i18n')
      .then(mod => {
        const _i18n = mod.default;
        if (_i18n && typeof _i18n.changeLanguage === 'function') {
          _i18n.changeLanguage(code);
          localStorage.setItem('i18nextLng', code);
          setOpen(false);
        } else {
          console.error('i18n not ready. Ensure src/i18n.js is imported before rendering the app.');
        }
      })
      .catch(err => {
        console.error('Failed to load i18n module', err);
      });
  };

  return (
    <>
      <div className="lang-fab" role="toolbar" aria-label="Language switcher">
        <button
          className="lang-button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          title="Change language"
        >
          {LANGS.find(l => l.code === current)?.label || 'EN'}
        </button>

        {open && (
          <ul className="lang-menu" role="menu">
            {LANGS.map(l => (
              <li key={l.code} role="menuitem">
                <button
                  className={`lang-item ${current === l.code ? 'active' : ''}`}
                  onClick={() => change(l.code)}
                >
                  <span className="lang-label">{l.label}</span>
                  <span className="lang-name">{l.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        .lang-fab {
          position: fixed;
          right: 18px;
          bottom: 90px;          /* moved up so it doesn't cover bottom controls */
          z-index: 9998;         /* slightly lower than back-to-top when you raise it */
          font-family: system-ui, Arial, sans-serif;
        }

        /* move to left on very small screens to avoid overlap */
        @media (max-width: 480px) {
          .lang-fab {
            right: auto;
            left: 12px;
            bottom: 90px;
          }
        }

        .lang-button {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: none;
          background: #1f2937;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
        }
        .lang-menu {
          margin: 8px 0 0;
          padding: 8px;
          list-style: none;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }
        .lang-item {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 8px 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          width: 200px;
        }
        .lang-item:hover { background: #f3f4f6; }
        .lang-item.active { font-weight: 700; background: #eef2ff; }
        .lang-label { width: 36px; font-weight: 800; }
        .lang-name { color: #111827; font-size: 0.95rem; }
        /* RTL adjustment for menu when Arabic is active */
        html[dir="rtl"] .lang-menu { direction: rtl; }
      `}</style>
    </>
  );
}