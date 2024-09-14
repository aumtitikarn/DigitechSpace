import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18nextXHRBackend from 'i18next-fetch-backend';
import LanguageDetector from "i18next-browser-languagedetector";


i18n
  .use(i18nextXHRBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    i18nextXHRBackend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: 'locales/add/{{lng}}/{{ns}}'
    },
    fallbackLng: "en",
    debug: false,


    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
