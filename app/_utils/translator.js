import en from "./translations/en.json";
import zh from "./translations/zh.json";

const translations = {
  en,
  zh,
};
export default function translator(lang, key, defaultValue = "") {
  const langTranslations = translations[lang];
  return langTranslations && langTranslations[key]
    ? langTranslations[key]
    : defaultValue;
}
