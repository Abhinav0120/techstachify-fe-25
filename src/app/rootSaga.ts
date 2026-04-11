import { all } from 'redux-saga/effects';
import { authSaga } from '@/modules/auth/model/authSaga';
import { expenseSaga } from '@/modules/expenseTracker/model/expenseSaga';
import { chatSaga } from '@/modules/chatbot/model/chatSaga';

export default function* rootSaga() {
	yield all([authSaga(), expenseSaga(), chatSaga()]);
}
