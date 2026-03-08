'use client';

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
	LayoutDashboard,
	User,
	Shield,
	PanelLeftClose,
	PanelLeft,
	LogOut,
	MessageSquare,
	Wallet,
	LayoutGrid,
	ShoppingCart,
	Users,
} from 'lucide-react';
import { cn } from '@/common/lib/utils';
import { Button } from '@/common/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { logout } from '@/modules/auth/model/authSlice';
import { ROUTES } from '@/common/constants/routes';

const PROJECT_NAME = 'Techstachify';

interface NavItem {
	to: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
	{ to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
	{ to: ROUTES.PROFILE, label: 'Profile', icon: User },
	{ to: ROUTES.ADMIN, label: 'Admin', icon: Shield, roles: ['ADMIN'] },
	{ to: '/dashboard/chat', label: 'Chatbot', icon: MessageSquare },
	{ to: '/dashboard/expenses', label: 'Expense Tracker', icon: Wallet },
	{ to: '/dashboard/kanban', label: 'Kanban', icon: LayoutGrid },
	{ to: '/dashboard/shop', label: 'E-commerce', icon: ShoppingCart },
	{ to: '/dashboard/social', label: 'Social', icon: Users },
];

export default function MainLayout() {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector((state) => state.auth.user);
	const userRole = user?.role ?? null;

	const handleLogout = () => {
		dispatch(logout());
		navigate(ROUTES.AUTH.LOGIN);
	};

	const visibleNavItems = NAV_ITEMS.filter(
		(item) => !item.roles?.length || (userRole && item.roles.includes(userRole))
	);

	return (
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<aside
				className={cn(
					'flex flex-col border-r bg-muted/30 transition-[width] duration-200 ease-in-out',
					sidebarCollapsed ? 'w-[4.5rem]' : 'w-64'
				)}
			>
				<nav className="flex-1 overflow-y-auto p-2 space-y-1 pt-4">
					{visibleNavItems.map((item) => {
						const Icon = item.icon;
						return (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									cn(
										'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
										isActive
											? 'bg-primary text-primary-foreground'
											: 'text-muted-foreground hover:bg-muted hover:text-foreground'
									)
								}
								title={sidebarCollapsed ? item.label : undefined}
							>
								<Icon className="size-5 shrink-0" />
								{!sidebarCollapsed && <span className="truncate">{item.label}</span>}
							</NavLink>
						);
					})}
				</nav>
				<div className="border-t p-2">
					<Button
						variant="ghost"
						size="icon"
						className="w-full"
						onClick={() => setSidebarCollapsed((c) => !c)}
						title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					>
						{sidebarCollapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
					</Button>
				</div>
			</aside>

			{/* Main content area */}
			<div className="flex-1 flex flex-col min-w-0">
				<header className="flex h-14 items-center justify-between border-b bg-background px-4">
					<span className="font-semibold text-lg truncate">{PROJECT_NAME}</span>
					<div className="ml-auto flex items-center gap-2">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="rounded-full">
									<div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
										{user?.name?.charAt(0)?.toUpperCase() ?? <User className="size-4" />}
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<div className="flex flex-col">
										<span>{user?.name ?? 'User'}</span>
										<span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={() => navigate(ROUTES.PROFILE)}>
									<User className="mr-2 size-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive" onSelect={handleLogout}>
									<LogOut className="mr-2 size-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>

				<main className="flex-1 overflow-auto p-4 md:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
