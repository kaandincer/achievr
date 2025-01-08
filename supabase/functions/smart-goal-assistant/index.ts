import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: openAIApiKey,
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();
    console.log('Received goal:', goal);

    if (!goal) {
      throw new Error('No goal provided');
    }

    // Use Chat Completions API for goal analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a SMART goal expert. Analyze the user's goal and provide specific guidance on making it SMART:
          1. Specific: What exactly needs to be accomplished?
          2. Measurable: How will progress and success be measured?
          3. Achievable: Is this realistic with available resources?
          4. Relevant: Why is this goal important?
          5. Time-bound: What's the deadline?
          
          Format your response with clear sections for each SMART component.`
        },
        {
          role: "user",
          content: `Help me make this goal SMART: ${goal}`
        }
      ]
    });

    const response = completion.choices[0].message.content;
    console.log('Generated response:', response);

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
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
      }
    );
  }
});