import { useContext } from 'react';
import { SleepContext } from '@/lib/SleepContext';

import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';

export default function WakeTime() {
	const {
		state: { wakeTime },
		dispatch,
	} = useContext(SleepContext);
	function handleSetWakeTime(id: 'hour' | 'minute', value: string) {
		dispatch({ type: `wakeTime/${id}`, payload: parseInt(value, 10) });
	}
	return (
		<Card>
			<CardHeader>Wake Time</CardHeader>
			<CardContent className='flex gap-2'>
				<Select
					value={`${wakeTime.hour}`}
					onValueChange={(value) => handleSetWakeTime('hour', value)}>
					<SelectTrigger>
						<SelectValue placeholder={wakeTime.hour} />
					</SelectTrigger>
					<SelectContent>
						{[5, 6, 7, 8, 9].map((hour) => (
							<SelectItem
								key={`hour-${hour}`}
								value={`${hour}`}>
								{hour}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={`${wakeTime.minute}`}
					onValueChange={(value) =>
						handleSetWakeTime('minute', value)
					}>
					<SelectTrigger>
						<SelectValue placeholder={wakeTime.minute} />
					</SelectTrigger>
					<SelectContent>
						{Array.from({ length: 60 }).map((_, min) => {
							const minute = min.toString().padStart(2, '0');
							return (
								<SelectItem
									key={`minute-${minute}`}
									value={minute}>
									{minute}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</CardContent>
			<CardFooter>
				<Button
					onClick={() => {
						dispatch({ type: 'wakeTime/reset' });
					}}>
					Reset Wake Time
				</Button>
			</CardFooter>
		</Card>
	);
}
