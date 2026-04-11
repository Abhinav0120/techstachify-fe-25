export interface Message {
	id: string;
	conversationId: string;
	role: 'USER' | 'ASSISTANT';
	content: string;
	createdAt: string;
	completionStatus: 'COMPLETE' | 'TRUNCATED';
}

export interface Conversation {
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

export interface ChatState {
	conversations: Conversation[];
	currentConversation: Conversation | null;
	messages: Message[];
	loading: boolean;
	error: string | null;
	typingUsers: string[];
}

export interface TypingIndicator {
	userId: number;
	conversationId: string;
}

export interface MessageChunk {
	chunk: string;
}

export interface MessageReady {
	messageId: string;
}

export interface ChatError {
	code: string;
	message: string;
}
