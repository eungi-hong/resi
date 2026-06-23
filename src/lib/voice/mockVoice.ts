export function isBrowserSpeechAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speakWithBrowser(text: string) {
  if (!isBrowserSpeechAvailable()) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
  return true;
}
