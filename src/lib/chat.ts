// Utility to trigger UniTop AI Chat open event from anywhere in the app
export function openUniTopChat(prompt?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-unitop-chat", { detail: { prompt } }));
  }
}
