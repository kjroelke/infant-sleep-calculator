export default function SleepDebtNotice({ sleepDebt }: { sleepDebt: number }) {
	if (sleepDebt === 0) {
		return null;
	}
	if (sleepDebt > 0) {
		return (
			<span className='text-red-500 italic text-sm'>
				{sleepDebt}m of sleep debt accrued this nap
			</span>
		);
	} else {
		return (
			<span className='text-green-500 italic text-sm'>
				{Math.abs(sleepDebt)}m of sleep debt recovered this nap
			</span>
		);
	}
}
