import { useCallback, useEffect, useMemo, useState } from "react";
import { languageStorageKey, languages } from "./languages";
import { translations } from "./translations";
import { LanguageContext } from "./LanguageContext";

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    return languages.some((language) => language.code === saved) ? saved : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const languageInfo = languages.find((item) => item.code === language) || languages[0];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languageInfo.direction;
    try {
      localStorage.setItem(languageStorageKey, language);
    } catch (error) {
      console.warn("Could not save the language preference in this browser.", error);
    }
  }, [language, languageInfo.direction]);

  const t = useCallback((text, variables) => {
    if (typeof text !== "string") return text;
    let result = translations[language]?.[text] || text;
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        result = result.replaceAll(`{${key}}`, String(value));
      });
    }
    return result;
  }, [language]);

  const value = useMemo(() => ({
    language,
    languageInfo,
    languages,
    setLanguage,
    t,
    formatNumber: (number, options) => new Intl.NumberFormat(language, options).format(number),
    formatDate: (date, options) => new Intl.DateTimeFormat(language, options).format(date),
  }), [language, languageInfo, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

