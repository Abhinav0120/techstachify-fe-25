import { Button } from '@/common/components/ui/button';
import { useNavigate } from 'react-router-dom';

type DashbaordPage = {
	name?: string; // Optional prop
};

const Dashboard: React.FC<DashbaordPage> = () => {
	const navigate = useNavigate();

	return (
		<>
			<h1>Dashboard (Protected)</h1>

			<Button onClick={() => navigate('/auth/register')}> Register </Button>
		</>
	);
};

export default Dashboard;
