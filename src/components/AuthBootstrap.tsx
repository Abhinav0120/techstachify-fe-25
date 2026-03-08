'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { setUser } from '@/modules/auth/model/authSlice';
import type { AuthUser } from '@/modules/auth/model/authSlice';
import { apiGet } from '@/common/lib/apiHelpers';
import { API_PATHS } from '@/common/constants/routes';

/**
 * On app load, if accessToken exists in localStorage, fetches current user from GET /auth/me
 * and syncs auth state so refresh keeps the user logged in.
 */
export function AuthBootstrap() {
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

	useEffect(() => {
		const token = localStorage.getItem('accessToken');
		if (!token || isAuthenticated) return;

		apiGet<AuthUser>(API_PATHS.AUTH.ME)
			.then((user) => {
				dispatch(setUser(user));
			})
			.catch(() => {
				// 401 or network error: interceptor or fetch failed; token may be invalid.
				// Interceptor already clears token and redirects on 401 from api.
			});
	}, [dispatch, isAuthenticated]);

	return null;
}
