import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();
    
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v2'  // Add this header for v2 API
      }
    });

    const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');
    if (!assistantId) {
      throw new Error('Assistant ID not configured');
    }

    console.log('Creating thread...');
    const thread = await openai.beta.threads.create();

    console.log('Adding message to thread...');
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `Please analyze this goal and provide feedback on how to make it SMARTer: ${goal}`,
    });

    console.log('Running assistant...');
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    console.log('Waiting for completion...');
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status !== "completed") {
      if (runStatus.status === "failed") {
        console.error('Run failed:', runStatus);
        throw new Error("Assistant run failed");
      }
      if (runStatus.status === "expired") {
        console.error('Run expired:', runStatus);
        throw new Error("Assistant run expired");
      }
      
      // Wait for 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log('Current status:', runStatus.status);
    }

    console.log('Retrieving messages...');
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    const analysis = lastMessage.content[0].text.value;

    console.log('Analysis complete:', analysis);
    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in analyze-goal function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});