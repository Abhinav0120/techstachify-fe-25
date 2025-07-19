import type { Reducer } from '@reduxjs/toolkit';
import type store from './store';

export type ExtendedStore = typeof store & {
	reducerManager: {
		add: (key: string, reducer: Reducer) => void;
		reducers: Record<string, Reducer>;
	};
};
