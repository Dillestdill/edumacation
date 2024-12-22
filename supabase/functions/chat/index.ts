import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from 'https://esm.sh/openai@4.28.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    try {
      console.log('Calling OpenAI API with message:', message)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are Instructor Dan, a helpful and knowledgeable teaching assistant. You help teachers create lesson plans and provide educational guidance. You are friendly, professional, and always aim to provide practical, actionable advice."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      const response = completion.choices[0].message?.content || "I apologize, but I couldn't generate a response."
      console.log('OpenAI API response:', response)

      return new Response(
        JSON.stringify({ response }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } catch (openAIError: any) {
      console.error('OpenAI API Error:', openAIError)
      
      // Handle rate limiting error specifically
      if (openAIError.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "The AI service is currently at capacity. Please try again in a few minutes.",
            details: "Rate limit exceeded"
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 429,
          },
        )
      }

      // Handle other OpenAI errors
      return new Response(
        JSON.stringify({ 
          error: openAIError.message || "An error occurred while processing your request",
          details: openAIError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }
  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred",
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})