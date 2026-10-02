# NOMIK (prototype v0.2)
Next.js 14 + React 18 + TypeScript + Framer Motion. Fully static, no backend, no environment variables, no secrets.

## Local development
    npm install && npm run dev      # http://localhost:3000
## Production build
    npm run build && npm start
## Deployment
Vercel: push to GitHub, import the repo at vercel.com/new, click Deploy (Next.js is auto-detected).
Netlify/Cloudflare Pages: use the Next.js preset. No env vars needed.

## What exists
Train-window intro (skippable) · Day/Night tokens (Travel Kit toggle) · tactile Backpack (drag + tap) · budget tokens and quest builder · connected "One Journey" graph · NOMIK Departures board · journey tickets with NOMIK reference codes (not railway PNRs) · coach classes Sleeper/3AC/2AC/1AC · season status CONFIRMED/RAC/WL · custom package builder with cost breakdown · mission checklist with XP and stamp · Yeti drone (cursor-tracking, sleeps when idle, reward reactions) · optional sound (off by default) · reduced-motion toggle · skip link and ARIA.

## Day/Night system
Tokens live in `app/globals.css` (`--color-*`, `--sky*`, `--hill*`) under `[data-theme="day"|"night"]`. State is in `components/Theme.tsx` (`themeMode`, `timeOfDay`). To add DAWN/DUSK, add a `[data-theme="dawn"]` block and extend the `Mode` type.

## Adding content (all in `lib/packages.ts`)
- Destination: add an object to `REGIONS` (id, name, state, best `months`, `areas`, `base` costs, `items` = [title, tag, area, slot 0/1/2, cost per person]).
- Package: add an entry to `CURATED` with a `regionId`, days, tier and interests.
- Coach classes: `F` multipliers. Season logic: `season()`.
- Quests/experiences: edit `EXP` in `app/page.tsx` (move to `lib/` when a CMS exists).

## Asset replacement
Official logo and Day/Night artwork are NOT included yet (none were supplied). Put files in `public/` and replace the placeholder "NOMIK" text and CSS hills in `components/TrainWindow.tsx` and the `.sky/.layer` rules in `globals.css`.

## Future backend
Replace the arrays in `lib/packages.ts` with API/DB calls. Each content record should carry status, createdAt, updatedAt, lastVerifiedAt, source, notes. Lifecycle: PENDING, REVIEWED, VERIFIED, REPORTED/REMOVED.

## Known limitations
All prices, seasons and itineraries are SAMPLE DATA and unverified. No booking. Progress is not persisted. Night mode changes colours only. Not built yet: destination finder search, travel windows, Leaving Soon, layover, weekend engine, mood dials, constraint cards, group, remix, mystery envelope, ghost stop, bingo, dispatches, flip-page journal, postcards, decorative cursor, map, official logo and artwork.
