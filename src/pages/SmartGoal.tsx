import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import QuestionStep from "@/components/smart-goal/QuestionStep";
import AIResponse from "@/components/smart-goal/AIResponse";
import ProgressIndicator from "@/components/smart-goal/ProgressIndicator";

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
  const originalGoal = location.state?.goal || "";
  const aiResponse = location.state?.aiResponse || "";
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep]: value,
    }));
  };

  const handleNext = async () => {
    if (answers[currentStep as keyof typeof answers]) {
      if (currentStep < questions.length) {
        setCurrentStep((prev) => prev + 1);
      }
    } else {
      toast.error('Please provide an answer before continuing.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

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
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
            <AIResponse response={aiResponse} />
          </div>
        )}

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
          <QuestionStep
            question={questions[currentStep - 1]}
            value={answers[currentStep as keyof typeof answers]}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            onClick={handleBack} 
            variant="outline"
            disabled={isLoading}
          >
            {currentStep === 1 ? "Back to Home" : "Previous"}
          </Button>
          {currentStep < questions.length && (
            <Button 
              onClick={handleNext}
              className="bg-sage-600 hover:bg-sage-700"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Next"}
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