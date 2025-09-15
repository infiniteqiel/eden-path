import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractionRequest {
  file_id: string;
  business_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    const { file_id, business_id }: ExtractionRequest = await req.json();
    
    if (!file_id || !business_id) {
      return new Response(
        JSON.stringify({ error: 'file_id and business_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role for backend operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    console.log(`Starting text extraction for file ${file_id}`);

    // Get file details
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('id', file_id)
      .single();

    if (fileError) {
      console.error('Failed to fetch file:', fileError);
      return new Response(
        JSON.stringify({ error: 'File not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to processing
    await supabase
      .from('files')
      .update({ 
        extraction_status: 'processing',
        processed_at: new Date().toISOString()
      })
      .eq('id', file_id);

    let extractedText = '';
    let extractionMethod = 'unknown';

    try {
      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(file.storage_bucket)
        .download(file.storage_path);

      if (downloadError) throw downloadError;

      const contentType = file.content_type || '';
      const fileName = file.original_name.toLowerCase();

      if (contentType.includes('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        // Plain text files
        extractedText = await fileData.text();
        extractionMethod = 'plain_text';
        
      } else if (contentType.includes('application/pdf') || fileName.endsWith('.pdf')) {
        // PDF files - for now, just mark for future OCR processing
        // In Phase 2, we'll implement proper PDF text extraction and OCR
        extractedText = `[PDF file: ${file.original_name}] - Text extraction will be implemented in Phase 2`;
        extractionMethod = 'pdf_placeholder';
        
      } else if (contentType.includes('application/vnd.openxmlformats') || fileName.endsWith('.docx')) {
        // DOCX files - for now, just mark for future processing  
        // In Phase 2, we'll implement proper DOCX text extraction
        extractedText = `[DOCX file: ${file.original_name}] - Text extraction will be implemented in Phase 2`;
        extractionMethod = 'docx_placeholder';
        
      } else if (contentType.includes('application/json') || fileName.endsWith('.json')) {
        // JSON files
        const jsonData = await fileData.text();
        extractedText = JSON.stringify(JSON.parse(jsonData), null, 2);
        extractionMethod = 'json_parse';
        
      } else {
        // Unknown file type
        extractedText = `[Binary file: ${file.original_name}] - Content type: ${contentType}`;
        extractionMethod = 'binary_placeholder';
      }

      // Update file with extracted text
      const { error: updateError } = await supabase
        .from('files')
        .update({
          extracted_text: extractedText,
          extraction_status: 'completed',
          extraction_method: extractionMethod,
          processed_at: new Date().toISOString()
        })
        .eq('id', file_id);

      if (updateError) throw updateError;

      // Update analysis job status
      await supabase
        .from('analysis_jobs')
        .update({ 
          status: 'completed',
          progress_pct: 100,
          completed_at: new Date().toISOString()
        })
        .eq('metadata->>file_id', file_id)
        .eq('job_type', 'document_extraction');

      console.log(`Successfully extracted text from file ${file_id}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          extracted_length: extractedText.length,
          extraction_method: extractionMethod
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (extractionError) {
      console.error('Text extraction failed:', extractionError);

      // Update file with error status
      await supabase
        .from('files')
        .update({
          extraction_status: 'failed',
          processed_at: new Date().toISOString()
        })
        .eq('id', file_id);

      // Update analysis job with error
      await supabase
        .from('analysis_jobs')
        .update({ 
          status: 'failed',
          error_message: String(extractionError),
          completed_at: new Date().toISOString()
        })
        .eq('metadata->>file_id', file_id)
        .eq('job_type', 'document_extraction');

      return new Response(
        JSON.stringify({ 
          error: 'Text extraction failed', 
          details: String(extractionError) 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});