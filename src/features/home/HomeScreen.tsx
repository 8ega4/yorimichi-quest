import { ArrowRight, FlagBanner, Footprints, MapPin } from "@phosphor-icons/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "../../components/BottomNav";
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
      <img
        className="home-city-background"
        src={publicAsset("assets/home-city-scene.jpg")}
        alt=""
        aria-hidden="true"
      />
      <main className="screen__content home-content">
        <header className="home-hero-copy">
          <div className="home-title-cluster">
            <h1 className="home-title-image">
              <span className="visually-hidden">寄り道クエスト</span>
              <img
                src={publicAsset("assets/yorimichi-title.png")}
                alt=""
                aria-hidden="true"
              />
            </h1>
          </div>
          <p className="home-message">今日は、いつもの道を<br />ちょっと外れよう。</p>

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
        </header>

        <div className="home-actions">
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
            <aside className="home-mode-note">
              <MapPin size={20} weight="fill" aria-hidden="true" />
              <div>
                <strong>サンプルモードでは位置情報の許可は表示されません。</strong>
                <button type="button" onClick={() => navigate("/choose")}>実際の位置情報で試す</button>
              </div>
            </aside>
          ) : (
            <p className="privacy-hint">
              <Footprints size={18} weight="fill" aria-hidden="true" />
              位置情報は開始するまで使いません
            </p>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
