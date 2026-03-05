import { GlowCard } from "glow-card/react";

export function Hero() {
	return (
		<section className="py-24 text-center">
			<h1 className="text-5xl font-bold tracking-tight text-zinc-50 mb-4">glow-card</h1>

			<p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-16">
				Cursor-tracking glow border cards. Web Component + React. Zero dependencies.
			</p>

			<div className="max-w-md mx-auto">
				<GlowCard variant="border" color="#6366f1" radius={16} borderWidth={2}>
					<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
						<p className="text-lg text-zinc-300 mb-2">Move your cursor over this card</p>
						<p className="text-sm text-zinc-500">
							The glow follows your mouse — pure CSS, no canvas, no JS animation loops
						</p>
					</div>
				</GlowCard>
			</div>
		</section>
	);
}
