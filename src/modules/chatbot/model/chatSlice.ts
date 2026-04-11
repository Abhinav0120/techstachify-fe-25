import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Conversation, Message, ChatState } from '../types';

const initialState: ChatState = {
	conversations: [],
	currentConversation: null,
	messages: [],
	loading: false,
	error: null,
	typingUsers: [],
};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		// Conversation actions
		fetchConversationsRequest: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchConversationsSuccess: (state, action: PayloadAction<Conversation[]>) => {
			state.conversations = action.payload;
			state.loading = false;
		},
		fetchConversationsFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		createConversationRequest: (state) => {
			state.loading = true;
			state.error = null;
		},
		createConversationSuccess: (state, action: PayloadAction<Conversation>) => {
			state.conversations.unshift(action.payload);
			state.currentConversation = action.payload;
			state.messages = [];
			state.loading = false;
		},
		createConversationFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
			state.currentConversation = action.payload;
		},

		// Message actions
		fetchMessagesRequest: (state) => {
			state.loading = true;
			state.error = null;
		},
		fetchMessagesSuccess: (state, action: PayloadAction<Message[]>) => {
			state.messages = action.payload;
			state.loading = false;
		},
		fetchMessagesFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		sendMessageRequest: (state, action: PayloadAction<{ conversationId: string; content: string }>) => {
			void action; // Used by saga, not in reducer
			state.error = null;
		},
		sendMessageSuccess: (state, action: PayloadAction<Message>) => {
			state.messages.push(action.payload);
		},
		sendMessageFailure: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
		},

		addMessageChunk: () => {
			// Message is added when chunk completes
		},

		addStreamingMessage: (state, action: PayloadAction<Message>) => {
			// Add streaming message with unique ID (will be replaced with real ID on ready)
			state.messages.push(action.payload);
		},

		updateStreamingMessage: (state, action: PayloadAction<{ messageId: string; content: string }>) => {
			const message = state.messages.find((m) => m.id === action.payload.messageId);
			if (message) {
				message.content = action.payload.content;
			}
		},

		markMessageComplete: (state, action: PayloadAction<string>) => {
			const message = state.messages.find((m) => m.id === action.payload);
			if (message) {
				message.completionStatus = 'COMPLETE';
			}
		},

		// Typing indicators
		addTypingUser: (state, action: PayloadAction<string>) => {
			if (!state.typingUsers.includes(action.payload)) {
				state.typingUsers.push(action.payload);
			}
		},

		removeTypingUser: (state, action: PayloadAction<string>) => {
			state.typingUsers = state.typingUsers.filter((u) => u !== action.payload);
		},

		clearMessages: (state) => {
			state.messages = [];
		},

		clearError: (state) => {
			state.error = null;
		},
	},
});

export const {
	fetchConversationsRequest,
	fetchConversationsSuccess,
	fetchConversationsFailure,
	createConversationRequest,
	createConversationSuccess,
	createConversationFailure,
	setCurrentConversation,
	fetchMessagesRequest,
	fetchMessagesSuccess,
	fetchMessagesFailure,
	sendMessageRequest,
	sendMessageSuccess,
	sendMessageFailure,
	addMessageChunk,
	addStreamingMessage,
	updateStreamingMessage,
	markMessageComplete,
	addTypingUser,
	removeTypingUser,
	clearMessages,
	clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
