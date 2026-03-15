import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import {
	createExpenseRequest,
	updateExpenseRequest,
	clearFormError,
	fetchExpensesRequest,
} from '../model/expenseSlice';
import { ROUTES } from '@/common/constants/routes';
import { Button } from '@/common/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import ExpenseForm from '../components/ExpenseForm';
import type { Expense } from '../types/expense.types';

const ExpenseAddPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const isEdit = !!id;
	const expense = useAppSelector((state) =>
		isEdit ? state.expense?.expenses.find((e: Expense) => e.id === Number(id)) : undefined
	);
	const formLoading = useAppSelector((state) => state.expense?.formLoading ?? false);
	const formError = useAppSelector((state) => state.expense?.formError ?? null);

	useEffect(() => {
		if (isEdit && !expense) {
			dispatch(fetchExpensesRequest());
		}
	}, [isEdit, expense, dispatch]);

	useEffect(() => {
		return () => {
			dispatch(clearFormError());
		};
	}, [dispatch]);

	const handleSubmit = useCallback(
		(data: { amount: number; description: string; date: Date; categoryId: number }) => {
			const payload = {
				amount: data.amount,
				description: data.description,
				date: data.date.toISOString(),
				categoryId: data.categoryId,
			};

			if (isEdit) {
				dispatch(updateExpenseRequest({ id: Number(id), data: payload }));
			} else {
				dispatch(createExpenseRequest(payload));
			}
			navigate(ROUTES.EXPENSES.BASE);
		},
		[dispatch, isEdit, id, navigate]
	);

	return (
		<div className="mx-auto max-w-lg space-y-6">
			<Button variant="ghost" onClick={() => navigate(ROUTES.EXPENSES.BASE)} className="gap-2">
				<ArrowLeft className="h-4 w-4" />
				Back to Expenses
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>{isEdit ? 'Edit Expense' : 'Add Expense'}</CardTitle>
				</CardHeader>
				<CardContent>
					<ExpenseForm expense={expense} onSubmit={handleSubmit} loading={formLoading} error={formError} />
				</CardContent>
			</Card>
		</div>
	);
};

export default ExpenseAddPage;
