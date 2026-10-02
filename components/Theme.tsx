"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
export type Mode = "DAY" | "NIGHT";
type Ctx = { themeMode: Mode; setThemeMode: (m: Mode) => void; timeOfDay: Mode; reduced: boolean; setReduced: (b: boolean) => void };
const C = createContext<Ctx>(null!);
export const useTheme = () => useContext(C);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<Mode>("DAY");
  const [reduced, setReduced] = useState(false);
  useEffect(() => { setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => { document.documentElement.dataset.theme = themeMode.toLowerCase(); document.documentElement.dataset.reduced = String(reduced); }, [themeMode, reduced]);
  return <C.Provider value={{ themeMode, setThemeMode, timeOfDay: themeMode, reduced, setReduced }}>{children}</C.Provider>;
}
