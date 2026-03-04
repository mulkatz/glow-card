import { describe, expect, it } from "vitest";
import { baseStyles } from "../styles.js";

describe("baseStyles", () => {
	it("contains the :host base rule with CSS custom properties", () => {
		expect(baseStyles).toContain(":host {");
		expect(baseStyles).toContain("--_glow-x:");
		expect(baseStyles).toContain("--_glow-y:");
		expect(baseStyles).toContain("--_glow-opacity:");
		expect(baseStyles).toContain("--_glow-color:");
	});

	it("contains border variant selector (default)", () => {
		expect(baseStyles).toContain(':host([variant="border"]) .glow-effect');
		expect(baseStyles).toContain(":host(:not([variant])) .glow-effect");
	});

	it("contains background variant selector", () => {
		expect(baseStyles).toContain(':host([variant="background"]) .glow-effect');
	});

	it("contains spotlight variant selector", () => {
		expect(baseStyles).toContain(':host([variant="spotlight"]) .glow-effect');
	});

	it("contains glow-line variant with conic-gradient and atan2", () => {
		expect(baseStyles).toContain(':host([variant="glow-line"]) .glow-effect');
		expect(baseStyles).toContain("conic-gradient");
		expect(baseStyles).toContain("atan2(");
	});

	it("contains rainbow variant selector", () => {
		expect(baseStyles).toContain(':host([variant="rainbow"]) .glow-effect');
	});

	it("contains pulse variant with animation", () => {
		expect(baseStyles).toContain(':host([variant="pulse"]) .glow-effect');
		expect(baseStyles).toContain("animation: glow-pulse");
		expect(baseStyles).toContain("@keyframes glow-pulse");
	});

	it("wraps atan2 arguments in calc() for valid CSS", () => {
		// atan2 arguments must be wrapped in calc() for cross-browser compat
		const atan2Match = baseStyles.match(/atan2\(([\s\S]*?)\)/);
		expect(atan2Match).not.toBeNull();
		expect(atan2Match?.[1]).toContain("calc(");
	});

	it("contains prefers-reduced-motion media query for pulse", () => {
		expect(baseStyles).toContain("prefers-reduced-motion: reduce");
		expect(baseStyles).toContain("animation: none");
	});

	it("contains .content slot wrapper", () => {
		expect(baseStyles).toContain(".content {");
		expect(baseStyles).toContain("z-index: 1");
	});

	it("uses mask-composite for border variants", () => {
		expect(baseStyles).toContain("mask-composite: exclude");
		expect(baseStyles).toContain("-webkit-mask-composite: xor");
	});
});
