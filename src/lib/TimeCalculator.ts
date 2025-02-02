import { addMinutes, isWithinInterval, parse, subMinutes } from 'date-fns';
import { AppState } from './sleepReducer';

const format = 'h:mm a';
export function getNap1Time({
	hour,
	minute,
}: {
	hour: number;
	minute: number;
}): string | null {
	const wakeTime = parse(`${hour}:${minute} AM`, format, new Date());
	const isEightThirty = isWithinInterval(wakeTime, {
		start: parse('6:00 AM', format, new Date()),
		end: parse('6:30 AM', format, new Date()),
	});
	const isEightFortyFive = isWithinInterval(wakeTime, {
		start: parse('6:30 AM', format, new Date()),
		end: parse('7:00 AM', format, new Date()),
	});
	const isNine = isWithinInterval(wakeTime, {
		start: parse('7:00 AM', format, new Date()),
		end: parse('7:30 AM', format, new Date()),
	});
	if (isEightThirty) {
		return '8:30am';
	}
	if (isEightFortyFive) {
		return '8:45am';
	}
	if (isNine) {
		return '9:00am';
	}
	return null;
}

export function getBedTime(sleepDebt: number): string {
	const timeStringArgs = [
		'en-US',
		{ hour: 'numeric', minute: '2-digit' },
	] as const;
	const idealBedTime = parse('6:00 PM', format, new Date());
	if (0 === sleepDebt) {
		return idealBedTime.toLocaleTimeString(...timeStringArgs);
	}
	if (0 < sleepDebt) {
		return subMinutes(idealBedTime, sleepDebt).toLocaleTimeString(
			...timeStringArgs,
		);
	}
	return addMinutes(idealBedTime, Math.abs(sleepDebt)).toLocaleTimeString(
		...timeStringArgs,
	);
}

export function calcNapDebt(
	napKey: keyof AppState['napData'],
	updatedState: AppState,
): number {
	const calculatedSleep =
		updatedState.napData[napKey].sleep.hours * 60 +
		updatedState.napData[napKey].sleep.minutes +
		Math.round(updatedState.napData[napKey].rest * 0.5);
	if ('nap3' === napKey) {
		return calculatedSleep * -1;
	}
	return 60 - calculatedSleep;
}
