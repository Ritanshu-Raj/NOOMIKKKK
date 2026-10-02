"use client";
export default function Err({ reset }: { error: Error; reset: () => void }) { return <main className="page" role="alert"><h1>SIGNAL FAILURE</h1><p>Something went wrong.</p><button className="chip" onClick={reset}>Try again</button></main>; }
