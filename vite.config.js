import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

/**
 * Vite configuration for MediaPipe Pose Estimation App
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        base: env.VITE_APP_BASE_PATH || "/",
        plugins: [react(), tailwindcss()],
        optimizeDeps: {
            exclude: ["@mediapipe/tasks-vision"],
        },
        // Suppress source map warnings from node_modules (MediaPipe doesn't include them)
        css: {
            devSourcemap: false,
        },
        preview: {
            port: 8080,
            strictPort: true,
        },
        server: {
            port: 8080,
            strictPort: true,
            host: true,
            cors: true,
            allowedHosts: true,
            // Suppress source map warnings for dependencies
            sourcemapIgnoreList: (sourcePath) => sourcePath.includes("node_modules"),
        },
        build: {
            minify: "terser",
            // Don't generate source maps for production to avoid warnings
            sourcemap: false,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            rollupOptions: {
                output: {
                    manualChunks: {
                        "react-vendor": ["react", "react-dom"],
                        "mediapipe-vendor": ["@mediapipe/tasks-vision"],
                    },
                },
            },
        },
    };
});
