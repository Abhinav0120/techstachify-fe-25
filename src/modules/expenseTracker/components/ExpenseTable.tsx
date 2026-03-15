import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/common/hooks/reduxHooks';
import { deleteExpenseRequest } from '../model/expenseSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/common/components/ui/table';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import DeleteExpenseDialog from './DeleteExpenseDialog';
import type { Expense } from '../types/expense.types';

interface ExpenseTableProps {
	expenses: Expense[];
	loading?: boolean;
}

const ExpenseTable = ({ expenses, loading }: ExpenseTableProps) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [deleteId, setDeleteId] = useState<number | null>(null);

	const handleDelete = () => {
		if (deleteId !== null) {
			dispatch(deleteExpenseRequest(deleteId));
			setDeleteId(null);
		}
	};

	if (!loading && expenses.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-muted-foreground text-lg">No expenses found</p>
				<p className="text-muted-foreground text-sm">Add your first expense to get started.</p>
			</div>
		);
	}

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Category</TableHead>
						<TableHead className="text-right">Amount</TableHead>
						<TableHead className="w-[50px]" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{expenses.map((expense) => (
						<TableRow key={expense.id}>
							<TableCell className="whitespace-nowrap">
								{format(new Date(expense.date), 'MMM d, yyyy')}
							</TableCell>
							<TableCell>{expense.description}</TableCell>
							<TableCell>
								<Badge
									variant="outline"
									className="gap-1.5"
									style={{ borderColor: expense.category.color }}
								>
									<span
										className="inline-block h-2 w-2 rounded-full"
										style={{ backgroundColor: expense.category.color }}
									/>
									{expense.category.name}
								</Badge>
							</TableCell>
							<TableCell className="text-right font-medium">${expense.amount.toFixed(2)}</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											onClick={() => navigate(`/dashboard/expenses/edit/${expense.id}`)}
										>
											<Pencil className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-destructive"
											onClick={() => setDeleteId(expense.id)}
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<DeleteExpenseDialog
				open={deleteId !== null}
				onOpenChange={(open) => !open && setDeleteId(null)}
				onConfirm={handleDelete}
				loading={loading}
			/>
		</>
	);
};

export default ExpenseTable;
