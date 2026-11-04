/** Browser TTS for English vocabulary terms. */
export function speakVocabTerm(term: string, lang = "en-US"): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(term)
  utterance.lang = lang
  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
}
