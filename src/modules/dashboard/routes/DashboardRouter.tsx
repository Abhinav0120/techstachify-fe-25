import { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import store from '@/app/store';
import dashboardReducer from '../model/dashboardSlice';
import { ExtendedStore } from '@/app/type';

const reducerKey = 'dashboard';
const Dashboard = lazy(() => import('@/modules/dashboard/pages/Dashboard'));
const ProfilePage = lazy(() => import('@/modules/dashboard/pages/ProfilePage'));
const AdminPage = lazy(() => import('@/modules/dashboard/pages/AdminPage'));
const ComingSoonPage = lazy(() => import('@/modules/dashboard/pages/ComingSoonPage'));
const ExpenseRouter = lazy(() => import('@/modules/expenseTracker/routes/ExpenseRouter'));
const PrivateRoute = lazy(() => import('@/routes/PrivateRoute'));
const AdminRoute = lazy(() => import('@/routes/AdminRoute'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));

const ChatRouter = lazy(() => import('@/modules/chatbot/routes/ChatRouter'));

const DashboardRouter = () => {
	useEffect(() => {
		const reducerManager = (store as ExtendedStore).reducerManager;
		if (!reducerManager.reducers?.[reducerKey]) {
			reducerManager.add(reducerKey, dashboardReducer);
		}
	}, []);

	return (
		<Routes>
			<Route element={<PrivateRoute />}>
				<Route element={<MainLayout />}>
					<Route path="" element={<Dashboard />} />
					<Route path="profile" element={<ProfilePage />} />
					<Route element={<AdminRoute />}>
						<Route path="admin" element={<AdminPage />} />
					</Route>
					<Route path="chat/*" element={<ChatRouter />} />
					<Route path="expenses/*" element={<ExpenseRouter />} />
					<Route
						path="kanban"
						element={<ComingSoonPage title="Kanban Board" description="Project management. Coming soon." />}
					/>
					<Route
						path="shop"
						element={
							<ComingSoonPage
								title="E-commerce"
								description="Product catalog and payments. Coming soon."
							/>
						}
					/>
					<Route
						path="social"
						element={
							<ComingSoonPage
								title="Social Dashboard"
								description="Posts, comments, and notifications. Coming soon."
							/>
						}
					/>
				</Route>
			</Route>
		</Routes>
	);
};

export default DashboardRouter;
