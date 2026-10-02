"use client";
import { useEffect, useRef, useState } from "react";
export default function Yeti({ on }: { on: boolean }) {
  const [state, setState] = useState<"IDLE" | "SLEEPING" | "EXCITED">("IDLE");
  const [say, setSay] = useState(""); const [eye, setEye] = useState({ x: 0, y: 0 });
  const box = useRef<HTMLDivElement>(null); const idle = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!on) return;
    const wake = () => { setState(s => s === "SLEEPING" ? "IDLE" : s); clearTimeout(idle.current); idle.current = setTimeout(() => setState("SLEEPING"), 15000); };
    const move = (e: PointerEvent) => { const r = box.current?.getBoundingClientRect(); if (r) { const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1; setEye({ x: (dx / d) * 4, y: (dy / d) * 3 }); } wake(); };
    const rew = (e: Event) => { const m = (e as CustomEvent).detail as string; setState("EXCITED"); setSay(m.includes("STAMPED") ? "STAMP THAT." : m.includes("PACKED") ? "Good luggage." : "+XP"); setTimeout(() => { setState("IDLE"); setSay(""); }, 2200); wake(); };
    wake(); addEventListener("pointermove", move); addEventListener("nomik:reward", rew);
    return () => { removeEventListener("pointermove", move); removeEventListener("nomik:reward", rew); clearTimeout(idle.current); };
  }, [on]);
  if (!on) return null;
  const z = state === "SLEEPING";
  return (
    <div ref={box} className="yeti" role="img" aria-label={`Yeti drone companion, ${state.toLowerCase()}`}>
      {say && <div className="holo" role="status">{say}</div>}
      <svg viewBox="0 0 100 90" width="84" height="76" style={{ transform: state === "EXCITED" ? "translateY(-6px)" : undefined, transition: "transform .3s" }}>
        <ellipse cx="50" cy="80" rx="24" ry="4" fill="#0003" />
        <rect x="8" y="30" width="22" height="5" rx="2" fill="#4aa3ff" /><rect x="70" y="30" width="22" height="5" rx="2" fill="#4aa3ff" />
        <circle cx="50" cy="50" r="30" fill="#f7fbff" stroke="#9cc8ff" strokeWidth="3" />
        <circle cx="38" cy="48" r="9" fill="#1b2a44" /><circle cx="62" cy="48" r="9" fill="#1b2a44" />
        {z ? <><path d="M31 48h14M55 48h14" stroke="#9cc8ff" strokeWidth="3" /><text x="72" y="24" fontSize="12" fill="#4aa3ff">z</text></> :
          <><circle cx={38 + eye.x} cy={48 + eye.y} r="4" fill="#4aa3ff" /><circle cx={62 + eye.x} cy={48 + eye.y} r="4" fill="#4aa3ff" /></>}
        <path d="M42 66q8 6 16 0" stroke="#9cc8ff" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );
}
