-- Remove storage policies
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;

-- Remove profiles policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can delete their own profile" on public.profiles;

-- Remove trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Remove realtime publication
alter publication supabase_realtime drop table public.profiles;

-- Revoke permissions
revoke all on public.profiles from anon, authenticated;
revoke usage on sequence public.profiles_id_seq from anon, authenticated;
revoke usage on schema public from anon, authenticated; 