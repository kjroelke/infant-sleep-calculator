import { useContext } from 'react';
import NapData from './components/NapData';
import WakeTime from './components/WakeTime';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { SleepContext } from './lib/SleepContext';

export default function App() {
	const {
		state: { bedTime },
	} = useContext(SleepContext);

	return (
		<main className='my-6 max-w-screen-sm mx-auto flex flex-col gap-4 px-2'>
			<WakeTime />
			{Array.from({ length: 3 }, (_, i) => {
				const index = i + 1;
				return (
					<NapData
						key={i}
						index={index}
					/>
				);
			})}
			<Card>
				<CardHeader>Bed Time</CardHeader>
				<CardContent>
					<div className='text-center'>{bedTime}</div>
				</CardContent>
			</Card>
		</main>
	);
}
