import { all } from 'redux-saga/effects';
import { authSaga } from '@/modules/auth/model/authSaga';
import { expenseSaga } from '@/modules/expenseTracker/model/expenseSaga';

export default function* rootSaga() {
	yield all([authSaga(), expenseSaga()]);
}
