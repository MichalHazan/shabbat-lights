import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import heTranslation from './locales/he.json';

// Configure i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    he: {
      translation: heTranslation,
    },
  },
  lng: 'he', // Set the default language to Hebrew
  fallbackLng: 'en', // Fallback language if translation is missing
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;
