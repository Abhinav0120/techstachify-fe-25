'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/common/components/ui/alert';
import { cn } from '@/common/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { loginRequest } from '../model/authSlice';
import { ROUTES } from '@/common/constants/routes';
import { AlertCircle } from 'lucide-react';

const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const loginError = useAppSelector((state) => state.auth.loginError);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate(ROUTES.DASHBOARD);
		}
	}, [isAuthenticated, navigate]);

	const onSubmit = (data: LoginFormValues) => {
		dispatch(loginRequest({ email: data.email, password: data.password }));
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>Enter your email below to login</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{loginError && (
								<Alert variant="destructive" role="alert">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Login failed</AlertTitle>
									<AlertDescription>{loginError}</AlertDescription>
								</Alert>
							)}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="m@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? 'Logging in...' : 'Login'}
								</Button>
								<Button type="button" variant="outline" className="w-full">
									Login with Google
								</Button>
							</div>
							<div className="mt-4 text-center text-sm">
								Don't have an account?{' '}
								<Button
									type="button"
									variant="link"
									className="pl-0 cursor-pointer"
									onClick={() => navigate(ROUTES.AUTH.REGISTER)}
								>
									Sign up
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
