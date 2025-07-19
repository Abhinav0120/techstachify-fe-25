import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createReducerManager } from './rootReducer';
import rootSaga from './rootSaga';
import authSlice, { AuthState } from '@/modules/auth/model/authSlice';

export interface RootState {
	auth: AuthState;
}

export const rootReducer = {
	auth: authSlice,
};

const sagaMiddleware = createSagaMiddleware();
const reducerManager = createReducerManager(rootReducer);

const store = configureStore({
	reducer: reducerManager.reduce,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
	devTools: import.meta.env.MODE !== 'production',
});

sagaMiddleware.run(rootSaga);
(store as typeof store & { reducerManager: typeof reducerManager }).reducerManager = reducerManager;

export type AppDispatch = typeof store.dispatch;
export default store;
