import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessId, businessData } = await req.json();
    
    console.log('Generating baseline tasks for business:', businessId);

    if (!businessId) {
      console.error('Missing required parameter: businessId');
      return new Response(
        JSON.stringify({ error: 'Missing businessId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Verify the user token by getting user info
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.error('Authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    // Build context string from business data
    const context = `
Company: ${businessData?.name || 'New Company'}
Industry: ${businessData?.industry || 'Not specified'}
Legal Form: ${businessData?.legalForm || 'Not specified'}
Operating Months: ${businessData?.operatingMonths || 'Not specified'}
Workers Count: ${businessData?.workersCount || 1}
Description: ${businessData?.description || 'No description provided'}
Country: ${businessData?.country || 'UK'}`;

    // Query knowledge base documents for B Corp standards
    console.log('Querying knowledge base for B Corp standards...');
    const { data: knowledgeData, error: kbError } = await supabase
      .from('knowledge_base_documents')
      .select('title, content, impact_area, requirement_codes')
      .or(`impact_area.is.null,impact_area.in.("Governance","Workers","Community","Environment","Customers")`)
      .limit(30);

    if (kbError) {
      console.error('Error querying knowledge base:', kbError);
    }

    // Build knowledge context from B Corp standards
    let knowledgeContext = '';
    if (knowledgeData && knowledgeData.length > 0) {
      console.log('Found', knowledgeData.length, 'relevant knowledge base documents');
      knowledgeContext = `
RELEVANT B CORP STANDARDS AND REQUIREMENTS:
${knowledgeData.map(doc => `
${doc.title}
${doc.impact_area ? `Impact Area: ${doc.impact_area}` : ''}
${doc.requirement_codes ? `Requirements: ${doc.requirement_codes.join(', ')}` : ''}
Content: ${doc.content.substring(0, 800)}${doc.content.length > 800 ? '...' : ''}
---`).join('\n')}`;
    }

    // Generate baseline B Corp tasks using OpenAI
    const prompt = `You are a B Corp certification expert. Generate essential baseline tasks for a newly created company to start their B Corp certification journey.

${context}
${knowledgeContext}

Generate 6-10 fundamental, actionable tasks across ALL five B Corp impact areas that every company should implement first. Focus on foundational requirements and quick wins that establish good practices early:

1. Governance - Legal mission lock, stakeholder governance setup
2. Workers - Basic HR policies, compensation framework
3. Community - Local engagement, supplier standards
4. Environment - Environmental policy, basic monitoring
5. Customers - Data protection, customer feedback systems

Prioritize tasks that:
- Are essential for B Corp certification
- Can be started immediately by a new company
- Establish the foundation for more advanced B Corp practices
- Are referenced in the B Corp standards provided

IMPORTANT: Return ONLY valid JSON, no markdown formatting, no code blocks, no extra text. Start with { and end with }.

{
  "tasks": [
    {
      "title": "Task title",
      "impact_area": "Governance|Workers|Community|Environment|Customers",
      "priority": "High|Medium|Low",
      "effort": "Low|Medium|High",
      "description": "Specific description with B Corp requirement context"
    }
  ]
}`;

    console.log('Calling OpenAI API for baseline task generation...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert B Corp certification consultant specializing in foundational requirements for new companies. Always respond with clean JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('No content in OpenAI response:', data);
      throw new Error('No content received from OpenAI');
    }
    
    console.log('AI Response received for baseline tasks');

    // Parse the JSON response
    let tasksData;
    try {
      tasksData = JSON.parse(aiResponse.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      
      // Fallback: Remove markdown blocks and try again
      let cleanResponse = aiResponse.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      try {
        tasksData = JSON.parse(cleanResponse);
      } catch (secondError) {
        // Extract JSON object from response
        const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          tasksData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      }
    }

    // Validate the parsed data structure
    if (!tasksData || !tasksData.tasks || !Array.isArray(tasksData.tasks)) {
      throw new Error('Invalid response structure: expected {tasks: []}');
    }

    console.log('Successfully parsed', tasksData.tasks.length, 'baseline tasks');

    // Normalize data to match database schema
    const normalizeImpactArea = (area: string): string => {
      const normalized = area.toLowerCase();
      const impactMap: Record<string, string> = {
        'governance': 'Governance',
        'workers': 'Workers', 
        'community': 'Community',
        'environment': 'Environment',
        'customers': 'Customers'
      };
      return impactMap[normalized] || 'Other';
    };

    const normalizePriority = (priority: string): string => {
      const normalized = priority.toLowerCase();
      const priorityMap: Record<string, string> = {
        'high': 'P1',
        'medium': 'P2', 
        'low': 'P3'
      };
      return priorityMap[normalized] || 'P2';
    };

    const normalizeEffort = (effort: string): string => {
      const normalized = effort.toLowerCase();
      const effortMap: Record<string, string> = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High'
      };
      return effortMap[normalized] || 'Medium';
    };

    // Prepare tasks for database insertion
    const tasksToInsert = tasksData.tasks.map((task: any) => ({
      title: task.title,
      description_md: task.description,
      impact: normalizeImpactArea(task.impact_area),
      priority: normalizePriority(task.priority),
      effort: normalizeEffort(task.effort),
      status: 'todo',
      business_id: businessId,
      user_id: user.id,
    }));

    console.log('Inserting', tasksToInsert.length, 'baseline tasks into database');

    const { data: insertedTasks, error: insertError } = await supabase
      .from('todos')
      .insert(tasksToInsert)
      .select();

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw insertError;
    }

    console.log('Successfully inserted', insertedTasks?.length, 'baseline tasks for business:', businessId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tasksGenerated: insertedTasks?.length || 0,
        tasks: insertedTasks,
        businessId: businessId,
        message: `Successfully generated ${insertedTasks?.length || 0} baseline B Corp tasks for new company`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-baseline-tasks function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});