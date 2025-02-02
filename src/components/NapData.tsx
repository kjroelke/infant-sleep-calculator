import { useState, useEffect, useContext } from 'react';
import { SleepContext } from '@/lib/SleepContext';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface NapDataProps {
	index: number;
}
export default function NapData({ index }: NapDataProps) {
	const { state, dispatch } = useContext(SleepContext);
	const { nap1Time } = state;
	const napKey = `nap${index}` as keyof typeof state.napData;
	const { debt: sleepDebt } = state.napData[napKey];

	const [sleep, setSleep] = useState({
		hours: 0,
		minutes: 0,
	});
	const [rest, setRest] = useState(0);

	useEffect(() => {
		const napKey = `nap${index}` as keyof (typeof state)['napData'];
		if (sleep.hours === 0 && sleep.minutes === 0 && rest === 0) {
			dispatch({ type: 'napData/reset', payload: napKey });
			return;
		}
		const calculatedRest = rest > 0 ? Math.round(rest * 0.5) : 0;
		const sleepTime = sleep.hours * 60 + sleep.minutes;
		const debt = 60 - sleepTime - calculatedRest;

		dispatch({
			type: 'napData/update',
			payload: {
				napKey,
				data: {
					sleep: sleepTime,
					rest,
					debt: debt > 0 ? debt : 0,
				},
			},
		});
	}, [sleep, rest]);

	return (
		<Card>
			<CardHeader className='gap-2'>
				Nap {index}{' '}
				{1 === index && (
					<CardDescription>
						Nap 1 should be at {nap1Time}
					</CardDescription>
				)}
				{3 === index && (
					<CardDescription>
						Nap 3 should be at 2hr and 15min after Nap 2 ended
					</CardDescription>
				)}
				{sleepDebt > 0 && (
					<span className='text-red-500 italic text-sm'>
						{sleepDebt}m of sleep debt accrued this nap
					</span>
				)}
			</CardHeader>

			<CardContent>
				<div className='flex flex-wrap items-center gap-4'>
					<div className='flex items-center gap-2'>
						<Input
							type='number'
							id={`nap-${index}-hours`}
							name={`nap-${index}`}
							max={2}
							min={0}
							onChange={(ev) =>
								setSleep((prev) => ({
									...prev,
									hours: parseInt(ev.target.value),
								}))
							}
						/>
						<Label htmlFor={`nap-${index}-hours`}>Hours</Label>
						<Input
							type='number'
							id={`nap-${index}-minutes`}
							name={`nap-${index}`}
							max={59}
							min={0}
							onChange={(ev) =>
								setSleep((prev) => ({
									...prev,
									minutes: parseInt(ev.target.value),
								}))
							}
						/>
						<Label htmlFor={`nap-${index}-minutes`}>Minutes</Label>
					</div>
					<div className='input'>
						<h3>Rest Time</h3>
						<span className='italic text-sm'>
							(minutes spent resting, but not asleep)
						</span>
						<div className='flex items-center gap-2'>
							<Input
								type='number'
								id={`rest-time-${index}`}
								name={`rest-time-${index}`}
								min='0'
								max='240'
								onChange={(ev) =>
									setRest(parseInt(ev.target.value))
								}
							/>
							<Label htmlFor={`rest-time-${index}`}>
								Minutes
							</Label>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
