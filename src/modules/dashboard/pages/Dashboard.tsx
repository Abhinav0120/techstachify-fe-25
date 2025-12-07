import { Button } from '@/common/components/ui/button';
import { logout } from '@/modules/auth/model/authSlice';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type DashbaordPage = {
	name?: string; // Optional prop
};

// Utility functions
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
	let timer: ReturnType<typeof setTimeout>;
	return function (...args: Parameters<T>) {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}

function throttle<T extends (...args: any[]) => void>(fn: T, limit: number) {
	let lastCall = 0;
	return function (...args: Parameters<T>) {
		const now = new Date().getTime();
		console.log('throttle called')
		if (now - lastCall >= limit) {
			lastCall = now;
			fn(...args);
		}
	};
}


const Dashboard: React.FC<DashbaordPage> = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Debounced navigation
	const debouncedNavigate = useCallback(
		debounce(() => { dispatch(logout());
			 navigate('/auth/register')}, 1000),
		[]
	);

	// Throttled navigation
	const throttledNavigate = useCallback(
		throttle(() => {
			setTimeout(()=>{
				console.log('navigated')
				dispatch(logout());
				navigate('/auth/register')
			}, 2000)
		}, 200),
		[]
	)

	return (
		<>
			<h1>Dashboard (Protected)</h1>

			<Button onClick={() => navigate('/auth/register')}> Register </Button>

			{/* Use debounce */}
			<Button onClick={debouncedNavigate}> Debounced Register </Button>

			{/* Use throttle */}
			<Button onClick={throttledNavigate}> Throttled Register </Button>
		</>
	);
};

export default Dashboard;
