import {
	createContext,
	useReducer,
	useEffect,
	ReactNode,
	Dispatch,
} from 'react';
import DBUtils from './DBUtils';
import { Action, AppState, initialState, sleepReducer } from './sleepReducer';

const SleepContext = createContext<{
	state: AppState;
	dispatch: Dispatch<Action>;
}>({
	state: initialState,
	dispatch: () => null,
});

const SleepProvider = ({ children }: { children: ReactNode }) => {
	const db = new DBUtils();
	const [state, dispatch] = useReducer(
		sleepReducer,
		db.isExpired ? initialState : db.loadState() || initialState,
	);

	useEffect(() => {
		db.saveState(state);
		db.markStateAsReset();
	}, [state]);

	useEffect(() => {
		const now = new Date();
		const msUntilMidnight =
			new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate() + 1,
			).getTime() - now.getTime();
		const timer = setTimeout(() => {
			dispatch({ type: 'reset' });
		}, msUntilMidnight);

		return () => clearTimeout(timer);
	}, []);

	return (
		<SleepContext.Provider value={{ state, dispatch }}>
			{children}
		</SleepContext.Provider>
	);
};

export { SleepContext, SleepProvider };
