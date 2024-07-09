import en from "./translations/en.json";

const translations = {
  en,
};
export default function translator(lang, key, defaultValue = "") {
  const langTranslations = translations[lang];
  return langTranslations && langTranslations[key]
    ? langTranslations[key]
    : defaultValue;
}
