// src/modules/auth/authSaga.ts
import { takeLatest, put, delay } from 'redux-saga/effects';
import { loginSuccess } from './authSlice';

function* handleLogin() {
	yield delay(1000);
	yield put(loginSuccess('John Doe'));
}

export function* authSaga() {
	yield takeLatest('auth/login', handleLogin);
}
