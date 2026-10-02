"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./Theme";
import Logo from "./Logo";
import { NOMIK_MEDIA } from "@/lib/media";
const SCENES = [
  { n: "PURI · SUNRISE", a: "#ff9a5a", b: "#ffe2a8" }, { n: "KERALA · BACKWATERS", a: "#7fc8a9", b: "#e8f6d8" },
  { n: "MUNNAR · TEA HILLS", a: "#a8d5ba", b: "#f5f0d0" }, { n: "RAJASTHAN · DESERT", a: "#f4c26b", b: "#fff0c9" },
];
export default function TrainWindow({ onDone }: { onDone: () => void }) {
  const { themeMode, reduced } = useTheme(); const [vid, setVid] = useState(true);
  const [i, setI] = useState(0); const [out, setOut] = useState(false);
  useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % SCENES.length), 4000); return () => clearInterval(t); }, []);
  const go = () => { setOut(true); setTimeout(onDone, 1500); };
  const s = SCENES[i];
  const sky = themeMode === "NIGHT" ? "linear-gradient(#0b0a1a,#2a1f6b)" : `linear-gradient(${s.a},${s.b})`;
  return (
    <div className={"win" + (out ? " out" : "")} role="dialog" aria-label="Train window intro">
      <button className="chip skipbtn" onClick={go}>SKIP ▸</button>
      <div className="frame" aria-hidden="true">
        <div className="sky" style={{ background: sky }} />
        {vid && !reduced && <video className="vid" src={themeMode === "NIGHT" ? NOMIK_MEDIA.nightIntro : NOMIK_MEDIA.dayIntro} autoPlay muted loop playsInline preload="metadata" style={{ objectPosition: NOMIK_MEDIA.focal }} onError={() => setVid(false)} />}
        <div className="layer l1" /><div className="layer l2" />
        {[0, 1, 2].map(k => <div key={k} className="pole" style={{ animationDelay: `${k}s` }} />)}
        <div className="glass" /><div className="etch"><Logo h={80} /></div>
        <div className="tag">NEXT STOP → {s.n}</div>
        <button className="enter" tabIndex={-1} onClick={go}>WHERE TO? ▸</button>
      </div>
      <button className="brass" style={{ position: "absolute", bottom: 14 }} onClick={go}><i />ENTER JOURNEY</button>
    </div>
  );
}
