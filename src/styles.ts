export const baseStyles = /* css */ `
	:host {
		display: block;
		position: relative;
		border-radius: var(--glow-radius, 12px);
		--_glow-x: 0.5;
		--_glow-y: 0.5;
		--_glow-opacity: 0;
		--_glow-color: var(--glow-color, #6366f1);
		--_glow-size: var(--glow-size, 200px);
		--_glow-blur: var(--glow-blur, 40px);
		--_glow-border-width: var(--glow-border-width, 1px);
		--_glow-intensity: var(--glow-intensity, 1);
		--_glow-transition: var(--glow-transition, opacity 0.3s ease);
	}

	.glow-effect {
		z-index: 2;
	}

	:host([variant="border"]) .glow-effect,
	:host(:not([variant])) .glow-effect {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: calc(var(--_glow-opacity) * var(--_glow-intensity));
		transition: var(--_glow-transition);
		border: var(--_glow-border-width) solid transparent;
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		background: radial-gradient(
			var(--_glow-size) circle at
				calc(var(--_glow-x) * 100%)
				calc(var(--_glow-y) * 100%),
			var(--_glow-color),
			transparent 70%
		);
		background-origin: border-box;
	}

	:host([variant="background"]) .glow-effect {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: calc(var(--_glow-opacity) * var(--_glow-intensity) * 0.15);
		transition: var(--_glow-transition);
		filter: blur(var(--_glow-blur));
		background: radial-gradient(
			var(--_glow-size) circle at
				calc(var(--_glow-x) * 100%)
				calc(var(--_glow-y) * 100%),
			var(--_glow-color),
			transparent 70%
		);
	}

	:host([variant="spotlight"]) .glow-effect {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: calc(var(--_glow-opacity) * var(--_glow-intensity));
		transition: var(--_glow-transition);
		background: radial-gradient(
			calc(var(--_glow-size) * 0.6) circle at
				calc(var(--_glow-x) * 100%)
				calc(var(--_glow-y) * 100%),
			transparent 0%,
			transparent 25%,
			rgba(0, 0, 0, 0.7) 100%
		);
	}

	:host([variant="glow-line"]) .glow-effect {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: calc(var(--_glow-opacity) * var(--_glow-intensity));
		transition: var(--_glow-transition);
		border: var(--_glow-border-width) solid transparent;
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		background: conic-gradient(
			from calc(atan2(
				calc(var(--_glow-y) - 0.5),
				calc(var(--_glow-x) - 0.5)
			)),
			transparent 0%,
			var(--_glow-color) 10%,
			transparent 20%
		);
		background-origin: border-box;
	}

	:host([variant="rainbow"]) .glow-effect {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: calc(var(--_glow-opacity) * var(--_glow-intensity));
		transition: var(--_glow-transition);
		border: var(--_glow-border-width) solid transparent;
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		background: conic-gradient(
			from calc(atan2(
				calc(var(--_glow-y) - 0.5),
				calc(var(--_glow-x) - 0.5)
			)) at
				calc(var(--_glow-x) * 100%)
				calc(var(--_glow-y) * 100%),
			#f06,
			#9f0,
			#0ff,
			#90f,
			#f06
		);
		background-origin: border-box;
	}

	:host([variant="pulse"]) .glow-effect {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		opacity: calc(var(--_glow-opacity) * var(--_glow-intensity));
		transition: var(--_glow-transition);
		border: var(--_glow-border-width) solid transparent;
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		background: radial-gradient(
			var(--_glow-size) circle at
				calc(var(--_glow-x) * 100%)
				calc(var(--_glow-y) * 100%),
			var(--_glow-color),
			transparent 70%
		);
		background-origin: border-box;
		animation: glow-pulse 2s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%, 100% { filter: brightness(1); }
		50% { filter: brightness(1.5); }
	}

	@media (prefers-reduced-motion: reduce) {
		:host([variant="pulse"]) .glow-effect {
			animation: none;
		}
	}

	.content {
		position: relative;
		z-index: 1;
	}
`;
