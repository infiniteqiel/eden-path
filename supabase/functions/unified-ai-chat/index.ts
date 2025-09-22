import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!openAIApiKey) {
  throw new Error('OPENAI_API_KEY is required');
}

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

interface ChatRequest {
  sessionId?: string;
  message: string;
  contextLevel: 'home' | 'overview' | 'subarea' | 'task';
  businessId: string;
  userId: string;
  impactArea?: string;
  subArea?: string;
  subAreaId?: string;
  taskId?: string;
}

interface ChatSession {
  id: string;
  business_id: string;
  level: string;
  impact_area?: string;
  specific_area?: string;
  task_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      sessionId,
      message,
      contextLevel,
      businessId,
      userId,
      impactArea,
      subArea,
      subAreaId,
      taskId
    }: ChatRequest = await req.json();

    console.log('Processing chat request:', { contextLevel, businessId, impactArea, subArea, subAreaId, taskId });

    // 1. Get or create session
    let session: ChatSession;
    if (sessionId) {
      const { data } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      session = data;
    } else {
      // Find existing session or create new one with strict context separation
      let query = supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('business_id', businessId)
        .eq('level', contextLevel);

      // Apply strict filtering based on context level
      if (contextLevel === 'overview') {
        query = query.eq('impact_area', impactArea || null);
        query = query.is('specific_area', null);
        query = query.is('task_id', null);
      } else if (contextLevel === 'subarea') {
        query = query.eq('impact_area', impactArea || null);
        query = query.eq('specific_area', subArea || null);
        query = query.is('task_id', null);
      } else if (contextLevel === 'task') {
        query = query.eq('task_id', taskId || null);
      } else if (contextLevel === 'home') {
        query = query.is('impact_area', null);
        query = query.is('specific_area', null);
        query = query.is('task_id', null);
      }

      const { data: existingSessions } = await query
        .order('updated_at', { ascending: false })
        .limit(1);

      if (existingSessions && existingSessions.length > 0) {
        session = existingSessions[0];
      } else {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: userId,
            business_id: businessId,
            level: contextLevel,
            impact_area: contextLevel === 'overview' || contextLevel === 'subarea' ? impactArea : null,
            specific_area: contextLevel === 'subarea' ? subArea : null,
            task_id: contextLevel === 'task' ? taskId : null
          })
          .select()
          .single();
        session = newSession;
      }
    }

    // 2. Save user message
    await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        user_id: userId,
        role: 'user',
        content: message
      });

    // 3. Gather contextual data
    let contextInfo = "";
    let retrievalContext = "";

    if (contextLevel === 'home') {
      // Get business info and overall progress
      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (business) {
        contextInfo += `Company: ${business.name}\nDescription: ${business.description}\nIndustry: ${business.industry}\nWorkers: ${business.workers_count}\n`;
      }

      // Get overall progress across all impact areas
      const { data: todos } = await supabase
        .from('todos')
        .select('impact, status')
        .eq('business_id', businessId);

      if (todos) {
        const impactStats = todos.reduce((acc: any, todo: any) => {
          if (!acc[todo.impact]) {
            acc[todo.impact] = { total: 0, completed: 0 };
          }
          acc[todo.impact].total++;
          if (todo.status === 'done') {
            acc[todo.impact].completed++;
          }
          return acc;
        }, {});

        contextInfo += "\nProgress Summary:\n";
        Object.entries(impactStats).forEach(([impact, stats]: [string, any]) => {
          const pct = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;
          contextInfo += `• ${impact}: ${pct}% complete (${stats.completed}/${stats.total} tasks)\n`;
        });
      }
    } else if (contextLevel === 'overview' && impactArea) {
      // Get impact area specific info
      contextInfo += `Impact Area: ${impactArea}\n`;
      
      const { data: areaTodos } = await supabase
        .from('todos')
        .select('*')
        .eq('business_id', businessId)
        .eq('impact', impactArea);

      if (areaTodos) {
        const completed = areaTodos.filter(t => t.status === 'done').length;
        const total = areaTodos.length;
        const pct = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
        contextInfo += `Progress: ${pct}% complete (${completed}/${total} tasks)\n`;
        contextInfo += `Priority breakdown: P1: ${areaTodos.filter(t => t.priority === 'P1').length}, P2: ${areaTodos.filter(t => t.priority === 'P2').length}, P3: ${areaTodos.filter(t => t.priority === 'P3').length}\n`;
      }
    } else if (contextLevel === 'subarea' && subArea) {
      // Get sub-area specific info with tasks
      contextInfo += `Sub-Area: ${subArea} (within ${impactArea})\n`;
      
      // Get sub-area details if available
      const { data: subAreaDetails } = await supabase
        .from('impact_sub_areas')
        .select('*')
        .eq('business_id', businessId)
        .eq('impact_area', impactArea)
        .eq('title', subArea)
        .single();

      if (subAreaDetails) {
        contextInfo += `Description: ${subAreaDetails.description || 'No description available'}\n`;
      }

      // Get tasks for this sub-area using sub_area_id if we have it, or title match
      let subAreaTodos;
      if (subAreaId) {
        const { data } = await supabase
          .from('todos')
          .select('*')
          .eq('business_id', businessId)
          .eq('sub_area_id', subAreaId);
        subAreaTodos = data;
      } else {
        const { data } = await supabase
          .from('todos')
          .select('*')
          .eq('business_id', businessId)
          .eq('sub_area', subArea);
        subAreaTodos = data;
      }

      if (subAreaTodos && subAreaTodos.length > 0) {
        const completed = subAreaTodos.filter(t => t.status === 'done').length;
        const pending = subAreaTodos.filter(t => t.status !== 'done').length;
        contextInfo += `Tasks in this sub-area: ${subAreaTodos.length} (${completed} completed, ${pending} pending)\n`;
        
        // List current tasks for context
        contextInfo += "\nCurrent tasks in this sub-area:\n";
        subAreaTodos.forEach((task, idx) => {
          contextInfo += `${idx + 1}. [${task.status.toUpperCase()}] ${task.title} (Priority: ${task.priority}, Effort: ${task.effort})\n`;
          if (task.description_md) {
            contextInfo += `   Description: ${task.description_md.substring(0, 100)}...\n`;
          }
        });
      } else {
        contextInfo += `No tasks currently assigned to this sub-area.\n`;
      }
    } else if (contextLevel === 'task' && taskId) {
      // Get task specific info
      const { data: task } = await supabase
        .from('todos')
        .select('*')
        .eq('id', taskId)
        .single();

      if (task) {
        contextInfo += `Task: "${task.title}" (${task.impact} impact area)\n`;
        contextInfo += `Status: ${task.status}, Priority: ${task.priority}, Effort: ${task.effort}\n`;
        if (task.description_md) {
          contextInfo += `Description: ${task.description_md}\n`;
        }
        if (task.anchor_quote) {
          contextInfo += `Anchor Quote: "${task.anchor_quote}"\n`;
        }
      }
    }

    // 4. Perform knowledge base retrieval
    try {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: message
        }),
      });

      if (embeddingResponse.ok) {
        const embeddingData = await embeddingResponse.json();
        const queryEmbedding = embeddingData.data[0].embedding;

        const { data: kbDocs } = await supabase.rpc('match_knowledge_documents', {
          query_embedding: queryEmbedding,
          match_count: 3,
          similarity_threshold: 0.3
        });

        if (kbDocs && kbDocs.length > 0) {
          retrievalContext += "\nRelevant Knowledge Base Information:\n";
          kbDocs.forEach((doc: any, idx: number) => {
            retrievalContext += `${idx + 1}. ${doc.title} (${doc.document_type}): ${doc.content.substring(0, 300)}...\n\n`;
          });
        }
      }
    } catch (error) {
      console.log('Knowledge base retrieval failed:', error);
    }

    // 5. Get conversation history
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', session.id)
      .order('created_at', { ascending: false })
      .limit(8);

    const historyMessages = recentMessages?.reverse().slice(0, -1) || []; // Exclude the current user message

    // 6. Build prompt
    let systemPrompt = "";
    
    switch (contextLevel) {
      case 'home':
        systemPrompt = `You are an AI B Corp consultant providing comprehensive business analysis. You have access to the company's complete profile and progress across all impact areas. Provide holistic guidance that considers the entire B Corp journey.`;
        break;
      case 'overview':
        systemPrompt = `You are an AI specialist for the ${impactArea} impact area of B Corp certification. Focus on ${impactArea}-specific requirements, best practices, and implementation strategies. Provide detailed guidance relevant to this impact area.`;
        break;
      case 'subarea':
        systemPrompt = `You are an AI specialist for ${subArea} within the ${impactArea} impact area. You have detailed context about the current tasks and progress in this specific sub-area. Provide focused, specialized guidance on ${subArea} requirements and best practices for B Corp certification. Reference the specific tasks and their status when relevant to provide personalized advice.`;
        break;
      case 'task':
        systemPrompt = `You are an AI assistant helping with a specific B Corp task. Provide practical, actionable guidance to help complete this specific task effectively.`;
        break;
    }

    systemPrompt += `\n\nContext Information:\n${contextInfo}`;
    if (retrievalContext) {
      systemPrompt += `\n${retrievalContext}`;
    }
    systemPrompt += `\n\nInstructions: Provide helpful, accurate guidance based on the above context. Reference specific information when possible. If you don't have enough information, ask clarifying questions. Keep responses focused and actionable.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...historyMessages.map((msg: any) => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    // 7. Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;

    // 8. Save assistant response
    await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        user_id: userId,
        role: 'assistant',
        content: assistantResponse
      });

    // 9. Update session timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', session.id);

    return new Response(JSON.stringify({
      response: assistantResponse,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in unified-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});