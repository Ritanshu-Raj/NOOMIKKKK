const b = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export default function sitemap() { return [""].map(p => ({ url: b + p })); }
