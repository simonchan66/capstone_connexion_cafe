/*
 * Our group asked ChatGPT for language translation support.
 * (ChatGPT, private communication, July 2024).
 */
"use client";

import { createContext, useContext, useState } from "react";
import translator from "./translator";

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children, lang: initialLang }) {
  const [lang, setLang] = useState(initialLang);

  // Create the t function that uses the translator function
  const t = (key, defaultValue) => translator(lang, key, defaultValue);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
