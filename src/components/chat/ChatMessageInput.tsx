interface ChatMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatMessageInput = ({ value, onChange, onSend }: ChatMessageInputProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSend()}
        placeholder="Type your message..."
        className="flex-1 px-4 py-2 rounded-lg border border-accent/20 focus:outline-none focus:border-highlight"
      />
      <button
        onClick={onSend}
        className="px-6 py-2 bg-highlight text-primary rounded-lg hover:bg-highlight/90 transition-colors"
      >
        Send
      </button>
    </div>
  );
};

export default ChatMessageInput;