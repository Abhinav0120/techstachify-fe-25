import { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import store from '@/app/store';
import { expenseReducer } from '../model';
import { ExtendedStore } from '@/app/type';

const reducerKey = 'expense';

const ExpenseListPage = lazy(() => import('../pages/ExpenseListPage'));
const ExpenseAddPage = lazy(() => import('../pages/ExpenseAddPage'));
const ExpenseDashboardPage = lazy(() => import('../pages/ExpenseDashboardPage'));

const ExpenseRouter = () => {
	useEffect(() => {
		const reducerManager = (store as ExtendedStore).reducerManager;
		if (!reducerManager.reducers?.[reducerKey]) {
			reducerManager.add(reducerKey, expenseReducer);
		}
	}, []);

	return (
		<Routes>
			<Route path="" element={<ExpenseListPage />} />
			<Route path="add" element={<ExpenseAddPage />} />
			<Route path="edit/:id" element={<ExpenseAddPage />} />
			<Route path="overview" element={<ExpenseDashboardPage />} />
		</Routes>
	);
};

export default ExpenseRouter;
