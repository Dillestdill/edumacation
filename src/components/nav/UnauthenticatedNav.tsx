import { useNavigate } from "react-router-dom";

interface UnauthenticatedNavProps {
  handleFAQClick: (e: React.MouseEvent) => void;
}

const UnauthenticatedNav = ({ handleFAQClick }: UnauthenticatedNavProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex items-center gap-8">
      <a href="/pricing" className="text-[#141413] hover:text-[#141413]/80 transition-colors">
        Pricing
      </a>
      <a href="/teacher-reviews" className="text-[#141413] hover:text-[#141413]/80 transition-colors">
        Teacher Reviews
      </a>
      <a href="/challenge" className="text-[#141413] hover:text-[#141413]/80 transition-colors">
        Challenge
      </a>
      <a 
        href="#faq" 
        onClick={handleFAQClick}
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        FAQ
      </a>
      <button 
        onClick={() => navigate("/signin")}
        className="text-[#141413] font-medium hover:text-[#141413]/80 transition-colors"
      >
        Sign in
      </button>
    </div>
  );
};

export default UnauthenticatedNav;