import { REGIONS } from "@/lib/packages";
export type Kind = "place" | "food" | "stay" | "experience";
export type Entry = { id: string; kind: Kind; dest: string; title: string; blurb: string; budget: string; tags: string[]; status: "SAMPLE" };
const e = (dest: string, kind: Kind, title: string, blurb: string, budget: string, tags: string[] = []): Entry =>
  ({ id: `${dest}-${kind}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, kind, dest, title, blurb, budget, tags, status: "SAMPLE" });
export const BLURB: Record<string, string> = {
  munnar: "Mist, tea slopes and slow mornings in the Western Ghats.", puri: "Sea, stone temples and a lagoon on Odisha's coast.",
  jaipur: "Forts, bazaars and rooftop sunsets in Rajasthan's pink city.", spiti: "High-altitude monasteries and huge skies. Summer access only.",
  kolkata: "Trams, adda, sweets and street food in a city of conversation." };
const BASE: Entry[] = [
  e("munnar", "place", "Tea Museum", "How the hills became tea country.", "₹200", ["heritage"]), e("munnar", "food", "Local mess meals", "Simple Kerala meals where locals eat.", "₹150–300", ["food"]), e("munnar", "stay", "Plantation homestay", "Family-run stay among tea rows.", "₹1,500–3,000/night", ["slow"]),
  e("puri", "place", "Raghurajpur village", "Artisan village of pattachitra painters.", "₹100", ["culture"]), e("puri", "food", "Temple-style prasad meals", "Regional vegetarian Odia food.", "₹100–250", ["food"]), e("puri", "stay", "Beachside guesthouse", "Basic, breezy, walkable to the sea.", "₹1,000–2,500/night", ["budget"]),
  e("jaipur", "place", "Stepwells and old lanes", "Architecture best seen on foot.", "₹100", ["history"]), e("jaipur", "food", "Old City snack crawl", "Kachori, lassi and sweets.", "₹200–400", ["food"]), e("jaipur", "stay", "Haveli stay", "Heritage-style rooms in the old quarter.", "₹2,500–6,000/night", ["unique"]),
  e("spiti", "place", "Key Monastery", "Hilltop monastery above the Spiti river.", "₹100", ["culture"]), e("spiti", "food", "Homestay kitchens", "Thukpa and butter tea with a host family.", "₹250–400", ["food"]), e("spiti", "stay", "Village homestay", "Warm, simple rooms. Book ahead in season.", "₹1,200–2,500/night", ["slow"]),
  e("kolkata", "place", "College Street", "Book stalls, coffee houses and adda.", "Free", ["culture"]), e("kolkata", "food", "Phuchka and roll stalls", "The classic street-food loop.", "₹100–300", ["food"]), e("kolkata", "stay", "Old-city heritage stay", "Colonial-era buildings turned guesthouses.", "₹1,500–4,000/night", ["heritage"]),
];
const EXPS = REGIONS.flatMap(r => r.items.map(i => e(r.id, "experience", i[0], `${i[2]} · ${["Morning", "Afternoon", "Evening"][i[3]]}`, i[4] ? `₹${i[4]}/person` : "Free", [i[1]])));
export const ENTRIES: Entry[] = [...BASE, ...EXPS];
