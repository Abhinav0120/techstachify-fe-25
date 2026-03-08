import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes';

const AuthRouter = lazy(() => import('@/modules/auth/routes/AuthRouter'));
const DashboardRouter = lazy(() => import('@/modules/dashboard/routes/DashboardRouter'));

const AppRouter = () => {
	return (
		<Suspense fallback={<div> Loding... </div>}>
			<Routes>
				<Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} />} />
				<Route path={`${ROUTES.AUTH.BASE}/*`} element={<AuthRouter />} />
				<Route path={`${ROUTES.DASHBOARD}/*`} element={<DashboardRouter />} />
			</Routes>
		</Suspense>
	);
};

export default AppRouter;
