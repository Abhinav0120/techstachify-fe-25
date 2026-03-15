import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
	Expense,
	ExpenseFilters,
	ExpenseSummary,
	CategorySpending,
	MonthlyTrend,
	Category,
	PaginatedResponse,
	CreateExpensePayload,
	UpdateExpensePayload,
} from '../types/expense.types';

export interface ExpenseState {
	expenses: Expense[];
	total: number;
	page: number;
	totalPages: number;
	filters: ExpenseFilters;
	categories: Category[];
	summary: ExpenseSummary | null;
	categorySpending: CategorySpending[];
	monthlyTrend: MonthlyTrend[];
	loading: boolean;
	error: string | null;
	formLoading: boolean;
	formError: string | null;
}

const initialState: ExpenseState = {
	expenses: [],
	total: 0,
	page: 1,
	totalPages: 0,
	filters: { sortBy: 'date', sortOrder: 'desc', page: 1, limit: 20 },
	categories: [],
	summary: null,
	categorySpending: [],
	monthlyTrend: [],
	loading: false,
	error: null,
	formLoading: false,
	formError: null,
};

const expenseSlice = createSlice({
	name: 'expense',
	initialState,
	reducers: {
		fetchExpensesRequest: (
			state,
			_action: PayloadAction<ExpenseFilters | undefined> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.loading = true;
			state.error = null;
		},
		fetchExpensesSuccess: (state, action: PayloadAction<PaginatedResponse<Expense>>) => {
			state.expenses = action.payload.data;
			state.total = action.payload.total;
			state.page = action.payload.page;
			state.totalPages = action.payload.totalPages;
			state.loading = false;
		},
		fetchExpensesFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		createExpenseRequest: (
			state,
			_action: PayloadAction<CreateExpensePayload> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.formLoading = true;
			state.formError = null;
		},
		createExpenseSuccess: (
			state,
			_action: PayloadAction<Expense> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.formLoading = false;
		},
		createExpenseFailure: (state, action: PayloadAction<string>) => {
			state.formLoading = false;
			state.formError = action.payload;
		},

		updateExpenseRequest: (
			state,
			_action: PayloadAction<UpdateExpensePayload> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.formLoading = true;
			state.formError = null;
		},
		updateExpenseSuccess: (
			state,
			_action: PayloadAction<Expense> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.formLoading = false;
		},
		updateExpenseFailure: (state, action: PayloadAction<string>) => {
			state.formLoading = false;
			state.formError = action.payload;
		},

		deleteExpenseRequest: (
			state,
			_action: PayloadAction<number> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.loading = true;
			state.error = null;
		},
		deleteExpenseSuccess: (state, action: PayloadAction<number>) => {
			state.expenses = state.expenses.filter((e) => e.id !== action.payload);
			state.total -= 1;
			state.loading = false;
		},
		deleteExpenseFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		fetchCategoriesRequest: (state) => {
			state.loading = true;
		},
		fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
			state.categories = action.payload;
			state.loading = false;
		},

		fetchSummaryRequest: (state) => {
			state.loading = true;
		},
		fetchSummarySuccess: (state, action: PayloadAction<ExpenseSummary>) => {
			state.summary = action.payload;
			state.loading = false;
		},

		fetchCategorySpendingRequest: (state) => {
			state.loading = true;
		},
		fetchCategorySpendingSuccess: (state, action: PayloadAction<CategorySpending[]>) => {
			state.categorySpending = action.payload;
			state.loading = false;
		},

		fetchMonthlyTrendRequest: (state) => {
			state.loading = true;
		},
		fetchMonthlyTrendSuccess: (state, action: PayloadAction<MonthlyTrend[]>) => {
			state.monthlyTrend = action.payload;
			state.loading = false;
		},

		setFilters: (state, action: PayloadAction<Partial<ExpenseFilters>>) => {
			state.filters = { ...state.filters, ...action.payload };
		},

		clearFormError: (state) => {
			state.formError = null;
		},
	},
});

export const {
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
	setFilters,
	clearFormError,
} = expenseSlice.actions;

export default expenseSlice.reducer;
