import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
			console.warn('Unauthorized - redirecting to login');
			// window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default api;
