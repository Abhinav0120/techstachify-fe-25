import { Button } from '@/common/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../model/authSlice';
import { ModeToggle } from '@/common/components/mode-toggle';
// import { LoginForm } from '@/common/components/login-form';
import { Label } from "@/common/components/ui/label"
import { Input } from '@/common/components/ui/input';
import { LoginForm } from '../components/LoginForm';

type LoginPage = {
	name?: string; // Optional prop
};

const LoginPage: React.FC<LoginPage> = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const state = useAppSelector((state) => state);
	console.log('✅ Redux State:', state.auth);
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>

		// <div>
		// 	<h1>Login</h1>
		// 	<Button onClick={handleLogin}>Mock Login</Button>
		// 	<Button onClick={() => navigate('/auth/register')}> Register </Button>

		// 	<ModeToggle />

		// 	<div>
		// 		<div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
		// 			<img className="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
		// 			<div>
		// 				<div className="text-xl font-medium text-black dark:text-white">ChitChat</div>
		// 				<p className="text-gray-500 dark:text-gray-400">You have a new message!</p>
		// 			</div>
		// 		</div>
		// 	</div>

		// 	<div className="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4 ...">
		// 		<img
		// 			className="mx-auto block h-24 rounded-full sm:mx-0 sm:shrink-0"
		// 			src="/img/erin-lindford.jpg"
		// 			alt=""
		// 		/>
		// 		<div className="space-y-2 text-center sm:text-left">
		// 			<div className="space-y-0.5">
		// 				<p className="text-lg font-semibold text-black">Erin Lindford</p>
		// 				<p className="font-medium text-gray-500">Product Engineer</p>
		// 			</div>
		// 			<button className="border-purple-200 text-purple-600 hover:border-transparent hover:bg-purple-600 hover:text-white active:bg-purple-700 ...">
		// 				Message
		// 			</button>
		// 		</div>
		// 	</div>

		// 	<div className="grid w-full max-w-sm items-center gap-3">
		// 	<Label htmlFor="email">Email</Label>
		// 	<Input type="email" id="email" placeholder="Email" />
		// 	</div>

		// </div>
	);
};

export default LoginPage;
