// src/services/newsletter.ts
import { supabase } from "@/lib/supabaseClient";

export type NewsletterPayload = {
  email: string;
  interests: string[]; // array from the questionnaire
  primary_goal: string; // string
  update_frequency: string; // string
  usage_type: string; // "personal" | "business" | ...
  biggest_challenge: string; // NEW: biggest challenge field
};

export async function upsertSubscriber(payload: NewsletterPayload) {
  try {
    console.log("Attempting to save newsletter preferences:", payload);

    // Simple insert approach - if it fails due to duplicate, that's okay
    const { data, error } = await supabase
      .from("email_subscribers")
      .insert([
        {
          email: payload.email,
          interests: payload.interests,
          primary_goal: payload.primary_goal,
          update_frequency: payload.update_frequency,
          usage_type: payload.usage_type,
          biggest_challenge: payload.biggest_challenge, // NEW field
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      // If it's a duplicate key error, that's actually fine - the email is already subscribed
      if (error.code === "23505") {
        console.log("Email already exists, treating as success");
        return { data: { email: payload.email }, error: null };
      }

      console.error("Insert failed:", error);
      return { data: null, error };
    }

    console.log("Insert successful:", data);
    return { data, error: null };
  } catch (err) {
    console.error("Upsert error:", err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unknown error"),
    };
  }
}
