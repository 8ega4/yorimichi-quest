const MAX_IMAGE_EDGE = 1600;

export async function sanitizeImageFile(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("画像を処理できませんでした");
  context.fillStyle = "#f7eedb";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("画像を保存できませんでした"))),
      "image/jpeg",
      0.86,
    );
  });
}

export function blobUrl(blob?: Blob) {
  return blob ? URL.createObjectURL(blob) : undefined;
}
