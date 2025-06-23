import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  role: 'data' | 'user' | 'system' | 'assistant';
  isStreaming?: boolean;
}

export function ChatMessage({ content, role, isStreaming = false }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex w-full mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
          isUser
            ? 'bg-rose-100 text-rose-900 rounded-br-md'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md',
          isStreaming && 'animate-pulse'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />}
        </p>
      </div>
    </div>
  );
}
