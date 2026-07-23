export function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatDuration(totalSeconds: number) {
  if (totalSeconds < 60) return `${Math.max(1, totalSeconds)}秒`;
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${minutes}分`;
}

export function formatJournalDate(timestamp: number) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(timestamp);
}
