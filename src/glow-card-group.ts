import { GlowCardElement } from "./glow-card.js";

export class GlowCardGroupElement extends HTMLElement {
	static readonly tagName = "glow-card-group";

	#abortController: AbortController | null = null;
	#observer: MutationObserver | null = null;
	#cards: GlowCardElement[] = [];

	#updateCards(): void {
		this.#cards = Array.from(this.querySelectorAll("*")).filter(
			(el): el is GlowCardElement => el instanceof GlowCardElement,
		);
	}

	connectedCallback(): void {
		this.#abortController = new AbortController();
		const { signal } = this.#abortController;

		this.#updateCards();

		this.#observer = new MutationObserver(() => this.#updateCards());
		this.#observer.observe(this, { childList: true, subtree: true });

		this.addEventListener("pointermove", this.#onPointerMove, { signal });
		this.addEventListener("pointerleave", this.#onPointerLeave, { signal });
	}

	disconnectedCallback(): void {
		this.#abortController?.abort();
		this.#abortController = null;
		this.#observer?.disconnect();
		this.#observer = null;
		this.#cards = [];
	}

	#onPointerMove = (e: PointerEvent): void => {
		for (const card of this.#cards) {
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
		for (const card of this.#cards) {
			card.updateGlow(0.5, 0.5, 0);
		}
	};
}

export function registerGlowCardGroup(tagName: string = GlowCardGroupElement.tagName): void {
	if (!customElements.get(tagName)) {
		customElements.define(tagName, GlowCardGroupElement);
	}
}
