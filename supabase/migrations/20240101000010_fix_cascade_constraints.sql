-- Fix cascade constraints and properly handle foreign key dependencies
-- This migration safely handles existing constraints

-- First, drop the foreign key constraint if it exists
alter table if exists preferences 
drop constraint if exists preferences_user_id_fkey cascade;

-- Drop tables in correct order (child first, then parent)
drop table if exists preferences cascade;
drop table if exists profiles cascade;

-- Recreate profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Recreate preferences table with proper foreign key
create table preferences (
  user_id uuid primary key references profiles(id) on delete cascade,
  favorite_topics text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table preferences enable row level security;

-- Create RLS policies for profiles
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Create RLS policies for preferences
create policy "Users can view own preferences"
  on preferences for select using (auth.uid() = user_id);

create policy "Users can insert own preferences"
  on preferences for insert with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on preferences for update using (auth.uid() = user_id);

-- Create updated_at trigger function if it doesn't exist
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

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  
  -- Also create default preferences
  insert into public.preferences (user_id, favorite_topics)
  values (new.id, '{}');
  
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); 