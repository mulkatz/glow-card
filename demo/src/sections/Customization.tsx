import { GlowCard } from "glow-card/react";
import { useState } from "react";

const presets = [
	{ label: "Indigo", color: "#6366f1" },
	{ label: "Cyan", color: "#22d3ee" },
	{ label: "Rose", color: "#f43f5e" },
	{ label: "Emerald", color: "#10b981" },
	{ label: "Amber", color: "#f59e0b" },
];

export function Customization() {
	const [color, setColor] = useState("#6366f1");
	const [size, setSize] = useState(200);
	const [blur, setBlur] = useState(40);
	const [borderWidth, setBorderWidth] = useState(1);
	const [intensity, setIntensity] = useState(1);

	return (
		<section className="py-20">
			<h2 className="text-2xl font-semibold text-zinc-50 mb-2">Customization</h2>
			<p className="text-zinc-500 mb-10">
				Everything is configurable via CSS Custom Properties or React props.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Controls */}
				<div className="space-y-5">
					{/* Color presets */}
					<div>
						<span className="text-sm text-zinc-400 block mb-2">Color</span>
						<div className="flex gap-2">
							{presets.map((p) => (
								<button
									key={p.label}
									type="button"
									onClick={() => setColor(p.color)}
									className={`w-8 h-8 rounded-lg border-2 transition-all ${
										color === p.color ? "border-zinc-400 scale-110" : "border-zinc-700"
									}`}
									style={{ background: p.color }}
									title={p.label}
								/>
							))}
						</div>
					</div>

					{/* Sliders */}
					<SliderControl
						label="Size"
						value={size}
						min={50}
						max={500}
						onChange={setSize}
						unit="px"
					/>
					<SliderControl label="Blur" value={blur} min={0} max={100} onChange={setBlur} unit="px" />
					<SliderControl
						label="Border Width"
						value={borderWidth}
						min={1}
						max={4}
						step={0.5}
						onChange={setBorderWidth}
						unit="px"
					/>
					<SliderControl
						label="Intensity"
						value={intensity}
						min={0}
						max={1}
						step={0.05}
						onChange={setIntensity}
					/>
				</div>

				{/* Preview */}
				<div className="flex items-center justify-center">
					<GlowCard
						variant="border"
						color={color}
						size={size}
						blur={blur}
						borderWidth={borderWidth}
						intensity={intensity}
						radius={16}
					>
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full">
							<p className="text-lg font-medium text-zinc-100 mb-2">Live Preview</p>
							<p className="text-sm text-zinc-500 mb-4">
								Adjust the controls to see changes in real time.
							</p>
							<code className="text-xs text-zinc-600 font-mono block leading-relaxed">
								--glow-color: {color}
								<br />
								--glow-size: {size}px
								<br />
								--glow-blur: {blur}px
								<br />
								--glow-border-width: {borderWidth}px
								<br />
								--glow-intensity: {intensity}
							</code>
						</div>
					</GlowCard>
				</div>
			</div>
		</section>
	);
}

function SliderControl({
	label,
	value,
	min,
	max,
	step = 1,
	onChange,
	unit,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	onChange: (v: number) => void;
	unit?: string;
}) {
	const id = `slider-${label.toLowerCase().replace(/\s+/g, "-")}`;
	return (
		<div>
			<div className="flex items-baseline justify-between mb-1">
				<label htmlFor={id} className="text-sm text-zinc-400">
					{label}
				</label>
				<span className="text-xs text-zinc-600 font-mono tabular-nums">
					{value}
					{unit}
				</span>
			</div>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-zinc-500 h-1"
			/>
		</div>
	);
}
