"use client";
import { useState } from "react";
import { NOMIK_MEDIA } from "@/lib/media";
export default function Logo({ h = 32 }: { h?: number }) {
  const [bad, setBad] = useState(false);
  if (bad) return <span className="logoslot" style={{ height: h }} role="img" aria-label="NOMIK logo (slot)">LOGO SLOT</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={NOMIK_MEDIA.logo} alt="NOMIK" style={{ height: h, width: "auto" }} onError={() => setBad(true)} />;
}
