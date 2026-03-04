export { GlowCardElement, registerGlowCard } from "./glow-card.js";
export { GlowCardGroupElement, registerGlowCardGroup } from "./glow-card-group.js";
export type { GlowVariant } from "./glow-card.js";

import { registerGlowCardGroup } from "./glow-card-group.js";
import { registerGlowCard } from "./glow-card.js";

/** Register all custom elements with default tag names */
export function register(): void {
	registerGlowCard();
	registerGlowCardGroup();
}
