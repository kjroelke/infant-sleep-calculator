import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { SleepProvider } from './lib/SleepContext';

const root = document.getElementById('root')!;
createRoot(root).render(
	<StrictMode>
		<header className='bg-slate-200 dark:bg-slate-950 text-center text-slate-950 dark:text-slate-200 py-4'>
			<h1 className='font-bold text-2xl'>Infant Sleep Calculator</h1>
			<span className='text-md italic'>
				{new Date().toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})}
			</span>
		</header>
		<SleepProvider>
			<App />
		</SleepProvider>
		<footer className='bg-slate-200 dark:bg-slate-950 text-center text-slate-950 dark:text-slate-200 py-4'>
			&copy; K.J. Roelke
		</footer>
	</StrictMode>,
);

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/src/service-worker.ts').then(
			(registration) => {
				console.log(
					'Service Worker registered with scope:',
					registration.scope,
				);
			},
			(error) => {
				console.log('Service Worker registration failed:', error);
			},
		);
	});
}
