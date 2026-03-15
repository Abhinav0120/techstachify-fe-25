import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { fetchExpensesRequest, fetchCategoriesRequest, setFilters } from '../model/expenseSlice';
import { ROUTES } from '@/common/constants/routes';
import { Button } from '@/common/components/ui/button';
import { Skeleton } from '@/common/components/ui/skeleton';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFilters from '../components/ExpenseFilters';

const ExpenseListPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const expenses = useAppSelector((state) => state.expense?.expenses ?? []);
	const loading = useAppSelector((state) => state.expense?.loading ?? false);
	const page = useAppSelector((state) => state.expense?.page ?? 1);
	const totalPages = useAppSelector((state) => state.expense?.totalPages ?? 0);
	const filters = useAppSelector((state) => state.expense?.filters ?? {});

	useEffect(() => {
		dispatch(fetchExpensesRequest());
		dispatch(fetchCategoriesRequest());
	}, [dispatch]);

	const handlePageChange = (newPage: number) => {
		dispatch(setFilters({ page: newPage }));
		dispatch(fetchExpensesRequest({ ...filters, page: newPage }));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
					<p className="text-muted-foreground text-sm">Track and manage your spending.</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => navigate(ROUTES.EXPENSES.OVERVIEW)}>
						Analytics
					</Button>
					<Button onClick={() => navigate(ROUTES.EXPENSES.ADD)} className="gap-2">
						<Plus className="h-4 w-4" />
						Add Expense
					</Button>
				</div>
			</div>

			<ExpenseFilters />

			{loading && expenses.length === 0 ? (
				<div className="space-y-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="h-12 w-full" />
					))}
				</div>
			) : (
				<ExpenseTable expenses={expenses} loading={loading} />
			)}

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
						Previous
					</Button>
					<span className="text-muted-foreground text-sm">
						Page {page} of {totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= totalPages}
						onClick={() => handlePageChange(page + 1)}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};

export default ExpenseListPage;
