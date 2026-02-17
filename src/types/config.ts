/** Supported UI locale codes. */
export type Locale = "zh-CN" | "en";

/** Shape of a navigation link. */
export interface NavLink {
  label: Record<Locale, string>;
  href: string;
}

/** Global site configuration. */
export interface SiteConfig {
  title: string;
  description: string;
  /** Default locale */
  defaultLocale: Locale;
  /** Navbar link entries */
  navLinks: NavLink[];
}
