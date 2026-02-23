import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type TranslationKeys } from "./translations";

type LanguageCode = "en" | "es" | "fr" | "hi" | "zh" | "pt" | "ar";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

interface I18nContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
}

const STORAGE_KEY = "dozey_language";

function getInitialLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) {
      return stored as LanguageCode;
    }
  } catch {}
  return "en";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(getInitialLanguage);

  const setLanguage = useCallback((lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {}
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = translations[language] as TranslationKeys | undefined;
      if (dict && key in dict) {
        return dict[key as keyof TranslationKeys];
      }
      const fallback = translations["en"] as TranslationKeys;
      if (key in fallback) {
        return fallback[key as keyof TranslationKeys];
      }
      return key;
    },
    [language],
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
