import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { goal, step, previousAnswers } = await req.json();
    
    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    // Create a thread if it's the first step
    let threadId = '';
    if (step === 1) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      
      // Add the initial message with the goal
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: `My goal is: ${goal}. Help me make it SMART (Specific, Measurable, Achievable, Relevant, Time-bound).`
      });
    } else {
      // For subsequent steps, add the user's previous answer
      const prevAnswer = previousAnswers[step - 1];
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: prevAnswer
      });
    }

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }

    // Get the latest message from the assistant
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];
    const response = lastMessage.content[0].text.value;

    return new Response(
      JSON.stringify({ response, threadId }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});