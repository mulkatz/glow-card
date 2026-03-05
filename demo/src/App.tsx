import { Customization } from "./sections/Customization";
import { Group } from "./sections/Group";
import { Hero } from "./sections/Hero";
import { Usage } from "./sections/Usage";
import { Variants } from "./sections/Variants";

export function App() {
	return (
		<div className="min-h-screen">
			<div className="max-w-5xl mx-auto px-6">
				<Hero />

				<hr className="border-zinc-800" />
				<Variants />

				<hr className="border-zinc-800" />
				<Group />

				<hr className="border-zinc-800" />
				<Customization />

				<hr className="border-zinc-800" />
				<Usage />

				<hr className="border-zinc-800" />

				<footer className="py-16 text-center">
					<p className="text-sm text-zinc-500 mb-4">Install</p>
					<code className="inline-block px-6 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm">
						npm install glow-card
					</code>
					<div className="mt-8 flex justify-center gap-6 text-sm text-zinc-500">
						<a
							href="https://github.com/mulkatz/glow-card"
							className="hover:text-zinc-300 transition-colors"
						>
							GitHub
						</a>
						<a
							href="https://npmjs.com/package/glow-card"
							className="hover:text-zinc-300 transition-colors"
						>
							npm
						</a>
						<span>&lt;2KB gzipped</span>
					</div>
					<p className="mt-8 text-xs text-zinc-600">MIT License</p>
				</footer>
			</div>
		</div>
	);
}
