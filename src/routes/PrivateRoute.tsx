import { useAppSelector } from '@/common/hooks/reduxHooks';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
}
