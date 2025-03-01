import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface TimeSelectProps {
	value: {
		hour?: string;
		minute?: string;
	};
	onValueChange: (value: { id: 'hour' | 'minute'; value: string }) => void;
	options: number[];
}
export default function TimeSelect({
	value,
	onValueChange,
	options,
}: TimeSelectProps) {
	return (
		<>
			<Select
				value={value.hour}
				onValueChange={(value) => onValueChange({ id: 'hour', value })}>
				<SelectTrigger>
					<SelectValue placeholder={'hour'} />
				</SelectTrigger>
				<SelectContent>
					{options.map((hour) => (
						<SelectItem
							key={`hour-${hour}`}
							value={`${hour}`}>
							{hour}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={value.minute}
				onValueChange={(value) =>
					onValueChange({ id: 'minute', value })
				}>
				<SelectTrigger>
					<SelectValue placeholder={'minute'} />
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
		</>
	);
}
