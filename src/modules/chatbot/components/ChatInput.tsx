'use client';

import { useCallback, useRef, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/common/hooks/reduxHooks';
import { sendMessageRequest } from '../model/chatSlice';
import { emitTypingStart, emitTypingStop } from '@/common/lib/socket';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/common/components/ui/form';
import { Button } from '@/common/components/ui/button';
import { Textarea } from '@/common/components/ui/textarea';
import { Send } from 'lucide-react';

const messageSchema = z.object({
	message: z.string().min(1, { message: 'Message cannot be empty' }).max(4000, { message: 'Message is too long' }),
});

type MessageFormValues = z.infer<typeof messageSchema>;

const ChatInput = () => {
	const dispatch = useAppDispatch();
	const currentConversation = useAppSelector((state) => state.chat?.currentConversation);
	const loading = useAppSelector((state) => state.chat?.loading ?? false);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const form = useForm<MessageFormValues>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			message: '',
		},
	});

	// Handle typing indicators
	useEffect(() => {
		const subscription = form.watch(() => {
			if (currentConversation) {
				// Emit typing start
				emitTypingStart(currentConversation.id);

				// Clear previous timeout
				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current);
				}

				// Emit typing stop after 2 seconds of inactivity
				typingTimeoutRef.current = setTimeout(() => {
					emitTypingStop(currentConversation.id);
				}, 2000);
			}
		});

		return () => {
			subscription.unsubscribe();
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, [form, currentConversation]);

	const onSubmit = useCallback(
		(data: MessageFormValues) => {
			if (!currentConversation) return;

			// Emit typing stop on submit
			emitTypingStop(currentConversation.id);

			dispatch(
				sendMessageRequest({
					conversationId: currentConversation.id,
					content: data.message,
				})
			);

			form.reset();
		},
		[dispatch, currentConversation, form]
	);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			form.handleSubmit(onSubmit)();
		}
	};

	const isTextareaDisabled = !currentConversation;
	const isButtonDisabled = !currentConversation || loading || !form.formState.isValid;

	return (
		<div className="border-t border-border p-4 bg-card flex-shrink-0">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem className="m-0">
								<FormControl>
									<div className="flex gap-2 items-end">
										<Textarea
											{...field}
											placeholder="Type your message... (Ctrl+Enter to send)"
											className="resize-none h-12 max-h-32 flex-1"
											disabled={isTextareaDisabled}
											onKeyDown={handleKeyDown}
										/>
										<Button
											type="submit"
											disabled={isButtonDisabled}
											size="icon"
											className="flex-shrink-0 h-12 w-12 rounded-full"
										>
											<Send className="h-5 w-5" />
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	);
};

export default ChatInput;
