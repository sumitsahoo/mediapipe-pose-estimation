import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

/**
 * Vite configuration for MediaPipe Pose Estimation App
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    const pwaOptions = {
        registerType: "autoUpdate",
        devOptions: {
            enabled: true,
        },
        includeAssets: [
            "favicon.ico",
            "apple-touch-icon.png",
            "mask-icon.svg",
            "images/*.svg",
        ],
        workbox: {
            globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm}"],
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB for MediaPipe WASM files
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: "CacheFirst",
                    options: {
                        cacheName: "google-fonts-cache",
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                        },
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
                {
                    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                    handler: "CacheFirst",
                    options: {
                        cacheName: "gstatic-fonts-cache",
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                        },
                        cacheableResponse: {
                            statuses: [0, 200],
                        },
                    },
                },
            ],
        },
        manifest: {
            version: "1.0.0",
            id: env.VITE_APP_BASE_PATH,
            start_url: env.VITE_APP_BASE_PATH,
            name: "MediaPipe Pose Estimation",
            description: "Real-time pose estimation using MediaPipe and React",
            short_name: "Pose Estimation",
            theme_color: "#5dd4c0",
            background_color: "#5dd4c0",
            display: "standalone",
            display_override: ["standalone"],
            orientation: "portrait",
            categories: ["productivity", "utilities", "health"],
            dir: "ltr",
            icons: [
                {
                    src: "images/pwa-64x64.png",
                    sizes: "64x64",
                    type: "image/png",
                },
                {
                    src: "images/pwa-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                },
                {
                    src: "images/pwa-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "images/maskable-icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable",
                },
            ],
        },
    };

    return {
        base: env.VITE_APP_BASE_PATH || "/",
        plugins: [react(), tailwindcss(), VitePWA(pwaOptions)],
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
