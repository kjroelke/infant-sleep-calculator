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
		</header>
		<SleepProvider>
			<App />
		</SleepProvider>
		<footer className='bg-slate-200 dark:bg-slate-950 text-center text-slate-950 dark:text-slate-200 py-4'>
			&copy; K.J. Roelke
		</footer>
	</StrictMode>,
);
