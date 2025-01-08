import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionStepProps {
  question: {
    id: number;
    label: string;
    placeholder: string;
  };
  value: string;
  onChange: (value: string) => void;
}

const QuestionStep = ({ question, value, onChange }: QuestionStepProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor={`question-${question.id}`} className="text-lg font-medium text-gray-900">
        {question.label}
      </Label>
      <Input
        id={`question-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full text-lg p-4"
      />
    </div>
  );
};

export default QuestionStep;