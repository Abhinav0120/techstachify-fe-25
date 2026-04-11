import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { fetchConversationsRequest, createConversationRequest, setCurrentConversation } from '../model/chatSlice';
import { Plus } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Skeleton } from '@/common/components/ui/skeleton';
import { ScrollArea } from '@/common/components/ui/scroll-area';
import { cn } from '@/common/lib/utils';
import ChatWindow from '../components/ChatWindow';
import type { Conversation } from '../types';

const ChatPage = () => {
	const dispatch = useAppDispatch();
	const conversations = useAppSelector((state) => state.chat?.conversations ?? []);
	const currentConversation = useAppSelector((state) => state.chat?.currentConversation);
	const loading = useAppSelector((state) => state.chat?.loading ?? false);

	useEffect(() => {
		dispatch(fetchConversationsRequest());
	}, [dispatch]);

	const handleNewConversation = () => {
		dispatch(createConversationRequest());
	};

	const handleSelectConversation = (conversation: Conversation | null) => {
		dispatch(setCurrentConversation(conversation));
	};

	return (
		<div className="flex h-full w-full gap-0 bg-background overflow-hidden">
			{/* Sidebar */}
			<div className="w-64 border-r border-border bg-card flex flex-col min-h-0">
				{/* Header */}
				<div className="p-4 border-b border-border flex-shrink-0">
					<Button onClick={handleNewConversation} className="w-full gap-2" variant="outline">
						<Plus className="h-4 w-4" />
						New Chat
					</Button>
				</div>

				{/* Conversations List */}
				<ScrollArea className="flex-1 min-h-0">
					<div className="p-2">
						{loading && conversations.length === 0 ? (
							<div className="space-y-3 p-2">
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</div>
						) : conversations.length === 0 ? (
							<div className="p-4 text-center text-muted-foreground text-sm">
								No conversations yet. Start a new chat!
							</div>
						) : (
							<div className="space-y-2">
								{conversations.map((conversation) => (
									<button
										key={conversation.id}
										onClick={() => handleSelectConversation(conversation)}
										className={cn(
											'w-full text-left p-3 rounded-lg text-sm transition-colors duration-200',
											currentConversation?.id === conversation.id
												? 'bg-primary text-primary-foreground'
												: 'hover:bg-accent text-foreground'
										)}
									>
										<div className="truncate font-medium">
											{conversation.latestMessage?.content || 'New conversation'}
										</div>
										<div className="text-xs opacity-70 mt-1">
											{new Date(conversation.createdAt).toLocaleDateString()}
										</div>
									</button>
								))}
							</div>
						)}
					</div>
				</ScrollArea>
			</div>

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col bg-background min-h-0">
				{currentConversation ? (
					<ChatWindow />
				) : (
					<div className="flex-1 flex items-center justify-center text-muted-foreground">
						<div className="text-center">
							<h2 className="text-xl font-semibold mb-2">Welcome to Chat</h2>
							<p>Select a conversation or start a new one to begin</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatPage;
