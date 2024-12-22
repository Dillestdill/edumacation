import { Users } from "lucide-react";

interface ChatRoomHeaderProps {
  activeUsers: number;
}

const ChatRoomHeader = ({ activeUsers }: ChatRoomHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Educator Chat Rooms</h2>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        <span>{activeUsers} active</span>
      </div>
    </div>
  );
};

export default ChatRoomHeader;