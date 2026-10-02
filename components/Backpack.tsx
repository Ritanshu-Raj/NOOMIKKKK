"use client";
import { motion } from "framer-motion";
import { RefObject } from "react";
import { useTheme } from "./Theme";
export type Gear = { id: string; icon: string; label: string; unlocks: string };
export const GEAR: Gear[] = [
  { id: "camera", icon: "📷", label: "Camera", unlocks: "Photo spots" },
  { id: "food", icon: "🍴", label: "Food token", unlocks: "Food discovery" },
  { id: "compass", icon: "🧭", label: "Compass", unlocks: "Hidden gems" },
  { id: "key", icon: "🗝️", label: "Brass key", unlocks: "Unique stays" },
  { id: "boots", icon: "🥾", label: "Boots", unlocks: "Adventure" },
  { id: "map", icon: "🗺️", label: "Map", unlocks: "Destinations" },
  { id: "ticket", icon: "🎫", label: "Ticket", unlocks: "Travel routes" },
];
export default function Backpack({ zone, onPack }: { zone: RefObject<HTMLElement>; onPack: (g: Gear) => void }) {
  const { reduced } = useTheme();
  return (
    <nav className="dock" aria-label="Travel backpack">
      <span className="lbl">TRAVEL BACKPACK — drag to the quest, or tap</span>
      {GEAR.map(g => (
        <motion.button key={g.id} className="obj" aria-label={`${g.label}: unlocks ${g.unlocks}. Activate to pack.`}
          drag={!reduced} dragSnapToOrigin dragElastic={0.35} whileHover={{ y: -4, rotate: -4 }} whileDrag={{ scale: 1.2, rotate: 8, zIndex: 50 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          onClick={() => onPack(g)}
          onDragEnd={(_, info) => { const r = zone.current?.getBoundingClientRect(); if (r && info.point.x >= r.left && info.point.x <= r.right && info.point.y >= r.top - window.scrollY * 0 && info.point.y <= r.bottom) onPack(g); }}>
          {g.icon}
        </motion.button>
      ))}
    </nav>
  );
}
