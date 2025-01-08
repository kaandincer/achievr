import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface QuestionFormProps {
  response: string;
  onNext: (input: string) => void;
  isLoading: boolean;
}

export const QuestionForm = ({ response, onNext, isLoading }: QuestionFormProps) => {
  const [userInput, setUserInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onNext(userInput);
    setUserInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="prose prose-sage">
        <p className="whitespace-pre-wrap text-gray-600">{response}</p>
      </div>
      
      <div className="space-y-4">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full"
        />
        <Button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="w-full bg-sage-500 hover:bg-sage-600 text-white"
        >
          {isLoading ? "Processing..." : "Next"}
        </Button>
      </div>
    </form>
  );
};