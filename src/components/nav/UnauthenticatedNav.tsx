import { Link } from "react-router-dom";

interface UnauthenticatedNavProps {
  handleFAQClick: (e: React.MouseEvent) => void;
}

const UnauthenticatedNav = ({ handleFAQClick }: UnauthenticatedNavProps) => {
  return (
    <div className="flex items-center gap-8">
      <Link 
        to="/pricing" 
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        Pricing
      </Link>
      <Link 
        to="/teacher-reviews" 
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        Teacher Reviews
      </Link>
      <Link 
        to="/challenge" 
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        Challenge
      </Link>
      <button 
        onClick={handleFAQClick}
        className="text-[#141413] hover:text-[#141413]/80 transition-colors"
      >
        FAQ
      </button>
      <Link 
        to="/signin"
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Sign in
      </Link>
    </div>
  );
};

export default UnauthenticatedNav;