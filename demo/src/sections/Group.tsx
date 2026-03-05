import { GlowCard, GlowCardGroup } from "glow-card/react";

const cards = [
	{ title: "Analytics", value: "24.3K", label: "page views this week" },
	{ title: "Conversions", value: "3.2%", label: "up from last month" },
	{ title: "Revenue", value: "$12.4K", label: "monthly recurring" },
];

export function Group() {
	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-50 mb-2">Card Groups</h2>
			<p className="text-zinc-500 mb-10">
				Wrap cards in <code className="text-zinc-400 font-mono text-sm">&lt;GlowCardGroup&gt;</code>{" "}
				for proximity-based glow across all cards. The Stripe dashboard effect.
			</p>

			<GlowCardGroup className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: "1.25rem" }}>
				{cards.map((card) => (
					<GlowCard key={card.title} variant="border" color="#6366f1" radius={16}>
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
							<p className="text-sm text-zinc-500 mb-1">{card.title}</p>
							<p className="text-3xl font-bold text-zinc-50 mb-1">{card.value}</p>
							<p className="text-xs text-zinc-600">{card.label}</p>
						</div>
					</GlowCard>
				))}
			</GlowCardGroup>
		</section>
	);
}
