-- Create table for single-row device status
create table public.device_status (
  device_id text primary key, -- Unique ID (e.g., 'feeder_01')
  status text, -- OPEN/CLOSED
  distance int,
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.device_status enable row level security;

-- Allow anonymous access
create policy "Enable all access" on public.device_status
for all using (true) with check (true);

-- Enable realtime
alter publication supabase_realtime add table public.device_status;
