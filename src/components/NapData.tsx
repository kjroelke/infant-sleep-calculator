import { useState, useEffect, useContext } from 'react';
import { SleepContext } from '@/lib/SleepContext';
import { Card, CardContent, CardDescription, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import SleepDebtNotice from './SleepDebtNotice';

interface NapDataProps {
	index: number;
}
export default function NapData({ index }: NapDataProps) {
	const { state, dispatch } = useContext(SleepContext);
	const { nap1Time } = state;
	const napKey = `nap${index}` as keyof typeof state.napData;
	const {
		sleep: { hours, minutes },
		rest,
		debt: sleepDebt,
	} = state.napData[napKey];
	function handleChange(type: 'hours' | 'minutes' | 'rest', value: number) {
		dispatch({
			type: 'napData/update',
			payload: {
				napKey,
				type,
				value,
			},
		});
	}

	return (
		<Card>
			<CardHeader className='gap-2'>
				Nap {index}{' '}
				{1 === index && nap1Time && (
					<CardDescription>
						Nap 1 should be at {nap1Time}
					</CardDescription>
				)}
				{3 === index && (
					<CardDescription>
						Nap 3 should be at 2hr and 15min after Nap 2 ended
					</CardDescription>
				)}
				<SleepDebtNotice sleepDebt={sleepDebt} />
			</CardHeader>
			<CardContent>
				<div className='flex flex-wrap items-end gap-4'>
					<div className='flex items-center gap-2'>
						<Input
							inputMode='numeric'
							type='number'
							id={`nap-${index}-hours`}
							name={`nap-${index}`}
							max={2}
							min={0}
							value={hours}
							onChange={(ev) =>
								handleChange('hours', parseInt(ev.target.value))
							}
						/>
						<Label htmlFor={`nap-${index}-hours`}>Hours</Label>
						<Input
							inputMode='numeric'
							type='number'
							id={`nap-${index}-minutes`}
							name={`nap-${index}`}
							max={59}
							min={0}
							value={minutes}
							onChange={(ev) =>
								handleChange(
									'minutes',
									parseInt(ev.target.value),
								)
							}
						/>
						<Label htmlFor={`nap-${index}-minutes`}>Minutes</Label>
					</div>
					<div className='input flex flex-col'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className='self-start'>
									<h3>Rest Time</h3>
								</TooltipTrigger>
								<TooltipContent>
									<span className='italic text-sm'>
										Minutes spent resting, but not asleep
									</span>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<div className='flex items-center gap-2'>
							<Input
								inputMode='numeric'
								type='number'
								id={`rest-time-${index}`}
								name={`rest-time-${index}`}
								min='0'
								max='240'
								value={rest}
								onChange={(ev) =>
									handleChange(
										'rest',
										parseInt(ev.target.value),
									)
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
