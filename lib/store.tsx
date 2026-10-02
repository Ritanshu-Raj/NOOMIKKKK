"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { track } from "./analytics";
export type Memory = { id: string; dest: string; note: string; date: string };
type S = { saved: string[]; xp: number; memories: Memory[]; stamps: string[] };
type API = S & { level: number; toggleSave: (id: string) => void; addXp: (n: number) => void; addMemory: (m: { dest: string; note: string }) => void; addStamp: (t: string) => void };
const K = "nomik.v1"; // local-only demo profile; swap for real auth + DB later
const C = createContext<API>(null!);
export const useStore = () => useContext(C);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<S>({ saved: [], xp: 0, memories: [], stamps: [] });
  useEffect(() => { try { const v = localStorage.getItem(K); if (v) setS(JSON.parse(v)); } catch {} }, []);
  const up = (f: (p: S) => S) => setS(p => { const n = f(p); try { localStorage.setItem(K, JSON.stringify(n)); } catch {} return n; });
  const api: API = { ...s, level: Math.floor(s.xp / 100) + 1,
    toggleSave: id => { track("save_toggled", { id }); up(p => ({ ...p, saved: p.saved.includes(id) ? p.saved.filter(x => x !== id) : [...p.saved, id] })); },
    addXp: n => up(p => ({ ...p, xp: p.xp + n })),
    addMemory: m => { track("memory_created", m); up(p => ({ ...p, memories: [{ ...m, id: String(Date.now()), date: new Date().toISOString().slice(0, 10) }, ...p.memories] })); },
    addStamp: t => up(p => (p.stamps.includes(t) ? p : { ...p, stamps: [...p.stamps, t] })) };
  return <C.Provider value={api}>{children}</C.Provider>;
}
