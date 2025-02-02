import { useContext, useState } from 'react';
import NapData from './components/NapData';
import WakeTime from './components/WakeTime';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { SleepContext } from './lib/SleepContext';

interface AppState {
	nap1: {
		sleep: number;
		rest: number;
		debt: number;
	};
	nap2: {
		sleep: number;
		rest: number;
		debt: number;
	};
	nap3: {
		sleep: number;
		rest: number;
		debt: number;
	};
}
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
