-- Anonymous conversion tracking for IP-based rate limiting
CREATE TABLE public.anonymous_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_anon_conversions_ip_date ON public.anonymous_conversions(ip_address, created_at);

-- Helper: count conversions today for a logged-in user
CREATE OR REPLACE FUNCTION public.conversions_today(uid uuid)
RETURNS integer AS $$
  SELECT count(*)::integer
  FROM public.conversions
  WHERE user_id = uid
    AND status = 'completed'
    AND created_at >= date_trunc('day', now());
$$ LANGUAGE sql SECURITY DEFINER STABLE;
