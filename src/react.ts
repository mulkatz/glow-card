import {
	type CSSProperties,
	type MutableRefObject,
	type PropsWithChildren,
	type Ref,
	createElement,
	useEffect,
	useRef,
} from "react";
import type { GlowVariant } from "./glow-card.js";
import { register } from "./index.js";

let registered = false;
function ensureRegistered(): void {
	if (!registered && typeof customElements !== "undefined") {
		register();
		registered = true;
	}
}

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
	ensureRegistered();

	const innerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const el = innerRef.current;
		if (!el) return;
		if (disabled) {
			el.setAttribute("disabled", "");
		} else {
			el.removeAttribute("disabled");
		}
	}, [disabled]);

	useEffect(() => {
		const el = innerRef.current;
		if (!el) return;
		el.setAttribute("variant", variant);
	}, [variant]);

	const cssVars: Record<string, string> = {};
	if (color) cssVars["--glow-color"] = color;
	if (size !== undefined) cssVars["--glow-size"] = `${size}px`;
	if (radius !== undefined) cssVars["--glow-radius"] = `${radius}px`;
	if (blur !== undefined) cssVars["--glow-blur"] = `${blur}px`;
	if (borderWidth !== undefined) cssVars["--glow-border-width"] = `${borderWidth}px`;
	if (intensity !== undefined) cssVars["--glow-intensity"] = String(intensity);

	const mergedStyle = { ...cssVars, ...style };

	const setRef = (el: HTMLElement | null) => {
		innerRef.current = el;
		if (typeof ref === "function") ref(el);
		else if (ref) (ref as MutableRefObject<HTMLElement | null>).current = el;
	};

	return createElement(
		"glow-card",
		{
			ref: setRef,
			variant,
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
	ensureRegistered();
	return createElement("glow-card-group", { class: className, style }, children);
}
