ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS transaction_id text,
  ADD COLUMN IF NOT EXISTS payer_name text;