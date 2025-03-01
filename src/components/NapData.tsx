import { useContext } from 'react';
import { SleepContext } from '@/lib/SleepContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import SleepDebtNotice from './SleepDebtNotice';
import NextNapNotice from './NextNapNotice';

interface NapDataProps {
	index: number;
}
export default function NapData({ index }: NapDataProps) {
	const { state, dispatch } = useContext(SleepContext);
	const napKey = `nap${index}` as keyof typeof state.napData;
	if ('nap3' === napKey) {
		return null;
	}
	const {
		sleep: { hours, minutes },
		rest,
		debt: sleepDebt,
	} = state.napData[napKey];
	function handleChange(type: 'hours' | 'minutes' | 'rest', value: string) {
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
				<h2>Nap {index}</h2> <NextNapNotice index={index} />
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
								handleChange('hours', ev.target.value)
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
								handleChange('minutes', ev.target.value)
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
									handleChange('rest', ev.target.value)
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
