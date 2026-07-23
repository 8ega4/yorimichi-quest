import { Camera, Check, ImageSquare, Sparkle, X } from "@phosphor-icons/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../../components/LoadingScreen";
import { PageHeader } from "../../components/PageHeader";
import { db, saveDiscovery } from "../../lib/db";
import { sanitizeImageFile } from "../../lib/image";
import { withSampleMode } from "../../lib/sampleMode";
import type { DiscoveryCategory } from "../../types";

const categories: DiscoveryCategory[] = ["風景", "かたち", "色", "音", "道", "そのほか"];

export function DiscoveryScreen() {
  const navigate = useNavigate();
  const inputId = useId();
  const attempt = useLiveQuery(async () => (await db.attempts.where("status").equals("active").last()) ?? null);
  const [photo, setPhoto] = useState<Blob>();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<DiscoveryCategory>();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!photo) {
      setPhotoUrl(undefined);
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  if (attempt === undefined) return <LoadingScreen />;
  if (!attempt) {
    return (
      <div className="screen empty-screen">
        <Sparkle size={42} weight="fill" aria-hidden="true" />
        <h1>記録するクエストがありません</h1>
        <button className="primary-button" type="button" onClick={() => navigate(withSampleMode("/"))}>今日へ戻る</button>
      </div>
    );
  }

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setProcessing(true);
    setError(undefined);
    try {
      setPhoto(await sanitizeImageFile(file));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "写真を処理できませんでした");
    } finally {
      setProcessing(false);
    }
  };

  const submit = async () => {
    setProcessing(true);
    const discovery = await saveDiscovery(attempt, { note, category, photo });
    navigate(withSampleMode(`/complete/${discovery.id}`));
  };

  return (
    <div className="screen discovery-screen">
      <PageHeader title="発見を記録" backTo={withSampleMode("/quest")} />
      <main className="screen__content discovery-content">
        <section className="discovery-intro">
          <span><Sparkle size={18} weight="fill" aria-hidden="true" /> {attempt.questTitle}</span>
          <h2>何を見つけた？</h2>
          <p>写真もメモも、残したいものだけで大丈夫。</p>
        </section>

        <div className="photo-field">
          {photoUrl ? (
            <div className="photo-preview">
              <img src={photoUrl} alt="選んだ発見の写真" />
              <button className="icon-button photo-remove" type="button" aria-label="写真を外す" onClick={() => setPhoto(undefined)}>
                <X size={22} weight="bold" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label className="photo-picker" htmlFor={inputId}>
              <ImageSquare size={38} weight="duotone" aria-hidden="true" />
              <strong>{processing ? "写真を整えています…" : "写真を1枚えらぶ"}</strong>
              <span>撮影場所のメタデータは保存しません</span>
            </label>
          )}
          <input
            id={inputId}
            className="visually-hidden"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => void handlePhoto(event.target.files?.[0])}
          />
        </div>

        <fieldset className="category-field">
          <legend>見つけたもの <span>任意</span></legend>
          <div>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? "is-selected" : ""}
                aria-pressed={category === item}
                onClick={() => setCategory(category === item ? undefined : item)}
              >
                {category === item ? <Check size={15} weight="bold" aria-hidden="true" /> : null}{item}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="memo-field">
          <span>ひとことメモ <small>任意</small></span>
          <textarea
            value={note}
            maxLength={120}
            rows={3}
            placeholder="木漏れ日が、少し青く見えた。"
            onChange={(event) => setNote(event.target.value)}
          />
          <small>{note.length}/120</small>
        </label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="primary-button" type="button" disabled={processing} onClick={submit}>
          {photo ? <Camera size={22} weight="fill" aria-hidden="true" /> : <Sparkle size={22} weight="fill" aria-hidden="true" />}
          {photo ? "この発見を保存" : "写真なしでクエストクリア"}
        </button>
      </main>
    </div>
  );
}
