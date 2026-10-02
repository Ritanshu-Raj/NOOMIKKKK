"use client";
import { useEffect, useRef } from "react";
export default function Cursor({ on }: { on: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!on || !matchMedia("(pointer: fine)").matches) return;
    const m = (e: PointerEvent) => { const t = e.target as HTMLElement, hot = !!t.closest?.("button,a,input,label,summary"); if (el.current) { el.current.style.transform = `translate(${e.clientX - 14}px,${e.clientY - 14}px) scale(${hot ? 1.8 : 1})`; el.current.dataset.hot = String(hot); } };
    addEventListener("pointermove", m); return () => removeEventListener("pointermove", m);
  }, [on]);
  return on ? <div ref={el} className="ncursor" aria-hidden="true">◈</div> : null;
}
