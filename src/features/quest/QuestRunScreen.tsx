import { FlagBanner, HandPalm, MapPin, Pause, Sparkle } from "@phosphor-icons/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../../components/LoadingScreen";
import { QuestMap } from "../map/QuestMap";
import { useElapsed } from "../../hooks/useElapsed";
import { useLocationTracking } from "../../hooks/useLocationTracking";
import { abandonAttempt, db } from "../../lib/db";
import { isSampleMode, withSampleMode } from "../../lib/sampleMode";
import { LOCATION_PERMISSION_FALLBACK_MESSAGE } from "../../services/location";
import { formatElapsed } from "../../lib/time";

export function QuestRunScreen() {
  const navigate = useNavigate();
  const attempt = useLiveQuery(async () => (await db.attempts.where("status").equals("active").last()) ?? null);
  const track = useLiveQuery(
    () => (attempt ? db.locationTracks.where("attemptId").equals(attempt.id).sortBy("sequence") : []),
    [attempt?.id],
    [],
  );
  const elapsed = useElapsed(attempt?.startedAt);
  const locationNotice = useLocationTracking(attempt ?? undefined);
  const sampleMode = isSampleMode();
  const modeNotice = sampleMode
    ? "サンプルモード：位置情報の許可は表示されません。"
    : attempt?.locationMode === "sample"
      ? LOCATION_PERMISSION_FALLBACK_MESSAGE
      : undefined;

  if (attempt === undefined) return <LoadingScreen />;
  if (!attempt) {
    return (
      <div className="screen empty-screen">
        <FlagBanner size={42} weight="fill" aria-hidden="true" />
        <h1>進行中のクエストはありません</h1>
        <button className="primary-button" type="button" onClick={() => navigate(withSampleMode("/choose"))}>寄り道を選ぶ</button>
      </div>
    );
  }

  const stopQuest = async () => {
    await abandonAttempt(attempt.id);
    navigate(withSampleMode("/"));
  };

  return (
    <div className="screen quest-run-screen">
      <main className="quest-run-layout">
        <div className="map-stage">
          <QuestMap track={track} />
          <div className="safety-banner">
            <HandPalm size={20} weight="fill" aria-hidden="true" />
            画面は立ち止まって確認しよう
          </div>
          <div className="timer-badge" aria-label={`経過時間 ${formatElapsed(elapsed)}`}>
            <span>経過</span><strong>{formatElapsed(elapsed)}</strong>
          </div>
        </div>

        <section className="quest-drawer">
          {locationNotice || modeNotice ? (
            <p className="location-notice">
              <MapPin size={18} weight="fill" aria-hidden="true" />
              {locationNotice ?? modeNotice}
            </p>
          ) : null}
          <div className="quest-drawer__heading">
            <span><FlagBanner size={18} weight="fill" aria-hidden="true" /> クエスト中</span>
            <small>{attempt.plannedMinutes}分</small>
          </div>
          <h1>{attempt.questTitle}</h1>
          <p>{attempt.questInstruction}</p>
          <button className="primary-button" type="button" onClick={() => navigate(withSampleMode("/discover"))}>
            <Sparkle size={23} weight="fill" aria-hidden="true" />
            発見を記録する
          </button>
          <button className="text-button" type="button" onClick={stopQuest}>
            <Pause size={20} weight="fill" aria-hidden="true" />
            今回はここまで
          </button>
        </section>
      </main>
    </div>
  );
}
