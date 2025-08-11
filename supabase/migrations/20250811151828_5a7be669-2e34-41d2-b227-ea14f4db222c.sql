-- Create enum for member status
DO $$ BEGIN
  CREATE TYPE public.member_status AS ENUM ('offline','online','in_workout','resting');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text,
  status public.member_status NOT NULL DEFAULT 'offline',
  last_seen timestamptz NOT NULL DEFAULT now(),
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Policies: public read, authenticated write
DO $$ BEGIN
  CREATE POLICY "Public can read members" ON public.members
  FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated can manage members" ON public.members
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_members_updated_at ON public.members;
CREATE TRIGGER trg_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime support
ALTER TABLE public.members REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
EXCEPTION WHEN undefined_object THEN
  -- publication may not exist locally; ignore in cloud
  NULL;
END $$;

-- Seed some demo members if table is empty
INSERT INTO public.members (name, avatar_url, status, role)
SELECT m.name, m.avatar_url, m.status, m.role
FROM (VALUES
  ('Alex Carter','https://i.pravatar.cc/150?img=12','in_workout'::public.member_status,'member'),
  ('Jamie Rivera','https://i.pravatar.cc/150?img=22','online','coach'),
  ('Taylor Brooks','https://i.pravatar.cc/150?img=32','resting','member'),
  ('Jordan Lee','https://i.pravatar.cc/150?img=42','offline','member')
) AS m(name, avatar_url, status, role)
WHERE NOT EXISTS (SELECT 1 FROM public.members);
