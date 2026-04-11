import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/common/hooks/reduxHooks';
import { cn } from '@/common/lib/utils';
import { ScrollArea } from '@/common/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/common/components/ui/avatar';
import type { Message } from '../types';

const MessageList = () => {
	const messages = useAppSelector((state) => state.chat?.messages ?? []);
	const typingUsers = useAppSelector((state) => state.chat?.typingUsers ?? []);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Auto-scroll to bottom when new messages arrive
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<ScrollArea className="flex-1 min-h-0">
			<div className="p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-muted-foreground">
						<p>Start a conversation. Send a message to begin.</p>
					</div>
				) : (
					<>
						{messages.map((message: Message) => (
							<div
								key={message.id}
								className={cn('flex gap-2 items-end', {
									'justify-end': message.role === 'USER',
									'justify-start': message.role === 'ASSISTANT',
								})}
							>
								{message.role === 'ASSISTANT' && (
									<Avatar className="h-8 w-8 flex-shrink-0">
										<AvatarFallback className="text-xs">AI</AvatarFallback>
									</Avatar>
								)}
								<div
									className={cn('max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg break-words', {
										'bg-primary text-primary-foreground': message.role === 'USER',
										'bg-muted text-foreground': message.role === 'ASSISTANT',
									})}
								>
									<p className="text-sm whitespace-pre-wrap">{message.content}</p>
									{message.completionStatus === 'TRUNCATED' && (
										<p className="text-xs opacity-70 mt-1">(Incomplete response)</p>
									)}
									<p className="text-xs opacity-60 mt-1">
										{new Date(message.createdAt).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
								{message.role === 'USER' && (
									<Avatar className="h-8 w-8 flex-shrink-0">
										<AvatarFallback className="text-xs">U</AvatarFallback>
									</Avatar>
								)}
							</div>
						))}

						{/* Typing Indicators */}
						{typingUsers.length > 0 && (
							<div className="flex gap-2 items-center justify-start">
								<Avatar className="h-8 w-8 flex-shrink-0">
									<AvatarFallback className="text-xs">AI</AvatarFallback>
								</Avatar>
								<div className="bg-muted px-4 py-2 rounded-lg">
									<div className="flex gap-1">
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
										<div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</>
				)}
			</div>
		</ScrollArea>
	);
};

export default MessageList;
