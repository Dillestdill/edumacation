import { MessageCircle, X } from "lucide-react";

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const FloatingButton = ({ isOpen, onClick }: FloatingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 w-14 h-14 bg-highlight rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  );
};

export default FloatingButton;