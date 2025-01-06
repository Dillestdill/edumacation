import { useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";

interface AuthenticatedNavProps {
  handleSignOut: () => Promise<void>;
}

const AuthenticatedNav = ({ handleSignOut }: AuthenticatedNavProps) => {
  const navigate = useNavigate();
  
  const handleNavClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      navigate(path, { replace: true });
    } catch (error) {
      console.error(`Navigation error to ${path}:`, error);
    }
  };
  
  return (
    <div className="flex items-center gap-8">
      <button 
        onClick={handleNavClick('/tools')}
        className="flex items-center gap-2 text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        <Wrench className="h-4 w-4" />
        Tools
      </button>
      <button 
        onClick={handleNavClick('/home')}
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        AI Assistant
      </button>
      <button 
        onClick={handleNavClick('/educator-chat')}
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        Educator Chat
      </button>
      <button 
        onClick={handleNavClick('/lesson-planning')}
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        Lesson Planning
      </button>
      <button 
        onClick={handleSignOut}
        className="text-[#141413] font-medium hover:text-[#141413]/80 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
};

export default AuthenticatedNav;