'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/components/ui/card';
import { cn } from '@/common/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { registerRequest } from '../model/authSlice';
import { ROUTES } from '@/common/constants/routes';

const registerSchema = z
	.object({
		fullName: z.string().min(2, { message: 'Full name is required' }),
		email: z.email({ message: 'Invalid email address' }),
		password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Passwords do not match',
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const registerError = useAppSelector((state) => state.auth.registerError);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			fullName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		if (isAuthenticated) {
			navigate(ROUTES.DASHBOARD);
		}
	}, [isAuthenticated, navigate]);

	const onSubmit = (data: RegisterFormValues) => {
		dispatch(
			registerRequest({
				email: data.email,
				password: data.password,
				name: data.fullName,
			})
		);
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>Fill in the details to register</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{registerError && (
								<p className="text-sm text-destructive" role="alert">
									{registerError}
								</p>
							)}
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="John Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="you@example.com" {...field} />
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
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? 'Creating Account...' : 'Register'}
							</Button>
							<div className="mt-4 text-center text-sm">
								Already have an account?{' '}
								<Button
									type="button"
									variant="link"
									className="pl-0 cursor-pointer"
									onClick={() => navigate(ROUTES.AUTH.LOGIN)}
								>
									Login
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
