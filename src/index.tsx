import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { SleepProvider } from './lib/SleepContext';
import updateThemeColor from './updateThemeColor';

// Initial theme color update
updateThemeColor();

// Listen for changes in color scheme
window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', updateThemeColor);

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
