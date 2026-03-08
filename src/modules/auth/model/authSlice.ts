import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
	id: number;
	email: string;
	name: string;
	role: string;
	createdAt: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: AuthUser | null;
	loginError: string | null;
	registerError: string | null;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	loginError: null,
	registerError: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginRequest: (
			state,
			_action: PayloadAction<{ email: string; password: string }> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.loginError = null;
		},
		loginSuccess: (state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) => {
			state.isAuthenticated = true;
			state.user = action.payload.user;
			state.loginError = null;
			state.registerError = null;
		},
		loginFailure: (state, action: PayloadAction<string>) => {
			state.loginError = action.payload;
		},
		registerRequest: (
			state,
			_action: PayloadAction<{ email: string; password: string; name: string }> // eslint-disable-line @typescript-eslint/no-unused-vars
		) => {
			state.registerError = null;
		},
		registerFailure: (state, action: PayloadAction<string>) => {
			state.registerError = action.payload;
		},
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = null;
			state.loginError = null;
			state.registerError = null;
		},
		setUser: (state, action: PayloadAction<AuthUser>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
		},
	},
});

export const { loginRequest, loginSuccess, loginFailure, registerRequest, registerFailure, logout, setUser } =
	authSlice.actions;
export default authSlice.reducer;
