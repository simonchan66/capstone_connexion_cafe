"use client";

import { createContext, useContext, useState } from "react";
import translator from "./translator";

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children, lang: initialLang }) {
  const [lang, setLang] = useState(initialLang);

  const t = (key, defaultValue) => translator(lang, key, defaultValue);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
