import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: any
  ) => void;
  isDisabled?: boolean;
  input: string;
}

export function ChatInput({
  handleInputChange,
  handleSubmit,
  input,
  isDisabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea with max height of 3 lines
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24; // Approximate line height
      const maxHeight = lineHeight * 3; // 3 lines max
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isDisabled}
          className="min-h-[44px] max-h-[72px] resize-none leading-6 bg-gray-50/50 border-gray-200 focus:border-rose-300 focus:ring-rose-200"
          rows={1}
        />
        <Button
          type="submit"
          disabled={!input.trim() || isDisabled}
          size="icon"
          className="shrink-0 bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-[44px] w-[44px]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
