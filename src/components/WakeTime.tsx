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
import TimeSelect from './TimeSelect';

export default function WakeTime() {
	const {
		state: { wakeTime },
		dispatch,
	} = useContext(SleepContext);
	function handleSetWakeTime({
		id,
		value,
	}: {
		id: 'hour' | 'minute';
		value: string;
	}) {
		dispatch({ type: `wakeTime/${id}`, payload: value });
	}
	return (
		<Card>
			<CardHeader>Wake Time</CardHeader>
			<CardContent className='flex gap-2'>
				<TimeSelect
					value={wakeTime}
					onValueChange={handleSetWakeTime}
					options={[5, 6, 7, 8]}
				/>
			</CardContent>
			<CardFooter className='flex gap-2'>
				<Button
					onClick={() => {
						dispatch({ type: 'wakeTime/reset' });
					}}>
					Reset Wake Time
				</Button>
				<Button
					variant={'secondary'}
					onClick={() => {
						dispatch({ type: 'reset' });
					}}>
					Reset All
				</Button>
			</CardFooter>
		</Card>
	);
}
