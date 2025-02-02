import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			strategies: 'generateSW',
			registerType: 'autoUpdate',
			manifest: {
				name: 'Infant Sleep Calculator',
				short_name: 'SleepCalc',
				description: 'An app to calculate infant sleep schedules.',
				start_url: '/infant-sleep-calculator/',
				scope: '/infant-sleep-calculator/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#ffffff',
				icons: [
					{
						src: '/infant-sleep-calculator/icons/icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/infant-sleep-calculator/icons/icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/infant-sleep-calculator/icons/icon-1024x1024.png',
						sizes: '1024x1024',
						type: 'image/png',
					},
				],
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'google-fonts-cache',
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-webfonts',
							expiration: {
								maxEntries: 30,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
							},
						},
					},
				],
			},
			devOptions: {
				enabled: true,
				type: 'module',
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	base: '/infant-sleep-calculator/',
});
