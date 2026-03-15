import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';

interface DeleteExpenseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	loading?: boolean;
}

const DeleteExpenseDialog = ({ open, onOpenChange, onConfirm, loading }: DeleteExpenseDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Expense</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this expense? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={loading}>
						{loading ? 'Deleting...' : 'Delete'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteExpenseDialog;
