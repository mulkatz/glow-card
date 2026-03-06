import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: {
			index: "src/index.ts",
		},
		format: ["esm", "cjs"],
		dts: true,
		clean: true,
		minify: true,
		treeshake: true,
	},
	{
		entry: {
			react: "src/react.ts",
		},
		format: ["esm", "cjs"],
		dts: { resolve: false },
		minify: true,
		treeshake: true,
		external: ["react", "react/jsx-runtime", /^\.\/.*\.js$/],
	},
]);
