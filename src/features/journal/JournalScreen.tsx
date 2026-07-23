import { FlagBanner, Notebook, Sparkle } from "@phosphor-icons/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { BottomNav } from "../../components/BottomNav";
import { db } from "../../lib/db";
import { formatDuration, formatJournalDate } from "../../lib/time";
import type { Discovery } from "../../types";

function JournalEntry({ discovery }: { discovery: Discovery }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    if (!discovery.photo) return undefined;
    const nextUrl = URL.createObjectURL(discovery.photo);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [discovery.photo]);

  return (
    <article className="journal-entry">
      <div className="journal-entry__marker" aria-hidden="true">
        {url ? <img src={url} alt="" /> : <FlagBanner size={25} weight="fill" />}
      </div>
      <div className="journal-entry__body">
        <div className="journal-entry__meta">
          <time dateTime={new Date(discovery.createdAt).toISOString()}>{formatJournalDate(discovery.createdAt)}</time>
          <span>#{String(discovery.discoveryNumber).padStart(3, "0")}</span>
        </div>
        <h2>{discovery.questTitle}</h2>
        {discovery.note ? <p>{discovery.note}</p> : <p className="journal-entry__quiet">ことばにしない発見を残しました。</p>}
        <div className="journal-entry__footer">
          <span>{formatDuration(discovery.durationSeconds)}</span>
          {discovery.category ? <span>{discovery.category}</span> : null}
        </div>
      </div>
    </article>
  );
}

export function JournalScreen() {
  const discoveries = useLiveQuery(() => db.discoveries.orderBy("createdAt").reverse().toArray(), [], []);
  return (
    <div className="screen screen--with-nav journal-screen">
      <header className="journal-heading">
        <div><Notebook size={30} weight="duotone" aria-hidden="true" /><span>MY YORIMICHI LOG</span></div>
        <h1>寄り道の冒険手帳</h1>
        <p>見過ごさなかった景色の記録。</p>
      </header>
      <main className="journal-book">
        {discoveries.length ? (
          <div className="journal-timeline">
            {discoveries.map((discovery) => <JournalEntry key={discovery.id} discovery={discovery} />)}
          </div>
        ) : (
          <div className="journal-empty">
            <Sparkle size={42} weight="duotone" aria-hidden="true" />
            <h2>最初の1ページは、まだまっさら。</h2>
            <p>寄り道をすると、ここに小さな発見が増えていきます。</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
