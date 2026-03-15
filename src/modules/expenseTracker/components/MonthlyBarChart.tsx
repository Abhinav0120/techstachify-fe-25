import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parse } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Skeleton } from '@/common/components/ui/skeleton';
import type { MonthlyTrend } from '../types/expense.types';

interface MonthlyBarChartProps {
	data: MonthlyTrend[];
	loading?: boolean;
}

const MonthlyBarChart = ({ data, loading }: MonthlyBarChartProps) => {
	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Monthly Spending</CardTitle>
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[300px] w-full" />
				</CardContent>
			</Card>
		);
	}

	if (data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Monthly Spending</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">No data yet</p>
				</CardContent>
			</Card>
		);
	}

	const chartData = data.map((item) => ({
		...item,
		label: format(parse(item.month, 'yyyy-MM', new Date()), 'MMM yyyy'),
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Monthly Spending</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis dataKey="label" className="text-xs" />
						<YAxis className="text-xs" tickFormatter={(val) => `$${val}`} />
						<Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total']} />
						<Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export default MonthlyBarChart;
