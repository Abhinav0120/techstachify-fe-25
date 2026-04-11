import { takeLatest, put, call } from 'redux-saga/effects';
import { apiPost, apiGet } from '@/common/lib/apiHelpers';
import { API_PATHS } from '@/common/constants/routes';
import type { Conversation, Message } from '../types';
import {
	fetchConversationsRequest,
	fetchConversationsSuccess,
	fetchConversationsFailure,
	createConversationRequest,
	createConversationSuccess,
	createConversationFailure,
	sendMessageRequest,
	sendMessageSuccess,
	sendMessageFailure,
	addStreamingMessage,
} from './chatSlice';

interface ConversationResponse {
	id: string;
	userId: number;
	createdAt: string;
	updatedAt: string;
	latestMessage?: {
		id: string;
		content: string;
		createdAt: string;
	} | null;
}

interface ConversationsResponse {
	data: ConversationResponse[];
	total: number;
	page: number;
	totalPages: number;
}

interface SendMessageResponse {
	messageId: string;
	conversationId: string;
	userMessage: Message;
}

function* handleFetchConversations() {
	try {
		const data: ConversationsResponse = yield call(
			apiGet<ConversationsResponse>,
			`${API_PATHS.CHAT.BASE}/conversations`
		);
		yield put(fetchConversationsSuccess(data.data));
	} catch (err: unknown) {
		const message = getErrorMessage(err, 'Failed to fetch conversations');
		yield put(fetchConversationsFailure(message));
	}
}

function* handleCreateConversation() {
	try {
		const data: Conversation = yield call(apiPost<Conversation>, `${API_PATHS.CHAT.BASE}/conversations`);
		yield put(createConversationSuccess(data));
	} catch (err: unknown) {
		const message = getErrorMessage(err, 'Failed to create conversation');
		yield put(createConversationFailure(message));
	}
}

function* handleSendMessage(action: { payload: { conversationId: string; content: string } }) {
	const { conversationId, content } = action.payload;

	// Validate conversationId is not empty
	if (!conversationId || conversationId.trim().length === 0) {
		yield put(sendMessageFailure('Invalid conversation ID'));
		return;
	}

	try {
		const data: SendMessageResponse = yield call(
			apiPost<SendMessageResponse>,
			`${API_PATHS.CHAT.BASE}/conversations/${conversationId}/send`,
			{ conversationId, content }
		);

		// Add user message to Redux
		yield put(sendMessageSuccess(data.userMessage));

		// Create placeholder for streaming AI message
		const streamingMessage: Message = {
			id: `streaming-${Date.now()}`,
			conversationId,
			role: 'ASSISTANT',
			content: '',
			createdAt: new Date().toISOString(),
			completionStatus: 'COMPLETE',
		};

		yield put(addStreamingMessage(streamingMessage));

		// Socket.io streaming will update this message in real-time
	} catch (err: unknown) {
		const message = getErrorMessage(err, 'Failed to send message');
		yield put(sendMessageFailure(message));
	}
}

function getErrorMessage(err: unknown, fallback: string): string {
	return err &&
		typeof err === 'object' &&
		'response' in err &&
		typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
		? (err as { response: { data: { message: string } } }).response.data.message
		: fallback;
}

export function* chatSaga() {
	yield takeLatest(fetchConversationsRequest, handleFetchConversations);
	yield takeLatest(createConversationRequest, handleCreateConversation);
	yield takeLatest(sendMessageRequest, handleSendMessage);
}
