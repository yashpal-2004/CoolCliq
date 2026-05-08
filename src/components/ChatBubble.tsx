interface ChatBubbleProps {
  message: string;
  type: 'sent' | 'received';
  timestamp?: string;
}

export default function ChatBubble({ message, type, timestamp }: ChatBubbleProps) {
  const isSent = type === 'sent';

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isSent
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-secondary text-secondary-foreground rounded-bl-sm'
        }`}>
          {message}
        </div>
        {timestamp && (
          <div className={`text-xs text-muted-foreground mt-1 ${isSent ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
