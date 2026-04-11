import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string | null): Socket | null => {
	if (!token) {
		return null;
	}

	// Prevent SSR issues
	if (typeof window === 'undefined') {
		return null;
	}

	if (socket && socket.connected) {
		return socket;
	}

	// Get WebSocket URL from env or derive from current origin
	const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.origin}/chat`;

	socket = io(wsUrl, {
		auth: {
			token,
		},
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: 10,
		secure: window.location.protocol === 'https:',
		transports: ['websocket', 'polling'],
	});

	socket.on('connect', () => {
		console.log('Socket connected');
	});

	socket.on('disconnect', () => {
		console.log('Socket disconnected');
	});

	socket.on('error', (error: unknown) => {
		console.error('Socket error:', error);
	});

	return socket;
};

export const getSocket = (): Socket | null => {
	return socket;
};

export const disconnectSocket = (): void => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};

export const emitTypingStart = (conversationId: string): void => {
	if (socket && socket.connected) {
		socket.emit('typing:start', { conversationId });
	}
};

export const emitTypingStop = (conversationId: string): void => {
	if (socket && socket.connected) {
		socket.emit('typing:stop', { conversationId });
	}
};

// Track listener wrappers for cleanup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listeners: Record<string, any> = {};

export const onMessageChunk = (callback: (chunk: string) => void): void => {
	if (socket) {
		// Remove old listener if exists
		if (listeners['ai:chunk']) {
			socket.off('ai:chunk', listeners['ai:chunk']);
		}
		// Register new listener and track it
		const handler = (data: { chunk: string }) => callback(data.chunk);
		listeners['ai:chunk'] = handler;
		socket.on('ai:chunk', handler);
	}
};

export const onMessageReady = (callback: (messageId: string) => void): void => {
	if (socket) {
		if (listeners['ai:ready']) {
			socket.off('ai:ready', listeners['ai:ready']);
		}
		const handler = (data: { messageId: string }) => callback(data.messageId);
		listeners['ai:ready'] = handler;
		socket.on('ai:ready', handler);
	}
};

export const onMessageError = (callback: (error: { code: string; message: string }) => void): void => {
	if (socket) {
		if (listeners['ai:error']) {
			socket.off('ai:error', listeners['ai:error']);
		}
		const handler = (error: { code: string; message: string }) => callback(error);
		listeners['ai:error'] = handler;
		socket.on('ai:error', handler);
	}
};

export const onTypingStart = (callback: (data: { userId: number; conversationId: string }) => void): void => {
	if (socket) {
		if (listeners['typing:start']) {
			socket.off('typing:start', listeners['typing:start']);
		}
		listeners['typing:start'] = callback;
		socket.on('typing:start', callback);
	}
};

export const onTypingStop = (callback: (data: { userId: number; conversationId: string }) => void): void => {
	if (socket) {
		if (listeners['typing:stop']) {
			socket.off('typing:stop', listeners['typing:stop']);
		}
		listeners['typing:stop'] = callback;
		socket.on('typing:stop', callback);
	}
};
