"use client";
import { useState } from "react";
import { useTheme } from "./Theme";
type K = "hills" | "peaks" | "city";
const S: Record<string, { k: K; day: string[]; night: string[] }> = {
  munnar: { k: "hills", day: ["#cfe8d6", "#fff1cf", "#8fbf9a", "#4f8f5a", "#244d33"], night: ["#0b0a2a", "#2a1f6b", "#2b2f78", "#1b1a58", "#0c0a30"] },
  puri: { k: "hills", day: ["#ff9a5a", "#ffe2a8", "#e9a65f", "#c9783a", "#7a4a24"], night: ["#10082e", "#5a2a7a", "#3a2468", "#241a52", "#120c30"] },
  jaipur: { k: "city", day: ["#f4a37a", "#ffe0b8", "#e48e6a", "#c4664a", "#7a3a2a"], night: ["#12082a", "#4a2060", "#3a1f5a", "#27154a", "#150a2e"] },
  spiti: { k: "peaks", day: ["#9cc8f0", "#eaf4ff", "#b9c9d9", "#8a9db0", "#55687a"], night: ["#05061a", "#1a2260", "#2a3070", "#1a2058", "#0a0d30"] },
  kolkata: { k: "city", day: ["#e8c88a", "#fff0cf", "#b99a6a", "#8a6a42", "#4a3420"], night: ["#0a0a22", "#3a2070", "#2a1c5a", "#1c1448", "#0c0a28"] },
};
const rnd = (s: number) => { let t = s; return () => (t = (t * 16807) % 2147483647) / 2147483647; };
function layer(k: K, seed: number, base: number, amp: number) {
  const r = rnd(seed * 97 + 13); let d = `M-50 620 L-50 ${base}`;
  if (k === "city") for (let x = -50; x < 1300; x += 48) { const w = 30 + r() * 40, h = amp * (0.3 + r()); d += ` L${x} ${base - h} L${x + w} ${base - h} L${x + w} ${base}`; }
  else for (let x = -50; x <= 1300; x += 25) { const s = Math.sin(x * 0.008 + seed) + 0.5 * Math.sin(x * 0.021 + seed * 2); d += ` L${x} ${(base - amp * (k === "peaks" ? Math.abs(s) : (s + 1.5) / 3)).toFixed(0)}`; }
  return d + " L1300 620 Z";
}
export default function SceneArt({ slug }: { slug: string }) {
  const { themeMode } = useTheme(); const [photo, setPhoto] = useState(true);
  const s = S[slug] || S.munnar, c = themeMode === "NIGHT" ? s.night : s.day, night = themeMode === "NIGHT", r = rnd(slug.length * 31);
  return (
    <div className="scene" aria-hidden="true">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice">
        <defs><linearGradient id={"sk" + slug} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c[0]} /><stop offset="1" stopColor={c[1]} /></linearGradient>
          <linearGradient id={"ms" + slug} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity={night ? 0.12 : 0.4} /></linearGradient></defs>
        <rect width="1200" height="600" fill={`url(#sk${slug})`} />
        {night && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={r() * 1200} cy={r() * 300} r={r() * 1.6 + 0.4} fill="#fff" opacity={0.5 + r() * 0.5} />)}
        <circle cx="880" cy="190" r={night ? 46 : 78} fill={night ? "#e6e0ff" : "#fff2c0"} opacity={night ? 0.95 : 0.9} />
        <g className="dr1"><path d={layer(s.k, 1, 400, 160)} fill={c[2]} /></g>
        <g className="dr2"><path d={layer(s.k, 2, 480, 140)} fill={c[3]} /><rect y="330" width="1300" height="160" fill={`url(#ms${slug})`} /></g>
        <g className="dr3"><path d={layer(s.k, 3, 570, 110)} fill={c[4]} />{night && s.k === "city" && Array.from({ length: 24 }, (_, i) => <rect key={i} x={r() * 1200} y={470 + r() * 90} width="4" height="5" fill="#ffd27a" />)}</g>
      </svg>
      {photo && <img className="photo" src={`/nomik/destinations/${slug}.webp`} alt="" loading="lazy" onError={() => setPhoto(false)} />}
    </div>
  );
}
