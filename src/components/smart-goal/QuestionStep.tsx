import { Input } from "@/components/ui/input";

type QuestionStepProps = {
  question: {
    id: number;
    label: string;
    placeholder: string;
  };
  value: string;
  onChange: (value: string) => void;
};

export const QuestionStep = ({ question, value, onChange }: QuestionStepProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-lg font-medium text-gray-900">
        {question.label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className="w-full text-lg p-4"
      />
    </div>
  );
};