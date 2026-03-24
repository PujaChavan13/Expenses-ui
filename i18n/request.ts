import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "../i18n";

export default getRequestConfig(async ({ locale }) => {
  const validLocale =
    locale && locales.includes(locale as Locale)
      ? (locale as Locale)
      : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});

