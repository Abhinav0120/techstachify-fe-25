'use client';

import { useAppSelector } from '@/common/hooks/reduxHooks';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes';

export default function AdminRoute() {
	const user = useAppSelector((state) => state.auth.user);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
	}
	if (user?.role !== 'ADMIN') {
		return <Navigate to={ROUTES.DASHBOARD} replace />;
	}
	return <Outlet />;
}
