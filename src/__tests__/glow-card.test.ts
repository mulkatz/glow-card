import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlowCardGroupElement, registerGlowCardGroup } from "../glow-card-group.js";
import { GlowCardElement, registerGlowCard } from "../glow-card.js";

// Register custom elements once for all tests
let cardRegistered = false;
let groupRegistered = false;

function ensureRegistered() {
	if (!cardRegistered) {
		registerGlowCard();
		cardRegistered = true;
	}
	if (!groupRegistered) {
		registerGlowCardGroup();
		groupRegistered = true;
	}
}

function cleanupBody() {
	while (document.body.firstChild) {
		document.body.removeChild(document.body.firstChild);
	}
}

describe("GlowCardElement", () => {
	beforeEach(() => {
		ensureRegistered();
	});

	afterEach(() => {
		cleanupBody();
	});

	it("is registered as a custom element", () => {
		expect(customElements.get("glow-card")).toBeDefined();
	});

	it("has the correct static tagName", () => {
		expect(GlowCardElement.tagName).toBe("glow-card");
	});

	it("creates a shadow DOM with glow-effect and content elements", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		const shadow = el.shadowRoot;
		expect(shadow).not.toBeNull();
		expect(shadow?.querySelector(".glow-effect")).not.toBeNull();
		expect(shadow?.querySelector(".content")).not.toBeNull();
		expect(shadow?.querySelector("slot")).not.toBeNull();
		expect(shadow?.querySelector("style")).not.toBeNull();
	});

	it("glow-effect has aria-hidden=true", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		const glowEffect = el.shadowRoot?.querySelector(".glow-effect");
		expect(glowEffect?.getAttribute("aria-hidden")).toBe("true");
	});

	it("sets CSS custom properties via updateGlow()", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		el.updateGlow(0.3, 0.7, 0.8);

		expect(el.style.getPropertyValue("--_glow-x")).toBe("0.3");
		expect(el.style.getPropertyValue("--_glow-y")).toBe("0.7");
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("0.8");
	});

	it("resets glow opacity when disabled attribute is set", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		el.updateGlow(0.5, 0.5, 1);
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("1");

		el.setAttribute("disabled", "");
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("0");
	});

	it("does not update glow on pointermove when disabled", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		el.setAttribute("disabled", "");

		// Mock getBoundingClientRect
		el.getBoundingClientRect = () => ({
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			top: 0,
			left: 0,
			bottom: 100,
			right: 200,
			toJSON: () => {},
		});

		const event = new PointerEvent("pointermove", {
			clientX: 100,
			clientY: 50,
			bubbles: true,
		});
		el.dispatchEvent(event);

		// Should remain at reset value (0) since disabled
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("0");
	});

	it("guards against zero-dimension elements on pointermove", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		// Mock zero-width element
		el.getBoundingClientRect = () => ({
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			toJSON: () => {},
		});

		const event = new PointerEvent("pointermove", {
			clientX: 50,
			clientY: 50,
			bubbles: true,
		});

		// Should not throw
		expect(() => el.dispatchEvent(event)).not.toThrow();
	});

	it("sets opacity to 1 on pointerenter and 0 on pointerleave", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("1");

		el.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("0");
	});

	it("does not set opacity on pointerenter when disabled", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);
		el.setAttribute("disabled", "");

		el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("0");
	});

	it("cleans up event listeners on disconnectedCallback", () => {
		const el = document.createElement("glow-card") as GlowCardElement;
		document.body.appendChild(el);

		// Remove from DOM triggers disconnectedCallback
		document.body.removeChild(el);

		// Re-add to confirm it can be reconnected without issues
		document.body.appendChild(el);
		el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
		expect(el.style.getPropertyValue("--_glow-opacity")).toBe("1");
	});

	it("observes variant and disabled attributes", () => {
		const observed = GlowCardElement.observedAttributes;
		expect(observed).toContain("variant");
		expect(observed).toContain("disabled");
	});
});

describe("registerGlowCard", () => {
	it("does not throw when called multiple times", () => {
		expect(() => registerGlowCard()).not.toThrow();
		expect(() => registerGlowCard()).not.toThrow();
	});
});

describe("GlowCardGroupElement", () => {
	beforeEach(() => {
		ensureRegistered();
	});

	afterEach(() => {
		cleanupBody();
	});

	it("is registered as a custom element", () => {
		expect(customElements.get("glow-card-group")).toBeDefined();
	});

	it("has the correct static tagName", () => {
		expect(GlowCardGroupElement.tagName).toBe("glow-card-group");
	});

	it("updates child cards on pointermove", () => {
		const group = document.createElement("glow-card-group") as GlowCardGroupElement;
		const card = document.createElement("glow-card") as GlowCardElement;

		card.getBoundingClientRect = () => ({
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			top: 0,
			left: 0,
			bottom: 100,
			right: 200,
			toJSON: () => {},
		});

		group.appendChild(card);
		document.body.appendChild(group);

		const updateSpy = vi.spyOn(card, "updateGlow");

		group.dispatchEvent(
			new PointerEvent("pointermove", {
				clientX: 100,
				clientY: 50,
				bubbles: true,
			}),
		);

		expect(updateSpy).toHaveBeenCalled();
		const [x, y, opacity] = updateSpy.mock.calls[0];
		expect(x).toBeCloseTo(0.5);
		expect(y).toBeCloseTo(0.5);
		expect(opacity).toBeGreaterThan(0);
	});

	it("resets child cards on pointerleave", () => {
		const group = document.createElement("glow-card-group") as GlowCardGroupElement;
		const card = document.createElement("glow-card") as GlowCardElement;

		group.appendChild(card);
		document.body.appendChild(group);

		const updateSpy = vi.spyOn(card, "updateGlow");

		group.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));

		expect(updateSpy).toHaveBeenCalledWith(0.5, 0.5, 0);
	});

	it("skips disabled cards in group", () => {
		const group = document.createElement("glow-card-group") as GlowCardGroupElement;
		const card = document.createElement("glow-card") as GlowCardElement;
		card.setAttribute("disabled", "");

		card.getBoundingClientRect = () => ({
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			top: 0,
			left: 0,
			bottom: 100,
			right: 200,
			toJSON: () => {},
		});

		group.appendChild(card);
		document.body.appendChild(group);

		const updateSpy = vi.spyOn(card, "updateGlow");

		group.dispatchEvent(
			new PointerEvent("pointermove", {
				clientX: 100,
				clientY: 50,
				bubbles: true,
			}),
		);

		expect(updateSpy).not.toHaveBeenCalled();
	});

	it("updates cached cards when children change", async () => {
		const group = document.createElement("glow-card-group") as GlowCardGroupElement;
		document.body.appendChild(group);

		// Add a card dynamically
		const card = document.createElement("glow-card") as GlowCardElement;
		card.getBoundingClientRect = () => ({
			x: 0,
			y: 0,
			width: 200,
			height: 100,
			top: 0,
			left: 0,
			bottom: 100,
			right: 200,
			toJSON: () => {},
		});
		group.appendChild(card);

		// Wait for MutationObserver to fire
		await new Promise((resolve) => setTimeout(resolve, 0));

		const updateSpy = vi.spyOn(card, "updateGlow");

		group.dispatchEvent(
			new PointerEvent("pointermove", {
				clientX: 100,
				clientY: 50,
				bubbles: true,
			}),
		);

		expect(updateSpy).toHaveBeenCalled();
	});

	it("cleans up observer on disconnect", () => {
		const group = document.createElement("glow-card-group") as GlowCardGroupElement;
		document.body.appendChild(group);

		// Should not throw
		expect(() => document.body.removeChild(group)).not.toThrow();
	});
});

describe("registerGlowCardGroup", () => {
	it("does not throw when called multiple times", () => {
		expect(() => registerGlowCardGroup()).not.toThrow();
		expect(() => registerGlowCardGroup()).not.toThrow();
	});
});
