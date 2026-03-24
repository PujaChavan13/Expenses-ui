"use client";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, type Locale } from "@/i18n";

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Replace the locale in the current pathname
    const segments = pathname.split("/");
    segments[1] = newLocale; // Replace the locale segment
    const newPathname = segments.join("/");

    router.push(newPathname);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        className="px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer text-sm font-medium transition-colors"
        aria-label={t("languageSwitcher.selectLanguage")}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {t(
              `languageSwitcher.${
                locale === "en" ? "english" : locale === "hi" ? "hindi" : "marathi"
              }`
            )}
          </option>
        ))}
      </select>
    </div>
  );
}
