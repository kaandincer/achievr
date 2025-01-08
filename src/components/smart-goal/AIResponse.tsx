import { Card } from "@/components/ui/card";

interface AIResponseProps {
  response: string;
}

const AIResponse = ({ response }: AIResponseProps) => {
  if (!response) return null;

  return (
    <Card className="p-6 bg-sage-50 border-sage-200">
      <div className="prose prose-sage max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
      </div>
    </Card>
  );
};

export default AIResponse;