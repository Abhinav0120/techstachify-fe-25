import { Button } from '@/common/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';

type RegisterPage = {
	name?: string; // Optional prop
};

const RegisterPage: React.FC<RegisterPage> = () => {
	const navigate = useNavigate();
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<RegisterForm />
			</div>
		</div>
	);
};

export default RegisterPage;
