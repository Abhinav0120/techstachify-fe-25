import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { fetchCategoriesRequest } from '../model/expenseSlice';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Calendar } from '@/common/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form';
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { cn } from '@/common/lib/utils';
import type { Expense } from '../types/expense.types';

const expenseSchema = z.object({
	amount: z.number().positive('Amount must be positive'),
	description: z.string().min(1, 'Description is required').max(255),
	date: z.date({ message: 'Date is required' }),
	categoryId: z.number().int().positive('Category is required'),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
	expense?: Expense;
	onSubmit: (data: ExpenseFormValues) => void;
	loading?: boolean;
	error?: string | null;
}

const ExpenseForm = ({ expense, onSubmit, loading, error }: ExpenseFormProps) => {
	const dispatch = useAppDispatch();
	const categories = useAppSelector((state) => state.expense?.categories ?? []);

	useEffect(() => {
		if (categories.length === 0) {
			dispatch(fetchCategoriesRequest());
		}
	}, [dispatch, categories.length]);

	const form = useForm<ExpenseFormValues>({
		resolver: zodResolver(expenseSchema),
		defaultValues: {
			amount: expense?.amount ?? 0,
			description: expense?.description ?? '',
			date: expense ? new Date(expense.date) : new Date(),
			categoryId: expense?.categoryId ?? 0,
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									placeholder="0.00"
									{...field}
									onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input placeholder="What was this expense for?" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											className={cn(
												'w-full pl-3 text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) => date > new Date()}
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="categoryId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select
								onValueChange={(val) => field.onChange(Number(val))}
								defaultValue={field.value ? String(field.value) : undefined}
							>
								<FormControl>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((cat) => (
										<SelectItem key={cat.id} value={String(cat.id)}>
											<span className="flex items-center gap-2">
												<span
													className="inline-block h-3 w-3 rounded-full"
													style={{ backgroundColor: cat.color }}
												/>
												{cat.name}
											</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
				</Button>
			</form>
		</Form>
	);
};

export default ExpenseForm;
