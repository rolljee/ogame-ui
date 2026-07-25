import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	// Base path for the GitHub Pages project site (http://rolljee.github.io/ogame-ui)
	base: '/ogame-ui/',
	plugins: [react()],
	css: {
		preprocessorOptions: {
			scss: {
				// Bootstrap 5's own Sass still uses APIs deprecated by newer
				// dart-sass; silence those warnings coming from node_modules.
				quietDeps: true,
				silenceDeprecations: ['import', 'color-functions', 'global-builtin'],
			},
		},
	},
	server: {
		port: 3000,
		open: true,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/test/setup.js',
		include: ['src/**/*.test.{js,jsx}', 'worker/**/*.test.js'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{js,jsx}', 'worker/**/*.js'],
			exclude: ['src/index.jsx', 'src/test/**'],
		},
	},
});
