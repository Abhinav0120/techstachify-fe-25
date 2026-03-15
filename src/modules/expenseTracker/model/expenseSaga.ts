import { takeLatest, put, call, select } from 'redux-saga/effects';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/common/lib/apiHelpers';
import { API_PATHS } from '@/common/constants/routes';
import type {
	Expense,
	PaginatedResponse,
	ExpenseSummary,
	CategorySpending,
	MonthlyTrend,
	Category,
	ExpenseFilters,
} from '../types/expense.types';
import {
	fetchExpensesRequest,
	fetchExpensesSuccess,
	fetchExpensesFailure,
	createExpenseRequest,
	createExpenseSuccess,
	createExpenseFailure,
	updateExpenseRequest,
	updateExpenseSuccess,
	updateExpenseFailure,
	deleteExpenseRequest,
	deleteExpenseSuccess,
	deleteExpenseFailure,
	fetchCategoriesRequest,
	fetchCategoriesSuccess,
	fetchSummaryRequest,
	fetchSummarySuccess,
	fetchCategorySpendingRequest,
	fetchCategorySpendingSuccess,
	fetchMonthlyTrendRequest,
	fetchMonthlyTrendSuccess,
} from './expenseSlice';

function getErrorMessage(err: unknown, fallback: string): string {
	return err &&
		typeof err === 'object' &&
		'response' in err &&
		typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
		? (err as { response: { data: { message: string } } }).response.data.message
		: fallback;
}

function* handleFetchExpenses(action: ReturnType<typeof fetchExpensesRequest>) {
	try {
		const filters: ExpenseFilters =
			action.payload ??
			(yield select((state: { expense: { filters: ExpenseFilters } }) => state.expense.filters));
		const params: Record<string, string | number> = {};
		if (filters.startDate) params.startDate = filters.startDate;
		if (filters.endDate) params.endDate = filters.endDate;
		if (filters.categoryId) params.categoryId = filters.categoryId;
		if (filters.sortBy) params.sortBy = filters.sortBy;
		if (filters.sortOrder) params.sortOrder = filters.sortOrder;
		if (filters.page) params.page = filters.page;
		if (filters.limit) params.limit = filters.limit;

		const data: PaginatedResponse<Expense> = yield call(
			apiGet<PaginatedResponse<Expense>>,
			API_PATHS.EXPENSES.BASE,
			{ params }
		);
		yield put(fetchExpensesSuccess(data));
	} catch (err: unknown) {
		yield put(fetchExpensesFailure(getErrorMessage(err, 'Failed to fetch expenses')));
	}
}

function* handleCreateExpense(action: ReturnType<typeof createExpenseRequest>) {
	try {
		const data: Expense = yield call(apiPost<Expense>, API_PATHS.EXPENSES.BASE, action.payload);
		yield put(createExpenseSuccess(data));
		yield put(fetchExpensesRequest());
	} catch (err: unknown) {
		yield put(createExpenseFailure(getErrorMessage(err, 'Failed to create expense')));
	}
}

function* handleUpdateExpense(action: ReturnType<typeof updateExpenseRequest>) {
	try {
		const { id, data: updateData } = action.payload;
		const data: Expense = yield call(apiPatch<Expense>, `${API_PATHS.EXPENSES.BASE}/${id}`, updateData);
		yield put(updateExpenseSuccess(data));
		yield put(fetchExpensesRequest());
	} catch (err: unknown) {
		yield put(updateExpenseFailure(getErrorMessage(err, 'Failed to update expense')));
	}
}

function* handleDeleteExpense(action: ReturnType<typeof deleteExpenseRequest>) {
	try {
		yield call(apiDelete, `${API_PATHS.EXPENSES.BASE}/${action.payload}`);
		yield put(deleteExpenseSuccess(action.payload));
	} catch (err: unknown) {
		yield put(deleteExpenseFailure(getErrorMessage(err, 'Failed to delete expense')));
	}
}

function* handleFetchCategories() {
	try {
		const data: Category[] = yield call(apiGet<Category[]>, API_PATHS.EXPENSES.CATEGORIES);
		yield put(fetchCategoriesSuccess(data));
	} catch {
		// Silent fail — categories are non-critical
	}
}

function* handleFetchSummary() {
	try {
		const data: ExpenseSummary = yield call(apiGet<ExpenseSummary>, API_PATHS.EXPENSES.SUMMARY);
		yield put(fetchSummarySuccess(data));
	} catch {
		// Silent fail
	}
}

function* handleFetchCategorySpending() {
	try {
		const data: CategorySpending[] = yield call(apiGet<CategorySpending[]>, API_PATHS.EXPENSES.BY_CATEGORY);
		yield put(fetchCategorySpendingSuccess(data));
	} catch {
		// Silent fail
	}
}

function* handleFetchMonthlyTrend() {
	try {
		const data: MonthlyTrend[] = yield call(apiGet<MonthlyTrend[]>, API_PATHS.EXPENSES.MONTHLY_TREND);
		yield put(fetchMonthlyTrendSuccess(data));
	} catch {
		// Silent fail
	}
}

export function* expenseSaga() {
	yield takeLatest(fetchExpensesRequest.match, handleFetchExpenses);
	yield takeLatest(createExpenseRequest.match, handleCreateExpense);
	yield takeLatest(updateExpenseRequest.match, handleUpdateExpense);
	yield takeLatest(deleteExpenseRequest.match, handleDeleteExpense);
	yield takeLatest(fetchCategoriesRequest.match, handleFetchCategories);
	yield takeLatest(fetchSummaryRequest.match, handleFetchSummary);
	yield takeLatest(fetchCategorySpendingRequest.match, handleFetchCategorySpending);
	yield takeLatest(fetchMonthlyTrendRequest.match, handleFetchMonthlyTrend);
}
