import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EducationLevelSelectProps {
  activeLevel: string;
  activeUsers: Record<string, number>;
  onLevelChange: (value: string) => void;
}

const EducationLevelSelect = ({
  activeLevel,
  activeUsers,
  onLevelChange,
}: EducationLevelSelectProps) => {
  return (
    <Select value={activeLevel} onValueChange={onLevelChange}>
      <SelectTrigger className="w-full mb-4 bg-white border-accent/20">
        <SelectValue placeholder="Select education level" />
      </SelectTrigger>
      <SelectContent className="bg-white border-accent/20 shadow-lg">
        <SelectItem value="elementary" className="hover:bg-accent/10">
          Elementary School
          <span className="ml-2 text-xs text-muted-foreground">
            ({activeUsers.elementary} active)
          </span>
        </SelectItem>
        <SelectItem value="middle" className="hover:bg-accent/10">
          Middle School
          <span className="ml-2 text-xs text-muted-foreground">
            ({activeUsers.middle} active)
          </span>
        </SelectItem>
        <SelectItem value="high" className="hover:bg-accent/10">
          High School
          <span className="ml-2 text-xs text-muted-foreground">
            ({activeUsers.high} active)
          </span>
        </SelectItem>
        <SelectItem value="higher" className="hover:bg-accent/10">
          Higher Education
          <span className="ml-2 text-xs text-muted-foreground">
            ({activeUsers.higher} active)
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default EducationLevelSelect;