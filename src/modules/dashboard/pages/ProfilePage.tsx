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
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { updateProfileRequest } from '@/modules/auth/model/authSlice';
import { AlertCircle } from 'lucide-react';

const profileSchema = z
	.object({
		name: z.string().min(1, { message: 'Name is required' }),
		email: z.string().email({ message: 'Invalid email address' }),
		currentPassword: z.string(),
		newPassword: z.string().optional(),
		confirmNewPassword: z.string(),
	})
	.refine((data) => !data.newPassword?.trim() || (data.currentPassword?.trim()?.length ?? 0) > 0, {
		path: ['currentPassword'],
		message: 'Current password is required to set a new password',
	})
	.refine((data) => !data.newPassword?.trim() || (data.newPassword?.length ?? 0) >= 8, {
		path: ['newPassword'],
		message: 'New password must be at least 8 characters',
	})
	.refine((data) => !data.newPassword?.trim() || data.newPassword === data.confirmNewPassword, {
		path: ['confirmNewPassword'],
		message: 'Passwords do not match',
	});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage({ className, ...props }: React.ComponentProps<'div'>) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.auth.user);
	const profileError = useAppSelector((state) => state.auth.profileError);
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user?.name ?? '',
			email: user?.email ?? '',
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		},
	});

	useEffect(() => {
		if (user) {
			form.reset({
				name: user.name,
				email: user.email,
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: '',
			});
		}
	}, [user, form]);

	const onSubmit = (data: ProfileFormValues) => {
		dispatch(
			updateProfileRequest({
				name: data.name,
				email: data.email,
				...(data.newPassword?.trim()
					? { currentPassword: data.currentPassword, newPassword: data.newPassword }
					: {}),
			})
		);
	};

	return (
		<div className={cn('flex flex-col gap-6 max-w-xl', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
					<CardDescription>Update your account details</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{profileError && (
								<Alert variant="destructive" role="alert">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Update failed</AlertTitle>
									<AlertDescription>{profileError}</AlertDescription>
								</Alert>
							)}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Your name" {...field} />
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
											<Input type="email" placeholder="m@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="space-y-4 border-t pt-4">
								<p className="text-sm font-medium text-muted-foreground">Change password (optional)</p>
								<FormField
									control={form.control}
									name="currentPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Current password</FormLabel>
											<FormControl>
												<Input type="password" placeholder="••••••••" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="newPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New password</FormLabel>
											<FormControl>
												<Input type="password" placeholder="••••••••" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="confirmNewPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirm new password</FormLabel>
											<FormControl>
												<Input type="password" placeholder="••••••••" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

export default ProfilePage;
