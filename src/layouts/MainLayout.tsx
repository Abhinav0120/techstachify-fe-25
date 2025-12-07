// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Header */}
			<header className="p-4 font-bold text-lg">My App</header>

			{/* Main Content */}
			<main className="flex-1 p-4">
				<Outlet />
			</main>

			{/* Footer (optional) */}
			<footer className="p-4 text-center text-sm text-gray-500 border-t">© 2025</footer>
		</div>
	);
}
