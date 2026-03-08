import { Button } from '@/common/components/ui/button';
import { logout } from '@/modules/auth/model/authSlice';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/constants/routes';

type DashbaordPage = {
	name?: string; // Optional prop
};

// Utility functions
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
	let timer: ReturnType<typeof setTimeout>;
	return function (this: unknown, ...args: Parameters<T>) {
		clearTimeout(timer);
		timer = setTimeout(() => fn.apply(this, args), delay);
	};
}

function throttle<T extends (...args: unknown[]) => void>(fn: T, limit: number) {
	let lastCall = 0;
	return function (this: unknown, ...args: Parameters<T>) {
		const now = Date.now();
		if (now - lastCall >= limit) {
			lastCall = now;
			fn.apply(this, args);
		}
	};
}

const Dashboard: React.FC<DashbaordPage> = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const debouncedNavigate = useMemo(
		() =>
			debounce(() => {
				dispatch(logout());
				navigate(ROUTES.AUTH.REGISTER);
			}, 1000),
		[dispatch, navigate]
	);

	const throttledNavigate = useMemo(
		() =>
			throttle(() => {
				setTimeout(() => {
					dispatch(logout());
					navigate(ROUTES.AUTH.REGISTER);
				}, 2000);
			}, 200),
		[dispatch, navigate]
	);

	return (
		<>
			<h1>Dashboard (Protected)</h1>

			<Button onClick={() => navigate(ROUTES.AUTH.REGISTER)}> Register </Button>

			{/* Use debounce */}
			<Button onClick={debouncedNavigate}> Debounced Register </Button>

			{/* Use throttle */}
			<Button onClick={throttledNavigate}> Throttled Register </Button>
		</>
	);
};

export default Dashboard;
