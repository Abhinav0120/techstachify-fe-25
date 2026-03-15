import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Skeleton } from '@/common/components/ui/skeleton';
import type { CategorySpending } from '../types/expense.types';

interface CategoryPieChartProps {
	data: CategorySpending[];
	loading?: boolean;
}

const CategoryPieChart = ({ data, loading }: CategoryPieChartProps) => {
	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Spending by Category</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center">
					<Skeleton className="h-[250px] w-[250px] rounded-full" />
				</CardContent>
			</Card>
		);
	}

	if (data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Spending by Category</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">No data yet</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Spending by Category</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={100}
							paddingAngle={2}
							dataKey="total"
							nameKey="categoryName"
						>
							{data.map((entry) => (
								<Cell key={entry.categoryId} fill={entry.color} />
							))}
						</Pie>
						<Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};

export default CategoryPieChart;
