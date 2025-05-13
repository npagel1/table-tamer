import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en_translation from './locales/en/translation.json';
import es_translation from './locales/es/translation.json';
import fr_translation from './locales/fr/translation.json';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    // lng: (window.navigator.language || "en").split("-")[0].toLowerCase(),
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // react-i18next options
    react: {
      // Wait for the translation to be loaded before rendering the component
      useSuspense: true,
    },
    resources: {
      en: {
        translation: en_translation
      },
      es: {
        translation: es_translation
      },
      fr: {
        translation: fr_translation
      },
    }
  })

  export default i18n;