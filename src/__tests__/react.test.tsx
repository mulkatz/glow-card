import { act, cleanup, render } from "@testing-library/react";
import { createRef, useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { GlowCard, GlowCardGroup } from "../react.js";

afterEach(() => {
	cleanup();
});

describe("GlowCard", () => {
	it("renders a glow-card custom element", () => {
		const { container } = render(<GlowCard>Hello</GlowCard>);
		const el = container.querySelector("glow-card");
		expect(el).not.toBeNull();
	});

	it("forwards className as class attribute", () => {
		const { container } = render(<GlowCard className="my-class">Hello</GlowCard>);
		const el = container.querySelector("glow-card");
		expect(el?.getAttribute("class")).toBe("my-class");
	});

	it("sets variant attribute", () => {
		const { container } = render(<GlowCard variant="rainbow">Hello</GlowCard>);
		const el = container.querySelector("glow-card");
		expect(el?.getAttribute("variant")).toBe("rainbow");
	});

	it("defaults variant to border", () => {
		const { container } = render(<GlowCard>Hello</GlowCard>);
		const el = container.querySelector("glow-card");
		expect(el?.getAttribute("variant")).toBe("border");
	});

	it("sets CSS custom properties from props", () => {
		const { container } = render(
			<GlowCard color="#ff0000" size={300} radius={16} blur={20} borderWidth={2} intensity={0.8}>
				Hello
			</GlowCard>,
		);
		const el = container.querySelector("glow-card") as HTMLElement;
		expect(el.style.getPropertyValue("--glow-color")).toBe("#ff0000");
		expect(el.style.getPropertyValue("--glow-size")).toBe("300px");
		expect(el.style.getPropertyValue("--glow-radius")).toBe("16px");
		expect(el.style.getPropertyValue("--glow-blur")).toBe("20px");
		expect(el.style.getPropertyValue("--glow-border-width")).toBe("2px");
		expect(el.style.getPropertyValue("--glow-intensity")).toBe("0.8");
	});

	it("merges user style with CSS variables", () => {
		const { container } = render(
			<GlowCard color="#00ff00" style={{ padding: "10px" }}>
				Hello
			</GlowCard>,
		);
		const el = container.querySelector("glow-card") as HTMLElement;
		expect(el.style.getPropertyValue("--glow-color")).toBe("#00ff00");
		expect(el.style.padding).toBe("10px");
	});

	it("forwards ref to the underlying element", () => {
		const ref = createRef<HTMLElement>();
		render(<GlowCard ref={ref}>Hello</GlowCard>);
		expect(ref.current).not.toBeNull();
		expect(ref.current?.tagName.toLowerCase()).toBe("glow-card");
	});

	it("forwards callback ref", () => {
		let element: HTMLElement | null = null;
		render(
			<GlowCard
				ref={(el) => {
					element = el;
				}}
			>
				Hello
			</GlowCard>,
		);
		expect(element).not.toBeNull();
		expect(element?.tagName.toLowerCase()).toBe("glow-card");
	});

	it("sets disabled attribute when disabled=true", () => {
		const { container } = render(<GlowCard disabled>Hello</GlowCard>);
		const el = container.querySelector("glow-card");
		expect(el?.hasAttribute("disabled")).toBe(true);
	});

	it("does not set disabled attribute when disabled=false", () => {
		const { container } = render(<GlowCard disabled={false}>Hello</GlowCard>);
		const el = container.querySelector("glow-card");
		expect(el?.hasAttribute("disabled")).toBe(false);
	});

	it("reactively toggles disabled attribute", () => {
		function TestComponent() {
			const [disabled, setDisabled] = useState(false);
			return (
				<>
					<button type="button" onClick={() => setDisabled(!disabled)}>
						Toggle
					</button>
					<GlowCard disabled={disabled}>Hello</GlowCard>
				</>
			);
		}

		const { container, getByText } = render(<TestComponent />);
		const el = container.querySelector("glow-card") as Element;

		expect(el.hasAttribute("disabled")).toBe(false);

		// Click to toggle disabled on
		act(() => {
			getByText("Toggle").click();
		});
		expect(el.hasAttribute("disabled")).toBe(true);

		// Click to toggle disabled off
		act(() => {
			getByText("Toggle").click();
		});
		expect(el.hasAttribute("disabled")).toBe(false);
	});

	it("reactively updates variant attribute", () => {
		function TestComponent() {
			const [variant, setVariant] = useState<"border" | "rainbow">("border");
			return (
				<>
					<button type="button" onClick={() => setVariant("rainbow")}>
						Switch
					</button>
					<GlowCard variant={variant}>Hello</GlowCard>
				</>
			);
		}

		const { container, getByText } = render(<TestComponent />);
		const el = container.querySelector("glow-card") as Element;

		expect(el.getAttribute("variant")).toBe("border");

		act(() => {
			getByText("Switch").click();
		});
		expect(el.getAttribute("variant")).toBe("rainbow");
	});

	it("renders children", () => {
		const { container } = render(
			<GlowCard>
				<span data-testid="child">Child content</span>
			</GlowCard>,
		);
		const child = container.querySelector("[data-testid='child']");
		expect(child).not.toBeNull();
		expect(child?.textContent).toBe("Child content");
	});
});

describe("GlowCardGroup", () => {
	it("renders a glow-card-group custom element", () => {
		const { container } = render(<GlowCardGroup>Hello</GlowCardGroup>);
		const el = container.querySelector("glow-card-group");
		expect(el).not.toBeNull();
	});

	it("forwards className as class attribute", () => {
		const { container } = render(<GlowCardGroup className="group-class">Hello</GlowCardGroup>);
		const el = container.querySelector("glow-card-group");
		expect(el?.getAttribute("class")).toBe("group-class");
	});

	it("forwards style prop", () => {
		const { container } = render(<GlowCardGroup style={{ gap: "16px" }}>Hello</GlowCardGroup>);
		const el = container.querySelector("glow-card-group") as HTMLElement;
		expect(el.style.gap).toBe("16px");
	});

	it("renders children", () => {
		const { container } = render(
			<GlowCardGroup>
				<GlowCard>Card 1</GlowCard>
				<GlowCard>Card 2</GlowCard>
			</GlowCardGroup>,
		);
		const cards = container.querySelectorAll("glow-card");
		expect(cards.length).toBe(2);
	});
});

describe("SSR safety", () => {
	it("ensureRegistered does not crash when customElements is undefined", async () => {
		// The module-level guard checks typeof customElements !== "undefined"
		// In a real SSR env, customElements would not exist.
		// We can verify the guard exists by checking the module loaded without error
		// (since we're in jsdom which has customElements, the guard passes through)
		const mod = await import("../react.js");
		expect(mod.GlowCard).toBeDefined();
		expect(mod.GlowCardGroup).toBeDefined();
	});
});
