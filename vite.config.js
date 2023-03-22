import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { dirname } from "path";
import { fileURLToPath } from "url";
import terser from '@rollup/plugin-terser';

const proxyOptions = (port) => {
    return {
        target: `http://127.0.0.1:${port}`,
        changeOrigin: false,
        secure: true,
        ws: false,
    }
};

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        root: dirname(fileURLToPath(import.meta.url)),
        define: {
            __SHOPIFY_API_KEY__: JSON.stringify(env.SHOPIFY_API_KEY)
        },
        plugins: [react()],
        resolve: {
            preserveSymlinks: true,
        },
        server: {
            host: "localhost",
            port: env.PORT,
            strictPort: true,
            proxy: {
                "^/api(/|(\\?.*)?$)": proxyOptions(env.PORT)
            }
        },
        build: {
            outDir: "../dist",
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: [
                            '@shopify/app-bridge',
                            '@shopify/app-bridge-react',
                            '@shopify/polaris',
                            'react',
                            'react-dom',
                            'react-query',
                            'react-router-dom'
                        ]
                    }
                },
                plugins: [
                    terser(), // or closureCompiler()
                ],
            },
        }
    }
})