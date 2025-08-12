import { supabase } from "@/lib/supabase";

export async function subscribeToNewsletter(payload: {
  email: string;
  interests?: string[]; // array in UI
  primary_goal?: string;
  update_frequency?: string;
  usage_type?: string;
  experience_level?: string;
  challenge?: string;
}) {
  try {
    const email = payload.email?.toLowerCase().trim();

    if (!email) {
      return { ok: false, error: "Email is required" };
    }

    console.info("[newsletter] attempting subscription for", email);

    // First, try to insert just the email (like the working EmailPopup)
    const { error: insertError } = await supabase
      .from("email_subscribers")
      .insert([{ email }]);

    if (insertError) {
      console.error("[newsletter] insert error:", insertError);

      // If it's a duplicate key error, that's fine - try to update instead
      if (insertError.code === "23505") {
        // PostgreSQL unique violation
        console.info("[newsletter] email exists, attempting update");
      } else {
        return { ok: false, error: insertError.message };
      }
    }

    // Now try to update with additional fields if we have them
    const updateFields: any = {};

    if (Array.isArray(payload.interests) && payload.interests.length > 0) {
      updateFields.interests = payload.interests;
    }
    if (payload.primary_goal) {
      updateFields.primary_goal = payload.primary_goal;
    }
    if (payload.update_frequency) {
      updateFields.update_frequency = payload.update_frequency;
    }
    if (payload.usage_type) {
      updateFields.usage_type = payload.usage_type;
    }
    if (payload.experience_level) {
      updateFields.experience_level = payload.experience_level;
    }
    if (payload.challenge) {
      updateFields.challenge = payload.challenge;
    }

    // Only try to update if we have additional fields
    if (Object.keys(updateFields).length > 0) {
      updateFields.updated_at = new Date().toISOString();

      console.info(
        "[newsletter] updating with fields:",
        Object.keys(updateFields)
      );

      const { error: updateError } = await supabase
        .from("email_subscribers")
        .update(updateFields)
        .eq("email", email);

      if (updateError) {
        console.warn(
          "[newsletter] update failed, but email was saved:",
          updateError.message
        );
        // Don't fail the whole operation if update fails - email was already saved
      }
    }

    console.info("[newsletter] subscription successful");
    return { ok: true, error: null };
  } catch (err) {
    console.error("[newsletter] exception:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
