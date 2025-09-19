-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector embedding column to knowledge_base_documents table
ALTER TABLE knowledge_base_documents ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add new columns to todos table for enhanced AI task generation
ALTER TABLE todos ADD COLUMN IF NOT EXISTS anchor_quote TEXT;
ALTER TABLE todos ADD COLUMN IF NOT EXISTS kb_refs JSONB DEFAULT '[]';
ALTER TABLE todos ADD COLUMN IF NOT EXISTS rationale TEXT;

-- Create index for vector similarity search (using cosine distance)
CREATE INDEX IF NOT EXISTS knowledge_base_documents_embedding_idx 
ON knowledge_base_documents USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_knowledge_documents(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  similarity_threshold float DEFAULT 0.3
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  document_type text,
  impact_area text,
  requirement_codes text[],
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    id,
    title,
    content,
    document_type,
    impact_area,
    requirement_codes,
    1 - (embedding <=> query_embedding) as similarity
  FROM knowledge_base_documents
  WHERE embedding IS NOT NULL
    AND 1 - (embedding <=> query_embedding) > similarity_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;