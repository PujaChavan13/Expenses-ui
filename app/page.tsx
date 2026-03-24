import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n";

export default function Page() {
  // Middleware is configured with `localePrefix: "always"`, so `/` should
  // get redirected, but this ensures we never render without translations.
  redirect(`/${defaultLocale}`);
}

