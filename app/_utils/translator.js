/*
 * Our group asked ChatGPT for language translation support.
 * (ChatGPT, private communication, July 2024).
 */
import en from "./translations/en.json";
import zh from "./translations/zh.json";

const translations = {
  en,
  zh,
};

//The translator function fetches the translation from the appropriate language object (translations[lang]).
//If a translation is found, it returns the translated string. If not, it returns the defaultValue
export default function translator(
  lang,
  key,
  defaultValue = "!MISSING TRANSLATION!"
) {
  const langTranslations = translations[lang];
  return langTranslations && langTranslations[key]
    ? langTranslations[key]
    : defaultValue;
}
