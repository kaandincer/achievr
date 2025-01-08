import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Question = {
  id: number;
  label: string;
  placeholder: string;
};

const questions: Question[] = [
  {
    id: 1,
    label: "Make your goal as specific as possible",
    placeholder: "Enter your specific goal here...",
  },
  {
    id: 2,
    label: "Make your goal measurable",
    placeholder: "How will you measure progress towards this goal?",
  },
  {
    id: 3,
    label: "Make your goal achievable",
    placeholder: "What steps will you take to achieve this goal?",
  },
  {
    id: 4,
    label: "Make your goal relevant",
    placeholder: "Why is this goal important to you and your overall objectives?",
  },
  {
    id: 5,
    label: "Make your goal time-bound",
    placeholder: "When do you want to achieve this goal by?",
  },
];

const SmartGoal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const originalGoal = location.state?.goal || "";
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = async (step: number) => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('smart-goal-assistant', {
        body: {
          goal: originalGoal,
          step,
          previousAnswers: answers,
        },
      });

      if (response.error) {
        throw new Error("Failed to get AI response");
      }

      setAiResponse(response.data.response);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get AI guidance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep]: value,
    }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await getAIResponse(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  // Get initial AI response when component mounts
  useEffect(() => {
    getAIResponse(1);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto mt-16 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center">
            Let's Make Your Goal SMART
          </h1>
          <p className="text-gray-600 text-center">
            Your goal: "{originalGoal}"
          </p>
        </div>

        {aiResponse && (
          <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
            <p className="text-sage-800">{aiResponse}</p>
          </div>
        )}

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
          {questions.map((question) => (
            <div
              key={question.id}
              className={cn(
                "space-y-4 transition-all duration-300",
                currentStep === question.id
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 hidden"
              )}
            >
              <label className="block text-lg font-medium text-gray-900">
                {question.label}
              </label>
              <Input
                value={answers[question.id as keyof typeof answers]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={question.placeholder}
                className="w-full text-lg p-4"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={handleBack} variant="outline" disabled={isLoading}>
            {currentStep === 1 ? "Back to Home" : "Previous"}
          </Button>
          {currentStep < questions.length && (
            <Button 
              onClick={handleNext} 
              className="bg-sage-600 hover:bg-sage-700"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Next"}
            </Button>
          )}
        </div>

        <div className="flex justify-center gap-2">
          {questions.map((question) => (
            <div
              key={question.id}
              className={cn(
                "w-3 h-3 rounded-full",
                currentStep === question.id
                  ? "bg-sage-600"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartGoal;