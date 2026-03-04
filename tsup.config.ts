import { defineConfig } from "tsup";

export default defineConfig([
	{
		entry: {
			index: "src/index.ts",
		},
		format: ["esm"],
		dts: true,
		sourcemap: true,
		clean: true,
		minify: true,
		treeshake: true,
	},
	{
		entry: {
			react: "src/react.ts",
		},
		format: ["esm"],
		dts: true,
		sourcemap: true,
		minify: true,
		treeshake: true,
		external: ["react", "react/jsx-runtime"],
	},
]);
