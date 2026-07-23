import { EyeSlash, MapTrifold, Path } from "@phosphor-icons/react";
import { useLiveQuery } from "dexie-react-hooks";
import { BottomNav } from "../../components/BottomNav";
import { db } from "../../lib/db";
import { QuestMap } from "./QuestMap";

export function MapHistoryScreen() {
  const latestAttempt = useLiveQuery(() => db.attempts.orderBy("startedAt").last());
  const track = useLiveQuery(
    () => (latestAttempt ? db.locationTracks.where("attemptId").equals(latestAttempt.id).sortBy("sequence") : []),
    [latestAttempt?.id],
    [],
  );
  return (
    <div className="screen screen--with-nav map-history-screen">
      <header className="map-history-heading">
        <div><MapTrifold size={30} weight="duotone" aria-hidden="true" /></div>
        <h1>寄り道の地図</h1>
        <p>直近の歩みを、光の道で振り返ります。</p>
      </header>
      <main className="map-history-content">
        <QuestMap track={track} label="直近の寄り道の地図" />
        <section className="map-privacy-sheet">
          <h2><Path size={21} weight="fill" aria-hidden="true" /> この軌跡について</h2>
          <p>歩いた軌跡はこの端末の中だけに保存されます。共有カードや冒険手帳には地図・住所・座標を載せません。</p>
          <span><EyeSlash size={18} weight="fill" aria-hidden="true" /> 記録データのサーバー送信なし</span>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
