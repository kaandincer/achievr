import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openai = new OpenAI({
  apiKey: openAIApiKey,
  defaultHeaders: {
    'OpenAI-Beta': 'assistants=v2'
  }
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, step, threadId } = await req.json();
    console.log('Received request:', { goal, step, threadId });

    let currentThreadId = threadId;

    // If no thread exists, create a new one
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
      console.log('Created new thread:', currentThreadId);
    }

    // Add the user's message to the thread
    const message = step === 1 
      ? `My goal is: ${goal}. Help me make this a SMART goal. First, let's make it specific.`
      : goal;

    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId!,
    });

    // Wait for the completion
    let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
    
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed") {
        throw new Error("Assistant run failed");
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(currentThreadId);
    const lastMessage = messages.data[0];

    console.log('Assistant response:', lastMessage);

    return new Response(
      JSON.stringify({
        response: lastMessage.content[0].text.value,
        threadId: currentThreadId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in smart-goal-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});