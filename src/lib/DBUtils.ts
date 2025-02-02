import { AppState } from './SleepContext';

/**
 * A Wrapper for interacting with the local storage solution.
 * Since 0.1.0, that solution is the browser's local storage.
 */
export default class DBUtils {
	private LOCAL_STORAGE_KEY: string;
	private LAST_RESET_KEY: string;

	constructor() {
		this.LOCAL_STORAGE_KEY = 'sleepAppState';
		this.LAST_RESET_KEY = 'lastResetDate';
	}

	get isExpired(): boolean {
		const lastReset = localStorage.getItem(this.LAST_RESET_KEY);
		const today = new Date().toLocaleDateString();
		return lastReset !== today;
	}

	saveState(state: AppState) {
		const stateWithTimestamp = {
			...state,
			timestamp: new Date().toISOString(),
		};
		localStorage.setItem(
			this.LOCAL_STORAGE_KEY,
			JSON.stringify(stateWithTimestamp),
		);
	}

	loadState(): AppState | null {
		const state = localStorage.getItem(this.LOCAL_STORAGE_KEY);
		return state ? JSON.parse(state) : null;
	}

	markStateAsReset() {
		const today = new Date().toLocaleDateString();
		localStorage.setItem(this.LAST_RESET_KEY, today);
	}
}
