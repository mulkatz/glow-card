import { type ChildProcess, spawn } from "node:child_process";
import { chromium } from "playwright";

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
	page: Awaited<
		ReturnType<Awaited<ReturnType<typeof chromium.launch>>["newContext"]>
	>["pages"] extends () => infer R
		? R extends Array<infer P>
			? P
			: never
		: never,
	startX: number,
	startY: number,
	endX: number,
	endY: number,
	steps = 20,
	stepDelay = 30,
) {
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const x = startX + (endX - startX) * t;
		const y = startY + (endY - startY) * t;
		await page.mouse.move(x, y);
		await wait(stepDelay);
	}
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
		await wait(1000);

		// Scroll to variants section
		await page.evaluate(() => {
			document.querySelector("h2")?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
		await wait(600);

		// Hover across the variant cards (row 1: border, background, spotlight)
		await smoothMove(page, 100, 250, 350, 280, 15, 30);
		await smoothMove(page, 350, 280, 550, 260, 12, 30);

		// Row 2: rainbow, glow-line, pulse
		await smoothMove(page, 550, 260, 100, 420, 10, 25);
		await smoothMove(page, 100, 420, 600, 420, 20, 30);
		await wait(200);

		// Scroll to card groups
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[1]?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
		await wait(600);

		// Sweep cursor across the group cards
		await smoothMove(page, 80, 300, 720, 300, 30, 25);
		await smoothMove(page, 720, 300, 80, 320, 30, 25);
		await wait(300);

		// Scroll to customization
		await page.evaluate(() => {
			const headings = document.querySelectorAll("h2");
			headings[2]?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
		await wait(600);

		// Click Rose color and hover preview
		await page.click('button[title="Rose"]');
		await wait(300);
		await smoothMove(page, 500, 300, 650, 380, 15, 30);
		await wait(400);

		// Click Cyan and hover
		await page.click('button[title="Cyan"]');
		await wait(200);
		await smoothMove(page, 650, 380, 550, 350, 10, 30);
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
