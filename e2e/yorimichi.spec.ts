import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
}

test("sample mode completes the core journey and restores an active quest", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/?sample=1");
  await expect(page.getByRole("heading", { name: "寄り道クエスト" })).toBeVisible();
  await expect(page.getByText("今日は、いつもの道を")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "今日の寄り道をはじめる" }).click();
  await expect(page.getByRole("heading", { name: "今日の寄り道" })).toBeVisible();
  await page.getByRole("button", { name: "5 分", exact: true }).click();
  await page.getByRole("button", { name: "見る" }).click();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "このクエストをはじめる" }).click();
  await expect(page.getByText("画面は立ち止まって確認しよう")).toBeVisible();
  await expect(page.getByRole("button", { name: "発見を記録する" })).toBeVisible();
  await page.waitForTimeout(1_400);
  await page.reload();
  await expect(page.getByRole("button", { name: "発見を記録する" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "発見を記録する" }).click();
  await expect(page.getByRole("heading", { name: "発見を記録" })).toBeVisible();
  await page.getByRole("button", { name: "色" }).click();
  await page.getByPlaceholder("木漏れ日が、少し青く見えた。").fill("午後の道で、金色の葉を見つけた。");
  await page.getByRole("button", { name: "写真なしでクエストクリア" }).click();

  await expect(page.getByRole("heading", { name: "クエストクリア！" })).toBeVisible();
  await expect(page.getByText("今日の寄り道を記録しました")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "canShare", { configurable: true, value: undefined });
  });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "発見カードを共有" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^yorimichi-\d+\.png$/);

  await page.getByRole("button", { name: "冒険手帳を見る" }).click();
  await expect(page.getByRole("heading", { name: "寄り道の冒険手帳" })).toBeVisible();
  await expect(page.getByText("午後の道で、金色の葉を見つけた。")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(consoleErrors).toEqual([]);
});

test("geolocation is requested only after the explicit quest start action", async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __geoCalls: number }).__geoCalls = 0;
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        watchPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
          (window as Window & { __geoCalls: number }).__geoCalls += 1;
          queueMicrotask(() => error({ code: 1, message: "denied", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }));
          return 1;
        },
        clearWatch: () => undefined,
      },
    });
  });

  await page.goto("/");
  await expect.poll(() => page.evaluate(() => (window as Window & { __geoCalls: number }).__geoCalls)).toBe(0);
  await page.getByRole("button", { name: "今日の寄り道をはじめる" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { __geoCalls: number }).__geoCalls)).toBe(0);
  await expect(page.getByText("位置情報の許可は「このクエストをはじめる」を押した後に表示されます。")).toBeVisible();
  await page.getByRole("button", { name: "このクエストをはじめる" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { __geoCalls: number }).__geoCalls)).toBe(1);
  await expect(page.getByText("位置情報を利用できませんでした。許可画面が出ない場合は、SafariやChromeで開くか、ブラウザ設定で位置情報を許可してください。いまはサンプル軌跡で続けています。")).toBeVisible();
  await page.reload();
  await expect(page.getByText("位置情報を利用できませんでした。許可画面が出ない場合は、SafariやChromeで開くか、ブラウザ設定で位置情報を許可してください。いまはサンプル軌跡で続けています。")).toBeVisible();
});

test("sample mode clearly explains that no location permission will appear", async ({ page }) => {
  await page.goto("/?sample=1");
  await expect(page.getByText("サンプルモードでは位置情報の許可は表示されません。")).toBeVisible();
  const switchButton = page.getByRole("button", { name: "実際の位置情報で試す" });
  await expect(switchButton).toBeVisible();
  await switchButton.click();
  await expect(page).toHaveURL("/choose");
});

test("unsupported browsers explain why the permission dialog cannot appear", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "今日の寄り道をはじめる" }).click();
  await expect(page.getByText("このブラウザでは位置情報の許可を表示できません。")).toBeVisible();
  await expect(page.getByText("SafariやChromeなど、位置情報に対応したブラウザで開いてください。")).toBeVisible();
});

test("primary controls are keyboard reachable with a visible focus indicator", async ({ page }) => {
  await page.goto("/?sample=1");
  await page.keyboard.press("Tab");

  const focus = await page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active) return null;
    const styles = getComputedStyle(active);
    return {
      tagName: active.tagName,
      label: active.textContent?.trim(),
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
    };
  });

  expect(focus?.tagName).toBe("BUTTON");
  expect(focus?.label).toContain("今日の寄り道をはじめる");
  expect(focus?.outlineStyle).not.toBe("none");
  expect(Number.parseFloat(focus?.outlineWidth ?? "0")).toBeGreaterThanOrEqual(2);
});

for (const width of [360, 390, 430]) {
  test(`${width}px has no horizontal overflow across the full quest flow`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.setViewportSize({ width, height: 844 });
    await page.goto("/?sample=1");
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "今日の寄り道をはじめる" }).click();
    await expect(page.getByRole("heading", { name: "今日の寄り道" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "このクエストをはじめる" }).click();
    await expect(page.getByRole("button", { name: "発見を記録する" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "発見を記録する" }).click();
    await expect(page.getByRole("heading", { name: "発見を記録" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "写真なしでクエストクリア" }).click();
    await expect(page.getByRole("heading", { name: "クエストクリア！" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "冒険手帳を見る" }).click();
    await expect(page.getByRole("heading", { name: "寄り道の冒険手帳" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.goto("/map?sample=1");
    await expect(page.getByRole("heading", { name: "寄り道の地図" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors).toEqual([]);
  });
}

test("the generated PWA manifest is available", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.name).toBe("寄り道クエスト");
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons).toHaveLength(3);
});

test("a service worker is registered in a supported browser", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => "serviceWorker" in navigator)).toBeTruthy();
  await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBeGreaterThan(0);
});
