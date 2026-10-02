"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useTheme } from "./Theme";
const L = [["/destinations", "Destinations"], ["/search", "Finder"], ["/packages", "Tickets"], ["/build", "Build"], ["/journal", "Journal"], ["/radio", "Radio"]];
export default function SiteNav() {
  const p = usePathname(); const { themeMode, setThemeMode } = useTheme();
  if (p === "/") return null;
  return <header className="snav"><Link href="/" aria-label="NOMIK home"><Logo h={28} /></Link>
    <nav aria-label="Main">{L.map(([h, l]) => <Link key={h} className="chip" href={h}>{l}</Link>)}</nav>
    <button className="chip" aria-pressed={themeMode === "NIGHT"} onClick={() => setThemeMode(themeMode === "DAY" ? "NIGHT" : "DAY")}>{themeMode === "DAY" ? "🌙 Night" : "☀️ Day"}</button></header>;
}
