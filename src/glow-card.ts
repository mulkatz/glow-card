import { baseStyles } from "./styles.js";

export type GlowVariant = "border" | "background" | "spotlight" | "glow-line" | "rainbow" | "pulse";

const OBSERVED_ATTRIBUTES = ["variant", "disabled"] as const;

export class GlowCardElement extends HTMLElement {
	static readonly tagName = "glow-card";

	#groupParent: HTMLElement | null = null;
	#abortController: AbortController | null = null;

	static get observedAttributes(): string[] {
		return [...OBSERVED_ATTRIBUTES];
	}

	constructor() {
		super();
		const shadow = this.attachShadow({ mode: "open" });
		const style = document.createElement("style");
		style.textContent = baseStyles;
		shadow.appendChild(style);

		const glow = document.createElement("div");
		glow.classList.add("glow-effect");
		glow.setAttribute("aria-hidden", "true");
		shadow.appendChild(glow);

		const content = document.createElement("div");
		content.classList.add("content");
		const slot = document.createElement("slot");
		content.appendChild(slot);
		shadow.appendChild(content);
	}

	connectedCallback(): void {
		this.#abortController = new AbortController();
		const { signal } = this.#abortController;

		this.#groupParent = this.closest("glow-card-group");

		if (this.#groupParent) {
			// Group handles pointer events
			return;
		}

		this.addEventListener("pointermove", this.#onPointerMove, { signal });
		this.addEventListener("pointerenter", this.#onPointerEnter, { signal });
		this.addEventListener("pointerleave", this.#onPointerLeave, { signal });
	}

	disconnectedCallback(): void {
		this.#abortController?.abort();
		this.#abortController = null;
		this.#groupParent = null;
	}

	/** Update glow position from external coordinates (used by glow-card-group) */
	updateGlow(x: number, y: number, opacity: number): void {
		this.style.setProperty("--_glow-x", String(x));
		this.style.setProperty("--_glow-y", String(y));
		this.style.setProperty("--_glow-opacity", String(opacity));
	}

	#onPointerMove = (e: PointerEvent): void => {
		if (this.hasAttribute("disabled")) return;

		const rect = this.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;

		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;

		this.style.setProperty("--_glow-x", String(x));
		this.style.setProperty("--_glow-y", String(y));
	};

	#onPointerEnter = (): void => {
		if (this.hasAttribute("disabled")) return;
		this.style.setProperty("--_glow-opacity", "1");
	};

	#onPointerLeave = (): void => {
		this.style.setProperty("--_glow-opacity", "0");
	};
}

export function registerGlowCard(tagName: string = GlowCardElement.tagName): void {
	if (!customElements.get(tagName)) {
		customElements.define(tagName, GlowCardElement);
	}
}
