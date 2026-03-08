import { takeLatest, put, call } from 'redux-saga/effects';
import { apiPost } from '@/common/lib/apiHelpers';
import { API_PATHS } from '@/common/constants/routes';
import type { AuthUser } from './authSlice';
import { loginRequest, loginSuccess, loginFailure, registerRequest, registerFailure, logout } from './authSlice';

interface LoginResponse {
	user: AuthUser;
	accessToken: string;
}

interface RegisterResponse {
	user: AuthUser;
	accessToken: string;
}

function* handleLogin(action: ReturnType<typeof loginRequest>) {
	const { email, password } = action.payload;
	try {
		const data: LoginResponse = yield call(apiPost<LoginResponse>, API_PATHS.AUTH.LOGIN, {
			email,
			password,
		});
		if (data.accessToken) {
			localStorage.setItem('accessToken', data.accessToken);
		}
		yield put(loginSuccess({ user: data.user, accessToken: data.accessToken }));
	} catch (err: unknown) {
		const message =
			err &&
			typeof err === 'object' &&
			'response' in err &&
			typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
				? (err as { response: { data: { message: string } } }).response.data.message
				: 'Invalid credentials';
		yield put(loginFailure(message));
	}
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
	const { email, password, name } = action.payload;
	try {
		const data: RegisterResponse = yield call(apiPost<RegisterResponse>, API_PATHS.AUTH.REGISTER, {
			email,
			password,
			name,
		});
		if (data.accessToken) {
			localStorage.setItem('accessToken', data.accessToken);
		}
		yield put(loginSuccess({ user: data.user, accessToken: data.accessToken }));
	} catch (err: unknown) {
		const message =
			err &&
			typeof err === 'object' &&
			'response' in err &&
			typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
				? (err as { response: { data: { message: string } } }).response.data.message
				: 'Registration failed';
		yield put(registerFailure(message));
	}
}

function* handleLogout() {
	localStorage.removeItem('accessToken');
	yield undefined;
}

export function* authSaga() {
	yield takeLatest(loginRequest.match, handleLogin);
	yield takeLatest(registerRequest.match, handleRegister);
	yield takeLatest(logout.match, handleLogout);
}
