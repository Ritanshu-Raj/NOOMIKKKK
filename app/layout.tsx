import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/Theme";
import { StoreProvider } from "@/lib/store";
const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = { metadataBase: new URL(base), title: { default: "NOMIK — Make every trip an experience", template: "%s | NOMIK" },
  description: "India-first travel discovery: destinations, food, stays, experiences, quests and journeys.", openGraph: { title: "NOMIK", description: "Make every trip an experience.", type: "website" }, alternates: { canonical: "/" } };
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-theme="day"><body><a className="skip" href="#main">Skip to content</a><ThemeProvider><StoreProvider>{children}</StoreProvider></ThemeProvider></body></html>;
}
