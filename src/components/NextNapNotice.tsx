import { useContext } from 'react';
import { SleepContext } from '@/lib/SleepContext';
import { CardDescription } from './ui/card';

export default function NextNapNotice({ index }: { index: number }) {
	const { state } = useContext(SleepContext);
	const { nap1Time } = state;
	const previousNapKey = `nap${
		index - 1 === 0 ? 1 : index - 1
	}` as keyof typeof state.napData;
	const {
		sleep: { hours, minutes },
		rest,
	} = state.napData[previousNapKey];

	function getNapMessage() {
		if (1 === index) {
			return 'Nap 1 should be at ' + nap1Time;
		} else {
			const totalSleep =
				Number(hours) * 60 +
				Number(minutes) +
				Math.round(Number(rest) / 2);
			if (totalSleep < 60) {
				return `Nap ${index} should be in 1.75–2 hours.`;
			}
			if (60 === totalSleep) {
				return `Nap ${index} should be in 2–2.25 hours.`;
			}
			if (totalSleep > 60) {
				return `Nap ${index} should be in 2hr, 10m to 2hr, 25m.`;
			}
		}
	}

	return <CardDescription>{getNapMessage()}</CardDescription>;
}
