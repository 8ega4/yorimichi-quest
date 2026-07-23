import { Binoculars, Camera, CheckCircle, Footprints, FlagBanner, MapPin, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { moodLabels, selectQuest } from "../../data/quests";
import { createAttempt, db } from "../../lib/db";
import { createId } from "../../lib/id";
import { isSampleMode, withSampleMode } from "../../lib/sampleMode";
import { isGeolocationAvailable } from "../../services/location";
import type { QuestDuration, QuestMood } from "../../types";

const durationOptions: QuestDuration[] = [5, 10, 15];
const moodOptions: Array<{ value: QuestMood; icon: typeof Binoculars }> = [
  { value: "look", icon: Binoculars },
  { value: "walk", icon: Footprints },
  { value: "photo", icon: Camera },
];

export function QuestSelectScreen() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState<QuestDuration>(10);
  const [mood, setMood] = useState<QuestMood>("walk");
  const [starting, setStarting] = useState(false);
  const sample = isSampleMode();
  const geolocationAvailable = isGeolocationAvailable();
  const quest = useMemo(() => selectQuest(new Date(), duration, mood), [duration, mood]);

  const startQuest = async () => {
    setStarting(true);
    await createAttempt({
      id: createId("attempt"),
      questId: quest.id,
      questTitle: quest.title,
      questInstruction: quest.instruction,
      plannedMinutes: duration,
      mood,
      startedAt: Date.now(),
      status: "active",
      locationMode: sample ? "sample" : "live",
    });
    await db.settings.put({
      id: "local",
      preferredDuration: duration,
      preferredMood: mood,
      hasSeenWelcome: true,
    });
    navigate(withSampleMode("/quest"));
  };

  return (
    <div className="screen choose-screen">
      <PageHeader title="今日の寄り道" backTo={withSampleMode("/")} />
      <main className="screen__content choose-content">
        {sample ? (
          <aside className="location-mode-card location-mode-card--compact">
            <MapPin size={23} weight="fill" aria-hidden="true" />
            <div>
              <strong>サンプルモードでは位置情報の許可は表示されません。</strong>
              <span>実際の位置情報を使う場合は通常モードへ切り替えてください。</span>
            </div>
            <button type="button" onClick={() => navigate("/choose")}>実際の位置情報で試す</button>
          </aside>
        ) : !geolocationAvailable ? (
          <aside className="location-mode-card location-mode-card--warning">
            <WarningCircle size={23} weight="fill" aria-hidden="true" />
            <div>
              <strong>このブラウザでは位置情報の許可を表示できません。</strong>
              <span>SafariやChromeなど、位置情報に対応したブラウザで開いてください。</span>
            </div>
          </aside>
        ) : null}
        <p className="section-lead">今の気分にちょうどいい<br />小さなクエストを選ぼう。</p>

        <fieldset className="choice-group">
          <legend>どのくらい寄り道する？</legend>
          <div className="segmented-options">
            {durationOptions.map((option) => (
              <button
                key={option}
                className={duration === option ? "is-selected" : ""}
                type="button"
                aria-pressed={duration === option}
                onClick={() => setDuration(option)}
              >
                <strong>{option}</strong><span>分</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="choice-group">
          <legend>今日は、どんな気分？</legend>
          <div className="mood-options">
            {moodOptions.map(({ value, icon: Icon }) => (
              <button
                key={value}
                className={mood === value ? "is-selected" : ""}
                type="button"
                aria-pressed={mood === value}
                onClick={() => setMood(value)}
              >
                <Icon size={27} weight="fill" aria-hidden="true" />
                <span>{moodLabels[value]}</span>
                {mood === value ? <CheckCircle size={20} weight="fill" aria-hidden="true" /> : null}
              </button>
            ))}
          </div>
        </fieldset>

        <article className="quest-ticket" aria-live="polite">
          <div className="quest-ticket__flag"><FlagBanner size={25} weight="fill" aria-hidden="true" /></div>
          <span>今日のクエスト</span>
          <h2>{quest.title}</h2>
          <p>{quest.description}</p>
        </article>

        {!sample && geolocationAvailable ? (
          <p className="permission-timing-note">
            <MapPin size={18} weight="fill" aria-hidden="true" />
            位置情報の許可は「このクエストをはじめる」を押した後に表示されます。
          </p>
        ) : null}
        <button className="primary-button" type="button" disabled={starting} onClick={startQuest}>
          <FlagBanner size={23} weight="fill" aria-hidden="true" />
          {starting ? "準備しています…" : "このクエストをはじめる"}
        </button>
        <p className="safety-note">私有地や危険な場所には入らず、歩きやすい道を選んでください。</p>
      </main>
    </div>
  );
}
