import './App.css';
import { AuthBootstrap } from '@/components/AuthBootstrap';
import AppRouter from './routes/AppRouter';

function App() {
	return (
		<>
			<AuthBootstrap />
			<AppRouter />
		</>
	);
}

export default App;
