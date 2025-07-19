import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const AuthRouter = lazy(() => import('@/modules/auth/routes/AuthRouter'));
const DashboardRouter = lazy(() => import('@/modules/dashboard/routes/DashboardRouter'));

const AppRouter = () => {
	return (
		<Suspense fallback={<div> Loding... </div>}>
			<Routes>
				<Route path="/" element={<Navigate to="/dashboard" />} />
				<Route path="/auth/*" element={<AuthRouter />} />
				<Route path="/dashboard/*" element={<DashboardRouter />} />
			</Routes>
		</Suspense>
	);
};

export default AppRouter;
