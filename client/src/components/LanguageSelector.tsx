import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function LanguageSelector() {
  const { language, setLanguage, t, languages } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-colors"
        aria-label={t("selectLanguage")}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang?.nativeName ?? "English"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg z-50 py-1">
          <div className="px-3 py-1.5 text-xs font-medium text-[#86868b] uppercase tracking-wide">
            {t("selectLanguage")}
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                language === lang.code
                  ? "bg-[#4a7fb5] text-white"
                  : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
              }`}
            >
              <span>{lang.nativeName}</span>
              <span className={`text-xs ${language === lang.code ? "text-white/70" : "text-[#86868b]"}`}>
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
