import {
	type CSSProperties,
	type MutableRefObject,
	type PropsWithChildren,
	type Ref,
	createElement,
	useRef,
} from "react";
import type { GlowVariant } from "./glow-card.js";
import { register } from "./index.js";

// Register custom elements synchronously at module load time to prevent FOUC
register();

export interface GlowCardProps extends PropsWithChildren {
	/** Glow effect variant */
	variant?: GlowVariant;
	/** Disable the glow effect */
	disabled?: boolean;
	/** Glow color (CSS color value) */
	color?: string;
	/** Glow size in px */
	size?: number;
	/** Border radius in px */
	radius?: number;
	/** Glow blur in px */
	blur?: number;
	/** Border width in px */
	borderWidth?: number;
	/** Glow intensity (0-1) */
	intensity?: number;
	/** Additional class name */
	className?: string;
	/** Additional style */
	style?: CSSProperties;
	/** Ref to the underlying element */
	ref?: Ref<HTMLElement>;
}

export function GlowCard({
	variant = "border",
	disabled = false,
	color,
	size,
	radius,
	blur,
	borderWidth,
	intensity,
	className,
	style,
	children,
	ref,
}: GlowCardProps) {
	const innerRef = useRef<HTMLElement>(null);

	const cssVars: Record<string, string> = {};
	if (color) cssVars["--glow-color"] = color;
	if (size !== undefined) cssVars["--glow-size"] = `${size}px`;
	if (radius !== undefined) cssVars["--glow-radius"] = `${radius}px`;
	if (blur !== undefined) cssVars["--glow-blur"] = `${blur}px`;
	if (borderWidth !== undefined) cssVars["--glow-border-width"] = `${borderWidth}px`;
	if (intensity !== undefined) cssVars["--glow-intensity"] = String(intensity);

	const mergedStyle = { ...cssVars, ...style };

	const setRef = (el: HTMLElement | null) => {
		(innerRef as MutableRefObject<HTMLElement | null>).current = el;
		if (typeof ref === "function") ref(el);
		else if (ref) (ref as MutableRefObject<HTMLElement | null>).current = el;
	};

	return createElement(
		"glow-card",
		{
			ref: setRef,
			variant,
			disabled: disabled || undefined,
			class: className,
			style: mergedStyle,
		},
		children,
	);
}

export interface GlowCardGroupProps extends PropsWithChildren {
	/** Additional class name */
	className?: string;
	/** Additional style */
	style?: CSSProperties;
}

export function GlowCardGroup({ children, className, style }: GlowCardGroupProps) {
	return createElement("glow-card-group", { class: className, style }, children);
}
