'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/components/ui/card';

export function AdminPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Admin</h1>
				<p className="text-muted-foreground">Admin-only area. More features coming soon.</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Admin access granted</CardTitle>
					<CardDescription>You have access to this page because your role is ADMIN.</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Use this area for admin-only features (e.g. user management, product management for e-commerce,
						etc.).
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

export default AdminPage;
