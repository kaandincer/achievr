import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GoalProvider } from "@/components/smart-goal/GoalContext";
import { QuestionForm } from "@/components/smart-goal/QuestionForm";
import { GoalSummary } from "@/components/smart-goal/GoalSummary";

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { goal } = location.state || {};
  const [currentStep, setCurrentStep] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!goal) {
      navigate('/');
      return;
    }
    initializeConversation();
  }, [goal]);

  const initializeConversation = async () => {
    setIsLoading(true);
    try {
      // Create a new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('smart_goal_conversations')
        .insert([
          {
            original_goal: goal,
            current_step: 'S',
            conversation_history: []
          }
        ])
        .select()
        .single();

      if (conversationError) throw conversationError;

      setConversationId(conversation.id);
      
      // Get initial response from assistant
      const { data, error } = await supabase.functions.invoke('smart-goal-assistant', {
        body: { 
          conversationId: conversation.id,
          goal,
          step: 'S',
          userInput: null
        },
      });

      if (error) throw error;

      setResponse(data.response);
      setCurrentStep('S');
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start the conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (userInput: string) => {
    setIsLoading(true);
    try {
      // Get next step based on current step
      const nextStep = {
        'S': 'M',
        'M': 'A',
        'A': 'R',
        'R': 'T',
        'T': 'complete'
      }[currentStep];

      // Update conversation in database
      const { error: updateError } = await supabase
        .from('smart_goal_conversations')
        .update({ 
          current_step: nextStep,
          conversation_history: [...(await getCurrentHistory()), {
            step: currentStep,
            userInput,
            assistantResponse: response
          }]
        })
        .eq('id', conversationId);

      if (updateError) throw updateError;

      if (nextStep === 'complete') {
        // Handle completion
        navigate('/goals');
        return;
      }

      // Get next response from assistant
      const { data, error } = await supabase.functions.invoke('smart-goal-assistant', {
        body: { 
          conversationId,
          step: nextStep,
          userInput
        },
      });

      if (error) throw error;

      setResponse(data.response);
      setCurrentStep(nextStep);
    } catch (error) {
      console.error('Error processing next step:', error);
      toast({
        title: "Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentHistory = async () => {
    const { data } = await supabase
      .from('smart_goal_conversations')
      .select('conversation_history')
      .eq('id', conversationId)
      .single();
    
    return data?.conversation_history || [];
  };

  if (!goal) return null;

  return (
    <GoalProvider initialGoal={goal}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            ← Back to Goal Entry
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Make Your Goal SMART</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <GoalSummary />
              
              {response && (
                <QuestionForm
                  response={response}
                  onNext={handleNext}
                  isLoading={isLoading}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </GoalProvider>
  );
};

export default Analysis;