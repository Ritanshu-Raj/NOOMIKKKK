export const track = (event: string, props?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("nomik:analytics", { detail: { event, props } })); // plug a provider in here
  if (process.env.NODE_ENV !== "production") console.debug("[nomik]", event, props);
};
