import DBUtils from './DBUtils';
import { calcNapDebt, getBedTime, getNap1Time } from './TimeCalculator';

export interface AppState {
	napData: {
		nap1: {
			sleep: {
				hours: number;
				minutes: number;
			};
			rest: number;
			debt: number;
		};
		nap2: {
			sleep: {
				hours: number;
				minutes: number;
			};
			rest: number;
			debt: number;
		};
		nap3: {
			sleep: {
				hours: number;
				minutes: number;
			};
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

export const initialState: AppState = {
	napData: {
		nap1: {
			sleep: {
				hours: 0,
				minutes: 0,
			},
			rest: 0,
			debt: 0,
		},
		nap2: {
			sleep: {
				hours: 0,
				minutes: 0,
			},
			rest: 0,
			debt: 0,
		},
		nap3: {
			sleep: {
				hours: 0,
				minutes: 0,
			},
			rest: 0,
			debt: 0,
		},
	},
	nap1Time: '8:30am',
	bedTime: '6:00pm',
	wakeTime: { hour: 6, minute: 30 },
	totalSleepDebt: 0,
};

export type Action =
	| { type: 'reset' }
	| { type: 'wakeTime/hour'; payload: number }
	| { type: 'wakeTime/minute'; payload: number }
	| { type: 'wakeTime/reset' }
	| {
			type: 'napData/update';
			payload: {
				napKey: keyof AppState['napData'];
				type: 'hours' | 'minutes' | 'rest';
				value: number;
			};
	  }
	| {
			type: 'napData/reset';
			payload: keyof AppState['napData'];
	  };

const db = new DBUtils();

export const sleepReducer = (state: AppState, action: Action): AppState => {
	let updatedState: AppState;
	switch (action.type) {
		case 'wakeTime/hour':
			updatedState = {
				...state,
				wakeTime: { ...state.wakeTime, hour: action.payload },
			};
			updatedState.nap1Time = getNap1Time(updatedState.wakeTime);
			break;
		case 'wakeTime/minute':
			updatedState = {
				...state,
				wakeTime: { ...state.wakeTime, minute: action.payload },
			};
			updatedState.nap1Time = getNap1Time(updatedState.wakeTime);
			break;
		case 'wakeTime/reset':
			updatedState = {
				...state,
				wakeTime: initialState.wakeTime,
				nap1Time: initialState.nap1Time,
			};
			break;
		case 'napData/update':
			const update =
				action.payload.type === 'rest'
					? { rest: action.payload.value }
					: {
							sleep: {
								...state.napData[action.payload.napKey].sleep,
								[action.payload.type]: action.payload.value,
							},
					  };
			updatedState = {
				...state,
				napData: {
					...state.napData,
					[action.payload.napKey]: {
						...state.napData[action.payload.napKey],
						...update,
					},
				},
			};
			const debt = calcNapDebt(action.payload.napKey, updatedState);
			updatedState.napData[action.payload.napKey].debt = debt;
			const { nap1, nap2, nap3 } = updatedState.napData;
			updatedState.totalSleepDebt =
				nap1.debt +
				nap2.debt -
				(nap3.sleep.hours * 60 + nap3.sleep.minutes + nap3.rest);
			updatedState.bedTime = getBedTime(updatedState.totalSleepDebt);
			break;
		case 'napData/reset':
			updatedState = {
				...state,
				napData: {
					...state.napData,
					[action.payload]: {
						sleep: {
							hours: 0,
							minutes: 0,
						},
						rest: 0,
						debt: 0,
					},
				},
				totalSleepDebt: state.totalSleepDebt,
				bedTime: state.bedTime,
			};
			break;
		case 'reset':
			updatedState = initialState;
			break;
		default:
			updatedState = state;
	}
	db.saveState(updatedState);
	return updatedState;
};
