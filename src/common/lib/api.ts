import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { logout } from '@/modules/auth/model/authSlice';
import { ROUTES, isPublicApiPath } from '@/common/constants/routes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

type StoreWithDispatch = { dispatch: (action: ReturnType<typeof logout>) => void };
let storeRef: StoreWithDispatch | null = null;

export function setStore(store: StoreWithDispatch) {
	storeRef = store;
}

const api: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

const getToken = (): string | null => {
	return localStorage.getItem('accessToken');
};

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const token = getToken();
		if (token) {
			if (!config.headers) {
				config.headers = {} as AxiosHeaders;
			}
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			const requestUrl = error.config?.url;
			if (!isPublicApiPath(requestUrl)) {
				localStorage.removeItem('accessToken');
				storeRef?.dispatch(logout());
				window.location.href = ROUTES.AUTH.LOGIN;
			}
		}
		return Promise.reject(error);
	}
);

export default api;
