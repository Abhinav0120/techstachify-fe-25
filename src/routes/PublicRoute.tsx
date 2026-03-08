import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/common/hooks/reduxHooks';
import { ROUTES } from '@/common/constants/routes';

export default function PublicRoute() {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} /> : <Outlet />;
}
