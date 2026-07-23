import { FlagBanner, ShareNetwork, Sparkle, Star } from "@phosphor-icons/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingScreen } from "../../components/LoadingScreen";
import { db } from "../../lib/db";
import { withSampleMode } from "../../lib/sampleMode";
import { shareDiscovery } from "../../lib/share";

export function CompleteScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const discovery = useLiveQuery(async () => (id ? (await db.discoveries.get(id)) ?? null : null), [id]);
  const [shareStatus, setShareStatus] = useState<string>();

  if (discovery === undefined) return <LoadingScreen />;
  if (!discovery) return <div className="screen empty-screen"><h1>記録が見つかりません</h1></div>;

  const share = async () => {
    try {
      const result = await shareDiscovery(discovery);
      setShareStatus(result === "shared" ? "共有しました" : "共有画像を保存しました");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("共有を完了できませんでした");
    }
  };

  return (
    <div className="screen complete-screen">
      <main className="complete-content">
        <div className="celebration" aria-hidden="true">
          <Star className="celebration__star celebration__star--one" size={30} weight="fill" />
          <Sparkle className="celebration__star celebration__star--two" size={34} weight="fill" />
          <Star className="celebration__star celebration__star--three" size={24} weight="fill" />
          <div className="stamp-mark">
            <FlagBanner size={56} weight="fill" />
            <span>CLEAR</span>
          </div>
        </div>
        <p className="discovery-number">発見 #{String(discovery.discoveryNumber).padStart(3, "0")}</p>
        <h1>クエストクリア！</h1>
        <h2>{discovery.questTitle}</h2>
        <p className="complete-message">今日の寄り道を記録しました</p>
        <p className="complete-submessage">また気が向いた日に、続きを探そう。</p>

        <div className="complete-actions">
          <button className="primary-button" type="button" onClick={() => void share()}>
            <ShareNetwork size={23} weight="fill" aria-hidden="true" />
            発見カードを共有
          </button>
          <button className="secondary-button" type="button" onClick={() => navigate(withSampleMode("/journal"))}>
            冒険手帳を見る
          </button>
          <button className="text-button" type="button" onClick={() => navigate(withSampleMode("/"))}>今日へ戻る</button>
        </div>
        {shareStatus ? <p className="share-status" role="status">{shareStatus}</p> : null}
      </main>
    </div>
  );
}
