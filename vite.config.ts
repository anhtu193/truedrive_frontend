import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	base: "/",
	server: {
		port: 5173, // Frontend development port
		open: true, // Optional: Automatically opens the app in the browser
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
