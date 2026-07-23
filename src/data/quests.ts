import type { Quest, QuestDuration, QuestMood } from "../types";

export const quests: Quest[] = [
  {
    id: "next-street",
    title: "一本となりの道へ",
    description: "普段使う道から一本だけ外れ、気になったものを一つ見つける。",
    instruction: "安全に歩ける道を選び、一本だけとなりへ。気になったものを一つ見つけよう。",
    durations: [5, 10, 15],
    moods: ["look", "walk"],
    category: "道",
  },
  {
    id: "round-things",
    title: "街の丸を探せ",
    description: "丸い形を三つ見つける。",
    instruction: "看板、窓、植木鉢。街に隠れた丸い形を三つ探そう。",
    durations: [5, 10, 15],
    moods: ["look", "walk", "photo"],
    category: "かたち",
  },
  {
    id: "look-up",
    title: "上を向いて歩こう",
    description: "建物の二階より上にある面白いものを探す。",
    instruction: "立ち止まれる安全な場所で、二階より上を眺めて面白いものを探そう。",
    durations: [5, 10, 15],
    moods: ["look", "walk", "photo"],
    category: "風景",
  },
  {
    id: "unknown-color",
    title: "知らない色を一枚",
    description: "今日いちばん気になった色を撮る。",
    instruction: "今日の空気に似合う、名前をつけたくなる色を一つ見つけよう。",
    durations: [5, 10, 15],
    moods: ["look", "photo"],
    category: "色",
  },
  {
    id: "sound-checkpoint",
    title: "音のチェックポイント",
    description: "立ち止まって、聞こえた音を三つ記録する。",
    instruction: "安全な場所で少し立ち止まり、遠くと近くの音を三つ聞いてみよう。",
    durations: [5, 10, 15],
    moods: ["look", "walk"],
    category: "音",
  },
  {
    id: "tiny-entrance",
    title: "小さな入口",
    description: "普段なら見過ごす細い道や入口を見つける。",
    instruction: "入らずに眺めるだけでも大丈夫。街の小さな入口を一つ見つけよう。",
    durations: [5, 10, 15],
    moods: ["look", "walk", "photo"],
    category: "道",
  },
];

export const moodLabels: Record<QuestMood, string> = {
  look: "見る",
  walk: "歩く",
  photo: "撮る",
};

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function selectQuest(date: Date, duration: QuestDuration, mood: QuestMood) {
  const candidates = quests.filter(
    (quest) => quest.durations.includes(duration) && quest.moods.includes(mood),
  );
  const localDayNumber = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  const base = hashString(`${duration}|${mood}`) % candidates.length;
  const index = (base + localDayNumber) % candidates.length;

  return candidates[index];
}
