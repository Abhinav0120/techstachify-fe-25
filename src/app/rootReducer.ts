import { combineReducers } from '@reduxjs/toolkit';
import type { ReducersMapObject, Reducer } from '@reduxjs/toolkit';
import type { Action } from 'redux';

type ReducerMap = ReducersMapObject;

export const createReducerManager = (initialReducers: ReducerMap) => {
	const reducers = { ...initialReducers };

	let combinedReducer = combineReducers(reducers);

	return {
		reduce: (state: ReturnType<typeof combinedReducer> | undefined, action: Action) =>
			combinedReducer(state, action),

		add: (key: string, reducer: Reducer) => {
			if (!key || reducers[key]) return;
			reducers[key] = reducer;
			combinedReducer = combineReducers(reducers);
		},

		remove: (key: string) => {
			if (!key || !reducers[key]) return;
			delete reducers[key];
			combinedReducer = combineReducers(reducers);
		},

		get reducers() {
			return reducers;
		},
	};
};
