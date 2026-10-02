"use client";
import { useRef, useState } from "react";
import { PLAYLISTS } from "@/data/playlists";
export default function Radio() {
  const [pl, setPl] = useState(0), [ti, setTi] = useState(0), [on, setOn] = useState(false), [err, setErr] = useState(""), [pos, setPos] = useState(0);
  const a = useRef<HTMLAudioElement>(null); const list = PLAYLISTS[pl].tracks, t = list[ti];
  const miss = () => { setErr(`No audio found at ${t.audioUrl}. Upload it to /public/nomik/audio/.`); setOn(false); };
  const toggle = async () => { try { if (on) { a.current?.pause(); setOn(false); } else { await a.current?.play(); setOn(true); setErr(""); } } catch { miss(); } };
  const go = (d: number) => { setTi((ti + d + list.length) % list.length); setOn(false); setErr(""); setPos(0); };
  return <div className="quest"><p className="mono">NOW PLAYING · {PLAYLISTS[pl].title}</p><h3>{t.title}</h3><p className="meta">{t.artist} · {t.destination} · {t.mood}</p>
    <audio ref={a} src={t.audioUrl} preload="none" onError={miss} onEnded={() => go(1)} onTimeUpdate={e => setPos(e.currentTarget.duration ? (e.currentTarget.currentTime / e.currentTarget.duration) * 100 : 0)} />
    <button className="chip" onClick={() => go(-1)} aria-label="Previous">⏮</button> <button className="chip" onClick={toggle} aria-label={on ? "Pause" : "Play"}>{on ? "⏸ Pause" : "▶ Play"}</button> <button className="chip" onClick={() => go(1)} aria-label="Next">⏭</button>
    <p><label>Progress <input type="range" min={0} max={100} value={pos} onChange={e => { const d = a.current?.duration; if (a.current && d) a.current.currentTime = d * (+e.target.value / 100); }} /></label> <label>Volume <input type="range" min={0} max={1} step={0.05} defaultValue={0.6} onChange={e => { if (a.current) a.current.volume = +e.target.value; }} /></label></p>
    {err && <p role="alert" className="meta">{err}</p>}
    <p className="mono">PLAYLISTS</p>{PLAYLISTS.map((p, i) => <button key={p.id} className="chip" aria-pressed={pl === i} style={{ marginRight: 6 }} onClick={() => { setPl(i); setTi(0); setOn(false); setErr(""); }}>{p.title}</button>)}
    <p className="meta">Sound is off until you press play. Replace the audio files and edit data/playlists.ts to add songs.</p></div>;
}
