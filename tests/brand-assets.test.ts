import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

async function readPngSize(path: string) {
  const bytes = await readFile(resolve(root, path));
  expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

describe("brand assets", () => {
  it.each([
    ["public/favicon-16x16.png", 16],
    ["public/favicon-32x32.png", 32],
    ["public/apple-touch-icon.png", 180],
    ["public/icon-192.png", 192],
    ["public/icon-512.png", 512],
    ["public/icon-maskable-512.png", 512],
  ])("%s is the expected square size", async (path, size) => {
    await expect(readPngSize(path)).resolves.toEqual({ width: size, height: size });
  });

  it("connects favicon, Apple icon, OGP, Twitter card, and canonical metadata", async () => {
    const html = await readFile(resolve(root, "index.html"), "utf8");

    expect(html).toContain("%BASE_URL%favicon-32x32.png");
    expect(html).toContain("%BASE_URL%favicon-16x16.png");
    expect(html).toContain("%BASE_URL%apple-touch-icon.png");
    expect(html).toContain('property="og:image" content="https://8ega4.github.io/yorimichi-quest/ogp.jpg?v=2"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('rel="canonical" href="https://8ega4.github.io/yorimichi-quest/"');
  });

  it("ships a 1200 by 630 OGP JPEG", async () => {
    const bytes = await readFile(resolve(root, "public/ogp.jpg"));

    expect(bytes[0]).toBe(0xff);
    expect(bytes[1]).toBe(0xd8);
    expect(bytes.byteLength).toBeGreaterThan(50_000);
  });

  it("ships the TOP title as a transparent PNG", async () => {
    const path = "public/assets/yorimichi-title.png";
    const bytes = await readFile(resolve(root, path));

    await expect(readPngSize(path)).resolves.toEqual({ width: 918, height: 259 });
    expect(bytes.includes(Buffer.from("tRNS"))).toBe(true);
  });
});
