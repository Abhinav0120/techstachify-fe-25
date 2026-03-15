import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { fetchSummaryRequest, fetchCategorySpendingRequest, fetchMonthlyTrendRequest } from '../model/expenseSlice';
import { ROUTES } from '@/common/constants/routes';
import { Button } from '@/common/components/ui/button';
import ExpenseSummaryCards from '../components/ExpenseSummaryCards';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyBarChart from '../components/MonthlyBarChart';

const ExpenseDashboardPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const summary = useAppSelector((state) => state.expense?.summary ?? null);
	const categorySpending = useAppSelector((state) => state.expense?.categorySpending ?? []);
	const monthlyTrend = useAppSelector((state) => state.expense?.monthlyTrend ?? []);
	const loading = useAppSelector((state) => state.expense?.loading ?? false);

	useEffect(() => {
		dispatch(fetchSummaryRequest());
		dispatch(fetchCategorySpendingRequest());
		dispatch(fetchMonthlyTrendRequest());
	}, [dispatch]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Expense Analytics</h1>
					<p className="text-muted-foreground text-sm">Overview of your spending patterns.</p>
				</div>
				<Button variant="ghost" onClick={() => navigate(ROUTES.EXPENSES.BASE)} className="gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back to List
				</Button>
			</div>

			<ExpenseSummaryCards summary={summary} loading={loading} />

			<div className="grid gap-6 lg:grid-cols-2">
				<CategoryPieChart data={categorySpending} loading={loading} />
				<MonthlyBarChart data={monthlyTrend} loading={loading} />
			</div>
		</div>
	);
};

export default ExpenseDashboardPage;
