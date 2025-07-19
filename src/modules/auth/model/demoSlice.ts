import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	user: null,
};

const demoSlice = createSlice({
	name: 'demo',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.user = action.payload;
		},
		logout: (state) => {
			state.user = null;
		},
	},
});

export const { loginSuccess, logout } = demoSlice.actions;
export default demoSlice.reducer;
