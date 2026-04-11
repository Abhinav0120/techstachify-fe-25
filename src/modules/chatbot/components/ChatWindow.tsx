import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/common/hooks/reduxHooks';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import {
	clearError,
	updateStreamingMessage,
	markMessageComplete,
	addTypingUser,
	removeTypingUser,
} from '../model/chatSlice';
import {
	onMessageChunk,
	onMessageReady,
	onMessageError,
	onTypingStart,
	onTypingStop,
	getSocket,
} from '@/common/lib/socket';
import { AlertCircle, X } from 'lucide-react';

const ChatWindow = () => {
	const dispatch = useAppDispatch();
	const currentConversation = useAppSelector((state) => state.chat?.currentConversation);
	const error = useAppSelector((state) => state.chat?.error);
	const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const messageStreamRef = useRef<{ [key: string]: string }>({});

	useEffect(() => {
		const socket = getSocket();

		// Join conversation room
		if (currentConversation && socket) {
			socket.emit('room:join', { conversationId: currentConversation.id });
		}

		// Set up Socket.io listeners
		let chunkListener: ((chunk: string) => void) | null = null;
		let readyListener: ((messageId: string) => void) | null = null;
		let errorListener: ((error: { code: string; message: string }) => void) | null = null;
		let typingStartListener: ((data: { userId: number; conversationId: string }) => void) | null = null;
		let typingStopListener: ((data: { userId: number; conversationId: string }) => void) | null = null;

		if (currentConversation) {
			chunkListener = (chunk: string) => {
				// Build up streaming message with UUID-based key
				const key = messageStreamRef.current.streamingId || `streaming-${crypto.randomUUID()}`;
				messageStreamRef.current.streamingId = key;

				if (!messageStreamRef.current[key]) {
					messageStreamRef.current[key] = '';
				}
				messageStreamRef.current[key] += chunk;
				// Update streaming message in Redux
				dispatch(updateStreamingMessage({ messageId: key, content: messageStreamRef.current[key] }));
			};

			readyListener = (messageId: string) => {
				dispatch(markMessageComplete(messageId));
			};

			errorListener = () => {
				// Error is handled by the backend, no need to update Redux here
			};

			typingStartListener = (data: { userId: number; conversationId: string }) => {
				if (data.conversationId === currentConversation.id) {
					dispatch(addTypingUser(`${data.userId}`));
				}
			};

			typingStopListener = (data: { userId: number; conversationId: string }) => {
				if (data.conversationId === currentConversation.id) {
					dispatch(removeTypingUser(`${data.userId}`));
				}
			};

			onMessageChunk(chunkListener);
			onMessageReady(readyListener);
			onMessageError(errorListener);
			onTypingStart(typingStartListener);
			onTypingStop(typingStopListener);
		}

		return () => {
			// Leave conversation room
			if (currentConversation && socket) {
				socket.emit('room:leave', { conversationId: currentConversation.id });
			}
			// Cleanup listeners when component unmounts or conversation changes
			messageStreamRef.current = {};
		};
	}, [currentConversation, dispatch]);

	useEffect(() => {
		if (error) {
			errorTimeoutRef.current = setTimeout(() => {
				dispatch(clearError());
			}, 5000);
		}

		return () => {
			if (errorTimeoutRef.current) {
				clearTimeout(errorTimeoutRef.current);
			}
		};
	}, [error, dispatch]);

	if (!currentConversation) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<div className="text-muted-foreground">Select a conversation</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full w-full min-h-0">
			{/* Header */}
			<div className="border-b border-border p-4 flex-shrink-0">
				<h2 className="text-lg font-semibold">Chat</h2>
				<p className="text-xs text-muted-foreground">
					Started {new Date(currentConversation.createdAt).toLocaleDateString()}
				</p>
			</div>

			{/* Error Toast */}
			{error && (
				<div className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2 flex-shrink-0">
					<AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
					<div className="flex-1 min-w-0">
						<p className="text-sm text-destructive">{error}</p>
					</div>
					<button
						onClick={() => dispatch(clearError())}
						className="text-destructive hover:opacity-70 flex-shrink-0"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			)}

			{/* Messages */}
			<MessageList />

			{/* Input */}
			<ChatInput />
		</div>
	);
};

export default ChatWindow;
