'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/components/ui/card';
import { cn } from '@/common/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../model/authSlice';

// 1. Zod schema
const loginSchema = z.object({
	email: z.email({ message: 'Invalid email address' }),
	password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin = (data: LoginFormValues) => {
        console.log('data', data);
		dispatch(loginSuccess('DemoUser'));
		navigate('/dashboard');
	};

	// 2. RHF setup
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmit = (data: LoginFormValues) => {
		console.log('Submitted:', data);
		// integrate your auth API here
        handleLogin(data);
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>Enter your email below to login</CardDescription>
				</CardHeader>
				<CardContent>
					{/* 3. Wrap FormProvider */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Email field */}
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
							{/* Password field */}
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
							{/* Submit and Google buttons */}
							<div className="flex flex-col gap-3">
								<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting ? 'Logging in...' : 'Login'}
								</Button>
								<Button type="button" variant="outline" className="w-full">
									Login with Google
								</Button>
							</div>
							{/* Signup link */}
							<div className="mt-4 text-center text-sm">
								Don't have an account?{' '}
								<Button
									type="button"
									variant="link"
									className="pl-0 cursor-pointer"
									onClick={() => navigate('/auth/register')}
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
