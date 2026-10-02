"use client";
import { useStore } from "@/lib/store";
import type { Entry } from "@/data/content";
export function SaveBtn({ id }: { id: string }) {
  const { saved, toggleSave } = useStore(); const on = saved.includes(id);
  return <button className="chip" aria-pressed={on} onClick={() => toggleSave(id)}>{on ? "🎒 Packed" : "➕ Pack"}</button>;
}
export default function EntryCard({ e }: { e: Entry }) {
  return <article className="card"><div className="stamp pending">SAMPLE<br />DATA</div>
    <p className="meta">{e.kind.toUpperCase()} · {e.budget} (estimate)</p><h3>{e.title}</h3><p>{e.blurb}</p><p className="meta">{e.tags.join(" · ")}</p><SaveBtn id={e.id} /></article>;
}
