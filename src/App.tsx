import { useContext } from 'react';
import NapData from './components/NapData';
import WakeTime from './components/WakeTime';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { SleepContext } from './lib/SleepContext';
import TimeSelect from './components/TimeSelect';
import NextNapNotice from './components/NextNapNotice';

export default function App() {
	const {
		state: {
			bedTime,
			napData: { nap3 },
		},
		dispatch,
	} = useContext(SleepContext);
	function handleSetNap3({
		id,
		value,
	}: {
		id: 'hour' | 'minute';
		value: string;
	}) {
		dispatch({
			type: `napData/update`,
			payload: { napKey: 'nap3', type: id, value },
		});
	}

	return (
		<main className='my-6 max-w-screen-sm mx-auto flex flex-col gap-4 px-2'>
			<WakeTime />
			{Array.from({ length: 2 }, (_, i) => {
				const index = i + 1;
				return (
					<NapData
						key={i}
						index={index}
					/>
				);
			})}
			<Card>
				<CardHeader className='gap-2'>
					<h2>Nap 3</h2> <NextNapNotice index={3} />
				</CardHeader>
				<CardContent className='flex flex-col gap-2'>
					<h2 className='font-bold'>Nap 3 End Time</h2>
					<div className='flex gap-2'>
						<TimeSelect
							value={nap3}
							onValueChange={handleSetNap3}
							options={[3, 4]}
						/>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>Bed Time</CardHeader>
				<CardContent>
					<div className='text-center'>
						{bedTime.start} &ndash; {bedTime.end}
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
