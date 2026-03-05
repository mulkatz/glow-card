import type { GlowVariant } from "glow-card";
import { GlowCard } from "glow-card/react";

const variants: {
	name: GlowVariant;
	label: string;
	description: string;
	props?: Record<string, unknown>;
}[] = [
	{
		name: "border",
		label: "Border",
		description: "Classic cursor-tracking glow border. The default variant.",
	},
	{
		name: "background",
		label: "Background",
		description: "Subtle background illumination that follows your cursor.",
	},
	{
		name: "spotlight",
		label: "Spotlight",
		description: "Focused spotlight beam that reveals content under the cursor.",
	},
	{
		name: "rainbow",
		label: "Rainbow",
		description: "Rotating rainbow gradient border that follows cursor angle.",
		props: { borderWidth: 2 },
	},
	{
		name: "glow-line",
		label: "Glow Line",
		description: "Rotating line that sweeps around the border edge.",
		props: { borderWidth: 2 },
	},
	{
		name: "pulse",
		label: "Pulse",
		description: "Pulsating glow border with a breathing animation.",
		props: { color: "#22d3ee" },
	},
];

export function Variants() {
	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-50 mb-2">Variants</h2>
			<p className="text-zinc-500 mb-10">
				Six built-in glow effects. Hover each card to see the difference.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{variants.map((v) => (
					<GlowCard key={v.name} variant={v.name} color="#6366f1" radius={16} {...v.props}>
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full">
							<div className="flex items-baseline justify-between mb-3">
								<h3 className="text-base font-medium text-zinc-100">{v.label}</h3>
								<code className="text-xs text-zinc-500 font-mono">{v.name}</code>
							</div>
							<p className="text-sm text-zinc-500 leading-relaxed">{v.description}</p>
						</div>
					</GlowCard>
				))}
			</div>
		</section>
	);
}
