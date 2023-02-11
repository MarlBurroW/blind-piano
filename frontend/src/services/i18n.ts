import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "../lang/fr";
import en from "../lang/en";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    returnNull: false,
    resources: {
      fr,
      en,
    },
    debug: import.meta.env.DEV,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
