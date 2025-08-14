// src/services/newsletter.ts
import { supabase } from '@/lib/supabaseClient';

export type NewsletterPayload = {
  email: string;
  interests: string[];        // array from the questionnaire
  primary_goal: string;       // string
  update_frequency: string;   // string
  usage_type: string;         // "personal" | "business" | ...
};

export async function upsertSubscriber(payload: NewsletterPayload) {
  // Ensure we are authenticated; RLS requires it
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: new Error('Not authenticated'), data: null };
  }

  // Upsert on the email column, returning the row
  const { data, error } = await supabase
    .from('email_subscribers')
    .upsert(
      {
        email: payload.email,
        interests: payload.interests,
        primary_goal: payload.primary_goal,
        update_frequency: payload.update_frequency,
        usage_type: payload.usage_type,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'email',
        ignoreDuplicates: false,
      },
    )
    .select()
    .single();

  return { data, error };
}
