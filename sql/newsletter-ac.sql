-- ============================================================
-- Alejandro CAD/CAM — Newsletter Subscribers
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      timestamptz DEFAULT now(),
  email           text NOT NULL,
  nombre          text,
  negocio         text DEFAULT 'alejandrocadcam',
  fuente          text,                    -- 'flujo-diseno', 'landing', 'manual'
  acepta_marketing boolean DEFAULT true,
  activo          boolean DEFAULT true,
  unsubscribe_token text DEFAULT gen_random_uuid()::text,
  tags            text[] DEFAULT '{}',
  UNIQUE(email, negocio)
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.newsletter_subscribers TO service_role, anon, authenticated;

-- Admin lee
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='newsletter_subscribers' AND policyname='admin_lee_nl_ac'
  ) THEN
    CREATE POLICY "admin_lee_nl_ac" ON public.newsletter_subscribers
      FOR SELECT TO authenticated
      USING (negocio='alejandrocadcam' AND auth.jwt()->'app_metadata'->>'role' IN ('admin','superadmin'));
  END IF;
END;
$$;

-- RPC subscribe upsert-safe
CREATE OR REPLACE FUNCTION public.alejandro_newsletter_subscribe(
  p_email text, p_nombre text DEFAULT NULL, p_fuente text DEFAULT 'web', p_tags text[] DEFAULT '{}'
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.newsletter_subscribers(email, nombre, negocio, fuente, tags)
  VALUES (lower(trim(p_email)), p_nombre, 'alejandrocadcam', p_fuente, p_tags)
  ON CONFLICT (email, negocio) DO UPDATE
    SET activo=true, acepta_marketing=true, updated_at=now()
    WHERE newsletter_subscribers.activo=false;
EXCEPTION WHEN OTHERS THEN NULL;
END;
$$;

-- Añadir columna updated_at si no existe
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

GRANT EXECUTE ON FUNCTION public.alejandro_newsletter_subscribe(text, text, text, text[]) TO anon, authenticated, service_role;

SELECT 'newsletter_subscribers AC OK' AS status;
