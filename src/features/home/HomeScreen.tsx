import { ArrowRight, FlagBanner, Footprints, MapPin, Sparkle } from "@phosphor-icons/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "../../components/BottomNav";
import { BrandTitle } from "../../components/BrandTitle";
import { publicAsset } from "../../lib/assets";
import { db } from "../../lib/db";
import { isSampleMode, withSampleMode } from "../../lib/sampleMode";

export function HomeScreen() {
  const navigate = useNavigate();
  const discoveries = useLiveQuery(() => db.discoveries.toArray(), [], []);
  const activeAttempt = useLiveQuery(() => db.attempts.where("status").equals("active").last());
  const sample = isSampleMode();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayCount = discoveries.filter((item) => item.createdAt >= startOfToday.getTime()).length;

  return (
    <div className="screen screen--with-nav home-screen">
      <main className="screen__content home-content">
        <BrandTitle />
        <p className="home-message">今日は、いつもの道を<br />ちょっと外れよう。</p>

        <figure className="hero-scene">
          <img
            src={publicAsset("assets/yorimichi-quest-key-visual.jpg")}
            alt="黄色く光る寄り道の軌跡と、小さな旗が並ぶ紙細工の街"
          />
          <figcaption>
            <Sparkle size={18} weight="fill" aria-hidden="true" />
            いつもの街に、小さな発見を。
          </figcaption>
        </figure>

        <section className="today-stats" aria-label="寄り道の記録">
          <div>
            <span>今日の発見</span>
            <strong>{todayCount}<small>こ</small></strong>
          </div>
          <div>
            <span>これまでのクエスト</span>
            <strong>{discoveries.length}<small>回</small></strong>
          </div>
        </section>

        <button
          className="primary-button primary-button--hero"
          type="button"
          onClick={() => navigate(withSampleMode(activeAttempt ? "/quest" : "/choose"))}
        >
          <FlagBanner size={25} weight="fill" aria-hidden="true" />
          <span>{activeAttempt ? "寄り道をつづける" : "今日の寄り道をはじめる"}</span>
          <ArrowRight size={22} weight="bold" aria-hidden="true" />
        </button>
        {sample ? (
          <aside className="location-mode-card">
            <MapPin size={23} weight="fill" aria-hidden="true" />
            <div>
              <strong>サンプルモードでは位置情報の許可は表示されません。</strong>
              <span>固定された安全な軌跡で体験しています。</span>
            </div>
            <button type="button" onClick={() => navigate("/choose")}>実際の位置情報で試す</button>
          </aside>
        ) : (
          <p className="privacy-hint">
            <Footprints size={18} weight="fill" aria-hidden="true" />
            位置情報は開始するまで使いません
          </p>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
