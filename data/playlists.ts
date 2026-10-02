// Add songs: put MP3 files in /public/nomik/audio/ and add a track here. No player changes needed.
export type Track = { title: string; artist: string; audioUrl: string; cover?: string; destination: string; mood: string; duration: string };
export const PLAYLISTS: { id: string; title: string; tracks: Track[] }[] = [
  { id: "night-train", title: "Night Train", tracks: [
    { title: "TRACK SLOT 1", artist: "Upload audio", audioUrl: "/nomik/audio/night-1.mp3", destination: "Anywhere", mood: "Late night", duration: "--:--" },
    { title: "TRACK SLOT 2", artist: "Upload audio", audioUrl: "/nomik/audio/night-2.mp3", destination: "Anywhere", mood: "City lights", duration: "--:--" }] },
  { id: "munnar", title: "Munnar Mornings", tracks: [
    { title: "TRACK SLOT 1", artist: "Upload audio", audioUrl: "/nomik/audio/munnar-1.mp3", destination: "Munnar", mood: "Misty", duration: "--:--" }] },
];
