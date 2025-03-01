/**
 * Set the app theme color based on the system color scheme
 */
export default function updateThemeColor() {
	const tailwind = {
		slate200: `oklch(0.929 0.013 255.508)`,
		slate950: `oklch(0.129 0.042 264.695)`,
	};
	const themeColor = window.matchMedia('(prefers-color-scheme: dark)').matches
		? tailwind.slate950
		: tailwind.slate200;
	const metaThemeColor = document.querySelector('meta[name=theme-color]');
	if (metaThemeColor) {
		metaThemeColor.setAttribute('content', themeColor);
	} else {
		const newMeta = document.createElement('meta');
		newMeta.name = 'theme-color';
		newMeta.content = themeColor;
		document.head.appendChild(newMeta);
	}
}
