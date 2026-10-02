"use client";
import { CURATED, REGIONS, MONTHS, season, SEASON_MEANING, refCode } from "@/lib/packages";
const STATUS = { CONFIRMED: "BOARDING", RAC: "RAC", WL: "WL" } as const;
export default function DepartureBoard({ month }: { month: number }) {
  return (
    <section id="departures"><h2>NOMIK DEPARTURES</h2>
      <p className="meta">NOMIK journey states for {MONTHS[month - 1]}. These are not train bookings. Sample data until verified.</p>
      <div className="board" role="table" aria-label="NOMIK departures">
        <div className="brow head" role="row"><span>DESTINATION</span><span>JOURNEY</span><span>COACH</span><span>SEASON</span><span>PLAT</span><span>STATUS</span></div>
        {CURATED.map((c, i) => { const r = REGIONS.find(x => x.id === c.o.regionId)!, s = season(r, month); return (
          <div className="brow" role="row" key={c.id} title={SEASON_MEANING[s]}>
            <span>{r.name.toUpperCase()}</span><span>{c.title}</span><span>{c.o.tier}</span><span>{s}</span><span>{i + 1}</span><span className={"st " + s}>{STATUS[s]}</span></div>); })}
      </div>
      <p className="meta"><b>CONFIRMED</b> ideal window · <b>RAC</b> shoulder season, with trade-offs · <b>WL</b> not preferred season, another window suggested.</p>
    </section>
  );
}
