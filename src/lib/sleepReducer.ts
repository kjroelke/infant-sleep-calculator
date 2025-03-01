import DBUtils from './DBUtils';
import { calcNapDebt, getBedTime, getNap1Time } from './TimeCalculator';

type NapData = {
	sleep: {
		hours?: string;
		minutes?: string;
	};
	rest?: string;
	debt: number;
};
export interface AppState {
	appSettings: {};
	napData: {
		nap1: NapData;
		nap2: NapData;
		nap3: {
			hour: string;
			minute: string;
		};
	};
	nap1Time: string;
	wakeTime: {
		hour: string;
		minute: string;
	};
	bedTime: {
		start: string;
		end: string;
	};
	totalSleepDebt: number;
}

export const initialState: AppState = {
	appSettings: {},
	napData: {
		nap1: {
			sleep: {
				hours: '0',
				minutes: '0',
			},
			rest: '0',
			debt: 0,
		},
		nap2: {
			sleep: {
				hours: '0',
				minutes: '0',
			},
			rest: '0',
			debt: 0,
		},
		nap3: {
			hour: '0',
			minute: '0',
		},
	},
	nap1Time: '8:30am',
	bedTime: {
		start: '6:30pm',
		end: '7:00pm',
	},
	wakeTime: { hour: '7', minute: '00' },
	totalSleepDebt: 0,
};

export type Action =
	| { type: 'reset' }
	| { type: 'wakeTime/hour'; payload: string }
	| { type: 'wakeTime/minute'; payload: string }
	| { type: 'wakeTime/reset' }
	| {
			type: 'napData/update';
			payload: {
				napKey: keyof AppState['napData'];
				type: 'hours' | 'minutes' | 'rest';
				value: string | undefined;
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
			if ('nap3' === action.payload.napKey) {
				updatedState = {
					...state,
					napData: {
						...state.napData,
						nap3: {
							...state.napData.nap3,
							[action.payload.type]: action.payload.value,
						},
					},
				};
			} else {
				const update =
					action.payload.type === 'rest'
						? { rest: action.payload.value }
						: {
								sleep: {
									...state.napData[action.payload.napKey]
										.sleep,
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
				const { nap1, nap2 } = updatedState.napData;
				updatedState.totalSleepDebt = nap1.debt + nap2.debt;
			}
			updatedState.bedTime = getBedTime(
				updatedState.totalSleepDebt,
				updatedState.napData.nap3,
			);
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
