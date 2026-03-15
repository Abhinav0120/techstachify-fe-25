export interface Category {
	id: number;
	name: string;
	color: string;
	userId: number | null;
}

export interface Expense {
	id: number;
	amount: number;
	description: string;
	date: string;
	categoryId: number;
	category: Category;
	createdAt: string;
	updatedAt: string;
}

export interface ExpenseSummary {
	thisMonth: number;
	lastMonth: number;
	allTime: number;
}

export interface CategorySpending {
	categoryId: number;
	categoryName: string;
	color: string;
	total: number;
}

export interface MonthlyTrend {
	month: string;
	total: number;
}

export interface ExpenseFilters {
	startDate?: string;
	endDate?: string;
	categoryId?: number;
	sortBy?: 'date' | 'amount' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
	page?: number;
	limit?: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	totalPages: number;
}

export interface CreateExpensePayload {
	amount: number;
	description: string;
	date: string;
	categoryId: number;
}

export interface UpdateExpensePayload {
	id: number;
	data: Partial<CreateExpensePayload>;
}
