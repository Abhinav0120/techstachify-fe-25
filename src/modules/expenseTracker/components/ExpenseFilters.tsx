import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { setFilters, fetchExpensesRequest } from '../model/expenseSlice';
import { Button } from '@/common/components/ui/button';
import { Calendar } from '@/common/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { cn } from '@/common/lib/utils';

const ExpenseFilters = () => {
	const dispatch = useAppDispatch();
	const filters = useAppSelector((state) => state.expense?.filters ?? {});
	const categories = useAppSelector((state) => state.expense?.categories ?? []);

	const updateFilter = (updates: Record<string, unknown>) => {
		dispatch(setFilters({ ...updates, page: 1 }));
		dispatch(fetchExpensesRequest({ ...filters, ...updates, page: 1 }));
	};

	const clearFilters = () => {
		const reset = {
			startDate: undefined,
			endDate: undefined,
			categoryId: undefined,
			sortBy: 'date' as const,
			sortOrder: 'desc' as const,
			page: 1,
		};
		dispatch(setFilters(reset));
		dispatch(fetchExpensesRequest(reset));
	};

	return (
		<div className="flex flex-wrap items-end gap-3">
			<div className="flex flex-col gap-1">
				<span className="text-sm font-medium">From</span>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								'w-[160px] justify-start text-left font-normal',
								!filters.startDate && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{filters.startDate ? format(new Date(filters.startDate), 'MMM d, yyyy') : 'Start date'}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={filters.startDate ? new Date(filters.startDate) : undefined}
							onSelect={(date) => updateFilter({ startDate: date?.toISOString() })}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-sm font-medium">To</span>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								'w-[160px] justify-start text-left font-normal',
								!filters.endDate && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{filters.endDate ? format(new Date(filters.endDate), 'MMM d, yyyy') : 'End date'}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={filters.endDate ? new Date(filters.endDate) : undefined}
							onSelect={(date) => updateFilter({ endDate: date?.toISOString() })}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-sm font-medium">Category</span>
				<Select
					value={filters.categoryId ? String(filters.categoryId) : 'all'}
					onValueChange={(val) => updateFilter({ categoryId: val === 'all' ? undefined : Number(val) })}
				>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{categories.map((cat) => (
							<SelectItem key={cat.id} value={String(cat.id)}>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-1">
				<span className="text-sm font-medium">Sort</span>
				<Select
					value={`${filters.sortBy ?? 'date'}-${filters.sortOrder ?? 'desc'}`}
					onValueChange={(val) => {
						const [sortBy, sortOrder] = val.split('-');
						updateFilter({ sortBy, sortOrder });
					}}
				>
					<SelectTrigger className="w-[170px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="date-desc">Newest first</SelectItem>
						<SelectItem value="date-asc">Oldest first</SelectItem>
						<SelectItem value="amount-desc">Highest amount</SelectItem>
						<SelectItem value="amount-asc">Lowest amount</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Button variant="ghost" size="sm" onClick={clearFilters}>
				Clear
			</Button>
		</div>
	);
};

export default ExpenseFilters;
