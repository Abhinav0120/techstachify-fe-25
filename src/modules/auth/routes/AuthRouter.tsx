import { Routes, Route } from 'react-router-dom';
import { lazy, useEffect } from 'react';
import store from '@/app/store';
import { authReducer } from '../model';
import AuthLayout from '@/layouts/AuthLayout';
import PublicRoute from '@/routes/PublicRoute';
import { ExtendedStore } from '@/app/type';

const reducerKey = 'auth';

const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const Register = lazy(() => import('@/modules/auth/pages/RegisterPage'));

const AuthRouter = () => {
	useEffect(() => {
		const reducerManager = (store as ExtendedStore).reducerManager;

		if (!reducerManager.reducers?.[reducerKey]) {
			reducerManager.add(reducerKey, authReducer);
			console.log('✅ Auth reducer injected!');
		}
	}, []);

	return (
		<Routes>
			<Route element={<PublicRoute />}>
				<Route element={<AuthLayout />}>
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<Register />} />
				</Route>
			</Route>
		</Routes>
	);
};

export default AuthRouter;
