import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Skeleton } from '@/common/components/ui/skeleton';
import type { ExpenseSummary } from '../types/expense.types';

interface ExpenseSummaryCardsProps {
	summary: ExpenseSummary | null;
	loading?: boolean;
}

const ExpenseSummaryCards = ({ summary, loading }: ExpenseSummaryCardsProps) => {
	if (loading || !summary) {
		return (
			<div className="grid gap-4 md:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-32" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const percentChange =
		summary.lastMonth > 0 ? ((summary.thisMonth - summary.lastMonth) / summary.lastMonth) * 100 : 0;

	const cards = [
		{
			title: 'This Month',
			value: summary.thisMonth,
			icon: DollarSign,
			extra:
				percentChange !== 0 ? (
					<span
						className={`flex items-center gap-1 text-xs ${percentChange > 0 ? 'text-red-500' : 'text-green-500'}`}
					>
						{percentChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
						{Math.abs(percentChange).toFixed(1)}% vs last month
					</span>
				) : null,
		},
		{
			title: 'Last Month',
			value: summary.lastMonth,
			icon: DollarSign,
		},
		{
			title: 'All Time',
			value: summary.allTime,
			icon: DollarSign,
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-3">
			{cards.map((card) => (
				<Card key={card.title}>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">{card.title}</CardTitle>
						<card.icon className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${card.value.toFixed(2)}</div>
						{card.extra}
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default ExpenseSummaryCards;
