"use client";
import { useState } from "react";
import { REGIONS, CURATED, TAGS, MONTHS, build, Plan, season, SEASON_MEANING, COACH_MEANING, refCode } from "@/lib/packages";
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const BUDGETS = [5000, 10000, 20000, 40000, 80000];

function PlanView({ plan, title, month, onXp }: { plan: Plan; title: string; month: number; onXp: (s: string) => void }) {
  const [done, setDone] = useState<string[]>([]);
  const total = plan.days.length * 3, st = season(plan.r, month), ideal = st === "CONFIRMED";
  const toggle = (id: string) => {
    if (done.includes(id)) return setDone(done.filter(x => x !== id));
    const nd = [...done, id]; setDone(nd);
    onXp(nd.length === total ? `TRIP STAMPED · ${title} · +100 XP` : "+20 XP · stop discovered");
  };
  const rows: [string, number][] = [["Stay", plan.c.stay], ["Food", plan.c.food], ["Local travel", plan.c.move], ["Activities", plan.c.act]];
  return (
    <div className="quest" style={{ marginTop: 14 }}>
      <p className="meta">
        <span className={"pill"} style={{ background: ideal ? "var(--color-secondary)" : "#a33" }}>{st} · {MONTHS[month - 1]}</span>{" "}<span className="meta">NOMIK season status: {SEASON_MEANING[st]}</span><br />
        Coach {plan.tier} ({COACH_MEANING[plan.tier]}) · Best: {plan.r.months.map(m => MONTHS[m - 1]).join(" ")}
      </p>
      {!ideal && <p className="meta">Better window: {MONTHS[plan.r.months[0] - 1]}–{MONTHS[plan.r.months[plan.r.months.length - 1] - 1]}. Roads, weather or crowds can change the experience.</p>}
      {plan.days.map((d, di) => <div className="day" key={di}><b className="mono">DAY {di + 1}</b>
        {d.map((s, si) => { const id = `${di}-${si}`; return (
          <label key={id} className="stop"><input type="checkbox" checked={done.includes(id)} onChange={() => toggle(id)} />
            <span>{["🌅", "☀️", "🌙"][si]} {s[0]} <span className="meta">· {s[2]} · {s[4] ? inr(s[4]) + "/person" : "free"}</span></span></label>); })}
      </div>)}
      <p className="mono">MISSION {done.length}/{total}</p>
      <div className="bar"><i style={{ width: `${(done.length / total) * 100}%` }} /></div>
      {done.length === total && <span className="stamp" style={{ position: "static", display: "inline-block", marginTop: 8 }}>TRIP<br />STAMPED</span>}
      <h4 className="mono">ESTIMATED COST · {inr(plan.pp)} / person</h4>
      {rows.map(([l, v]) => <div key={l} className="meta">{l} {inr(v)}<div className="bar"><i style={{ width: `${(v / plan.c.total) * 100}%` }} /></div></div>)}
      <p><b>Total {inr(plan.c.total)}</b> {plan.fits ? "" : <span style={{ color: "#a33" }}> · {inr(plan.short)} over budget. Try fewer days or travellers.</span>}</p>
      <p className="meta">Estimates only. Verify prices before travelling. Booking arrives in Phase 2.</p>
      <button className="chip" onClick={() => onXp(`PACKED · ${title}`)}>🎒 Pack this plan</button>
    </div>
  );
}

export default function Packages({ onXp }: { onXp: (s: string) => void }) {
  const [tab, setTab] = useState<"curated" | "custom">("curated");
  const [open, setOpen] = useState<string | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [rid, setRid] = useState("munnar"), [area, setArea] = useState(""), [days, setDays] = useState(3), [pax, setPax] = useState(2);
  const [budget, setBudget] = useState(20000), [tags, setTags] = useState<string[]>(["nature", "food"]);
  const region = REGIONS.find(r => r.id === rid)!;
  const plan = build({ regionId: rid, area, days, pax, budget, tags });
  const mSel = <label className="meta">Travel month <select value={month} onChange={e => setMonth(+e.target.value)}>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></label>;
  return (
    <section id="packages"><h2>TRAVEL PACKAGES</h2>
      <p className="meta">Recommendations only. No booking yet. Each package is a mission you can play on the road.</p>
      <div role="tablist" aria-label="Package type">
        {(["curated", "custom"] as const).map(t => <button key={t} role="tab" aria-selected={tab === t} className="chip" style={{ marginRight: 8, background: tab === t ? "var(--color-primary)" : undefined }} onClick={() => setTab(t)}>{t === "curated" ? "🎫 NOMIK PICKS" : "🧭 BUILD YOUR OWN"}</button>)}
        {mSel}
      </div>
      {tab === "curated" ? <div className="cards" style={{ marginTop: 14 }}>
        {CURATED.map((c, ci) => { const p = build(c.o), isOpen = open === c.id, st = season(p.r, month); return (
          <article className="card ticket-card" key={c.id}>
            <div className="stamp pending">SAMPLE<br />DATA</div><p className="mono meta">NOMIK JOURNEY TICKET · {refCode(c.o.regionId, c.o.days, ci + 1)}<br />(NOMIK reference, not a railway PNR)</p>
            <h3>{c.title}</h3><p>{c.line}</p>
            <p className="meta">{p.r.name}, {p.r.state} · {c.o.days} days · from {inr(p.pp)}/person (estimate)</p>
            <p className="meta">Coach {c.o.tier} · {st} in {MONTHS[month - 1]} · Window: {MONTHS[p.r.months[0] - 1]}–{MONTHS[p.r.months[p.r.months.length - 1] - 1]}</p>
            <button className="chip" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : c.id)}>{isOpen ? "Close mission" : "View mission"}</button>
            {isOpen && <PlanView plan={p} title={c.title} month={month} onXp={onXp} />}
          </article>); })}
      </div> : <div className="quest" style={{ marginTop: 14 }}>
        <label>Place <select value={rid} onChange={e => { setRid(e.target.value); setArea(""); }}>{REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}, {r.state}</option>)}</select></label>{" "}
        <label>Area <select value={area} onChange={e => setArea(e.target.value)}><option value="">Anywhere</option>{region.areas.map(a => <option key={a}>{a}</option>)}</select></label>
        <p className="mono">DAYS</p>{[2, 3, 4, 5, 7].map(d => <button key={d} className="chip" aria-pressed={days === d} style={{ marginRight: 6, background: days === d ? "var(--color-primary)" : undefined }} onClick={() => setDays(d)}>{d}</button>)}
        <p className="mono">TRAVELLERS</p>{[1, 2, 3, 4, 6].map(n => <button key={n} className="chip" aria-pressed={pax === n} style={{ marginRight: 6, background: pax === n ? "var(--color-primary)" : undefined }} onClick={() => setPax(n)}>{n}</button>)}
        <p className="mono">TOTAL BUDGET TOKEN</p>{BUDGETS.map(b => <button key={b} className="chip" aria-pressed={budget === b} style={{ marginRight: 6, background: budget === b ? "var(--color-primary)" : undefined }} onClick={() => setBudget(b)}>{inr(b)}</button>)}
        <p className="mono">INTERESTS</p>{TAGS.map(t => <button key={t} className="chip" aria-pressed={tags.includes(t)} style={{ marginRight: 6, background: tags.includes(t) ? "var(--color-primary)" : undefined }} onClick={() => setTags(tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])}>{t}</button>)}
        <PlanView key={`${rid}${area}${days}${pax}${budget}${tags.join()}`} plan={plan} title={`${region.name} custom`} month={month} onXp={onXp} />
      </div>}
    </section>
  );
}
