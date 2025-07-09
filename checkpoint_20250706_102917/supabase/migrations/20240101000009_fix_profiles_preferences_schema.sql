-- Drop and recreate tables with proper schema
drop table if exists preferences cascade;
drop table if exists profiles cascade;

-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

-- Create preferences table
create table preferences (
  user_id uuid primary key references profiles(id) on delete cascade,
  favorite_topics text[],
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table preferences enable row level security;

-- Create RLS policies
create policy "User can access own profile"
  on profiles for all using (auth.uid() = id);

create policy "User can access own preferences"
  on preferences for all using (auth.uid() = user_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers to update timestamps
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_preferences_updated_at
  before update on preferences
  for each row execute function update_updated_at_column(); 