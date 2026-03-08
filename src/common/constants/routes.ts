/**
 * Central route constants for the app.
 * Update paths here so they stay in sync everywhere (router, navigate, API redirects).
 */

// ---- App (frontend) routes ----
export const ROUTES = {
	ROOT: '/',
	AUTH: {
		BASE: '/auth',
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		/** Segment for React Router under AUTH.BASE (e.g. path="login" under /auth/*) */
		LOGIN_SEGMENT: 'login',
		REGISTER_SEGMENT: 'register',
	},
	DASHBOARD: '/dashboard',
} as const;

// ---- API path segments (relative to API base URL) ----
export const API_PATHS = {
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		ME: '/auth/me',
	},
} as const;

/**
 * API paths that are "public" – a 401 on these should NOT trigger logout/redirect.
 * Add any new public API route here (e.g. forgot-password, refresh-token).
 */
export const API_PUBLIC_PATHS: string[] = [API_PATHS.AUTH.LOGIN, API_PATHS.AUTH.REGISTER];

/**
 * Returns true if the request URL is a public API path (no redirect on 401).
 */
export function isPublicApiPath(url: string | undefined): boolean {
	if (!url) return false;
	const path = url.split('?')[0];
	return API_PUBLIC_PATHS.some((publicPath) => path === publicPath || path.startsWith(publicPath + '/'));
}
