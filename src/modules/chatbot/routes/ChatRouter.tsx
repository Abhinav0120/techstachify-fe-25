import { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import store from '@/app/store';
import chatReducer from '../model/chatSlice';
import { ExtendedStore } from '@/app/type';

const reducerKey = 'chat';
const ChatPage = lazy(() => import('@/modules/chatbot/pages/ChatPage'));

const ChatRouter = () => {
	useEffect(() => {
		const reducerManager = (store as ExtendedStore).reducerManager;
		if (!reducerManager.reducers?.[reducerKey]) {
			reducerManager.add(reducerKey, chatReducer);
		}
	}, []);

	return (
		<Routes>
			<Route path="" element={<ChatPage />} />
		</Routes>
	);
};

export default ChatRouter;
