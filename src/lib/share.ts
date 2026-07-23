import type { Discovery } from "../types";
import { publicAsset } from "./assets";

export interface ShareCardContent {
  brand: "寄り道クエスト";
  questTitle: string;
  message: "今日、いつもの道を少し外れた。";
  discoveryLabel: string;
  photo?: Blob;
}

export function buildShareCardContent(discovery: Discovery): ShareCardContent {
  return {
    brand: "寄り道クエスト",
    questTitle: discovery.questTitle,
    message: "今日、いつもの道を少し外れた。",
    discoveryLabel: `発見 #${String(discovery.discoveryNumber).padStart(3, "0")}`,
    photo: discovery.photo,
  };
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("共有画像の素材を読み込めませんでした"));
    image.src = source;
  });
}

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

export async function createShareImage(discovery: Discovery) {
  const content = buildShareCardContent(discovery);
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("共有画像を生成できませんでした");

  context.fillStyle = "#f7eedb";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = await loadImage(publicAsset("assets/washi-paper.jpg"));
  context.globalAlpha = 0.42;
  context.drawImage(texture, 0, 0, canvas.width, canvas.height);
  context.globalAlpha = 1;

  const mediaSource = content.photo
    ? URL.createObjectURL(content.photo)
    : publicAsset("assets/yorimichi-quest-key-visual.jpg");
  const media = await loadImage(mediaSource);
  context.save();
  context.beginPath();
  context.roundRect(72, 214, 936, 700, 56);
  context.clip();
  drawCover(context, media, 72, 214, 936, 700);
  context.restore();
  if (content.photo) URL.revokeObjectURL(mediaSource);

  context.fillStyle = "#0a7d7d";
  context.font = '900 58px "M PLUS Rounded 1c", sans-serif';
  context.fillText(content.brand, 72, 126);
  context.fillStyle = "#e94d12";
  context.font = '900 66px "M PLUS Rounded 1c", sans-serif';
  context.fillText(content.questTitle, 72, 1010, 936);
  context.fillStyle = "#3e342c";
  context.font = '700 41px "M PLUS Rounded 1c", sans-serif';
  context.fillText(content.message, 72, 1110, 936);
  context.fillStyle = "#7ba12b";
  context.font = '900 34px "M PLUS Rounded 1c", sans-serif';
  context.fillText(content.discoveryLabel, 72, 1245);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("共有画像を生成できませんでした"))),
      "image/png",
    );
  });
}

export async function shareDiscovery(discovery: Discovery) {
  const blob = await createShareImage(discovery);
  const file = new File([blob], `yorimichi-${discovery.discoveryNumber}.png`, { type: "image/png" });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: "寄り道クエスト" });
    return "shared" as const;
  }
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  return "downloaded" as const;
}
