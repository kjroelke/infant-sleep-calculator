import { createContext, useReducer, ReactNode, Dispatch } from 'react';
import { calcSleepDebt, getBedTime, getNap1Time } from './TimeCalculator';

interface AppState {
	napData: {
		nap1: {
			sleep: number;
			rest: number;
			debt: number;
		};
		nap2: {
			sleep: number;
			rest: number;
			debt: number;
		};
		nap3: {
			sleep: number;
			rest: number;
			debt: number;
		};
	};
	nap1Time: string | null;
	wakeTime: {
		hour: number;
		minute: number;
	};
	bedTime: string;
	totalSleepDebt: number;
}

const initialState: AppState = {
	napData: {
		nap1: { sleep: 0, rest: 0, debt: 0 },
		nap2: { sleep: 0, rest: 0, debt: 0 },
		nap3: { sleep: 0, rest: 0, debt: 0 },
	},
	nap1Time: '8:30am',
	bedTime: '6:00pm',
	wakeTime: { hour: 6, minute: 30 },
	totalSleepDebt: 0,
};

type Action =
	| { type: 'reset' }
	| { type: 'wakeTime/hour'; payload: number }
	| { type: 'wakeTime/minute'; payload: number }
	| { type: 'wakeTime/reset' }
	| {
			type: 'napData/update';
			payload: {
				napKey: keyof AppState['napData'];
				data: {
					sleep: number;
					rest: number;
					debt: number;
				};
			};
	  }
	| {
			type: 'napData/reset';
			payload: keyof AppState['napData'];
	  };

const sleepReducer = (state: AppState, action: Action): AppState => {
	let updatedState: AppState;
	switch (action.type) {
		case 'napData/update':
			updatedState = {
				...state,
				napData: {
					...state.napData,
					[action.payload.napKey]: action.payload.data,
				},
			};
			const { nap1, nap2, nap3 } = updatedState.napData;
			updatedState.totalSleepDebt =
				nap1.debt + nap2.debt - (nap3.sleep + nap3.rest);
			updatedState.bedTime = getBedTime(updatedState.totalSleepDebt);
			return updatedState;
		case 'napData/reset':
			return {
				...state,
				napData: {
					...state.napData,
					[action.payload]: {
						sleep: 0,
						rest: 0,
						debt: 0,
					},
				},
			};
		case 'wakeTime/hour':
			updatedState = {
				...state,
				wakeTime: { ...state.wakeTime, hour: action.payload },
			};
			updatedState.nap1Time = getNap1Time(updatedState.wakeTime);
			return updatedState;
		case 'wakeTime/minute':
			updatedState = {
				...state,
				wakeTime: { ...state.wakeTime, minute: action.payload },
			};
			updatedState.nap1Time = getNap1Time(updatedState.wakeTime);
			return updatedState;
		case 'wakeTime/reset':
			return {
				...state,
				wakeTime: initialState.wakeTime,
				nap1Time: initialState.nap1Time,
			};
		case 'reset':
			return initialState;
		default:
			return state;
	}
};

const SleepContext = createContext<{
	state: AppState;
	dispatch: Dispatch<Action>;
}>({
	state: initialState,
	dispatch: () => null,
});

const SleepProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(sleepReducer, initialState);

	return (
		<SleepContext.Provider value={{ state, dispatch }}>
			{children}
		</SleepContext.Provider>
	);
};

export { SleepContext, SleepProvider };
