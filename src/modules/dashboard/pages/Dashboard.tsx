'use client';

import { useNavigate } from 'react-router-dom';
import {
	LayoutDashboard,
	User,
	Shield,
	MessageSquare,
	Wallet,
	LayoutGrid,
	ShoppingCart,
	Users,
	ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/common/components/ui/card';
import { ROUTES } from '@/common/constants/routes';
import { useAppSelector } from '@/common/hooks/reduxHooks';
import { cn } from '@/common/lib/utils';

interface ModuleCard {
	to: string;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	available?: boolean;
	roles?: string[];
}

const MODULES: ModuleCard[] = [
	{
		to: ROUTES.DASHBOARD,
		title: 'Dashboard',
		description: 'Your home base. View overview and quick links.',
		icon: LayoutDashboard,
		available: true,
	},
	{
		to: ROUTES.PROFILE,
		title: 'Profile',
		description: 'Manage your account and password.',
		icon: User,
		available: true,
	},
	{
		to: ROUTES.ADMIN,
		title: 'Admin',
		description: 'Admin-only area for user and system management.',
		icon: Shield,
		available: true,
		roles: ['ADMIN'],
	},
	{
		to: '/dashboard/chat',
		title: 'Chatbot',
		description: 'AI-powered chat with OpenAI. Real-time messaging.',
		icon: MessageSquare,
		available: false,
	},
	{
		to: '/dashboard/expenses',
		title: 'Expense Tracker',
		description: 'Track spending with charts and analytics.',
		icon: Wallet,
		available: true,
	},
	{
		to: '/dashboard/kanban',
		title: 'Kanban Board',
		description: 'Project management with drag-and-drop tasks.',
		icon: LayoutGrid,
		available: false,
	},
	{
		to: '/dashboard/shop',
		title: 'E-commerce',
		description: 'Product catalog, recommendations, and Stripe payments.',
		icon: ShoppingCart,
		available: false,
	},
	{
		to: '/dashboard/social',
		title: 'Social Dashboard',
		description: 'Posts, comments, likes, and live notifications.',
		icon: Users,
		available: false,
	},
];

export default function Dashboard() {
	const navigate = useNavigate();
	const userRole = useAppSelector((state) => state.auth.user?.role) ?? null;

	const visibleModules = MODULES.filter((m) => !m.roles?.length || (userRole && m.roles.includes(userRole)));

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Welcome back. Choose a module below to get started.</p>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{visibleModules.map((module) => {
					const Icon = module.icon;
					const disabled = module.available === false;
					return (
						<Card
							key={module.to}
							className={cn(
								'transition-colors',
								disabled ? 'opacity-60' : 'hover:border-primary/50 cursor-pointer'
							)}
							onClick={() => !disabled && navigate(module.to)}
						>
							<CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
								<div className="space-y-1.5">
									<CardTitle className="text-base flex items-center gap-2">
										<Icon className="size-4 text-muted-foreground" />
										{module.title}
									</CardTitle>
									<CardDescription className="text-sm">{module.description}</CardDescription>
								</div>
								{!disabled && <ArrowRight className="size-4 shrink-0 text-muted-foreground" />}
							</CardHeader>
							{disabled && (
								<CardContent>
									<p className="text-xs text-muted-foreground">Coming soon</p>
								</CardContent>
							)}
						</Card>
					);
				})}
			</div>
		</div>
	);
}
