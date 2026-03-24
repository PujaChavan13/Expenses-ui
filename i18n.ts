import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "hi", "mr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// This enables TypeScript support for eslint-plugin-next-intl
// It must be the only export from i18n.ts
export default getRequestConfig(async ({ locale }: { locale?: string }) => {
  const validLocale = locale && locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  try {
    const messages = (await import(`./messages/${validLocale}.json`)).default;
    return {
      locale: validLocale,
      messages,
    };
  } catch (error) {
    console.error(`Error loading messages for locale ${validLocale}:`, error);
    const fallbackMessages = (await import(`./messages/${defaultLocale}.json`)).default;
    return {
      locale: defaultLocale,
      messages: fallbackMessages,
    };
  }
});
