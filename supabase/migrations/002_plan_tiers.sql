-- Update plan check constraint to support 4 tiers
ALTER TABLE public.profiles DROP CONSTRAINT profiles_plan_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'monthly', 'yearly', 'lifetime'));
