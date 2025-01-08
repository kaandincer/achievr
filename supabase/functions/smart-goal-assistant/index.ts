import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting smart-goal-assistant function');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    if (!assistantId) {
      throw new Error('OpenAI Assistant ID is not configured');
    }

    const { goal, step, previousAnswers, threadId } = await req.json();
    console.log('Received request:', { step, threadId, hasGoal: !!goal });
    
    const openai = new OpenAI({
      apiKey: openAIApiKey,
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    // Create a thread if it's the first step
    let thread;
    if (step === 1) {
      console.log('Creating new thread');
      thread = await openai.beta.threads.create();
      console.log('Thread created:', thread.id);
      
      // Add the initial message with the goal
      console.log('Adding initial message');
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `My goal is: ${goal}. Help me make it SMART (Specific, Measurable, Achievable, Relevant, Time-bound). For step 1, help me make it specific.`
      });
    } else {
      // For subsequent steps, add the user's previous answer and prepare for next step
      console.log('Adding user response for step', step - 1);
      const prevAnswer = previousAnswers[step - 1];
      const stepInstructions = {
        2: "Now, help me make this goal measurable.",
        3: "Next, help me make this goal achievable.",
        4: "Let's make this goal relevant.",
        5: "Finally, help me make this goal time-bound."
      };
      
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: `My answer for the previous step: ${prevAnswer}. ${stepInstructions[step as keyof typeof stepInstructions]}`
      });
    }

    const currentThreadId = threadId || thread?.id;
    console.log('Using thread ID:', currentThreadId);

    // Run the assistant
    console.log('Starting assistant run');
    const run = await openai.beta.threads.runs.create(
      currentThreadId, 
      { assistant_id: assistantId }
    );

    // Wait for the run to complete
    console.log('Waiting for run to complete');
    let runStatus = await openai.beta.threads.runs.retrieve(
      currentThreadId, 
      run.id
    );
    
    while (runStatus.status !== 'completed') {
      console.log('Run status:', runStatus.status);
      if (runStatus.status === 'failed') {
        console.error('Run failed:', runStatus);
        throw new Error('Assistant run failed');
      }
      if (runStatus.status === 'requires_action') {
        console.error('Run requires action:', runStatus);
        throw new Error('Assistant requires action - not supported in this implementation');
      }
      
      // Wait a second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        currentThreadId, 
        run.id
      );
    }

    // Get the latest message from the assistant
    console.log('Getting assistant response');
    const messages = await openai.beta.threads.messages.list(
      currentThreadId
    );
    
    if (!messages.data || messages.data.length === 0) {
      throw new Error('No response received from assistant');
    }
    
    const lastMessage = messages.data[0];
    const response = lastMessage.content[0].text.value;
    console.log('Got response from assistant:', response);

    return new Response(
      JSON.stringify({ 
        response, 
        threadId: currentThreadId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in smart-goal-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});