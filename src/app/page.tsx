import { redirect } from "next/navigation";

/**
 * Root landing page – currently redirects straight to /home.
 *
 * This file is reserved for a future login / onboarding flow.
 */
export default function RootPage() {
  redirect("/home");
}
