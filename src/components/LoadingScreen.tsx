import { Sparkle } from "@phosphor-icons/react";

export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <Sparkle size={30} weight="fill" aria-hidden="true" />
      <span>寄り道をひらいています…</span>
    </div>
  );
}
