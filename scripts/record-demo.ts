import { type ChildProcess, spawn } from "node:child_process";
import { type Page, chromium } from "playwright";

const WIDTH = 800;
const HEIGHT = 600;
const DEV_URL = "http://localhost:5173";

async function waitForServer(url: string, timeout = 15000): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			// not ready yet
		}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error(`Server at ${url} did not start within ${timeout}ms`);
}

async function startDevServer(): Promise<ChildProcess> {
	const proc = spawn("npm", ["run", "dev"], {
		cwd: new URL("../demo", import.meta.url).pathname,
		stdio: "pipe",
	});
	await waitForServer(DEV_URL);
	return proc;
}

async function wait(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

async function smoothMove(
	page: Page,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	steps = 20,
	stepDelay = 30,
) {
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		// Ease-in-out for smoother motion
		const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
		const x = startX + (endX - startX) * ease;
		const y = startY + (endY - startY) * ease;
		await page.mouse.move(x, y);
		await wait(stepDelay);
	}
}

/** Get the variants grid section */
function variantsGrid(page: Page) {
	return page.locator("section").filter({ hasText: "Variants" }).locator(".grid > *");
}

/** Hover a card with a nice arc sweep across it */
async function hoverCard(page: Page, index: number, slow = false) {
	const card = variantsGrid(page).nth(index);
	const box = await card.boundingBox();
	if (!box) return;

	const cx = box.x + box.width / 2;
	const cy = box.y + box.height / 2;
	const pauseTime = slow ? 500 : 350;
	const steps = slow ? 25 : 18;

	// Enter from the left, sweep to the right with a slight arc
	await smoothMove(
		page,
		box.x + box.width * 0.15,
		cy - 5,
		box.x + box.width * 0.85,
		cy + 5,
		steps,
		35,
	);
	// Pause at the right side to admire the effect
	await wait(pauseTime);
	// Sweep back slowly through center
	await smoothMove(page, box.x + box.width * 0.85, cy + 5, cx, cy, 14, 30);
	await wait(pauseTime);
}

async function record() {
	console.log("Starting demo dev server...");
	const server = await startDevServer();

	try {
		console.log("Launching browser...");
		const browser = await chromium.launch();
		const context = await browser.newContext({
			viewport: { width: WIDTH, height: HEIGHT },
			recordVideo: {
				dir: "./tmp-video",
				size: { width: WIDTH, height: HEIGHT },
			},
		});

		const page = await context.newPage();
		await page.goto(DEV_URL);
		await wait(800);

		// --- Variants Section ---
		// Scroll to variants heading
		await page.evaluate(() => {
			document.querySelector("h2")?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
		await wait(700);

		// Row 1: border (0), background (1), spotlight (2)
		await hoverCard(page, 0, true);
		await hoverCard(page, 1);
		await hoverCard(page, 2, true);
		await wait(200);

		// Scroll down to reveal row 2
		const row2Card = variantsGrid(page).nth(3);
		await row2Card.scrollIntoViewIfNeeded();
		await wait(700);

		// Row 2: rainbow (3), glow-line (4), pulse (5)
		await hoverCard(page, 3, true);
		await hoverCard(page, 4);
		await hoverCard(page, 5);
		await wait(200);

		// --- Card Groups Section ---
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[1]?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
		await wait(700);

		// Sweep cursor across the three group cards
		await smoothMove(page, 80, 320, 720, 320, 35, 25);
		await wait(200);
		await smoothMove(page, 720, 320, 80, 340, 35, 25);
		await wait(300);

		// --- Customization Section ---
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[2]?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
		await wait(600);

		// Click Rose color and hover preview card
		await page.click('button[title="Rose"]');
		await wait(300);
		await smoothMove(page, 500, 300, 680, 400, 18, 30);
		await wait(400);

		// Click Cyan and hover
		await page.click('button[title="Cyan"]');
		await wait(200);
		await smoothMove(page, 680, 400, 540, 340, 12, 30);
		await wait(500);

		console.log("Recording complete. Saving video...");
		await context.close();
		await browser.close();

		console.log("Video saved to tmp-video/");
	} finally {
		server.kill();
	}
}

record().catch((err) => {
	console.error("Recording failed:", err);
	process.exit(1);
});
