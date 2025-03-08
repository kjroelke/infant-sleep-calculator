import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SleepProvider } from './lib/SleepContext';
import updateThemeColor from './updateThemeColor';
import Header from './components/Header';
import Footer from './components/Footer';

// Initial theme color update
updateThemeColor();

// Listen for changes in color scheme
window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', updateThemeColor);

const root = document.getElementById('root')!;
createRoot(root).render(
    <>
        <Header />
        <SleepProvider>
            <App />
        </SleepProvider>
        <Footer />
    </>,
);
