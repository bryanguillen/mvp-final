import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isStreaming: boolean;
  role: 'data' | 'user' | 'system' | 'assistant';
}

export function ChatMessage({ content, isStreaming, role }: ChatMessageProps) {
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
        <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-0 prose-pre:bg-gray-100 prose-pre:p-2 prose-pre:rounded-md">
          <ReactMarkdown>{content}</ReactMarkdown>
          {isStreaming && <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />}
        </div>
      </div>
    </div>
  );
}
