'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { setUser } from '@/modules/auth/model/authSlice';
import type { AuthUser } from '@/modules/auth/model/authSlice';
import { apiGet } from '@/common/lib/apiHelpers';
import { API_PATHS } from '@/common/constants/routes';
import { initializeSocket, disconnectSocket } from '@/common/lib/socket';

/**
 * On app load, if accessToken exists in localStorage, fetches current user from GET /auth/me
 * and syncs auth state so refresh keeps the user logged in.
 * Also initializes Socket.io when authenticated.
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
				// Initialize Socket.io with token
				initializeSocket(token);
			})
			.catch(() => {
				// 401 or network error: interceptor or fetch failed; token may be invalid.
				// Interceptor already clears token and redirects on 401 from api.
				disconnectSocket();
			});
	}, [dispatch, isAuthenticated]);

	// Initialize Socket.io on authentication
	useEffect(() => {
		if (isAuthenticated) {
			const token = localStorage.getItem('accessToken');
			if (token) {
				initializeSocket(token);
			}
		} else {
			disconnectSocket();
		}
	}, [isAuthenticated]);

	return null;
}
