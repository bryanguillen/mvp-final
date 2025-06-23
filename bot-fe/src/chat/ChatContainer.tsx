import { useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: `${import.meta.env.VITE_API_URL}/chat`,
    experimental_prepareRequestBody: ({ messages: chatMessages }) => ({
      clientId: 'test',
      message: chatMessages[chatMessages.length - 1].content ?? '',
    }),
    onError: (err) => console.error('Chat error:', err),
    streamProtocol: 'text',
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const isStreaming = status === 'streaming';

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800 text-center">Radiant Assistant</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h2 className="text-lg font-medium text-gray-800 mb-2">
                    Welcome to Radiant Assistant
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Start a conversation by typing a message below.
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} content={message.content} role={message.role} />
            ))}

            {isStreaming && <ChatMessage content="Typing..." role="assistant" isStreaming={true} />}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <ChatInput
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        input={input}
        isDisabled={isStreaming}
      />
    </div>
  );
}
