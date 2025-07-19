import { AxiosRequestConfig } from 'axios';
import api from './api';

export const apiGet = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
	api.get<T>(url, config).then((res) => res.data);

export const apiPost = <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
	api.post<T>(url, data, config).then((res) => res.data);

export const apiPut = <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> =>
	api.put<T>(url, data, config).then((res) => res.data);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
	api.delete<T>(url, config).then((res) => res.data);
