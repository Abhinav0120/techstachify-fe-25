import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store.ts';
import { setStore } from './common/lib/api';
import { ThemeProvider } from './common/components/theme-provider.tsx';

setStore(store);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<App />
				</ThemeProvider>
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
