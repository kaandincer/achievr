import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuestionStep } from "@/components/smart-goal/QuestionStep";
import { AIResponse } from "@/components/smart-goal/AIResponse";
import { ProgressIndicator } from "@/components/smart-goal/ProgressIndicator";

const questions = [
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
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string>("");

  const getAIResponse = async (step: number) => {
    setIsLoading(true);
    try {
      console.log('Calling AI assistant with:', { step, threadId, originalGoal });
      const response = await supabase.functions.invoke('smart-goal-assistant', {
        body: {
          goal: originalGoal,
          step,
          previousAnswers: answers,
          threadId,
        },
      });

      if (response.error) {
        console.error('Supabase function error:', response.error);
        throw new Error(response.error.message || "Failed to get AI response");
      }

      if (!response.data) {
        console.error('No data in response:', response);
        throw new Error("No response data from AI assistant");
      }

      console.log('AI Response:', response.data);
      setAiResponse(response.data.response);
      if (response.data.threadId) {
        setThreadId(response.data.threadId);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get AI guidance. Please try again.",
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
    if (!answers[currentStep]) {
      toast({
        title: "Input Required",
        description: "Please provide an answer before continuing.",
        variant: "destructive",
      });
      return;
    }

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

  useEffect(() => {
    if (!originalGoal) {
      navigate("/");
      return;
    }
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

        <AIResponse response={aiResponse} isLoading={isLoading} />

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
          <QuestionStep
            question={questions[currentStep - 1]}
            value={answers[currentStep] || ""}
            onChange={handleInputChange}
          />
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

        <ProgressIndicator 
          totalSteps={questions.length} 
          currentStep={currentStep} 
        />
      </div>
    </div>
  );
};

export default SmartGoal;