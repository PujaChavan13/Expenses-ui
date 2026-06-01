# i18n Setup Guide - Expense Tracker

## Overview
This document describes the complete i18n (internationalization) setup for the Expense Tracker application using Next.js App Router and next-intl library.

## Project Structure

```
my-app/
├── app/
│   ├── [locale]/                    # Dynamic locale segment
│   │   └── page.tsx                 # Main page with locale param
│   ├── components/
│   │   ├── ExpenseForm.tsx          # Updated with translations
│   │   ├── ExpenseList.tsx          # Updated with translations
│   │   ├── Header.tsx               # Updated with translations
│   │   ├── LanguageSwitcher.tsx     # NEW: Language switcher component
│   │   └── MonthlySummary.tsx       # Updated with translations
│   ├── types/
│   │   └── expense.ts
│   ├── utils/
│   │   └── storage.ts
│   ├── globals.css
│   └── layout.tsx                   # Updated with NextIntlClientProvider
├── messages/                        # Translation files
│   ├── en.json                      # English translations
│   ├── hi.json                      # Hindi translations
│   └── mr.json                      # Marathi translations
├── components/
│   └── ui/
│       ├── card.tsx
│       └── separator.tsx
├── i18n.ts                          # NEW: i18n configuration
├── middleware.ts                    # NEW: Locale routing middleware
├── next.config.ts                   # Updated with i18n config
├── tsconfig.json
├── package.json
└── ...
```

## File Changes Summary

### 1. **messages/en.json, messages/hi.json, messages/mr.json**
   - Created translation files for 3 languages
   - Keys organized by feature (navigation, expenseForm, expenseList, monthlySummary, languageSwitcher)
   - Each key has complete translations in respective language

### 2. **i18n.ts** (NEW)
   - Configuration file for next-intl
   - Defines supported locales: en, hi, mr
   - Default locale: en
   - Dynamically loads translation files based on requested locale
   - Handles locale validation

### 3. **middleware.ts** (NEW)
   - Middleware for locale-based routing
   - Intercepts all requests and handles locale routing
   - Configuration: `localePrefix: "always"` (URLs like /en/..., /hi/..., /mr/...)
   - Configured with proper matcher to exclude API routes and static files

### 4. **next.config.ts** (UPDATED)
   - Added experimental `optimizePackageImports` for next-intl
   - Optimizes bundle size by importing only needed parts

### 5. **app/layout.tsx** (UPDATED)
   - Wrapped with `NextIntlClientProvider`
   - Added TypeScript types for `params` (async params pattern)
   - Generates static parameters for all supported locales
   - Loads messages dynamically using `getMessages()`
   - Sets proper `lang` attribute on html element

### 6. **app/[locale]/page.tsx** (NEW)
   - Created dynamic locale route segment
   - Moved main logic from app/page.tsx
   - Accepts locale parameter from params

### 7. **app/components/Header.tsx** (UPDATED)
   - Uses `useTranslations()` hook for all labels
   - Integrated `LanguageSwitcher` component
   - Responsive layout for language switcher

### 8. **app/components/ExpenseForm.tsx** (UPDATED)
   - Uses `useTranslations()` for all labels and placeholders
   - Improved error handling with translated error messages
   - Success message after adding expense
   - Updated category options to use translation keys

### 9. **app/components/ExpenseList.tsx** (UPDATED)
   - Uses `useTranslations()` for all UI text
   - Updated category display to use translated category names
   - Translated edit/delete buttons and confirmations

### 10. **app/components/MonthlySummary.tsx** (UPDATED)
   - Uses `useTranslations()` for all labels
   - Uses `useLocale()` to format dates correctly based on language
   - Translated category names in breakdown

### 11. **app/components/LanguageSwitcher.tsx** (NEW)
   - Client component for language switching
   - Dropdown select with all three languages
   - Uses `useRouter()` and `usePathname()` from next/navigation
   - Uses `useLocale()` to get current locale
   - Updates URL pathname with new locale
   - Styled with clean, accessible UI

## Supported Locales

| Code | Language | Native Name |
|------|----------|-------------|
| en | English | English |
| hi | Hindi | हिंदी |
| mr | Marathi | मराठी |

## URL Structure

After setup, URLs follow this pattern:
- **English**: `http://localhost:3000/en` (default)
- **Hindi**: `http://localhost:3000/hi`
- **Marathi**: `http://localhost:3000/mr`

When users access `/`, middleware redirects to `/en` (default locale).

## How to Use Translations in Components

### 1. **In Client Components** (use `useTranslations()`)
```typescript
"use client";
import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t("expenseForm.title")}</h1>
      <button>{t("expenseForm.save")}</button>
    </div>
  );
}
```

### 2. **In Server Components** (use `getTranslations()`)
```typescript
import { getTranslations } from "next-intl/server";

export default async function MyComponent() {
  const t = await getTranslations();
  
  return (
    <div>
      <h1>{t("expenseForm.title")}</h1>
    </div>
  );
}
```

### 3. **Get Current Locale** (use `useLocale()`)
```typescript
"use client";
import { useLocale } from "next-intl";

export default function MyComponent() {
  const locale = useLocale(); // "en" | "hi" | "mr"
  
  return <div>Current locale: {locale}</div>;
}
```

## Translation Keys Structure

Translation keys follow a hierarchical structure:

```
{
  "navigation": {
    "title": "...",
    "summary": "...",
    "expenses": "..."
  },
  "header": {
    "welcome": "...",
    "description": "..."
  },
  "expenseForm": {
    "title": "...",
    "amount": "...",
    "categories": {
      "food": "...",
      "transport": "...",
      ...
    },
    "errors": {
      "amountRequired": "...",
      ...
    },
    ...
  },
  ...
}
```

## Adding New Translations

To add a new language (e.g., Spanish):

1. Create `messages/es.json` with all translation keys
2. Update `i18n.ts`:
   ```typescript
   export const locales = ["en", "hi", "mr", "es"] as const;
   ```
3. The middleware and routing will automatically support the new locale

## TypeScript Support

All components are fully typed:
- `useTranslations()` hook is type-safe
- Locale types are properly defined
- Component props have proper types
- Next.js async params pattern is correctly typed

## Development

### Start Development Server
```bash
npm run dev
```

Application runs at:
- http://localhost:3000/en (default redirect)
- http://localhost:3000/hi
- http://localhost:3000/mr

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

## Best Practices Implemented

✅ **Middleware for Automatic Routing** - Users are automatically routed to appropriate locale
✅ **Dynamic Message Loading** - Translation files loaded based on current locale
✅ **Type Safety** - Full TypeScript support throughout
✅ **Proper Next.js Patterns** - Uses App Router, async params, server/client components correctly
✅ **Clean Folder Structure** - Organized by feature
✅ **Production Ready** - Optimized bundle imports, proper error handling
✅ **Accessible UI** - All components have proper ARIA labels
✅ **Responsive Design** - Works on mobile and desktop

## Common Tasks

### Accessing Translations in a Component
```typescript
const t = useTranslations();
const label = t("expenseForm.amount");
```

### Getting Current Locale
```typescript
const locale = useLocale(); // "en" | "hi" | "mr"
```

### Switching Language Programmatically
Use the `LanguageSwitcher` component, or manually:
```typescript
const router = useRouter();
const pathname = usePathname();

const newPathname = pathname.replace(/^\/(en|hi|mr)/, `/${newLocale}`);
router.push(newPathname);
```

## Troubleshooting

### Problem: Translations not showing
- Ensure `NextIntlClientProvider` is in root layout
- Check that translation keys exist in JSON files
- Verify locale is correctly set in middleware

### Problem: Locale not changing
- Check middleware configuration
- Verify URL structure matches locale routes
- Clear browser cache

### Problem: Build errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npx tsc --noEmit`
- Verify JSON syntax in translation files

## References

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Middleware in Next.js](https://nextjs.org/docs/app/building-your-application/routing/middleware)
