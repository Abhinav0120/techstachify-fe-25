import { Button } from '@/common/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

type RegisterPage = {
	name?: string; // Optional prop
};

const RegisterPage: React.FC<RegisterPage> = () => {
	const navigate = useNavigate();
	return (
		<div>
			<h1> Register Page</h1>
			<Button onClick={() => navigate('/auth/Login')}> Login </Button>
		</div>
	);
};

export default RegisterPage;
