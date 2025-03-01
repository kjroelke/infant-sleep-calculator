import { addMinutes, isWithinInterval, parse, subMinutes } from 'date-fns';
import { AppState } from './sleepReducer';

const format = 'h:mm a';
export function getNap1Time(args: { hour?: string; minute?: string }): string {
	if (!args.hour || !args.minute) {
		return "Couldn't calculate nap time";
	}
	const hour = parseInt(args.hour, 10);
	const minute = parseInt(args.minute, 10);
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
	return "Couldn't calculate nap time";
}

export function getBedTime(
	sleepDebt: number,
	nap3: { hour: string; minute: string },
): {
	start: string;
	end: string;
} {
	const timeStringArgs = [
		'en-US',
		{ hour: 'numeric', minute: '2-digit' },
	] as const;
	const bedTimeStart = parse('6:30 PM', format, new Date());
	const bedTimeEnd = parse('7:00 PM', format, new Date());
	const nap3Time = parse(
		`${nap3.hour}:${nap3.minute} PM`,
		format,
		new Date(),
	);

	const minBedTimeStart = addMinutes(nap3Time, 105); // 1 hour 45 minutes after nap3Time
	const bedTime: {
		start: Date;
		end: Date;
	} = {
		start: minBedTimeStart,
		end: bedTimeEnd,
	};
	if (sleepDebt > 0) {
		bedTime.start = subMinutes(bedTimeStart, sleepDebt);
		bedTime.end = subMinutes(bedTimeEnd, sleepDebt);
	}
	if (bedTime.start < minBedTimeStart) {
		console.log('adjusting bedtime');
		bedTime.start = new Date(
			bedTimeStart.setTime(minBedTimeStart.getTime()),
		);
		bedTime.end = new Date(
			bedTimeEnd.setTime(addMinutes(minBedTimeStart, 30).getTime()),
		); // Adjust bedTimeEnd accordingly
	}
	return {
		start: bedTime.start.toLocaleTimeString(...timeStringArgs),
		end: bedTime.end.toLocaleTimeString(...timeStringArgs),
	};
}

export function calcNapDebt(
	napKey: keyof AppState['napData'],
	updatedState: AppState,
): number {
	if ('nap3' === napKey) {
		return updatedState.totalSleepDebt;
	}
	const hours = updatedState.napData[napKey].sleep.hours ?? 0;
	const minutes = updatedState.napData[napKey].sleep.minutes ?? 0;
	const rest = updatedState.napData[napKey].rest ?? 0;
	if ('0' == rest && '0' == hours && '0' == minutes) {
		return updatedState.totalSleepDebt;
	}
	const calculatedSleep =
		Number(hours) * 60 + Number(minutes) + Math.round(Number(rest) * 0.5);
	return Math.max(0, 60 - calculatedSleep);
}
