import { supabase } from "./supabase";

export interface Topic {
  id: string;
  created_at: string;
  title: string;
  summary: string;
  image_url: string; // Added to match Supabase schema
  image?: string; // Optional, for backward compatibility
  source: string;
  slug: string;
  category?: string;
  difficulty?: string;
  duration?: number; // in minutes
  xp?: number;
  lessons?: number; // number of lessons/concepts
  flashcards?: { term: string; definition: string }[];
  quiz?: any[]; // Define a proper type for quiz questions
}

export const getAllTopics = async (): Promise<Topic[]> => {
  const { data, error } = await supabase.from("learn_topics").select("*");

  if (error) {
    console.error("Error fetching topics:", error);
    throw new Error(error.message);
  }

  // Ensure data is not null and conforms to the Topic[] type
  return (data as Topic[]) || [];
};

export const getTopicBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .limit(1); // limit instead of .single()

  if (error || !data || data.length === 0) {
    throw new Error("Topic not found for slug: " + slug);
  }

  return data[0];
};

export const getTopicById = async (id: string): Promise<Topic | null> => {
  const { data, error } = await supabase
    .from("learn_topics")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      console.warn(`No topic found with id: ${id}`);
      return null;
    }
    console.error("Error fetching topic by id:", error);
    throw new Error(error.message);
  }

  return data as Topic | null;
};

export const getAllTopicSlugs = async (): Promise<string[]> => {
  const { data, error } = await supabase.from("learn_topics").select("slug");

  if (error) {
    console.error("Error fetching topic slugs:", error);
    throw new Error(error.message);
  }

  return data ? data.map((item) => item.slug) : [];
};
