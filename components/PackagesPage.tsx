"use client";
import Packages from "./Packages";
import DepartureBoard from "./DepartureBoard";
import { useStore } from "@/lib/store";
export default function PackagesPage() {
  const { addXp, addStamp } = useStore();
  const onXp = (m: string) => { if (m.startsWith("TRIP STAMPED")) { addXp(100); addStamp(m.split(" · ")[1] || "Trip"); } else if (m.startsWith("PACKED")) addXp(10); else addXp(20); };
  return <><DepartureBoard month={new Date().getMonth() + 1} /><Packages onXp={onXp} /></>;
}
