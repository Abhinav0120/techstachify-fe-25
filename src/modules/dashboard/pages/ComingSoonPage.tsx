'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/components/ui/card';

interface ComingSoonPageProps {
	title?: string;
	description?: string;
}

export function ComingSoonPage({
	title = 'Coming soon',
	description = 'This module is not built yet.',
}: ComingSoonPageProps) {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
				<p className="text-muted-foreground">{description}</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Under construction</CardTitle>
					<CardDescription>Check back later for this feature.</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Use the Dashboard to see all planned modules and their status.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

export default ComingSoonPage;
