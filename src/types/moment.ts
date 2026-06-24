import type { Locale } from "@/types/config";

/**
 * A single one-line personal update shown on the home timeline.
 *
 * `text` is bilingual, keyed by UI locale, so it follows the language toggle.
 */
export interface Moment {
  date: string;
  text: Record<Locale, string>;
}
