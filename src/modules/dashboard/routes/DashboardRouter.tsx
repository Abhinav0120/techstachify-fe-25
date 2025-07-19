import { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import store from '@/app/store';
import dashboardReducer from '../model/dashboardSlice';
import { ExtendedStore } from '@/app/type';

const reducerKey = 'dashboard';
const Dashboard = lazy(() => import('@/modules/dashboard/pages/Dashboard'));
const PrivateRoute = lazy(() => import('@/routes/PrivateRoute'));
const MainLayout = lazy(() => import('@/layouts/MainLayout'));

const DashboardRouter = () => {
	useEffect(() => {
		const reducerManager = (store as ExtendedStore).reducerManager;
		if (!reducerManager.reducers?.[reducerKey]) {
			reducerManager.add(reducerKey, dashboardReducer);
			console.log('✅ Dashboard reducer injected!');
		}
	}, []);

	return (
		<Routes>
			<Route element={<PrivateRoute />}>
				<Route element={<MainLayout />}>
					<Route path="" element={<Dashboard />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default DashboardRouter;
