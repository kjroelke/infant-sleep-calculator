import { createContext, useReducer, ReactNode, Dispatch } from 'react';

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
	nap1Time: string;
	wakeTime: {
		hour: number;
		minute: number;
	};
	bedTime: string;
	totalSleepDebt: number;
}

type Action =
	| { type: 'SET_NAP1_TIME'; payload: string }
	| { type: 'wakeTime/hour'; payload: number }
	| { type: 'wakeTime/minute'; payload: number }
	| { type: 'wakeTime/reset' }
	| { type: 'SET_EVENING_SLEEP_DEBT'; payload: number }
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

const initialState: AppState = {
	napData: {
		nap1: { sleep: 0, rest: 0, debt: 0 },
		nap2: { sleep: 0, rest: 0, debt: 0 },
		nap3: { sleep: 0, rest: 0, debt: 0 },
	},
	nap1Time: '8:30am',
	bedTime: '7:00pm',
	wakeTime: { hour: 6, minute: 30 },
	totalSleepDebt: 0,
};

const SleepContext = createContext<{
	state: AppState;
	dispatch: Dispatch<Action>;
}>({
	state: initialState,
	dispatch: () => null,
});

const sleepReducer = (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case 'SET_NAP1_TIME':
			return { ...state, nap1Time: action.payload };
		case 'SET_EVENING_SLEEP_DEBT':
			return { ...state, eveningSleepDebt: action.payload };
		case 'napData/update':
			const updatedState = {
				...state,
				napData: {
					...state.napData,
					[action.payload.napKey]: action.payload.data,
				},
			};
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
			return {
				...state,
				wakeTime: { ...state.wakeTime, hour: action.payload },
			};
		case 'wakeTime/minute':
			return {
				...state,
				wakeTime: { ...state.wakeTime, minute: action.payload },
			};
		case 'wakeTime/reset':
			return {
				...state,
				wakeTime: initialState.wakeTime,
			};
		default:
			return state;
	}
};

const SleepProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(sleepReducer, initialState);

	return (
		<SleepContext.Provider value={{ state, dispatch }}>
			{children}
		</SleepContext.Provider>
	);
};

export { SleepContext, SleepProvider };
