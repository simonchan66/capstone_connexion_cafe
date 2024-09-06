/*
 * Our group asked ChatGPT for language translation support.
 * (ChatGPT, private communication, July 2024).
 */
import getLanguage from "./getLanguage";

// This function returns the current language code
export default function Language() {
  const lang = getLanguage();
  return lang;
}
