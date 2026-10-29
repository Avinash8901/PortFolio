import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const chromePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const baseUrl = process.env.PORTFOLIO_URL || "http://localhost:3000";
const screenshotDir = path.join(process.cwd(), "screenshots");
await mkdir(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: chromePath, args: ["--no-sandbox"] });
const errors = [];
const results = [];

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport, reducedMotion: "no-preference" });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(`${viewport.width}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${viewport.width}: ${message.text()}`);
  });

  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(900);
  const layout = await page.evaluate(() => {
    const overflowing = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === "string" ? element.className : "",
        right: Math.round(element.getBoundingClientRect().right),
        left: Math.round(element.getBoundingClientRect().left),
      }))
      .filter((element) => element.right > window.innerWidth + 1 || element.left < -1)
      .slice(0, 12);
    return { innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, overflowing };
  });
  const screenshot = path.join(screenshotDir, `portfolio-${viewport.width}x${viewport.height}.png`);
  await page.screenshot({ path: screenshot, animations: "disabled" });

  const videoStateBefore = await page.locator(".hero-video").evaluate((video) => ({ paused: video.paused, muted: video.muted }));
  await page.getByRole("button", { name: /turn sound/i }).click();
  await page.waitForTimeout(400);
  const videoStateAfter = await page.locator(".hero-video").evaluate((video) => ({ paused: video.paused, muted: video.muted }));

  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const videoPausedOutsideHero = await page.locator(".hero-video").evaluate((video) => video.paused);
  const idCard = page.locator(".id-card");
  await idCard.click();
  const cardFlipped = await idCard.evaluate((element) => element.classList.contains("is-flipped"));

  if (viewport.width < 600) {
    await page.getByRole("button", { name: /menu/i }).click();
    const menuOpened = await page.locator(".mobile-menu").evaluate((element) => element.classList.contains("is-open"));
    await page.keyboard.press("Escape");
    const menuClosedWithEscape = !(await page.locator(".mobile-menu").evaluate((element) => element.classList.contains("is-open")));
    results.push({ viewport, layout, videoStateBefore, videoStateAfter, videoPausedOutsideHero, cardFlipped, menuOpened, menuClosedWithEscape, screenshot });
  } else {
    results.push({ viewport, layout, videoStateBefore, videoStateAfter, videoPausedOutsideHero, cardFlipped, screenshot });
  }
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on("pageerror", (error) => errors.push(`gallery: ${error.message}`));
await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 120_000 });
await page.locator("#achievements").scrollIntoViewIfNeeded();
await page.waitForTimeout(350);
const galleryStart = await page.locator(".achievement-track").evaluate((element) => getComputedStyle(element).transform);
await page.evaluate(() => {
  const section = document.querySelector("#achievements");
  if (section) window.scrollTo(0, section.offsetTop + Math.round(window.innerHeight * 0.65));
});
await page.waitForTimeout(450);
const galleryMoved = await page.locator(".achievement-track").evaluate((element) => getComputedStyle(element).transform);
results.push({ galleryStart, galleryMoved, galleryTransformChanged: galleryStart !== galleryMoved });
await context.close();
await browser.close();

console.log(JSON.stringify({ results, errors }, null, 2));
if (errors.length || results.some((result) => result.layout && result.layout.scrollWidth !== result.layout.innerWidth)) process.exitCode = 1;
