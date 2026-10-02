"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TrainWindow from "./TrainWindow";
import SceneArt from "./SceneArt";
import Backpack, { Gear } from "./Backpack";
import Yeti from "./Yeti";
import Logo from "./Logo";
import Cursor from "./Cursor";
import Radio from "./Radio";
import DepartureBoard from "./DepartureBoard";
import { useTheme } from "./Theme";
import { useStore } from "@/lib/store";
import { REGIONS, CURATED, MONTHS, F, Tier, build, season, refCode, COACH_MEANING, SEASON_MEANING } from "@/lib/packages";
import { ENTRIES, BLURB } from "@/data/content";
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const TIERS = Object.keys(F) as Tier[];
const BINGO = ["Hear a sound you can't name", "Smell something cooking", "Find a blue door", "Taste a local snack", "Touch something hand-made"];
const ENV = ["Find the oldest-looking shop on a main street. Notice what it sells. Buy something small.", "Sit somewhere for ten quiet minutes and write down three sounds.", "Photograph a texture: peeling paint, woven cloth or worn stone.", "Ask a trusted local source (a host or guide) for their favourite breakfast, then try it."];
type Panel = null | "discover" | "journey";
export default function World() {
  const { themeMode, setThemeMode, reduced, setReduced } = useTheme();
  const { xp, level, stamps, memories, addXp, addStamp, addMemory, saved, toggleSave } = useStore();
  const [boarded, setBoarded] = useState(false), [idx, setIdx] = useState(0), [panel, setPanel] = useState<Panel>(null), [tier, setTier] = useState<Tier>("3AC");
  const [menu, setMenu] = useState(false), [cur, setCur] = useState(false), [yeti, setYeti] = useState(true), [toast, setToast] = useState("");
  const [done, setDone] = useState<string[]>([]), [env, setEnv] = useState(false), [bingo, setBingo] = useState<boolean[]>([false, false, false, false, false]), [note, setNote] = useState("");
  const stage = useRef<HTMLElement>(null);
  const r = REGIONS[idx], pk = CURATED.find(c => c.o.regionId === r.id)!, month = new Date().getMonth() + 1, st = season(r, month);
  const plan = build({ ...pk.o, tier }), stops = plan.days.flat(), code = refCode(r.id, pk.o.days, idx + 1);
  const say = (m: string, x = 0) => { if (x) addXp(x); setToast(m); dispatchEvent(new CustomEvent("nomik:reward", { detail: m })); setTimeout(() => setToast(""), 2400); };
  useEffect(() => { try { if (localStorage.getItem("nomik.seen")) { setBoarded(true); setToast("WELCOME BACK · NEXT JOURNEY: MUNNAR"); setTimeout(() => setToast(""), 3000); } } catch {} }, []);
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setPanel(null); setMenu(false); } if (!panel && boarded) { if (e.key === "ArrowRight") setIdx(i => (i + 1) % REGIONS.length); if (e.key === "ArrowLeft") setIdx(i => (i + REGIONS.length - 1) % REGIONS.length); } }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, [panel, boarded]);
  const tick = (t: string) => { if (done.includes(t)) return setDone(done.filter(x => x !== t)); const nd = [...done, t]; setDone(nd); if (stops.every(s => nd.includes(s[0]))) { addStamp(pk.title); say(`STAMP THAT · ${pk.title} · +100 XP`, 100); } else say("+20 XP", 20); };
  const flip = (i: number) => { const n = bingo.map((b, j) => (j === i ? !b : b)); setBingo(n); if (n.every(Boolean)) { addStamp(`${r.name} Bingo`); say("BINGO STAMPED · +60 XP", 60); } };
  const eat = (k: string) => ENTRIES.find(e => e.dest === r.id && e.kind === k);
  const go = (p: Panel) => { setPanel(p); setMenu(false); };
  return (
    <>
      {!boarded && <TrainWindow onDone={() => { setBoarded(true); try { localStorage.setItem("nomik.seen", "1"); } catch {} }} />}
      <Cursor on={cur && !reduced} />
      <header className="top">
        <Logo h={30} />
        <nav className="mini" aria-label="Main">
          <button className="lnk" onClick={() => go("discover")}>DISCOVER</button>
          <button className="lnk" onClick={() => go("journey")}>JOURNEY</button>
          <button className="dial" aria-label="Travel kit" aria-expanded={menu} onClick={() => setMenu(!menu)}>◉</button>
        </nav>
        {menu && <div className="kit" role="dialog" aria-label="Travel kit">
          <button className="sw" role="switch" aria-checked={themeMode === "NIGHT"} onClick={() => setThemeMode(themeMode === "DAY" ? "NIGHT" : "DAY")}><i />{themeMode === "DAY" ? "DAY" : "NIGHT"} WORLD</button>
          <label><input type="checkbox" checked={cur} onChange={e => setCur(e.target.checked)} /> Decorative cursor</label>
          <label><input type="checkbox" checked={yeti} onChange={e => setYeti(e.target.checked)} /> Yeti</label>
          <label><input type="checkbox" checked={reduced} onChange={e => setReduced(e.target.checked)} /> Reduced motion</label></div>}
      </header>
      {toast && <div className="toast" role="status">{toast}</div>}
      <main id="main">
        <section className="stage" ref={stage} aria-label={`${r.name}, ${r.state}`}>
          <AnimatePresence mode="wait"><motion.div key={r.id + themeMode} className="fill" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.9 }}><SceneArt slug={r.id} /></motion.div></AnimatePresence>
          <div className="shade" />
          <div className="stagetxt">
            <p className="data">{r.state.toUpperCase()} · SEASON {st} · {days(r.months)}</p>
            <h1 className="display" aria-label={r.name}>{[...r.name.toUpperCase()].map((c, i) => <span className="ch" key={r.id + i} aria-hidden="true"><motion.span initial={{ y: reduced ? 0 : "105%" }} animate={{ y: 0 }} transition={{ delay: reduced ? 0 : 0.2 + i * 0.045, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}>{c === " " ? "\u00a0" : c}</motion.span></span>)}</h1>
            <p className="lead">{BLURB[r.id]}</p>
            <p className="data">{String(pk.o.days).padStart(2, "0")} DAYS · FROM {inr(plan.pp)} PP · {tier} · SAMPLE ESTIMATE</p>
            <button className="brass" onClick={() => go("journey")}><i />EXPLORE</button>
            <button className="lnk" onClick={() => setIdx((idx + 1) % REGIONS.length)} aria-label="Next destination">NEXT STOP →</button>
          </div>
          <aside className="rail" aria-label="Eat, stay, do">{(["food", "stay", "experience"] as const).map(k => { const e = eat(k); return e && <button key={k} className="railitem" onClick={() => { toggleSave(e.id); say("PACKED · " + e.title); }} aria-pressed={saved.includes(e.id)}><span className="data">{k === "food" ? "EAT" : k === "stay" ? "STAY" : "DO"}</span>{e.title}</button>; })}</aside>
          <div className="dots">{REGIONS.map((x, i) => <button key={x.id} aria-label={x.name} aria-current={i === idx} onClick={() => setIdx(i)} />)}</div>
        </section>
      </main>
      <AnimatePresence>{panel && <motion.div className="panel" role="dialog" aria-modal="true" aria-label={panel} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: reduced ? 0 : 0.45 }}>
        <button className="lnk close" onClick={() => setPanel(null)}>CLOSE ✕</button>
        {panel === "discover" ? <>
          <h2 className="display sm">DISCOVER</h2>
          <div className="gallery">{REGIONS.map((x, i) => <button key={x.id} className="big" onClick={() => { setIdx(i); setPanel(null); }}><SceneArt slug={x.id} /><span className="bigtxt"><span className="data">{x.state.toUpperCase()}</span><b className="display sm">{x.name.toUpperCase()}</b><span className="data">{season(x, month)} · {days(x.months)}</span></span></button>)}</div>
          <DepartureBoard month={month} />
        </> : <>
          <h2 className="display sm">{r.name.toUpperCase()} · YOUR JOURNEY</h2>
          <div className="cols">
            <div>
              <div className="ticketbig"><p className="data">NOMIK JOURNEY TICKET · NOT A RAILWAY TICKET · NOT A PNR</p><h3 className="display sm">{pk.title}</h3><p className="data">{code} · {pk.o.days}D · COACH {tier} · {inr(plan.pp)} PP</p><p className="data">SEASON {st}: {SEASON_MEANING[st]}</p>{stamps.includes(pk.title) && <span className="stamp" style={{ position: "static", display: "inline-block" }}>STAMPED</span>}</div>
              <div role="radiogroup" aria-label="Coach class">{TIERS.map(t => <button key={t} role="radio" aria-checked={tier === t} className={"coach" + (tier === t ? " on" : "")} onClick={() => setTier(t)}>{t}<small>{COACH_MEANING[t]}</small></button>)}</div>
              <p className="data">LEVEL {level} · {xp} XP · {stamps.length} STAMPS</p>
              <h3 className="data">POSTCARD / MEMORY</h3><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} aria-label="Memory" placeholder="Woke up at 5:12. Fog everywhere." />
              <button className="brass" disabled={!note.trim()} onClick={() => { addMemory({ dest: r.id, note: note.trim() }); setNote(""); say("MEMORY KEPT · +25 XP", 25); }}><i />KEEP MEMORY</button>
              {memories[0] && <p className="postcard">“{memories[0].note}” <span className="data">{memories[0].date}</span></p>}
            </div>
            <div>
              <h3 className="data">MISSION · {stops.filter(s => done.includes(s[0])).length}/{stops.length}</h3>
              {plan.days.map((d, di) => <div key={di} className="day"><b className="data">DAY {di + 1}</b>{d.map(s => <label key={s[0] + di} className="stop"><input type="checkbox" checked={done.includes(s[0])} onChange={() => tick(s[0])} /><span>{s[0]} <small className="data">{s[2]} · {s[4] ? inr(s[4]) : "free"}</small></span></label>)}</div>)}
              <h3 className="data">MYSTERY ENVELOPE</h3>
              <button className={"envelope" + (env ? " open" : "")} aria-expanded={env} onClick={() => { if (!env) { setEnv(true); say("SECRET MISSION · +50 XP", 50); } }}>{env ? <span>{ENV[(r.id.length + idx) % ENV.length]}</span> : <span>NOMIK SECRET<br />DO NOT OPEN</span>}</button>
              <h3 className="data">{r.name.toUpperCase()} SENSORY BINGO</h3>
              <div className="bingo">{BINGO.map((b, i) => <button key={b} aria-pressed={bingo[i]} className={bingo[i] ? "on" : ""} onClick={() => flip(i)}>{bingo[i] ? "☑" : "☐"} {b}</button>)}</div>
              <details><summary className="data">SOUNDTRACK (SOUND OFF UNTIL YOU PRESS PLAY)</summary><Radio /></details>
            </div>
          </div></>}
      </motion.div>}</AnimatePresence>
      <Yeti on={yeti && !reduced} />
      <Backpack zone={stage} onPack={(g: Gear) => say(`${g.icon} ${g.unlocks}`, 5)} />
    </>
  );
}
const days = (m: number[]) => `${MONTHS[m[0] - 1]}–${MONTHS[m[m.length - 1] - 1]}`;
