import { GlowCardElement } from "./glow-card.js";

export class GlowCardGroupElement extends HTMLElement {
	static readonly tagName = "glow-card-group";

	#abortController: AbortController | null = null;

	connectedCallback(): void {
		this.#abortController = new AbortController();
		const { signal } = this.#abortController;

		this.addEventListener("pointermove", this.#onPointerMove, { signal });
		this.addEventListener("pointerleave", this.#onPointerLeave, { signal });
	}

	disconnectedCallback(): void {
		this.#abortController?.abort();
		this.#abortController = null;
	}

	#getCards(): GlowCardElement[] {
		return Array.from(this.querySelectorAll("*")).filter(
			(el): el is GlowCardElement => el instanceof GlowCardElement,
		);
	}

	#onPointerMove = (e: PointerEvent): void => {
		const cards = this.#getCards();

		for (const card of cards) {
			if (card.hasAttribute("disabled")) continue;

			const rect = card.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) continue;

			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;

			// Calculate distance from cursor to card center (normalized)
			const centerDistX = x - 0.5;
			const centerDistY = y - 0.5;
			const distance = Math.sqrt(centerDistX * centerDistX + centerDistY * centerDistY);

			// Opacity based on proximity — full at center, fading at edges
			const maxDistance = 1.5;
			const opacity = Math.max(0, 1 - distance / maxDistance);

			card.updateGlow(x, y, opacity);
		}
	};

	#onPointerLeave = (): void => {
		const cards = this.#getCards();
		for (const card of cards) {
			card.updateGlow(0.5, 0.5, 0);
		}
	};
}

export function registerGlowCardGroup(tagName: string = GlowCardGroupElement.tagName): void {
	if (!customElements.get(tagName)) {
		customElements.define(tagName, GlowCardGroupElement);
	}
}
