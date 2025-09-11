-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  company_number TEXT,
  legal_form TEXT,
  country TEXT,
  operating_months INTEGER,
  workers_count INTEGER,
  industry TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own businesses"
ON public.businesses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own businesses"
ON public.businesses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses"
ON public.businesses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own businesses"
ON public.businesses
FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  business_id TEXT NOT NULL,
  impact TEXT NOT NULL,
  requirement_code TEXT,
  kb_action_id TEXT,
  title TEXT NOT NULL,
  description_md TEXT,
  priority TEXT NOT NULL,
  effort TEXT NOT NULL,
  status TEXT NOT NULL,
  evidence_chunk_ids TEXT[],
  owner_user_id UUID,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own todos"
ON public.todos
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
ON public.todos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
ON public.todos
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
ON public.todos
FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON public.todos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Chat sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  business_id TEXT NOT NULL,
  level TEXT NOT NULL,
  impact_area TEXT,
  specific_area TEXT,
  task_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own chat sessions (select)"
ON public.chat_sessions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat sessions (insert)"
ON public.chat_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat sessions (update)"
ON public.chat_sessions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own chat sessions (delete)"
ON public.chat_sessions
FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages"
ON public.chat_messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Realtime settings
ALTER TABLE public.todos REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;