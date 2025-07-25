import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
				<Outlet />
			</div>
		</div>
	);
}
