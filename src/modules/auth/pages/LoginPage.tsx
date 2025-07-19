import { Button } from '@/common/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../model/authSlice';

type LoginPage = {
	name?: string; // Optional prop
};

const LoginPage: React.FC<LoginPage> = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleLogin = () => {
		dispatch(loginSuccess('DemoUser'));
		navigate('/dashboard');
	};
	const state = useAppSelector((state) => state);
	console.log('✅ Redux State:', state.auth);
	return (
		<div>
			<h1>Login</h1>
			<Button onClick={handleLogin}>Mock Login</Button>
			<Button onClick={() => navigate('/auth/register')}> Register </Button>
		</div>
	);
};

export default LoginPage;
